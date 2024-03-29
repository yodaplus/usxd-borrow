import { Icon } from '@makerdao/dai-ui-icons'
import { Pages, trackingEvents } from 'analytics/analytics'
import { getToken } from 'blockchain/tokensMetadata'
import { useAppContext } from 'components/AppContextProvider'
import { AppLink } from 'components/Links'
import { ColumnDef, Table, TableSortHeader } from 'components/Table'
import { IlkWithBalance } from 'features/ilks/ilksWithBalances'
import { IlksFilterState, TagFilter } from 'features/ilks/popularIlksFilters'
import { FiltersWithPopular } from 'features/landing/FiltersWithPopular'
import { useRedirectToOpenVault } from 'features/openVaultOverview/useRedirectToOpenVault'
import { AppSpinner, WithLoadingIndicator } from 'helpers/AppSpinner'
import { WithErrorHandler } from 'helpers/errorHandlers/WithErrorHandler'
import { formatCryptoBalance, formatPercent } from 'helpers/formatters/format'
import { useObservable, useObservableWithError } from 'helpers/observableHook'
import { Trans, useTranslation } from 'next-i18next'
import React, { ComponentProps, useCallback } from 'react'
import { Box, Button, Flex, Grid, Heading, SxStyleProp, Text } from 'theme-ui'
import { fadeInAnimation, slideInAnimation } from 'theme/animations'

import { FeaturedIlks, FeaturedIlksPlaceholder } from './FeaturedIlks'

export function TokenSymbol({
  token,
  displaySymbol,
  ...props
}: { token: string; displaySymbol?: boolean } & Omit<ComponentProps<typeof Icon>, 'name'>) {
  const tokenInfo = getToken(token)

  return (
    <Flex>
      <Icon
        name={tokenInfo.iconCircle}
        size="26px"
        sx={{ verticalAlign: 'sub', mr: 2 }}
        {...props}
      />
      <Text variant="paragraph2" sx={{ fontWeight: 'semiBold', whiteSpace: 'nowrap' }}>
        {tokenInfo[displaySymbol ? 'symbol' : 'name']}
      </Text>
    </Flex>
  )
}

const ilksColumns: ColumnDef<IlkWithBalance, IlksFilterState>[] = [
  {
    headerLabel: 'system.asset',
    header: ({ label }) => <Text variant="tableHead">{label}</Text>,
    cell: ({ token }) => <TokenSymbol token={token} />,
  },
  {
    headerLabel: 'system.type',
    header: ({ label }) => <Text variant="tableHead">{label}</Text>,
    cell: ({ ilk }) => <Text>{ilk}</Text>,
  },
  {
    headerLabel: 'system.dai-available',
    header: ({ label, ...filters }) => (
      <TableSortHeader sx={{ ml: 'auto' }} filters={filters} sortBy="ilkDebtAvailable">
        {label}
      </TableSortHeader>
    ),
    cell: ({ ilkDebtAvailable }) => (
      <Text sx={{ textAlign: 'right' }}>{formatCryptoBalance(ilkDebtAvailable)}</Text>
    ),
  },
  {
    headerLabel: 'system.stability-fee',
    header: ({ label, ...filters }) => (
      <TableSortHeader sx={{ ml: 'auto' }} filters={filters} sortBy="stabilityFee">
        {label}
      </TableSortHeader>
    ),
    cell: ({ stabilityFee }) => (
      <Text sx={{ textAlign: 'right' }}>
        {formatPercent(stabilityFee.times(100), { precision: 2 })}
      </Text>
    ),
  },
  {
    headerLabel: 'system.min-coll-ratio',
    header: ({ label, ...filters }) => (
      <TableSortHeader sx={{ ml: 'auto' }} filters={filters} sortBy="liquidationRatio">
        {label}
      </TableSortHeader>
    ),
    cell: ({ liquidationRatio }) => (
      <Text sx={{ textAlign: 'right' }}>{formatPercent(liquidationRatio.times(100))}</Text>
    ),
  },
  {
    headerLabel: '',
    header: () => null,
    cell: ({ ilk, ilkDebtAvailable, token, liquidationRatio }) => {
      const redirectToOpenVault = useRedirectToOpenVault()
      return (
        <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
          <AppLink
            sx={{ width: ['100%', 'inherit'], textAlign: 'center', maxWidth: ['100%', '150px'] }}
            variant="secondary"
            href={`/vaults/open/${ilk}`}
            disabled={ilkDebtAvailable.isZero()}
            onClick={(e) => {
              e.preventDefault()
              if (ilkDebtAvailable.isZero()) {
                return
              }
              redirectToOpenVault(ilk, token, liquidationRatio)
            }}
          >
            {!ilkDebtAvailable.isZero() ? (
              <Trans i18nKey="open-vault.title" />
            ) : (
              <Button
                variant="secondary"
                disabled={true}
                sx={{ width: '100%', maxWidth: ['100%', '150px'] }}
              >
                <Text>
                  <Trans i18nKey="no-dai" />
                </Text>
              </Button>
            )}
          </AppLink>
        </Box>
      )
    },
  },
]

export function Hero({ sx, isConnected }: { sx?: SxStyleProp; isConnected: boolean }) {
  const { t } = useTranslation()

  return (
    <Flex
      sx={{
        ...sx,
        justifySelf: 'center',
        alignItems: 'center',
        textAlign: 'center',
        my: 5,
        flexDirection: 'column',
      }}
    >
      <Heading as="h1" variant="header1" sx={{ mb: 3 }}>
        {t('landing.hero.headline')}
      </Heading>
      <Text variant="paragraph1" sx={{ mb: 4, color: 'lavender' }}>
        <Trans i18nKey="landing.hero.subheader" components={[<br />]} />
      </Text>
      {!isConnected && (
        <AppLink
          href="/connect"
          variant="primary"
          sx={{
            display: 'flex',
            margin: '0 auto',
            px: '40px',
            py: 2,
            alignItems: 'center',
            '&:hover svg': {
              transform: 'translateX(10px)',
            },
          }}
        >
          {t('connect-wallet')}
          <Icon
            name="arrow_right"
            sx={{
              ml: 2,
              position: 'relative',
              left: 2,
              transition: '0.2s',
            }}
          />
        </AppLink>
      )}

      <Text sx={{ my: 1, ml: 2, fontSize: 3, lineHeight: 'body' }}>
        {t('beta-disclaimer')}
      </Text>
    </Flex>
  )
}

export function LandingView() {
  const { landing$, context$ } = useAppContext()
  const context = useObservable(context$)
  const { value: landing, error: landingError } = useObservableWithError(landing$)
  const { t } = useTranslation()
  const redirectToOpenVault = useRedirectToOpenVault()

  const onIlkSearch = useCallback(
    (search: string) => {
      landing?.ilks.filters.change({ kind: 'search', search })
    },
    [landing?.ilks.filters],
  )
  const onIlksTagChange = useCallback(
    (tagFilter: TagFilter) => {
      landing?.ilks.filters.change({ kind: 'tagFilter', tagFilter })
    },
    [landing?.ilks.filters],
  )

  return (
    <Grid
      sx={{
        flex: 1,
        position: 'relative',
      }}
    >
      <Hero
        isConnected={context?.status === 'connected'}
        sx={{ ...slideInAnimation, position: 'relative' }}
      />
      <Box
        sx={{
          ...slideInAnimation,
          position: 'relative',
          my: 4,
          mb: [2, 3, 5],
        }}
      >
        <FeaturedIlksPlaceholder
          sx={
            landing !== undefined
              ? {
                  ...fadeInAnimation,
                  animationDirection: 'backwards',
                  animationFillMode: 'backwards',
                }
              : {}
          }
        />
        {landing !== undefined && <FeaturedIlks sx={fadeInAnimation} ilks={landing.featuredIlks} />}
      </Box>
      <WithErrorHandler error={landingError}>
        <WithLoadingIndicator
          value={landing}
          customLoader={
            <Flex sx={{ alignItems: 'flex-start', justifyContent: 'center', height: '500px' }}>
              <AppSpinner sx={{ mt: 5 }} variant="styles.spinner.large" />
            </Flex>
          }
        >
          {(landing) => (
            <Box sx={{ ...slideInAnimation, position: 'relative' }}>
              <FiltersWithPopular
                onSearch={onIlkSearch}
                search={landing.ilks.filters.search}
                onTagChange={onIlksTagChange}
                tagFilter={landing.ilks.filters.tagFilter}
                defaultTag="all-assets"
                page={Pages.LandingPage}
                searchPlaceholder={t('search-token')}
              />
              <Box sx={{ overflowX: 'auto', p: '3px' }}>
                <Table
                  data={landing.ilks.data}
                  primaryKey="ilk"
                  state={landing.ilks.filters}
                  columns={ilksColumns}
                  noResults={<Box>{t('no-results')}</Box>}
                  deriveRowProps={(row) => ({
                    onClick: row.ilkDebtAvailable.isZero()
                      ? undefined
                      : () => {
                          trackingEvents.openVault(Pages.LandingPage, row.ilk)
                          redirectToOpenVault(row.ilk, row.token, row.liquidationRatio)
                        },
                  })}
                />
              </Box>
            </Box>
          )}
        </WithLoadingIndicator>
      </WithErrorHandler>
    </Grid>
  )
}
