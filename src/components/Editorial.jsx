import { useState } from 'react'
import { Arrow, Button, LinkArrow } from './ui'

/* Editorial product modules. Evidence comes from the published case studies;
   controls are real buttons / links, and every visual also works without animation. */
const screens = [
  { id: 'checkout', key: '01', keycap: 'CONVERSION', name: 'Checkout & payments', signal: 'Price uncertainty after purchase intent', decision: 'Make price commitment predictable', outcome: '+12.5pp', metric: 'prepaid order-to-delivery conversion', path: '/work/price-lock-checkout', bars: [44, 55, 61, 76, 93] },
  { id: 'discovery', key: '02', keycap: 'DISCOVERY', name: 'Search & discovery', signal: 'High-intent searches ended in low-relevance results', decision: 'Predict intent before the dead end', outcome: '+9.0%', metric: 'search-to-order conversion', path: '/work/search-discovery', bars: [35, 43, 54, 72, 89] },
  { id: 'retention', key: '03', keycap: 'RETENTION', name: 'Retention & lifecycle', signal: 'Repeat customers missed the right reorder window', decision: 'Turn purchase cadence into timely action', outcome: '~1,100', metric: 'additional repeat orders a day', path: '/work/retention-reminders', bars: [29, 48, 57, 76, 94] },
]
const playbook = [
  { n: '01', t: 'Observe the friction', d: 'Trace intent across product analytics, frontline workflows and the actual customer journey.' },
  { n: '02', t: 'Design the decision', d: 'Specify states, exceptions and what should happen next — not just what the screen looks like.' },
  { n: '03', t: 'Ship a repeatable system', d: 'Build the product, connect the tools and give the teams operating it a clear path.' },
  { n: '04', t: 'Measure the outcome', d: 'Track conversion and cost with downstream quality metrics, then iterate.' },
]
const chapters = [
  { year: '2022—23', name: 'Learned what creates demand', role: 'Eggfirst · Neil Patel Digital', body: 'Clients, campaigns, automotive dealer networks and the distance between attention and action.', mark: '01' },
  { year: '2023—26', name: 'Built systems underneath commerce', role: 'Truemeds · Associate Product Manager', body: 'Checkout, search, fulfilment, retention, AI and operational products. The work that taught me to think in whole systems.', mark: '02' },
  { year: '2026—now', name: 'Own the customer-to-operation loop', role: 'GNC India · Product Manager', body: 'Ecommerce, D2C growth and customer experience — connecting visible moments to the platforms behind them.', mark: '03' },
  { year: 'Building', name: 'Turn the method into a product', role: 'ROQIVA · Founder', body: 'An independent revenue intelligence product in development. Designed and founded by me.', mark: '04' },
]

export function ProductDesk() {
  const [index, setIndex] = useState(0)
  const s = screens[index]
  return (
    <div className="ed-desk" data-reveal aria-label="Interactive portfolio workspace">
      <div className="ed-desk__top">
        <span className="ed-dot" /><span className="label">ANJOR / PRODUCT SYSTEMS</span>
        <span className="ed-desk__topright label">INTERACTIVE DESK · SELECT A KEY</span>
      </div>
      <div className="ed-desk__display" aria-live="polite">
        <div className="ed-desk__readout">
          <span className="ed-micro">NOW EXPLORING / {s.key}</span>
          <h2>{s.name}</h2>
          <p>{s.signal}</p>
          <div className="ed-desk__decision"><span className="ed-micro">PRODUCT DECISION</span><b>{s.decision}</b></div>
        </div>
        <div className="ed-desk__graph" aria-hidden="true">
          <span className="ed-micro">IMPACT SIGNAL / ILLUSTRATIVE TREND</span>
          <div className="ed-desk__bars">{s.bars.map((v, i) => <i key={i} style={{ height: v + '%' }} />)}</div>
          <span className="ed-desk__outcome">{s.outcome}</span><span className="ed-desk__metric">{s.metric}</span>
        </div>
      </div>
      <div className="ed-desk__keys" role="group" aria-label="Explore product outcomes">
        {screens.map((item, i) => (
          <button type="button" key={item.id} className={'ed-key' + (i === index ? ' is-active' : '')} aria-pressed={i === index} onClick={() => setIndex(i)}>
            <small>F0{i + 1}</small><strong>{item.keycap}</strong><span>{item.outcome}</span>
          </button>
        ))}
        <a className="ed-key ed-key--go" href={s.path}><small>↗</small><strong>OPEN CASE</strong><span>Read the decisions</span></a>
      </div>
      <div className="ed-desk__base" aria-hidden="true"><span /><span /><span /></div>
    </div>
  )
}

export function DecisionLab() {
  const [selected, setSelected] = useState(0)
  const d = screens[selected]
  return (
    <div className="ed-lab">
      <div className="ed-lab__intro" data-reveal>
        <p className="label eyebrow">THE PRODUCT METHOD / 01</p>
        <h2 className="h-2">The interface is the visible part. <span className="em">The decision system is the product.</span></h2>
        <p className="lead">I start with the business leak, map the decision that causes it, and work backwards into the experience, platform and measurement.</p>
        <LinkArrow to="/work">Explore the case studies</LinkArrow>
      </div>
      <div className="ed-lab__unit" data-reveal>
        <p className="label">PICK A REAL PROBLEM TO TRACE</p>
        <div className="ed-lab__tabs" role="tablist" aria-label="Select a product problem">
          {screens.map((s,i)=><button id={'ed-lab-tab-'+s.id} key={s.id} type="button" role="tab" aria-selected={selected===i} aria-controls="ed-lab-panel" tabIndex={0} onClick={()=>setSelected(i)}>{s.name}</button>)}
        </div>
        <div id="ed-lab-panel" role="tabpanel" aria-labelledby={'ed-lab-tab-'+d.id} className="ed-lab__panel" key={d.id}>
          <div className="ed-lab__problem"><span className="ed-micro">WHAT WAS BREAKING</span><p>{d.signal}</p></div>
          <ol className="ed-lab__flow">
            {playbook.map((p,i)=><li key={p.n}><span>{p.n}</span><b>{p.t}</b><p>{p.d}</p>{i<3&&<i aria-hidden="true" />}</li>)}
          </ol>
          <div className="ed-lab__result"><div><span className="ed-micro">MEASURED RESULT</span><strong>{d.outcome}</strong><small>{d.metric}</small></div><a href={d.path}>See how it worked <Arrow /></a></div>
        </div>
      </div>
    </div>
  )
}

export function JourneyRibbon() {
  return (
    <div className="ed-journey" data-reveal>
      <div className="ed-journey__intro">
        <p className="label eyebrow">THE PERSON / 02</p>
        <h2 className="h-2">Not a straight line. <span className="em">A consistent curiosity.</span></h2>
        <p>From the people trying to win a customer to the systems that fulfil the promise, every role has changed how I see products.</p>
        <LinkArrow to="/journey">See my full journey</LinkArrow>
        <div className="ed-journey__photo"><img src="/img/anjor.webp" alt="Portrait of Anjor Tank" loading="lazy" decoding="async" /><span>CURIOUS BY DEFAULT.</span></div>
      </div>
      <ol className="ed-journey__timeline">
        {chapters.map(c=><li key={c.mark}><span className="ed-journey__marker">{c.mark}</span><div><span className="label">{c.year} / {c.role}</span><h3>{c.name}</h3><p>{c.body}</p></div></li>)}
      </ol>
    </div>
  )
}

export function ConsultingPanel() {
  return (
    <div className="ed-consult" data-reveal>
      <div className="ed-consult__copy">
        <p className="label eyebrow">CONSULTING / 03</p>
        <h2 className="h-2">Your funnel is visible. <span className="em">The leak between tools usually isn't.</span></h2>
        <p className="lead">I work with commerce and growth teams to find where revenue gets lost between product, data, CRM and operations — then help build the fix.</p>
        <div className="ed-consult__actions">
          <Button to="/contact?intent=consult#brief">Discuss a project <Arrow /></Button>
          <LinkArrow to="/hire">See consulting services</LinkArrow>
        </div>
        <p className="ed-consult__aside">Also open to the right product leadership conversation. <a href="/contact?intent=job#brief">Talk about a role ↗</a></p>
      </div>
      <div className="ed-consult__graphic" data-editorial-drift>
        <div className="ed-consult__toolbar"><span className="ed-dot"/> LIVE FRAMEWORK <span>SCOPED TO YOUR PROBLEM</span></div>
        <div className="ed-consult__trace"><span>Customer signal</span><i/><span>Decision rule</span><i/><span>Measured outcome</span></div>
        <div className="ed-consult__signal">
          <div><small>01 / DISCOVER</small><b>Find the leak.</b><p>Funnel, events, handoffs, failure reasons.</p></div>
          <div><small>02 / ENGINEER</small><b>Fix the loop.</b><p>Product changes, integrations, workflow automation.</p></div>
          <div><small>03 / VERIFY</small><b>Prove the lift.</b><p>Primary metric, guardrails, clean attribution.</p></div>
        </div>
        <div className="ed-consult__foot"><span className="ed-micro">OUTPUT: A WORKING SYSTEM, NOT JUST A DECK</span><span className="ed-consult__pulse"/></div>
      </div>
    </div>
  )
}

export function LifePreview() {
  const photos = [
    { src: 'kart-night', title: 'Chasing the apex', note: 'Speed / focus' },
    { src: 'waterfall', title: 'Taking the long way', note: 'Outdoors / curiosity' },
    { src: 'stage-unreal', title: 'Getting lost in sound', note: 'Live / energy' }
  ]
  return (
    <div className="ed-life">
      <div className="ed-life__heading" data-reveal>
        <p className="label eyebrow">AWAY FROM THE ROADMAP / 04</p>
        <h2 className="h-2">There is more to me <span className="em">than a release plan.</span></h2>
        <p className="lead">Kart tracks, long detours, live music, new places. I like seeing how things work, even when I'm off the clock.</p>
        <LinkArrow to="/beyond">Meet the person beyond the PM</LinkArrow>
      </div>
      <div className="ed-life__photos" data-editorial-drift>
        {photos.map((p,i)=><a className={'ed-life__photo ed-life__photo--'+i} key={p.src} href="/beyond"><img src={'/img/adventure/'+p.src+'.webp'} alt={p.title} loading="lazy" decoding="async"/><span><small>{p.note}</small><b>{p.title}</b></span></a>)}
      </div>
    </div>
  )
}

export function WorkHeroVisual() {
  return <div className="ed-pageviz ed-pageviz--work" aria-label="Portfolio product domains">
    <div className="ed-pageviz__top"><span className="ed-dot"/> PRODUCT SYSTEMS / EVIDENCE</div>
    <div className="ed-pageviz__feature"><strong>06</strong><span>Detailed case studies<br/>across the commerce journey</span></div>
    <div className="ed-pageviz__matrix">
      {[['Checkout', '+12.5pp'], ['Fulfilment', '+3.0%'], ['Retention', '~1,100/day'], ['Search', '+9.0%'], ['AI Ops', '−20%'], ['Growth infra', '+1.7%']].map(([a,b])=><div key={a}><small>{a}</small><b>{b}</b></div>)}
    </div>
    <span className="ed-pageviz__bottom">PROBLEM → PRODUCT DECISION → OUTCOME</span>
  </div>
}

export function HireHeroVisual() {
  return <div className="ed-pageviz ed-pageviz--hire" aria-label="Consulting engagement approach">
    <div className="ed-pageviz__top"><span className="ed-dot"/> HOW ENGAGEMENTS WORK</div>
    <div className="ed-pageviz__stack">
      <div><span>01</span><b>Find the constraint</b><small>Product + data + operations</small></div>
      <div><span>02</span><b>Engineer the intervention</b><small>Rules + workflows + experience</small></div>
      <div><span>03</span><b>Measure what moved</b><small>Primary metric + guardrails</small></div>
    </div>
    <p className="ed-pageviz__bottom">Start with a problem. Agree the scope together.</p>
  </div>
}

export function BeyondHeroVisual() {
  return <div className="ed-beyondviz" aria-label="Moments beyond work">
    <img src="/img/adventure/kart-pov.webp" alt="Karting point of view" loading="lazy" />
    <img src="/img/adventure/lake-overlook.webp" alt="View overlooking a lake" loading="lazy" />
    <div><span className="ed-micro">SIDE QUESTS / ALWAYS ON</span><strong>Stay curious.</strong></div>
  </div>
}
