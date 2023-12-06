/* eslint-disable import/no-unused-modules */
import { useSwitchRPC } from 'hooks/useSwitchRPC'
import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { DEFAULT_RPC_URL } from './constants'
import RPCAlert from './RPCAlert'
import RPCModal from './RPCModal'

export function RPCWarning({
  warningRPCHandler,
  collapseVisible,
  defaultRPC,
}: {
  warningRPCHandler: () => void
  collapseVisible: boolean
  defaultRPC: boolean
}) {
  const { pathname } = useLocation()

  const warningOption = useMemo(() => !(pathname === '/swap'), [pathname])

  const selectChain = useSwitchRPC()

  const onDismissChain = useCallback(() => {
    sessionStorage.setItem(DEFAULT_RPC_URL, 'true')
    warningRPCHandler()
  }, [warningRPCHandler])

  const onSelectChain = useCallback(
    (targetChainId: number | undefined) => {
      selectChain(targetChainId)
      onDismissChain()
    },
    [onDismissChain, selectChain]
  )

  return warningOption ? (
    <RPCAlert
      defaultRPC={defaultRPC}
      onSelectChain={onSelectChain}
      collapseVisible={collapseVisible}
      onCancel={onDismissChain}
    />
  ) : (
    <RPCModal
      defaultRPC={defaultRPC}
      isOpen={!collapseVisible}
      onSelectChain={onSelectChain}
      onCancel={onDismissChain}
    />
  )
}
