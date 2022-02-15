import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'

export declare class NoEthereumProviderError extends Error {
  constructor()
}
export declare class UserRejectedRequestError extends Error {
  constructor()
}
export declare class InjectedConnector extends AbstractConnector {
  constructor(kwargs: { provider: any })
  private handleChainChanged
  private handleAccountsChanged
  private handleDisconnect
  activate(): Promise<ConnectorUpdate>
  getProvider(): Promise<any>
  getChainId(): Promise<number | string>
  getAccount(): Promise<null | string>
  deactivate(): void
  isAuthorized(): Promise<boolean>
}
