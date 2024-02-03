import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as BloxrouteLogo } from 'assets/svg/logoBloXroute.svg'
import { AlertTriangle, CheckCircle, Info, X } from 'react-feather'
import styled from 'styled-components'
import { useIsDarkMode } from 'theme/components/ThemeToggle'
import { isMobile } from 'utils/userAgent'

import Column from '../Column'
import { RPC_ALERT_BUTTON_TEXT, RPC_ALERT_ICON_COLOR, UNI_LIVE_DOC_LINK } from './constants'

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

const ErrorText = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;

  word-wrap: break-word;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
  color: #ff3d3d;
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
              Trade <strong>safe from front-running</strong> & <strong>x3 lower fees</strong>
            </Trans>
          </div>
          <div>
            <a style={{ outline: 'none' }} href={UNI_LIVE_DOC_LINK} target="_blank" rel="noreferrer">
              <Info color={RPC_ALERT_ICON_COLOR} size={20} />
            </a>
          </div>
        </TitleText>
        <WarningText>
          <Trans>
            * Swap.live RPC is needed for advanced features and <strong>to avoid front-running</strong>.
          </Trans>
        </WarningText>
      </Column>
      {defaultRPC ? (
        <SuccessText>
          <CheckCircle width={20} height={20} color="#06e92b" />
          <Trans>You successfully switched to Swap.live RPC</Trans>
        </SuccessText>
      ) : isMobile ? (
        <>
          <ErrorText>
            <AlertTriangle width={20} height={20} color="#ff3d3d" />
            <Trans>You did not switch to Swap.live RPC</Trans>
          </ErrorText>
          <StyledLink
            isDarkMode={isDarkMode}
            href="https://docs.bloxroute.com/introduction/protect-rpcs/eth-protect-rpc"
            target="_blank"
            rel="noreferrer"
          >
            <Trans>{RPC_ALERT_BUTTON_TEXT}</Trans>
          </StyledLink>
        </>
      ) : (
        <>
          <ErrorText>
            <AlertTriangle width={20} height={20} color="#ff3d3d" />
            <Trans>You did not switch to Swap.live RPC</Trans>
          </ErrorText>
          <StyledButton onClick={() => onSelectChain(chainId)} isDarkMode={isDarkMode}>
            <Trans>{RPC_ALERT_BUTTON_TEXT}</Trans>
          </StyledButton>
        </>
      )}
    </Container>
  ) : null
}
