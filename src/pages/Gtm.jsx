import { useState } from 'react'
import { gtm, gtmPage as P } from '../content'
import { AsciiArt } from '../art/AsciiArt'
import { Accordion, Arrow, Button, Cta, Head, LinkArrow, PageHero, Section } from '../components/ui'
import { SectionNav } from '../components/SectionNav'
import { Guardrails, JourneyMap, Leaks, Offers, Phases, Shapes, Stack, Versus } from '../components/gtm'
import { CaseCard } from '../components/folio'
import { CASES } from '../content'
import { PageMotion } from '../lib/PageMotion'

/* GTM engineering and RevOps: the practice, written down. Five leaks, the journey, six offers, the process, the rules, the stack. */
export default function Gtm() {
  const [cat, setCat] = useState('all')
  const h = P.hero
  const toOffers = (c) => setCat(c || 'all')
  return (
    <PageMotion routeKey="/gtm">
      <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead}
        visual={<div className="gtmv"><div className="gtmv__art"><AsciiArt kind="revops" /></div><ol className="gtmv__s"><li>Find the leak</li><li>Fix the loop</li><li>Prove the lift</li></ol></div>}>
        <div className="hero__btns hero__a" style={{ '--i': 3 }}>
          <Button to={h.primary.to} track="cta_gtm_hero">{h.primary.label}<Arrow /></Button>
          <Button to={h.secondary.to} variant="ghost">{h.secondary.label}</Button>
        </div>
        <ul className="hero__facts label hero__a" style={{ '--i': 4 }}>{h.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </PageHero>

      <SectionNav items={P.nav} label="On this page" />

      <Section id="why" rule={false}>
        <Head eyebrow={P.why.eyebrow} title={P.why.title} lead={P.why.lead} />
        <ol className="why">
          {gtm.whyUs.map((w) => <li key={w.n} className="why__c" data-reveal><span className="label">{w.n}</span><h3 className="h-4">{w.t}</h3><p className="muted">{w.d}</p></li>)}
        </ol>
      </Section>

      <Section id="leaks" tone="alt">
        <Head eyebrow={P.leaks.eyebrow} title={P.leaks.title} lead={P.leaks.lead} />
        <Leaks onOffer={toOffers} />
      </Section>

      <Section id="journey">
        <Head eyebrow={P.journey.eyebrow} title={P.journey.title} lead={P.journey.lead} />
        <JourneyMap />
      </Section>

      <Section id="offers" tone="alt">
        <Head eyebrow={P.offers.eyebrow} title={P.offers.title} lead={P.offers.lead} />
        <Offers cat={cat} setCat={setCat} />
      </Section>

      <Section id="process">
        <Head eyebrow={P.process.eyebrow} title={P.process.title} lead={P.process.lead} />
        <Phases />
        <div className="gap-top">
          <Head eyebrow={P.shapes.eyebrow} title={P.shapes.title} />
          <Shapes />
        </div>
      </Section>

      <Section id="rules" tone="alt">
        <Head eyebrow={P.rules.eyebrow} title={P.rules.title} lead={P.rules.lead} />
        <Guardrails />
      </Section>

      <Section id="stack">
        <Head eyebrow={P.stack.eyebrow} title={P.stack.title} lead={P.stack.lead} />
        <Stack />
      </Section>

      <Section id="versus" tone="alt">
        <Head eyebrow={P.versus.eyebrow} title={P.versus.title} lead={P.versus.lead} />
        <Versus />
      </Section>

      <Section id="proof">
        <Head eyebrow={P.proof.eyebrow} title={P.proof.title} lead={P.proof.lead} />
        <ul className="cgrid cgrid--3">{['price-lock-checkout', 'growth-loops', 'internal-ops-cx'].map((s) => <CaseCard key={s} c={CASES.find((c) => c.slug === s)} compact />)}</ul>
        <ul className="track3" data-reveal>{gtm.track.map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
        <p className="more" data-reveal><LinkArrow to={P.proof.link[1]}>{P.proof.link[0]}</LinkArrow></p>
      </Section>

      <Section id="faq" tone="alt">
        <div className="faq">
          <Head eyebrow={P.faq.eyebrow} title={P.faq.title} />
          <div data-reveal><Accordion items={gtm.faqs} first={0} label="Frequently asked questions" /></div>
        </div>
      </Section>

      <Cta {...P.cta} />
    </PageMotion>
  )
}
