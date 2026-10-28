import { useRef, useState } from 'react'
import { Arrow, Button, LinkArrow } from './ui'
import { CaseMock } from './mocks'
import { Dot, DotMap, Easel, KHead, KSection, Tile, pad, useClock } from './kit'
import { Float, Paint } from './paint'
import { AsciiCanvas } from './ascii'
import { CareerGraph } from './v5'
import { ConsultMapScene } from '../scenes/ConsultMap'
import { ScrollTrigger, useGSAP } from '../lib/motion'

/* Home sections. The house rule holds in each: windows sit on paintings, words sit on paper. */

/* ───────── How I think: three questions scroll past one pinned stage, which shows the decision behind each ───────── */
const THINK = [
  { slug: 'price-lock-checkout', title: 'What happens when an order changes after payment?', sub: 'Keep the promise made at checkout.', paint: 'dawn', result: '+12.5pp', metric: 'prepaid conversion', rule: 'Committed price preserved' },
  { slug: 'search-discovery', title: 'Should a typo ever become a lost order?', sub: 'Understand the query before ranking the results.', paint: 'noon', result: '+9%', metric: 'search-to-order conversion', rule: 'Intent matched and results ranked' },
  { slug: 'retention-reminders', title: 'When does a reminder become genuinely useful?', sub: 'Match the reminder to the reorder window.', paint: 'meadow', result: '~1,100', metric: 'additional repeat orders a day', rule: 'Reorder cadence identified' },
]

function Pinned() {
  const [on, setOn] = useState(0)
  const ref = useRef(null)
  useGSAP((_, contextSafe) => {
    const set = contextSafe((k) => setOn(k))
    ref.current.querySelectorAll('.th__step').forEach((el, k) => {
      ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (st) => st.isActive && set(k) })
    })
  }, { scope: ref })
  return (
    <div className="th" ref={ref}>
      <ol className="th__steps">
        {THINK.map((s, k) => (
          <li key={s.slug} className={`th__step${k === on ? ' is-on' : ''}`}>
            <button type="button" onClick={() => setOn(k)} aria-pressed={k === on}>
              <small>{pad(k + 1)} · {s.rule}</small>
              <b>{s.title}</b>
              <span>{s.sub}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="th__stage" aria-live="polite">
        {THINK.map((s, k) => (
          <Paint key={s.slug} name={s.paint} fit="bleed" className={`th__paint${k === on ? ' is-on' : ''}`}>
            <div className="th__mock" aria-hidden={k !== on}><CaseMock slug={s.slug} /></div>
            <Float className="th__res" depth={1.6}>
              <a href={`/work/${s.slug}`} tabIndex={k === on ? 0 : -1}><b>{s.result}</b><span>{s.metric}</span><em>Read the case<Arrow /></em></a>
            </Float>
          </Paint>
        ))}
      </div>
    </div>
  )
}

/** How I work: three small instruments, each a dark window on a painting running an ASCII scene of the idea. */
export function MethodTrio() {
  const items = [['find', 'Find the real problem.', 'Follow the friction across the journey, not just the screen.', 'Scan', 'dawn'], ['decide', 'Make the difficult call.', 'Turn the evidence into a decision with clear guardrails.', 'Branch', 'dusk'], ['loop', 'Close the loop.', 'Ship, measure the outcome, and use it to shape the next move.', 'Loop', 'meadow']]
  return (
    <ul className="mt">
      {items.map(([k, t, d, m, paint], i) => (
        <li key={k} className="mt__c" data-reveal>
          <div className="mt__art">
            <img src={`/img/paint/${paint}.webp`} alt="" width="1600" height="1000" loading="lazy" decoding="async" />
            <div className="mt__win">
              <span className="mt__bar" aria-hidden="true"><i /><i /><i /><b>{pad(i + 1)} · {m}</b></span>
              <AsciiCanvas scene={k} className="mt__cv" label={`An animated drawing: ${t}`} />
            </div>
          </div>
          <div className="mt__b"><h3>{t}</h3><p>{d}</p></div>
        </li>
      ))}
    </ul>
  )
}

export function ThinkingSection() {
  return (
    <KSection id="method" tone="soft">
      <KHead n="02" label="How I think" tag="Product decisions" title="A great interface is just" sub="the ==visible part==." lead="The product is the decision beneath it. I connect customer experience with the systems that deliver it, and the metrics that prove it worked." />
      <Pinned />
      <MethodTrio />
    </KSection>
  )
}

/* ───────── The story so far: the portrait, the roadmap on a painting, where I am now ───────── */
export function CareerSection() {
  const t = useClock()
  return (
    <KSection id="journey">
      <KHead n="03" label="The story so far" tag="Three chapters" title="From understanding demand" sub="to ==building what delivers it==." lead="Different roles. One growing curiosity about how products and businesses really work." />
      <div className="cr">
        <figure className="cr__photo" data-reveal>
          <img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" loading="lazy" decoding="async" />
          <figcaption><b>Anjor Tank</b><span>Curiosity is the through line.</span></figcaption>
        </figure>
        <Easel paint="noon" fit="center" className="cr__road"><CareerGraph /></Easel>
        <Tile tint="ink" className="cr__now">
          <p className="s-k"><Dot />Right now</p>
          <h3>Founder of ROQIVA. Product Manager, GNC India.</h3>
          <p><LinkArrow to="/journey">The story so far</LinkArrow></p>
        </Tile>
        <Tile className="cr__where">
          <p className="s-k"><span>Based in</span></p>
          <DotMap city="Mumbai" caption="Dotted map with a pin on Mumbai" />
          <p className="cr__city"><b>Mumbai</b><span>{t || 'India'}</span></p>
        </Tile>
      </div>
    </KSection>
  )
}

/* ───────── Consulting: the system map on a painting, the three ways in laid over its foot ───────── */
export function ConsultSection() {
  return (
    <KSection id="consulting" tone="soft">
      <KHead n="04" label="Consulting" tag="GTM engineering and RevOps" title="Growth often breaks" sub="==between tools==." lead="My consulting work combines GTM engineering and RevOps: find where the commercial journey leaks, engineer the missing operating loop, and prove the lift." />
      <Easel paint="dusk" fit="center" className="cn"><ConsultMapScene /></Easel>
      <div className="cn__row">
        <Tile className="cn__c"><p className="s-k"><b>01</b>GTM engineering</p><h3>Find the leak.</h3><p>Instrument the journey, recover intent and connect acquisition with conversion.</p></Tile>
        <Tile className="cn__c"><p className="s-k"><b>02</b>RevOps</p><h3>Connect the handoffs.</h3><p>Govern data, decision rules and the handoffs between the people and tools that deliver.</p></Tile>
        <Tile tint="ink" className="cn__c cn__c--ink">
          <p className="s-k"><Dot tone="accent" />ROQIVA · Intelligence layer · in development</p>
          <h3>The product I am founding to make the method repeatable.</h3>
          <div className="cn__btns"><Button to="/hire">Explore consulting <Arrow /></Button><Button to="/contact?intent=consult#brief" variant="ghost">Discuss a project</Button></div>
        </Tile>
      </div>
    </KSection>
  )
}

