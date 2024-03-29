import Web3 from 'web3'

const argentABI = [
  {
    inputs: [
      { internalType: 'bytes32', name: '_message', type: 'bytes32' },
      { internalType: 'bytes', name: '_signature', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const walletDetectorABI = [
  {
    inputs: [{ internalType: 'address', name: '_wallet', type: 'address' }],
    name: 'isArgentWallet',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const WALLET_DETECTOR_ADDRESS = {
  1: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
}

export async function isArgentWallet(web3: Web3, address: string): Promise<boolean> {
  // @ts-ignore
  const walletDetector = new web3.eth.Contract(walletDetectorABI, WALLET_DETECTOR_ADDRESS[1])

  return walletDetector.methods.isArgentWallet(address).call()
}

export async function isValidSignature(
  web3: Web3,
  address: string,
  message: string,
  signature: string,
): Promise<boolean> {
  // @ts-ignore
  const wallet = new web3.eth.Contract(argentABI, address)
  const messageBytes32 = web3.eth.accounts.hashMessage(message)

  try {
    await wallet.methods.isValidSignature(messageBytes32, signature).call()
    return true
  } catch (err) {
    return false
  }
}
