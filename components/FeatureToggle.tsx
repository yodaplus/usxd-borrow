import { Context } from 'blockchain/network'
import { useAppContext } from 'components/AppContextProvider'
import { useObservable } from 'helpers/observableHook'
import { WithChildren } from 'helpers/types'

type GetKeysType<S> = S extends Set<infer K> ? K : unknown

interface FeatureToggleProps {
  f: GetKeysType<Context['features']>
}

export function FeatureToggle({ f, children }: FeatureToggleProps & WithChildren) {
  const { context$ } = useAppContext()
  const { features } = useObservable(context$) ?? {}

  return features && features.has(f) ? children : null
}
