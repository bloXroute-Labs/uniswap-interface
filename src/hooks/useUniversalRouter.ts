import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { CustomUserProperties, SwapEventName } from '@uniswap/analytics-events'
import { Percent } from '@uniswap/sdk-core'
import { FlatFeeOptions, SwapRouter, UNIVERSAL_ROUTER_ADDRESS } from '@uniswap/universal-router-sdk'
import { FeeOptions, toHex } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import { sendAnalyticsEvent, useTrace } from 'analytics'
import { useCachedPortfolioBalancesQuery } from 'components/PrefetchBalancesWrapper/PrefetchBalancesWrapper'
import { getConnection } from 'connection'
import { utils } from 'ethers'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { formatCommonPropertiesForTrade, formatSwapSignedAnalyticsEventProperties } from 'lib/utils/analytics'
import { useCallback } from 'react'
import { ClassicTrade, TradeFillType } from 'state/routing/types'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { trace } from 'tracing/trace'
import { calculateGasMargin } from 'utils/calculateGasMargin'
import { getCookie } from 'utils/cookie'
import { UserRejectedRequestError, WrongChainError } from 'utils/errors'
import isZero from 'utils/isZero'
import { didUserReject, swapErrorToUserReadableMessage } from 'utils/swapErrorToUserReadableMessage'
import { getWalletMeta } from 'utils/walletMeta'

import { PermitSignature } from './usePermitAllowance'

const UNISWAP_API_URL = process.env.REACT_APP_UNISWAP_API_URL

/** Thrown when gas estimation fails. This class of error usually requires an emulator to determine the root cause. */
class GasEstimationError extends Error {
  constructor() {
    super(t`Your swap is expected to fail.`)
  }
}

/**
 * Thrown when the user modifies the transaction in-wallet before submitting it.
 * In-wallet calldata modification nullifies any safeguards (eg slippage) from the interface, so we recommend reverting them immediately.
 */
class ModifiedSwapError extends Error {
  constructor() {
    super(
      t`Your swap was modified through your wallet. If this was a mistake, please cancel immediately or risk losing your funds.`
    )
  }
}

interface SwapOptions {
  slippageTolerance: Percent
  deadline?: BigNumber
  permit?: PermitSignature
  feeOptions?: FeeOptions
  flatFeeOptions?: FlatFeeOptions
}

export function useUniversalRouterSwapCallback(
  trade: ClassicTrade | undefined,
  fiatValues: { amountIn?: number; amountOut?: number; feeUsd?: number },
  options: SwapOptions
) {
  const { account, chainId, provider, connector } = useWeb3React()
  const analyticsContext = useTrace()
  const blockNumber = useBlockNumber()
  const isAutoSlippage = useUserSlippageTolerance()[0] === 'auto'
  const { data } = useCachedPortfolioBalancesQuery({ account })
  const portfolioBalanceUsd = data?.portfolios?.[0]?.tokensTotalDenominatedValue?.value

  return useCallback(async () => {
    return trace('swap.send', async ({ setTraceData, setTraceStatus, setTraceError }) => {
      try {
        if (!account) throw new Error('missing account')
        if (!chainId) throw new Error('missing chainId')
        if (!provider) throw new Error('missing provider')
        if (!trade) throw new Error('missing trade')
        const connectedChainId = await provider.getSigner().getChainId()
        if (chainId !== connectedChainId) throw new WrongChainError()

        setTraceData('slippageTolerance', options.slippageTolerance.toFixed(2))

        const { calldata: data, value } = SwapRouter.swapERC20CallParameters(trade, {
          slippageTolerance: options.slippageTolerance,
          deadlineOrPreviousBlockhash: options.deadline?.toString(),
          inputTokenPermit: options.permit,
          fee: options.feeOptions,
          flatFee: options.flatFeeOptions,
        })

        const tx = {
          from: account,
          to: UNIVERSAL_ROUTER_ADDRESS(chainId),
          data,
          // TODO(https://github.com/Uniswap/universal-router-sdk/issues/113): universal-router-sdk returns a non-hexlified value.
          ...(value && !isZero(value) ? { value: toHex(value) } : {}),
        }
        const refferalCode = getCookie('refferalCode')
        let ref_trx_id

        if (refferalCode) {
          const refferalTransactionString = `${tx.from + tx.to + tx.data + value}`
          const refferalTransactionHash = utils.keccak256(utils.toUtf8Bytes(refferalTransactionString))

          console.log(refferalTransactionString, 'refferalTransactionStringa<---')
          console.log(refferalTransactionHash, 'refferalTransactionHash<---')

          const variables = {
            referral_code: refferalCode,
            swap_hash: refferalTransactionHash,
          }

          const refferalCodeResponse = await fetch(`${UNISWAP_API_URL + '/ref-transactions/store'}`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(variables),
          })
          const { trx_id } = await refferalCodeResponse.json()
          ref_trx_id = trx_id
        }

        let gasEstimate: BigNumber
        try {
          gasEstimate = await provider.estimateGas(tx)
        } catch (gasError) {
          setTraceStatus('failed_precondition')
          setTraceError(gasError)
          sendAnalyticsEvent(SwapEventName.SWAP_ESTIMATE_GAS_CALL_FAILED, {
            ...formatCommonPropertiesForTrade(trade, options.slippageTolerance),
            ...analyticsContext,
            client_block_number: blockNumber,
            tx,
            isAutoSlippage,
          })
          console.warn(gasError)
          throw new GasEstimationError()
        }
        const gasLimit = calculateGasMargin(gasEstimate)
        setTraceData('gasLimit', gasLimit.toNumber())
        const beforeSign = Date.now()
        const response = await provider
          .getSigner()
          .sendTransaction({ ...tx, gasLimit })
          .then((response) => {
            sendAnalyticsEvent(SwapEventName.SWAP_SIGNED, {
              ...formatSwapSignedAnalyticsEventProperties({
                trade,
                timeToSignSinceRequestMs: Date.now() - beforeSign,
                allowedSlippage: options.slippageTolerance,
                fiatValues,
                txHash: response.hash,
                portfolioBalanceUsd,
              }),
              ...analyticsContext,
              // TODO (WEB-2993): remove these after debugging missing user properties.
              [CustomUserProperties.WALLET_ADDRESS]: account,
              [CustomUserProperties.WALLET_TYPE]: getConnection(connector).getName(),
              [CustomUserProperties.PEER_WALLET_AGENT]: provider ? getWalletMeta(provider)?.agent : undefined,
            })
            if (tx.data !== response.data) {
              sendAnalyticsEvent(SwapEventName.SWAP_MODIFIED_IN_WALLET, {
                txHash: response.hash,
                ...analyticsContext,
              })

              if (!response.data || response.data.length === 0 || response.data === '0x') {
                throw new ModifiedSwapError()
              }
            }
            return response
          })
        if (refferalCode) {
          const variables = {
            ref_id: ref_trx_id,
            network_id: chainId,
            transaction_id: response.hash,
          }

          const refferalCodeRecordResponse = await fetch(`${UNISWAP_API_URL + '/ref-transactions/store-hash'}`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(variables),
          })
          console.log(refferalCodeRecordResponse.json(), 'refferalCodeRecordResponse<---')
        }

        return {
          type: TradeFillType.Classic as const,
          response,
        }
      } catch (swapError: unknown) {
        if (swapError instanceof ModifiedSwapError) throw swapError

        // GasEstimationErrors are already traced when they are thrown.
        if (!(swapError instanceof GasEstimationError)) setTraceError(swapError)

        // Cancellations are not failures, and must be accounted for as 'cancelled'.
        if (didUserReject(swapError)) {
          setTraceStatus('cancelled')
          // This error type allows us to distinguish between user rejections and other errors later too.
          throw new UserRejectedRequestError(swapErrorToUserReadableMessage(swapError))
        }

        throw new Error(swapErrorToUserReadableMessage(swapError))
      }
    })
  }, [
    account,
    chainId,
    provider,
    trade,
    options.slippageTolerance,
    options.deadline,
    options.permit,
    options.feeOptions,
    options.flatFeeOptions,
    analyticsContext,
    blockNumber,
    isAutoSlippage,
    fiatValues,
    portfolioBalanceUsd,
    connector,
  ])
}
