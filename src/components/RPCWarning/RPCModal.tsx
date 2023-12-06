import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { ReactComponent as BloxrouteLogo } from 'assets/svg/logoBloXrouteTransparent.svg'
import { MouseoverTooltip, TooltipSize } from 'components/Tooltip'
import { CheckCircle, Info, X } from 'react-feather'
import styled from 'styled-components'
import { useIsDarkMode } from 'theme/components/ThemeToggle'

import Column from '../Column'
import Modal from '../Modal'
import { RPC_ALERT_BUTTON_TEXT, RPC_ALERT_TRANSPARENT_BUTTON_TEXT } from './constants'

interface RPCModalProps {
  isOpen: boolean
  defaultRPC: boolean
  onCancel: () => void
  onSelectChain: ({ chainId }: any) => void
}

const Container = styled.div<{ isDarkMode: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 18px 12px;
  background: linear-gradient(143deg, #499afb 12.79%, #6a4df9 89.26%), linear-gradient(0deg, #5f62f7, #5f62f7);
  gap: 12px;
  overflow: hidden;
  position: relative;
`

const TitleText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${({ theme }) => theme.white};
  padding: 0 24px;
  margin-left: 25px;
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
  color: rgba(255, 255, 255, 0.7);
`

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 40px;
  background: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.black};
  cursor: pointer;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  padding: 10px 16px;
  margin: 4px 0;
  outline: none;
  svg {
    margin-right: 5px;
  }
`

const StyledTransparentButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 35%;
  height: 20px;
  background: none;
  color: ${({ theme }) => theme.white};
  cursor: pointer;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  margin: 4px 0;
  svg {
    margin-right: 5px;
  }
  :hover {
    color: #2e1b7b;
  }
`

const StyledColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  color: #06e92b;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`
const StyledIcon = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
`

export default function RPCModal({ isOpen, defaultRPC, onCancel, onSelectChain }: RPCModalProps) {
  const isDarkMode = useIsDarkMode()
  const { chainId } = useWeb3React()

  return (
    <Modal isOpen={isOpen} onDismiss={onCancel} hideBorder>
      <Container isDarkMode={isDarkMode}>
        <BloxrouteLogo />
        {defaultRPC && (
          <StyledIcon onClick={onCancel}>
            <X width={24} height={24} color="#fff" />
          </StyledIcon>
        )}
        <Column>
          <TitleText>
            <div>
              <Trans>
                Trade
                <br /> <b>safe from front-running</b> <br /> & <b>x3 lower fees</b>
              </Trans>
            </div>
            <MouseoverTooltip
              size={TooltipSize.MaxSmall}
              placement="top"
              text={
                <a
                  style={{ color: '#916EF7', textDecoration: 'none' }}
                  href="https://docs.bloxroute.com/introduction/protect-rpcs/eth-protect-rpc"
                  target="_blank"
                  rel="noreferrer"
                >
                  Click to learn more
                </a>
              }
            >
              <Info color="#fff" size={20} />
            </MouseoverTooltip>
          </TitleText>
        </Column>
        {defaultRPC ? (
          <StyledColumn>
            <div>
              <CheckCircle width={20} height={20} color="#06e92b" />
            </div>
            <div>
              <Trans>
                You successfully switched to
                <br /> Uni.live RPC
              </Trans>
            </div>
          </StyledColumn>
        ) : (
          <>
            <StyledButton onClick={() => onSelectChain(chainId)}>
              <Trans>{RPC_ALERT_BUTTON_TEXT}</Trans>
            </StyledButton>
            <StyledTransparentButton onClick={onCancel}>
              <Trans>{RPC_ALERT_TRANSPARENT_BUTTON_TEXT}</Trans>
            </StyledTransparentButton>
          </>
        )}

        <WarningText>
          <Trans>
            * Uni.live RPC is needed for advanced features and <u>to avoid front-running</u>.
          </Trans>
        </WarningText>
      </Container>
    </Modal>
  )
}
