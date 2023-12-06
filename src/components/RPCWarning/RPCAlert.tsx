import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as BloxrouteLogo } from 'assets/svg/logoBloXroute.svg'
import { MouseoverTooltip, TooltipSize } from 'components/Tooltip'
import { CheckCircle, Info, X } from 'react-feather'
import styled from 'styled-components'
import { useIsDarkMode } from 'theme/components/ThemeToggle'
import { isMobile } from 'utils/userAgent'

import Column from '../Column'
import { RPC_ALERT_BUTTON_TEXT, RPC_ALERT_ICON_COLOR } from './constants'

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
  position: relative;
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
  line-height: 16px;
  padding: 10px 16px;
  margin: 4px 0;
`

const StyledLink = styled.a<{ isDarkMode: boolean }>`
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
  line-height: 16px;
  padding: 10px 16px;
  margin: 4px 0;
  text-decoration: none;
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

const SuccessText = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;

  word-wrap: break-word;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #06e92b;
`

const SuccessIcon = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
`

export default function RPCAlert({
  collapseVisible,
  onSelectChain,
  defaultRPC,
  onCancel,
}: {
  collapseVisible: boolean
  onSelectChain: ({ chainId }: any) => void
  defaultRPC: boolean
  onCancel: (option: boolean) => void
}) {
  const { chainId } = useWeb3React()
  const isDarkMode = useIsDarkMode()

  return !collapseVisible ? (
    <Container isDarkMode={isDarkMode}>
      <BloxrouteLogo />
      {defaultRPC && (
        <SuccessIcon onClick={() => onCancel(true)}>
          <X width={24} height={24} color={RPC_ALERT_ICON_COLOR} />
        </SuccessIcon>
      )}

      <Column>
        <TitleText isDarkMode={isDarkMode}>
          <div>
            <Trans>
              Trade <b>safe from front-running</b> & <b>x3 lower fees</b>
            </Trans>
          </div>
          <MouseoverTooltip
            size={TooltipSize.MaxSmall}
            placement="top"
            text={
              <a
                style={{ color: '#916EF7', textDecoration: 'none' }}
                href="https://docs.bloxroute.com/introduction/uni.live"
                target="_blank"
                rel="noreferrer"
              >
                <Trans>Click to learn more</Trans>
              </a>
            }
          >
            <Info color={RPC_ALERT_ICON_COLOR} size={20} />
          </MouseoverTooltip>
        </TitleText>
        <WarningText>
          <Trans>
            * Uni.live RPC is needed for advanced features and <u>to avoid front-running</u>.
          </Trans>
        </WarningText>
      </Column>
      {defaultRPC ? (
        <SuccessText>
          <CheckCircle width={20} height={20} color="#06e92b" />
          <Trans>You successfully switched to Uni.live RPC</Trans>
        </SuccessText>
      ) : isMobile ? (
        <StyledLink
          isDarkMode={isDarkMode}
          href="https://docs.bloxroute.com/introduction/protect-rpcs/eth-protect-rpc"
          target="_blank"
          rel="noreferrer"
        >
          <Trans>{RPC_ALERT_BUTTON_TEXT}</Trans>
        </StyledLink>
      ) : (
        <StyledButton onClick={() => onSelectChain(chainId)} isDarkMode={isDarkMode}>
          <Trans>{RPC_ALERT_BUTTON_TEXT}</Trans>
        </StyledButton>
      )}
    </Container>
  ) : null
}
