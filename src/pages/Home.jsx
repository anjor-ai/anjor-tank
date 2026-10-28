import { useState } from 'react'
import { home as content } from '../content'
import { Arrow, Button, Cta, Kin, LinkArrow, Section } from '../components/ui'
import { CaseModal, RoqivaFounder } from '../components/folio'
import { KHead, KSection } from '../components/kit'
import { CareerSection, ConsultSection, ThinkingSection } from '../components/sections'
import { BeyondBand, CaseShowcase, HeroTrace } from '../components/v4'
import { Stat } from '../components/kinetic'
import { Hello } from '../components/hello'
import { PageMotion } from '../lib/PageMotion'

/* Home. A split stage: the words on paper at the left, the decision layer at work on a painting at the right.
   Below it the page keeps that rule: windows sit on paintings, words sit on paper. */
export default function Home() {
  const [open, setOpen] = useState('')
  return (
    <PageMotion routeKey="/">
      <header className="hh">
        <div className="hh__in">
          <div className="hh__copy">
            <div className="h-id"><span>AT</span><p>Anjor Tank<small>Product manager. Systems thinker. Builder.</small></p></div>
            <Hello items={content.hello.hellos} />
            <h1 className="hh__t" data-kin data-kin-hero><Kin text={content.hello.title} hlEm /></h1>
            <p className="hh__lead">I design consumer experiences, build the systems behind them, and measure what moves. Currently at GNC India, founding ROQIVA, and open to selective consulting.</p>
            <div className="hh__acts">
              <Button to="/contact?intent=consult#brief" track="cta_consult_home">Discuss a project <Arrow /></Button>
              <LinkArrow to="#work">Explore the work</LinkArrow>
              <button className="h-replay" type="button" onClick={() => window.dispatchEvent(new Event('replay-site-film'))}>▷ Replay the opening film</button>
            </div>
            <ul className="h-proof" aria-label="Selected results">{content.hello.proof.map(([v, l]) => <li key={l}><b><Stat v={v} /></b><span>{l}</span></li>)}</ul>
          </div>
          <div className="hh__stage"><HeroTrace /></div>
        </div>
        <div className="container h-exp"><span>Experience across</span><b>Truemeds</b><b>GNC India</b><b>Neil Patel Digital</b><span>Commerce · Growth · Operations</span></div>
      </header>

      <KSection id="work">
        <KHead n="01" label="Selected work" tag="Six systems" title="Not just features." sub="Products that ==changed the outcome==." lead="Six detailed stories behind measurable results. Open a quick view, or dive into the system design.">
          <LinkArrow to="/work">Explore all six case studies</LinkArrow>
        </KHead>
        <CaseShowcase onOpen={setOpen} />
        {open && <CaseModal slug={open} setSlug={setOpen} onClose={() => setOpen('')} />}
      </KSection>

      <ThinkingSection />
      <CareerSection />
      <ConsultSection />
      <Section id="roqiva" tone="band"><RoqivaFounder /></Section>
      <BeyondBand />

      <Cta title="Bring a ==difficult problem==. *Let's work out what moves it.*" lead="Consulting is the main door in. And if you are building a great product team, I am always open to the right conversation." primary={{ label: 'Discuss consulting', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Talk about a product role', to: '/contact?intent=job#brief' }} />
    </PageMotion>
  )
}
