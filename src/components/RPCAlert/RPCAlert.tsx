import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as Bloxroute } from 'components/Logo/BloxrouteLogo.svg'
import { ReactComponent as BloxrouteDark } from 'components/Logo/BloxrouteLogoDark.svg'
import { useSwitchRPC } from 'hooks/useSwitchRPC'
import { useCallback, useMemo } from 'react'
import { CheckCircle } from 'react-feather'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ThemedText } from 'theme/components'
import { useIsDarkMode } from 'theme/components/ThemeToggle'

import Column from '../Column'
import {
  DEFAULT_RPC_URL,
  RPC_ALERT_BUTTON_COLOR,
  RPC_ALERT_BUTTON_TEXT,
  RPC_ALERT_ICON_SIZE,
  RPC_ALERT_TEXT,
  RPC_CHAIN_IDS,
} from './constants'

const Container = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 12px 18px 12px 12px;
  text-decoration: none !important;
  width: 100%;
  border: 1px solid ${({ theme, isDarkMode }) => (isDarkMode ? theme.accentBloXroute : 'transparent')};
  border-radius: 24px;
  background: ${({ isDarkMode }) =>
    isDarkMode ? '#121219' : 'linear-gradient(to right, #fff, #fff), linear-gradient(to right, #4a91f7, #6d42f6)'};
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  gap: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  div {
    width: 100%;
  }
`
const StyledButton = styled.button<{ isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: max-content;
  min-width: 110px;
  height: 40px;
  background: ${({ theme }) => theme.backgroundBloXroute};
  color: ${({ theme }) => theme.white};
  cursor: pointer;
  border-radius: 12px;
  border: none;
  font-size: 18px;
  padding: 10px 16px;
  margin: 4px 0;
  svg {
    margin-right: 5px;
  }
`

const TitleText = styled(ThemedText.BodyPrimary)<{ isDarkMode: boolean }>`
  word-wrap: break-word;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme, isDarkMode }) => (isDarkMode ? theme.white : '#282A2D')};
  padding: 0 24px;
`

export function RPCAlert() {
  const { chainId } = useWeb3React()
  const { pathname } = useLocation()
  const isDarkMode = useIsDarkMode()
  const cookieDefaultRPC = JSON.parse(localStorage.getItem(DEFAULT_RPC_URL) || '{}')

  const SubMenuOpen = useMemo(
    () => chainId && !(pathname == '/' || cookieDefaultRPC[chainId]) && RPC_CHAIN_IDS.includes(chainId),
    [chainId, pathname, cookieDefaultRPC]
  )

  const selectChain = useSwitchRPC()

  const onSelectChain = useCallback(
    (targetChainId: number | undefined) => {
      selectChain(targetChainId)
    },
    [selectChain]
  )

  return SubMenuOpen ? (
    <Container isDarkMode={isDarkMode}>
      {isDarkMode ? <BloxrouteDark /> : <Bloxroute />}
      <Column>
        <TitleText isDarkMode={isDarkMode}>
          <Trans>{RPC_ALERT_TEXT}</Trans>
        </TitleText>
      </Column>
      <StyledButton onClick={() => onSelectChain(chainId)} isDarkMode={isDarkMode}>
        <CheckCircle width={RPC_ALERT_ICON_SIZE} height={RPC_ALERT_ICON_SIZE} color={RPC_ALERT_BUTTON_COLOR} />
        <Trans>{RPC_ALERT_BUTTON_TEXT}</Trans>
      </StyledButton>
    </Container>
  ) : null
}
