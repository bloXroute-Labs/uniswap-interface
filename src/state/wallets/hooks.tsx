import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'

import { addConnectedWallet } from './reducer'
import { Wallet } from './types'

export function useConnectedWallets(): [Wallet[], (wallet: Wallet) => void] {
  const dispatch = useAppDispatch()
  const connectedWallets = useAppSelector((state) => state.wallets.connectedWallets)
  const addWallet = useCallback(
    (wallet: Wallet) => {
      dispatch(addConnectedWallet(wallet))
    },
    [dispatch]
  )
  return [connectedWallets, addWallet]
}

export async function getBloxrouteWalletRPC(): Promise<boolean> {
  const address = '0x9B7a71b41544eefd7Cad9716Bf5B0fD7023d0755' as string
  const blockParameter = 'latest' as string
  const bloxrouteTransactionCount = '0xb10c707e' as string
  //@ts-ignore
  const response = (await window.ethereum.request({
    method: 'eth_getTransactionCount',
    params: [address, blockParameter],
  })) as string
  return response === bloxrouteTransactionCount
}
