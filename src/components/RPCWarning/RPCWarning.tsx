/* eslint-disable import/no-unused-modules */
import { useSwitchRPC } from 'hooks/useSwitchRPC'
import { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from 'state/hooks'

import RPCAlert from './RPCAlert'
import RPCModal from './RPCModal'

export function RPCWarning({
  warningRPCHandler,
  collapseVisible,
  defaultRPC,
}: {
  warningRPCHandler: (option: boolean) => void
  collapseVisible: boolean
  defaultRPC: boolean
}) {
  const [open, setOpen] = useState<boolean>(true)
  const selectedWallet = useAppSelector((state) => state.user.selectedWallet)

  const selectChain = useSwitchRPC()

  useEffect(() => {
    if (selectedWallet) setOpen(false)
  }, [])

  const onDismissChain = useCallback(() => {
    warningRPCHandler(true)
  }, [warningRPCHandler])

  const onCancelModal = useCallback(() => {
    setOpen(false)
    if (defaultRPC) warningRPCHandler(true)
  }, [warningRPCHandler])

  const onSelectChain = useCallback(
    (targetChainId: number | undefined) => {
      selectChain(targetChainId)
      if (defaultRPC) onDismissChain()
    },
    [defaultRPC, onDismissChain, selectChain]
  )

  return !open ? (
    <RPCAlert
      defaultRPC={defaultRPC}
      onSelectChain={onSelectChain}
      collapseVisible={collapseVisible}
      onCancel={warningRPCHandler}
    />
  ) : (
    <RPCModal defaultRPC={defaultRPC} isOpen={open} onSelectChain={onSelectChain} onCancel={onCancelModal} />
  )
}
