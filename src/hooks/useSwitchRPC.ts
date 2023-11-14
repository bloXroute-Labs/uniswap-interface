import { useCallback } from 'react'
import { useAppDispatch } from 'state/hooks'
import { endSwitchingChain, startSwitchingChain } from 'state/wallets/reducer'

const chainInfo = {
  chainId: `0x${Number(1).toString(16)}`,
  chainName: 'Ethereum',
  rpcUrls: ['https://eth-protect.rpc.blxrbdn.com'],
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  blockExplorerUrls: ['https://etherscan.io/'],
} as const

export function useSwitchRPC() {
  const dispatch = useAppDispatch()

  return useCallback(async () => {
    dispatch(startSwitchingChain(1))
    try {
      //@ts-ignore
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainInfo],
      })
    } catch (error) {
      console.error('Failed to change RPC URL', error)
    } finally {
      dispatch(endSwitchingChain())
    }
  }, [dispatch])
}
