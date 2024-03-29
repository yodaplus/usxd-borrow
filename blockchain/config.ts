import { ContractDesc } from '@oasisdex/web3-context'
import { keyBy } from 'lodash'
import getConfig from 'next/config'

import * as eth from './abi/ds-eth-token.json'
import * as dsProxyFactory from './abi/ds-proxy-factory.json'
import * as dsProxyRegistry from './abi/ds-proxy-registry.json'
import * as dssCdpManager from './abi/dss-cdp-manager.json'
import * as dssProxyActionsDsr from './abi/dss-proxy-actions-dsr.json'
import * as dssProxyActions from './abi/dss-proxy-actions.json'
import * as erc20 from './abi/erc20.json'
import * as exchange from './abi/exchange.json'
import * as getCdps from './abi/get-cdps.json'
import * as otc from './abi/matching-market.json'
import * as mcdDog from './abi/mcd-dog.json'
import * as mcdEnd from './abi/mcd-end.json'
import * as mcdJoinDai from './abi/mcd-join-dai.json'
import * as mcdJug from './abi/mcd-jug.json'
import * as mcdPot from './abi/mcd-pot.json'
import * as mcdSpot from './abi/mcd-spot.json'
import * as dssMultiplyProxyActions from './abi/multiply-proxy-actions.json'
import * as otcSupport from './abi/otc-support-methods.json'
import * as vat from './abi/vat.json'
import {
  getCollateralJoinContracts,
  getCollaterals,
  getCollateralTokens,
  getOsms,
} from './addresses/addressesUtils'
import { default as apothemAddresses } from './addresses/apothem.json'
import { default as mainnetddresses } from './addresses/mainnet.json'
import { networkNameToId } from '@oasisdex/web3-context/lib/src/network'

networkNameToId['apothem'] = 51
networkNameToId['main'] = 51
networkNameToId['mainnet'] = 50

export function contractDesc(abi: any, address: string): ContractDesc {
  return { abi, address }
}

const protoMain = {
  id: '51',
  name: 'apothem',
  label: 'apothem',
  infuraUrl: `https://rpc-apothem.xinfin.yodaplus.net`,
  infuraUrlWS: '',
  safeConfirmations: 1,
  otc: contractDesc(otc, '0x0000000000000000000000000000000000000000'),
  collaterals: getCollaterals(apothemAddresses),
  tokens: {
    ...getCollateralTokens(apothemAddresses),
    WETH: contractDesc(eth, apothemAddresses.ETH),
    DAI: contractDesc(erc20, apothemAddresses.MCD_DAI),
    USXD: contractDesc(erc20, apothemAddresses.MCD_DAI),
  },
  joins: {
    ...getCollateralJoinContracts(apothemAddresses),
  },
  getCdps: contractDesc(getCdps, apothemAddresses.GET_CDPS),
  mcdOsms: getOsms(apothemAddresses),
  mcdPot: contractDesc(mcdPot, apothemAddresses.MCD_POT),
  mcdJug: contractDesc(mcdJug, apothemAddresses.MCD_JUG),
  mcdEnd: contractDesc(mcdEnd, apothemAddresses.MCD_END),
  mcdSpot: contractDesc(mcdSpot, apothemAddresses.MCD_SPOT),
  mcdDog: contractDesc(mcdDog, apothemAddresses.MCD_DOG),
  dssCdpManager: contractDesc(dssCdpManager, apothemAddresses.CDP_MANAGER),
  otcSupportMethods: contractDesc(otcSupport, '0x0000000000000000000000000000000000000000'),
  vat: contractDesc(vat, apothemAddresses.MCD_VAT),
  mcdJoinDai: contractDesc(mcdJoinDai, apothemAddresses.MCD_JOIN_DAI),
  dsProxyRegistry: contractDesc(dsProxyRegistry, apothemAddresses.PROXY_REGISTRY),
  dsProxyFactory: contractDesc(dsProxyFactory, apothemAddresses.PROXY_FACTORY),
  dssProxyActions: contractDesc(dssProxyActions, apothemAddresses.PROXY_ACTIONS),
  dssMultiplyProxyActions: contractDesc(
    dssMultiplyProxyActions,
    '0x24E54706B100e2061Ed67fAe6894791ec421B421',
  ),
  // Currently this is not supported on Goerli - no deployed contract
  exchange: contractDesc(exchange, getConfig()?.publicRuntimeConfig?.exchangeAddress || ''),
  // Currently this is not supported on Goerli - no deployed contract
  fmm: apothemAddresses.MCD_FLASH,
  etherscan: {
    url: 'https://apothem.blocksscan.io',
    apiUrl: '',
    apiKey: '',
  },
  taxProxyRegistries: [apothemAddresses.PROXY_REGISTRY],
  dssProxyActionsDsr: contractDesc(dssProxyActionsDsr, apothemAddresses.PROXY_ACTIONS_DSR),
  magicLink: {
    apiKey: '',
  },
  cacheApi: 'https://borrow-cache-apothem.yodaplus.net/v1',
  features: new Set<'multiply'>([]),
}

export type NetworkConfig = typeof protoMain

const apothem: NetworkConfig = protoMain
const mainnet: NetworkConfig = {
  ...protoMain,
  id: '50',
  name: 'mainnet',
  label: 'mainnet',
  infuraUrl: 'https://rpc.xinfin.yodaplus.net',
  collaterals: getCollaterals(mainnetddresses),
  tokens: {
    ...getCollateralTokens(mainnetddresses),
    WETH: contractDesc(eth, mainnetddresses.ETH),
    DAI: contractDesc(erc20, mainnetddresses.MCD_DAI),
    USXD: contractDesc(erc20, mainnetddresses.MCD_DAI),
  },
  joins: {
    ...getCollateralJoinContracts(mainnetddresses),
  },
  getCdps: contractDesc(getCdps, mainnetddresses.GET_CDPS),
  mcdOsms: getOsms(mainnetddresses),
  mcdPot: contractDesc(mcdPot, mainnetddresses.MCD_POT),
  mcdJug: contractDesc(mcdJug, mainnetddresses.MCD_JUG),
  mcdEnd: contractDesc(mcdEnd, mainnetddresses.MCD_END),
  mcdSpot: contractDesc(mcdSpot, mainnetddresses.MCD_SPOT),
  mcdDog: contractDesc(mcdDog, mainnetddresses.MCD_DOG),
  dssCdpManager: contractDesc(dssCdpManager, mainnetddresses.CDP_MANAGER),
  vat: contractDesc(vat, mainnetddresses.MCD_VAT),
  mcdJoinDai: contractDesc(mcdJoinDai, mainnetddresses.MCD_JOIN_DAI),
  dsProxyRegistry: contractDesc(dsProxyRegistry, mainnetddresses.PROXY_REGISTRY),
  dsProxyFactory: contractDesc(dsProxyFactory, mainnetddresses.PROXY_FACTORY),
  dssProxyActions: contractDesc(dssProxyActions, mainnetddresses.PROXY_ACTIONS),
  fmm: mainnetddresses.MCD_FLASH,
  etherscan: {
    url: 'https://xdc.blocksscan.io',
    apiUrl: '',
    apiKey: '',
  },
  taxProxyRegistries: [mainnetddresses.PROXY_REGISTRY],
  dssProxyActionsDsr: contractDesc(dssProxyActionsDsr, mainnetddresses.PROXY_ACTIONS_DSR),
  cacheApi: 'https://borrow-cache.yodaplus.net/v1',
  features: new Set<'multiply'>([]),
}

const hardhat: NetworkConfig = {
  ...protoMain,
  id: '2137',
  name: 'hardhat',
  label: 'Hardhat',
  infuraUrl: `http://localhost:8545`,
  infuraUrlWS: `ws://localhost:8545`,
  cacheApi: 'http://localhost:3001/v1',
  dssMultiplyProxyActions: contractDesc(
    dssMultiplyProxyActions,
    getConfig()?.publicRuntimeConfig?.multiplyProxyActions ||
      '0x2a49eae5cca3f050ebec729cf90cc910fadaf7a2',
  ),
  exchange: contractDesc(
    exchange,
    getConfig()?.publicRuntimeConfig?.exchangeAddress ||
      '0xb5eB8cB6cED6b6f8E13bcD502fb489Db4a726C7B',
  ),
}

export const networksById = keyBy([hardhat, apothem, mainnet], 'id')
export const networksByName = keyBy([hardhat, apothem, mainnet], 'name')

export const dappName = 'Oasis'
export const pollingInterval = 12000
