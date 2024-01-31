import { Percent, TradeType } from '@uniswap/sdk-core'
import { FlatFeeOptions, SwapRouter, UNIVERSAL_ROUTER_ADDRESS } from '@uniswap/universal-router-sdk'
import { FeeOptions, toHex } from '@uniswap/v3-sdk'
import { useWeb3React } from '@web3-react/core'
import { utils } from 'ethers'
import { BigNumber } from 'ethers/lib/ethers'
import { PermitSignature } from 'hooks/usePermitAllowance'
import { useCallback } from 'react'
import { InterfaceTrade } from 'state/routing/types'
import { isClassicTrade } from 'state/routing/utils'
import { getCookie } from 'utils/cookie'
import isZero from 'utils/isZero'

import useTransactionDeadline from './useTransactionDeadline'

type UniversalRouterFeeField = { feeOptions: FeeOptions } | { flatFeeOptions: FlatFeeOptions }
type OptionsType = {
  slippageTolerance: Percent
  deadline?: BigNumber
  permit?: PermitSignature
  feeOptions?: FeeOptions
  flatFeeOptions?: FlatFeeOptions
}

const UNISWAP_API_URL = process.env.REACT_APP_UNISWAP_API_URL

function getUniversalRouterFeeFields(trade?: InterfaceTrade): UniversalRouterFeeField | undefined {
  if (!isClassicTrade(trade)) return undefined
  if (!trade.swapFee) return undefined

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return { feeOptions: { fee: trade.swapFee.percent, recipient: trade.swapFee.recipient } }
  } else {
    return { flatFeeOptions: { amount: BigNumber.from(trade.swapFee.amount), recipient: trade.swapFee.recipient } }
  }
}

export function useSwapReferralCode(
  trade: InterfaceTrade | undefined,
  allowedSlippage: Percent,
  permitSignature: PermitSignature | undefined
) {
  const deadline = useTransactionDeadline()
  const { account, chainId } = useWeb3React()

  const options: OptionsType = {
    slippageTolerance: allowedSlippage,
    deadline,
    permit: permitSignature,
    ...getUniversalRouterFeeFields(trade),
  }

  return useCallback(async () => {
    try {
      if (!trade) throw new Error('missing trade')
      if (!account || !chainId) throw new Error('wallet must be connected to swap')
      // @ts-ignore
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
        ...(value && !isZero(value) ? { value: toHex(value) } : {}),
      }

      const referralCode = getCookie('referralCode')
      let ref_trx_id

      if (referralCode) {
        const refferalTransactionString = `${tx.from + tx.to + tx.data + value}`
        const refferalTransactionHash = utils.keccak256(utils.toUtf8Bytes(refferalTransactionString))

        console.log(refferalTransactionString, 'refferalTransactionStringa<---')
        console.log(refferalTransactionHash, 'refferalTransactionHash<---')

        const variables = {
          referral_code: referralCode,
          swap_hash: refferalTransactionHash,
        }

        const referralCodeResponse = await fetch(`${UNISWAP_API_URL + '/ref-transactions/store'}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(variables),
        })
        const { trx_id } = await referralCodeResponse.json()
        ref_trx_id = trx_id
      }
      return ref_trx_id
    } catch (error: unknown) {
      console.log(error, '<---useSwapReferralCodeError')
    }
  }, [account, chainId, options, trade])
}
