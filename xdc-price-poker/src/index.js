require('dotenv').config()

const fetch = require('node-fetch')
const Web3 = require('web3')
const express = require('express')
const app = express()

let {
  WALLET_PRIVATE_KEY,
  MEDIANS,
  POKER_CONTRACT,
  OSM,
  JSON_RPC_NODE_URL = 'https://rpc-apothem.xinfin.yodaplus.net',
  POLL_INTERVAL = 60000,
  PORT = 3000,
} = process.env

if (!WALLET_PRIVATE_KEY) {
  console.log('WALLET_PRIVATE_KEY is not defined')
  process.exit(1)
}

if (!POKER_CONTRACT) {
  console.log('POKER_CONTRACT is not defined')
  process.exit(1)
}

if (!OSM) {
  OSM = '[]'
}

if (!MEDIANS) {
  MEDIANS = '[]'
}

const hexSanitize = (web3, str) => {
  if (/^0x/.test(str)) {
    return str
  }

  return `0x${web3.utils.toBN(str).toString(16)}`
}

const web3 = new Web3(JSON_RPC_NODE_URL)

WALLET_PRIVATE_KEY = hexSanitize(web3, WALLET_PRIVATE_KEY)
POKER_CONTRACT = hexSanitize(web3, POKER_CONTRACT)
OSM = JSON.parse(OSM)
MEDIANS = JSON.parse(MEDIANS)

web3.eth.accounts.wallet.add(WALLET_PRIVATE_KEY)

let status = 'IDLE'

app.get('/status', (req, res) => {
  res.send(JSON.stringify({ status }))
})

app.listen(PORT)
console.log('web server started at', PORT)

const sendTx = async ({ txData, to }) => {
  const receipt = await web3.eth.sendTransaction({
    to: to,
    from: web3.eth.accounts.wallet[0].address,
    data: txData,
    gas: 3320600,
  })

  console.log('Receipt status:', receipt.status)
  console.log('Tx hash:', receipt.transactionHash)
}

const processOsm = async (address) => {
  const txDataPass = web3.eth.abi.encodeFunctionCall(
    {
      name: 'pass',
      type: 'function',
      inputs: [],
    },
    [],
  )

  const isOK = web3.eth.abi.decodeParameter(
    'bool',
    await web3.eth.call({
      to: address,
      data: txDataPass,
    }),
  )

  if (!isOK) {
    console.log(`OSM ${address} is not ready for poke() yet`)
    return
  }

  const txDataPoke = web3.eth.abi.encodeFunctionCall(
    {
      name: 'poke',
      type: 'function',
      inputs: [],
    },
    [],
  )

  console.log('Sending OSM poke() transaction to', address)
  await sendTx({ txData: txDataPoke, to: address })
}

const processMedian = async (address, price) => {
  status = 'POKE'

  const val = web3.utils.toWei(price, 'ether')
  const age = Math.floor(new Date().valueOf() / 1000)
  const wat = 'XDCUSD'

  const sig = await web3.eth.accounts.sign(
    web3.utils.soliditySha3(
      {
        value: val,
        type: 'uint256',
      },
      {
        value: age,
        type: 'uint256',
      },
      {
        value: web3.utils.asciiToHex(wat),
        type: 'bytes32',
      },
    ),
    WALLET_PRIVATE_KEY,
  )

  const { v, r, s } = sig

  const txDataMedianPoke = web3.eth.abi.encodeFunctionCall(
    {
      name: 'poke',
      type: 'function',
      inputs: [
        {
          type: 'uint256[]',
          name: 'val_',
        },
        {
          type: 'uint256[]',
          name: 'age_',
        },
        {
          type: 'uint8[]',
          name: 'v',
        },
        {
          type: 'bytes32[]',
          name: 'r',
        },
        {
          type: 'bytes32[]',
          name: 's',
        },
      ],
    },
    [[val], [age], [v], [r], [s]],
  )

  console.log('Sending median poke() transaction to', address)
  await sendTx({ txData: txDataMedianPoke, to: address })
}

const getPrice = async () => {
  const res = await fetch('https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=XDC-USDT')

  const resJson = await res.json()

  const price = resJson?.data?.price

  if (price) {
    console.log('Received XDC price:', price)
  } else {
    console.log('Failed to get XDC price')
  }

  return price
}

const processPoker = async () => {
  const txDataPoker = web3.eth.abi.encodeFunctionCall(
    {
      name: 'poke',
      type: 'function',
      inputs: [],
    },
    [],
  )

  console.log('Sending poker poke() transaction to', POKER_CONTRACT)
  await sendTx({ txData: txDataPoker, to: POKER_CONTRACT })
}

const wrapStatus = async (status_, promise) => {
  try {
    status = status_
    return await promise
  } catch (e) {
    console.log(`${status_} failed:`, e)
  }
}

const run = async () => {
  const price = await wrapStatus('GET_PRICE', getPrice())

  if (price) {
    await Promise.all(MEDIANS.map((address) => wrapStatus('MEDIAN', processMedian(address, price))))
  }

  await Promise.all(OSM.map((address) => wrapStatus('OSM', processOsm(address))))

  await wrapStatus('POKER', processPoker())
}

const runTry = async () => {
  try {
    await run()
  } catch (e) {
    console.log('Failed:', e)
  }

  status = 'SLEEP'

  console.log('Sleeping for', POLL_INTERVAL)

  setTimeout(() => {
    runTry()
  }, POLL_INTERVAL)
}

runTry()