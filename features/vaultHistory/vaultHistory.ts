import BigNumber from 'bignumber.js'
import { Context } from 'blockchain/network'
import { Vault } from 'blockchain/vaults'
import { Observable, of } from 'rxjs'

import { VaultEvent } from './vaultHistoryEvents'

export type VaultHistoryEvent = VaultEvent & {
  token: string
  etherscan?: {
    url: string
    apiUrl: string
    apiKey: string
  }
}
export function fetchWithOperationId(url: string, options?: RequestInit) {
  const operationNameRegex = /query (?<operationName>[a-zA-Z0-9]+)\(/gm

  const body = typeof options?.body === 'string' ? options?.body : ''
  const parsedBody: { query: string } = JSON.parse(body)
  const result = operationNameRegex.exec(parsedBody.query)
  const operationName = result ? result.groups?.operationName : undefined

  return fetch(url, { ...options, body: JSON.stringify({ ...parsedBody, operationName }) })
}

export function createVaultHistory$(
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
