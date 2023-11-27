import { BrowserEvent, InterfaceElementName, SharedEventName } from '@uniswap/analytics-events'
import { TraceEvent } from 'analytics'
import { ReactComponent as BloxrouteLogo } from 'assets/svg/logoBloXroute.svg'
import { useDisableNFTRoutes } from 'hooks/useDisableNFTRoutes'
import styled from 'styled-components'
import { BREAKPOINTS } from 'theme'
import { ExternalLink, StyledRouterLink } from 'theme/components'

import { DiscordIcon, GithubIcon, TwitterIcon } from './Icons'

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 48px;
  max-width: 1440px;

  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    flex-direction: row;
    justify-content: space-between;
  }
`

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
`

const LogoSectionLeft = styled(LogoSection)`
  display: none;

  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    display: flex;
  }
`

const LogoSectionBottom = styled(LogoSection)`
  display: flex;

  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    display: none;
  }
`

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0 0 0;
`

const SocialLink = styled.a`
  display: flex;
`

const FooterLinks = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media screen and (min-width: ${BREAKPOINTS.xl}px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 24px;
  }
`

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 200px;
  margin: 20px 0 0 0;
  @media screen and (min-width: ${BREAKPOINTS.xl}px) {
    margin: 0;
  }
`

const LinkGroupTitle = styled.span`
  font-size: 16px;
  line-height: 20px;
  font-weight: 535;
`

const ExternalTextLink = styled(ExternalLink)`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.neutral2};
`

const TextLink = styled(StyledRouterLink)`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.neutral2};
`

const Copyright = styled.span`
  font-size: 16px;
  line-height: 20px;
  margin: 1rem 0 0 0;
  color: ${({ theme }) => theme.neutral3};
`

const LogoSectionContent = () => {
  return (
    <>
      <BloxrouteLogo />
      <SocialLinks>
        <SocialLink href="https://discord.com/invite/mB95H7s" target="_blank" rel="noopener noreferrer">
          <DiscordIcon size={32} />
        </SocialLink>
        <TraceEvent
          events={[BrowserEvent.onClick]}
          name={SharedEventName.ELEMENT_CLICKED}
          element={InterfaceElementName.TWITTER_LINK}
        >
          <SocialLink href="https://twitter.com/bloXrouteLabs" target="_blank" rel="noopener noreferrer">
            <TwitterIcon size={32} />
          </SocialLink>
        </TraceEvent>
        <SocialLink href="https://github.com/bloXroute-Labs" target="_blank" rel="noopener noreferrer">
          <GithubIcon size={32} />
        </SocialLink>
      </SocialLinks>
      <Copyright>© {new Date().getFullYear()} BloXroute Labs</Copyright>
    </>
  )
}

export const AboutFooter = () => {
  const shouldDisableNFTRoutes = useDisableNFTRoutes()
  return (
    <Footer>
      <LogoSectionLeft>
        <LogoSectionContent />
      </LogoSectionLeft>

      <FooterLinks>
        <LinkGroup>
          <LinkGroupTitle>App</LinkGroupTitle>
          <TextLink to="/swap">Swap</TextLink>
          <TextLink to="/tokens">Tokens</TextLink>
          {!shouldDisableNFTRoutes && <TextLink to="/nfts">NFTs</TextLink>}
          <TextLink to="/pools">Pools</TextLink>
        </LinkGroup>
        <LinkGroup>
          <LinkGroupTitle>Products</LinkGroupTitle>
          <ExternalTextLink href="https://bloxroute.com/products/#mempool-data">Mempool Data</ExternalTextLink>
          <ExternalTextLink href="https://bloxroute.com/products/#block-streaming">Block Streaming</ExternalTextLink>
          <ExternalTextLink href="https://bloxroute.com/products/#transaction-propagation">
            Transaction Propagation
          </ExternalTextLink>
          <ExternalTextLink href="https://bloxroute.com/products/#frontrunning-protection">
            Frontrunning Protection
          </ExternalTextLink>
          <ExternalTextLink href="https://bloxroute.com/products/#flahbots-mev-relays">
            Flashbots MEV Relays
          </ExternalTextLink>
          <ExternalTextLink href="https://bloxroute.com/pricing/">Pricing</ExternalTextLink>
        </LinkGroup>
        <LinkGroup>
          <LinkGroupTitle>Company</LinkGroupTitle>
          <ExternalTextLink href="https://bloxroute.com/#why-bloxroute">Why bloXroute</ExternalTextLink>
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={SharedEventName.ELEMENT_CLICKED}
            element={InterfaceElementName.CAREERS_LINK}
          >
            <ExternalTextLink href="https://bloxroute.com/careers/">Careers</ExternalTextLink>
          </TraceEvent>
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={SharedEventName.ELEMENT_CLICKED}
            element={InterfaceElementName.BLOG_LINK}
          >
            <ExternalTextLink href="https://bloxroute.com/team/">Our Team</ExternalTextLink>
          </TraceEvent>
        </LinkGroup>
        <LinkGroup>
          <LinkGroupTitle>Get Help</LinkGroupTitle>
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={SharedEventName.ELEMENT_CLICKED}
            element={InterfaceElementName.SUPPORT_LINK}
          >
            <ExternalTextLink href="mailto:hello@bloxroute.com" rel="noopener noreferrer">
              Contact Us
            </ExternalTextLink>
          </TraceEvent>
          <TraceEvent
            events={[BrowserEvent.onClick]}
            name={SharedEventName.ELEMENT_CLICKED}
            element={InterfaceElementName.SUPPORT_LINK}
          >
            <ExternalTextLink href="mailto:support@bloxroute.com">Help Center</ExternalTextLink>
          </TraceEvent>
        </LinkGroup>
      </FooterLinks>

      <LogoSectionBottom>
        <LogoSectionContent />
      </LogoSectionBottom>
    </Footer>
  )
}
