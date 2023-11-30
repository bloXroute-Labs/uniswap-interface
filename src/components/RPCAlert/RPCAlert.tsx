import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as BloxrouteLogo } from 'assets/svg/logoBloXroute.svg'
import { MouseoverTooltip } from 'components/Tooltip'
import { BLOXROUTE_CHAIN_IDS, BLOXROUTE_TESTNET_CHAIN_IDS } from 'constants/chains'
import { useSwitchRPC } from 'hooks/useSwitchRPC'
import { useCallback, useMemo } from 'react'
import { Info } from 'react-feather'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useIsDarkMode } from 'theme/components/ThemeToggle'

import Column from '../Column'
import { DEFAULT_RPC_URL, RPC_ALERT_BUTTON_TEXT, RPC_ALERT_ICON_COLOR } from './constants'

const Container = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 12px 18px 12px 12px;
  text-decoration: none !important;
  width: 95%;
  max-width: 510px;
  border: 1px solid ${({ theme, isDarkMode }) => (isDarkMode ? theme.accentBloXroute : 'transparent')};
  border-radius: 24px;
  background: ${({ isDarkMode }) =>
    isDarkMode ? '#121219' : 'linear-gradient(to right, #fff, #fff), linear-gradient(to right, #4a91f7, #6d42f6)'};
  background-clip: padding-box, border-box;
  background-origin: padding-box, border-box;
  gap: 12px;
  overflow: hidden;
  margin: 16px 0 0 0;
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
  font-size: 16px;
  padding: 10px 16px;
  margin: 4px 0;
  svg {
    margin-right: 5px;
  }
`

const TitleText = styled.div<{ isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  font-weight: 400;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
  color: ${({ theme, isDarkMode }) => (isDarkMode ? theme.white : '#282A2D')};
  padding: 0 24px;
  div {
    width: auto;
  }
  div:last-child {
    height: 20px;
    margin-left: 4px;
  }
`

const WarningText = styled.div`
  word-wrap: break-word;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: #7d7d7d;
`
const MouseoverTooltipRPC = styled(MouseoverTooltip)`
  width: auto;
`

const BLOXROUTE_NETWORK_SELECTOR_CHAINS = [...BLOXROUTE_CHAIN_IDS, ...BLOXROUTE_TESTNET_CHAIN_IDS]

export function RPCAlert() {
  const { chainId } = useWeb3React()
  const { pathname } = useLocation()
  const isDarkMode = useIsDarkMode()
  const cookieDefaultRPC = JSON.parse(localStorage.getItem(DEFAULT_RPC_URL) || '{}')

  const SubMenuOpen = useMemo(
    () =>
      chainId && !(pathname == '/' || cookieDefaultRPC[chainId]) && BLOXROUTE_NETWORK_SELECTOR_CHAINS.includes(chainId),
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
      <BloxrouteLogo />
      <Column>
        <TitleText isDarkMode={isDarkMode}>
          <div>
            <Trans>
              Trade <b>safe from front-running</b> & <b>pay x3 lower fees</b>
            </Trans>
          </div>
          <MouseoverTooltipRPC placement="top" text="link to learn more">
            <Info color={RPC_ALERT_ICON_COLOR} size={20} />
          </MouseoverTooltipRPC>
        </TitleText>
        <WarningText>
          <Trans>
            * Uni.live RPC is needed for advanced features and <u>to avoid front-running</u>.
          </Trans>
        </WarningText>
      </Column>
      <StyledButton onClick={() => onSelectChain(chainId)} isDarkMode={isDarkMode}>
        <Trans>{RPC_ALERT_BUTTON_TEXT}</Trans>
      </StyledButton>
    </Container>
  ) : null
}
