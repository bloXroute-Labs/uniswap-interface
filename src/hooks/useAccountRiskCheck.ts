import { useEffect } from 'react'
import { ApplicationModal, setOpenModal } from 'state/application/reducer'
import { useAppDispatch } from 'state/hooks'
import { isProductionEnv } from 'utils/env'

const API_ENDPOINT = isProductionEnv()
  ? 'https://api.uni.live/v1/screen'
  : 'https://0pzye3tb97.execute-api.us-east-1.amazonaws.com/dev/v1/screen'

export default function useAccountRiskCheck(account: string | null | undefined) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!account) return

    // TODO: add back local browser cacheing (revisit 11/13/2023)
    const headers = new Headers({ 'Content-Type': 'application/json' })
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ address: account }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.block) {
          dispatch(setOpenModal(ApplicationModal.BLOCKED_ACCOUNT))
        }
      })
      .catch(() => {
        dispatch(setOpenModal(null))
      })
  }, [account, dispatch])
}
