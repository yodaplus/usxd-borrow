export function ethToXdcAddress(address: string) {
  return address.replace(/^0x/, 'xdc')
}

export function xdcToEthAddress(address: string) {
  return address.replace(/^xdc/, '0x')
}
