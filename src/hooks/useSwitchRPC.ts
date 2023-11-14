import { useCallback } from 'react'
import { useAppDispatch } from 'state/hooks'
import { endSwitchingChain, startSwitchingChain } from 'state/wallets/reducer'

const chainRPCInfo = {
  1: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: 'Ethereum bloXroute Protect RPC',
    rpcUrls: ['https://eth-protect.rpc.blxrbdn.com'],
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  56: {
    chainId: `0x${Number(56).toString(16)}`,
    chainName: 'BNB bloXroute Protect RPC',
    rpcUrls: ['https://bsc.rpc.blxrbdn.com'],
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  137: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: 'Polygon bloXroute Protect RPC',
    rpcUrls: ['https://polygon.rpc.blxrbdn.com'],
    nativeCurrency: { name: 'Polygon Matic', symbol: 'MATIC', decimals: 18 },
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
} as any

export function useSwitchRPC() {
  const dispatch = useAppDispatch()

  return useCallback(
    async (chainId: number | undefined) => {
      dispatch(startSwitchingChain(chainId))
      try {
        //@ts-ignore
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chainId && chainRPCInfo[chainId]],
        })
      } catch (error) {
        console.error('Failed to change RPC URL', error)
      } finally {
        dispatch(endSwitchingChain())
      }
    },
    [dispatch]
  )
}
