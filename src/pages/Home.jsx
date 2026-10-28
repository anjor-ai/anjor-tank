import { useRef, useState } from 'react'
import { home as content } from '../content'
import { Arrow, Button, Cta, Kin, LinkArrow } from '../components/ui'
import { CaseModal, RoqivaFounder } from '../components/folio'
import { KHead, KSection } from '../components/kit'
import { CareerSection, ConsultSection, ThinkingSection } from '../components/sections'
import { BeyondBand, CaseShowcase, HeroTrace } from '../components/v4'
import { Stat } from '../components/kinetic'
import { Hello } from '../components/hello'
import { Shader } from '../system/Shader'
import { useTheme } from '../lib/theme'
import { MQ, gsap, useGSAP } from '../lib/motion'
import { PageMotion } from '../lib/PageMotion'

/* Home. The hero is a shader stage: the greeting, the line and the proof over it, and the decision layer waiting
   in the corner as a card. Scrolling pins the stage, sends the words away and grows the card into the screen.
   Then the work runs sideways, the thinking stacks, and the page closes on the people and the products. */

function Hero() {
  const { theme } = useTheme()
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(`${MQ.motion} and (min-width: 961px) and (min-height: 640px)`, () => {
      gsap.set('.hx__trace', { transform: 'none' })
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=150%', pin: true, scrub: 0.8, anticipatePin: 1 } })
      tl.to('.hx__copy', { yPercent: -18, autoAlpha: 0, ease: 'none', duration: 0.5 }, 0)
        .to('.hx__proof', { y: -80, autoAlpha: 0, ease: 'none', duration: 0.4 }, 0)
        .to('.hx__cue', { autoAlpha: 0, duration: 0.1 }, 0)
        .fromTo('.hx__trace', { x: 0, y: 0, xPercent: 34, yPercent: 46, scale: 0.4, borderRadius: 40 }, { x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, borderRadius: 28, ease: 'none', duration: 1 }, 0)
        .to('.hx__bg', { scale: 1.12, ease: 'none', duration: 1 }, 0)
        .to({}, { duration: 0.25 })
    })
    mm.add(MQ.motion, () => {
      gsap.from('.hx__proof li', { autoAlpha: 0, y: 24, stagger: 0.07, duration: 0.9, ease: 'eExpo', delay: 0.9 })
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <header className={`hx hx--${theme === 'dark' ? 'dark' : 'light'}`} ref={ref}>
      <div className="hx__card">
        <Shader preset={theme === 'dark' ? 'violet' : 'dawn'} className="hx__bg" />
        <div className="hx__copy">
          <div className="hx__id"><span>AT</span><p>Anjor Tank<small>Product manager. Systems thinker. Builder.</small></p></div>
          <Hello items={content.hello.hellos} />
          <h1 className="hx__t" data-kin data-kin-hero><Kin text={content.hello.title} hlEm /></h1>
          <div className="hx__foot">
            <p className="hx__lead">I design consumer experiences, build the systems behind them, and measure what moves. Currently at GNC India, founding ROQIVA, and open to selective consulting.</p>
            <div className="hx__acts">
              <Button to="/contact?intent=consult#brief" track="cta_consult_home">Discuss a project <Arrow /></Button>
              <LinkArrow to="#work">Explore the work</LinkArrow>
            </div>
          </div>
        </div>
        <aside className="hx__proof" aria-label="Selected results">
          <ul>{content.hello.proof.map(([v, l]) => <li key={l}><b><Stat v={v} /></b><span>{l}</span></li>)}</ul>
          <button className="hx__replay" type="button" onClick={() => window.dispatchEvent(new Event('replay-site-film'))}>▷ Replay the opening film</button>
        </aside>
        <div className="hx__trace"><HeroTrace /></div>
        <span className="hx__cue" aria-hidden="true"><i />Scroll</span>
      </div>
    </header>
  )
}

export default function Home() {
  const [open, setOpen] = useState('')
  return (
    <PageMotion routeKey="/">
      <Hero />
      <div className="mq" aria-label="Experience across Truemeds, GNC India and Neil Patel Digital, in commerce, growth and operations">
        <div className="mq__row" aria-hidden="true">
          {[0, 1].map((k) => <span key={k} className="mq__set"><em>Experience across</em><b>Truemeds</b><i /><b>GNC India</b><i /><b>Neil Patel Digital</b><i /><em>Commerce · Growth · Operations</em><i /></span>)}
        </div>
      </div>

      <KSection id="work" className="s-sec--rail">
        <KHead n="01" label="Selected work" tag="Six systems" title="Not just features." sub="Products that ==changed the outcome==." lead="Six detailed stories behind measurable results. Open a quick view, or dive into the system design.">
          <LinkArrow to="/work">Explore all six case studies</LinkArrow>
        </KHead>
      </KSection>
      <CaseShowcase onOpen={setOpen} />
      {open && <CaseModal slug={open} setSlug={setOpen} onClose={() => setOpen('')} />}

      <ThinkingSection />
      <CareerSection />
      <ConsultSection />
      <section id="roqiva" className="s-sec s-sec--ink rq-band"><div className="container"><RoqivaFounder /></div></section>
      <BeyondBand />

      <Cta title="Bring a ==difficult problem==. *Let's work out what moves it.*" lead="Consulting is the main door in. And if you are building a great product team, I am always open to the right conversation." primary={{ label: 'Discuss consulting', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Talk about a product role', to: '/contact?intent=job#brief' }} />
    </PageMotion>
  )
}
