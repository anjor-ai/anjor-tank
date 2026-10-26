import { useState } from 'react'
import { Arrow, Button, LinkArrow } from './ui'
import { CaseMock } from './mocks'

/* Grounded, interactive product illustrations. The mini UI is an illustration,
   not a screenshot or claim of live data. All headline outcomes come from Anjor's cases. */
const cases = [
  {
    id: 'checkout', slug: 'price-lock-checkout', n: '01', short: 'Checkout', name: 'Checkout & Price Lock',
    tag: 'PAYMENTS / CUSTOMER TRUST', signal: 'A customer commits to an order, but the final price might still change.',
    decision: 'Make payment and price commitment feel predictable.', result: '+12.5pp',
    resultLabel: 'prepaid order-to-delivery conversion',
    secondary: '−1.9% RTO', before: 'Price uncertainty', after: 'Price Lock + payment clarity',
    palette: 'blue'
  },
  {
    id: 'fulfilment', slug: 'sku-substitution-engine', n: '02', short: 'Fulfilment', name: 'SKU Substitution Engine',
    tag: 'PLATFORM / OPERATIONS', signal: 'Warehouse stock-outs threaten orders already placed by customers.',
    decision: 'Route acceptable substitutes and reconcile prices.', result: '+3.0%',
    resultLabel: 'delivery fulfilment', secondary: '−2.6pp cancellations',
    before: 'Unrecoverable stock-out', after: 'Rules + price reconciliation', palette: 'mint'
  },
  {
    id: 'retention', slug: 'retention-reminders', n: '03', short: 'Retention', name: 'Retention & Reminder Platform',
    tag: 'GROWTH / LIFECYCLE', signal: 'Repeat customers are missing the right reorder moment.',
    decision: 'Use purchase cadence to trigger the next action.', result: '~1,100',
    resultLabel: 'additional repeat orders / day', secondary: 'Customer + agent journeys',
    before: 'Missed repeat window', after: 'Timely lifecycle orchestration', palette: 'peach'
  },
  {
    id: 'search', slug: 'search-discovery', n: '04', short: 'Discovery', name: 'Predictive Product Search',
    tag: 'SEARCH / CONVERSION', signal: 'High-intent search fails to understand what customers mean.',
    decision: 'Predict and refine intent before a dead end.', result: '+9.0%',
    resultLabel: 'search-to-order conversion', secondary: 'Predictive recommendations',
    before: 'Low-relevance query', after: 'Intent-driven results', palette: 'lavender'
  }
]

function WindowDots() {
  return <span className="st-dots" aria-hidden="true"><i /><i /><i /></span>
}

/** A screen-based portfolio hero: actual illustrated product decisions, not fabricated performance charts. */
export function PortfolioConsole() {
  const [current, setCurrent] = useState(0)
  const c = cases[current]
  return (
    <div className={'st-console st-console--' + c.palette} aria-label="Explore four product systems">
      <div className="st-console__chrome"><WindowDots/><span>ANJOR / PRODUCT WORKSPACE</span><span className="st-console__online"><i/>INTERACTIVE PREVIEW</span></div>
      <div className="st-console__body">
        <aside className="st-console__nav" aria-hidden="true">
          <div className="st-console__brand">AT<span>·</span></div>
          <span className="st-console__navlabel">SELECTED SYSTEMS</span>
          {cases.map((x,i)=><div key={x.id} className={'st-console__navitem'+(i===current?' is-current':'')}><span>{x.n}</span>{x.short}</div>)}
          <span className="st-console__navfoot">DESIGN → DELIVERY</span>
        </aside>
        <div className="st-console__main" key={c.id}>
          <div className="st-console__title"><span className="st-eyebrow">{c.tag}</span><span className="st-console__state"><i/>CASE {c.n} / 04</span></div>
          <h2>{c.name}</h2>
          <p className="st-console__sub">{c.signal}</p>
          <div className="st-console__visual">
            <div className="st-console__mock" aria-hidden="true"><CaseMock slug={c.slug}/></div>
            <div className="st-console__metric">
              <span className="st-eyebrow">MEASURED IMPACT</span>
              <strong>{c.result}</strong>
              <p>{c.resultLabel}</p>
              <span>{c.secondary}</span>
            </div>
          </div>
          <div className="st-console__bottom">
            <div><span className="st-eyebrow">THE PRODUCT DECISION</span><strong>{c.decision}</strong></div>
            <a href={'/work/'+c.slug} aria-label={'Read case study: '+c.name}>Read case <Arrow /></a>
          </div>
        </div>
      </div>
      <div className="st-console__tabs" role="group" aria-label="Choose a product system">
        {cases.map((c,i)=><button type="button" key={c.id} onClick={()=>setCurrent(i)}
          className={'st-console__tab'+(current===i?' is-current':'')} aria-pressed={current===i}>
          <span>{c.n} / {c.short}</span><strong>{c.result}</strong>
        </button>)}
      </div>
      <div className="st-console__disclaimer">Product illustrations use sample data · Business results sourced from case studies</div>
    </div>
  )
}

/** Real systems thinking illustrated as a small annotated product decision graph. */
export function DecisionStudio() {
  const [active,setActive]=useState(0)
  const c=cases[active]
  return (
    <div className="st-method">
      <div className="st-method__copy" data-reveal>
        <p className="label eyebrow">THE WAY I THINK / PRODUCT METHOD</p>
        <h2 className="h-2">Good products are <span className="em">decision systems.</span> Not just screens.</h2>
        <p className="lead">The best product decisions often sit between the interface, data and operations. I work across that full chain — from diagnosing friction to designing the rules and measuring the result.</p>
        <LinkArrow to="/work">How this plays out in my work</LinkArrow>
        <div className="st-method__principles">
          <span>01 · Diagnose the root cause</span>
          <span>02 · Design the decision logic</span>
          <span>03 · Measure the business outcome</span>
        </div>
      </div>
      <div className={'st-method__board st-method__board--'+c.palette} data-reveal>
        <div className="st-method__toolbar"><WindowDots/><span>PRODUCT DECISION MAP</span><span className="st-method__live">INTERACTIVE</span></div>
        <div className="st-method__switch" role="group" aria-label="Switch system diagram">
          {cases.map((s,i)=><button type="button" key={s.id} aria-pressed={active===i} onClick={()=>setActive(i)}>{s.short}</button>)}
        </div>
        <div className="st-method__headline" key={c.id}><small>THE PRODUCT PROBLEM / {c.n}</small><h3>{c.signal}</h3></div>
        <div className="st-method__map" aria-label="Product decision flow">
          <div className="st-method__node st-method__node--problem"><span>INPUT / FRICTION</span><b>{c.before}</b><small>Customer or operational signal</small></div>
          <div className="st-method__wire" aria-hidden="true"><i /></div>
          <div className="st-method__node st-method__node--decision"><span>DECISION / LOGIC</span><b>{c.after}</b><small>Product + platform + experience</small></div>
          <div className="st-method__wire" aria-hidden="true"><i /></div>
          <div className="st-method__node st-method__node--outcome"><span>OUTPUT / PROOF</span><b>{c.result}</b><small>{c.resultLabel}</small></div>
        </div>
        <div className="st-method__bottom">
          <span>HYPOTHESIS → REQUIREMENTS → BUILD → MEASUREMENT</span>
          <a href={'/work/'+c.slug}>Examine this decision <Arrow /></a>
        </div>
      </div>
    </div>
  )
}

/** One compact, varied-weight strip instead of another oversized text block. */
export function ProofBento() {
  return (
    <div className="st-proof" aria-label="Selected product outcomes">
      <div className="st-proof__intro"><span className="label">EVIDENCE, NOT BUZZWORDS</span><b>Real outcomes. Different layers of the same product.</b></div>
      <div><strong>+12.5pp</strong><span>Prepaid conversion</span></div>
      <div><strong>~1,100</strong><span>Repeat orders / day</span></div>
      <div><strong>−20%</strong><span>Cost per order</span></div>
    </div>
  )
}
