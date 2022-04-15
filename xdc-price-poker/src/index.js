require('dotenv').config()

const fetch = require('node-fetch')
const Web3 = require('web3')
const express = require('express')
const app = express()

let {
  WALLET_PRIVATE_KEY,
  POKE_TARGET_CONTRACT,
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

if (!POKE_TARGET_CONTRACT) {
  console.log('POKE_TARGET_CONTRACT is not defined')
  process.exit(1)
}

if (!POKER_CONTRACT) {
  console.log('POKER_CONTRACT is not defined')
  process.exit(1)
}

if (!OSM) {
  OSM = '[]'
}

const hexSanitize = (web3, str) => {
  if (/^0x/.test(str)) {
    return str
  }

  return `0x${web3.utils.toBN(str).toString(16)}`
}

const web3 = new Web3(JSON_RPC_NODE_URL)

WALLET_PRIVATE_KEY = hexSanitize(web3, WALLET_PRIVATE_KEY)
POKE_TARGET_CONTRACT = hexSanitize(web3, POKE_TARGET_CONTRACT)
POKER_CONTRACT = hexSanitize(web3, POKER_CONTRACT)
OSM = JSON.parse(OSM)

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

const run = async () => {
  status = 'FETCH'

  const res = await fetch('https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=XDC-USDT')

  const resJson = await res.json()

  const price = resJson?.data?.price

  if (!price) {
    throw new Error("Can't get the price")
  }

  console.log('Received XDC price:', price)

  const priceWei = web3.utils.toWei(price, 'ether')
  const priceBytes32 = web3.utils.padLeft(web3.utils.toHex(priceWei), 64)

  const txDataOraclePoke = web3.eth.abi.encodeFunctionCall(
    {
      name: 'poke',
      type: 'function',
      inputs: [
        {
          type: 'bytes32',
          name: 'wut',
        },
      ],
    },
    [priceBytes32],
  )

  status = 'POKE'

  console.log('Sending oracle poke() transaction to', POKE_TARGET_CONTRACT)
  await sendTx({ txData: txDataOraclePoke, to: POKE_TARGET_CONTRACT })

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

  await Promise.all(OSM.map(processOsm))
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
