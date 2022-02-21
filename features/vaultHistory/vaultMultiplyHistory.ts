import BigNumber from 'bignumber.js'
import { Context } from 'blockchain/network'
import { Vault } from 'blockchain/vaults'
import { Observable, of } from 'rxjs'

import { VaultHistoryEvent } from './vaultHistory'
import { MultiplyEvent } from './vaultHistoryEvents'

export type VaultMultiplyHistoryEvent = MultiplyEvent & {
  token: string
  etherscan?: {
    url: string
    apiUrl: string
    apiKey: string
  }
}

export function createVaultMultiplyHistory$(
  context$: Observable<Context>,
  onEveryBlock$: Observable<number>,
  vault$: (id: BigNumber) => Observable<Vault>,
  vaultId: BigNumber,
): Observable<VaultHistoryEvent[]> {
  context$
  onEveryBlock$
  vault$
  vaultId
  return of([])
}
