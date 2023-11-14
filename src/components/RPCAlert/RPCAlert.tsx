import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
// import useSelectChain from 'hooks/useSelectChain'
import { useSwitchRPC } from 'hooks/useSwitchRPC'
// import useSyncChainQuery from 'hooks/useSyncChainQuery'
import { useCallback, useMemo, useState } from 'react'
import { CheckCircle } from 'react-feather'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'

import Column from '../Column'
import { ReactComponent as Bloxroute } from '../Logo/BloxrouteLogo.svg'
import {
  DEFAULT_RPC_URL,
  RPC_ALERT_BUTTON_COLOR,
  RPC_ALERT_BUTTON_TEXT,
  RPC_ALERT_ICON_SIZE,
  RPC_ALERT_TEXT,
  RPC_CHAIN_IDS,
  RPC_URL,
} from './constants'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 12px 18px 12px 12px;
  text-decoration: none !important;
  width: 100%;
  border: 2px solid transparent;
  border-radius: 24px;
  background: linear-gradient(to right, #fff, #fff), linear-gradient(to right, #4a91f7, #6d42f6);
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  gap: 12px;
  overflow: hidden;
  margin-bottom: 16px;
`
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 120px;
  height: 50px;
  background: linear-gradient(200deg, #4a91f7, #6d42f6);
  color: #fff;
  cursor: pointer;
  border-radius: 20px;
  border: 1px solid #fff;
  font-size: 18px;
  padding: 10px 16px;
  margin: 4px 0;
`

const TitleText = styled(ThemedText.BodyPrimary)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #7d7d7d;
`

export function RPCAlert() {
  const { chainId } = useWeb3React()
  const { pathname } = useLocation()
  const [currentChainId, setCurrentChainId] = useState<number | undefined>(chainId)
  const cookieDefaultRPC = localStorage.getItem(DEFAULT_RPC_URL)

  const SubMenuOpen = useMemo(
    () => !(pathname == '/' || cookieDefaultRPC) && chainId && RPC_CHAIN_IDS.includes(chainId),
    [chainId, pathname, cookieDefaultRPC]
  )

  const selectChain = useSwitchRPC()

  const onSelectChain = useCallback(() => {
    // localStorage.setItem(DEFAULT_RPC_URL, JSON.stringify(RPC_URL))
    selectChain()
  }, [selectChain])

  return SubMenuOpen ? (
    <Container>
      <Bloxroute />
      <Column>
        <TitleText>
          <Trans>{RPC_ALERT_TEXT}</Trans>
        </TitleText>
      </Column>
      <StyledButton onClick={onSelectChain}>
        <CheckCircle width={RPC_ALERT_ICON_SIZE} height={RPC_ALERT_ICON_SIZE} color={RPC_ALERT_BUTTON_COLOR} />
        <Trans>{RPC_ALERT_BUTTON_TEXT}</Trans>
      </StyledButton>
    </Container>
  ) : null
}
