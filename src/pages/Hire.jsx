import { useEffect, useRef, useState } from 'react'
import { gtm, home } from '../content'
import { Arrow, Button, Cta } from '../components/ui'
import { Icon } from '../components/icons'
import { Board, Go, H, Kicker, PageHead, Screen, Sec, Stage, Tile, Win } from '../components/board'
import { STORY } from '../components/v5'
import { ConsultMapScene } from '../scenes/ConsultMap'
import { WordReel } from '../art/Reel'
import { PageMotion } from '../lib/PageMotion'

/* Hire: what I build, how a project runs, who it fits. Every window below is an illustration and is labelled as one. */

/** The head's picture: one raw signal becomes the next best action (from the search case). */
function BeforeAfter() {
  return (
    <Win title="Before → intervention → outcome" tag="Search case" className="b-tf">
      <div className="b-tf__box">
        <b>Raw signal</b><small>What the stack already knows.</small>
        <dl>{[['Event', 'Search: a misspelt medicine'], ['Customer', 'Returning'], ['History', '3 orders'], ['Timing', 'Due now'], ['Action', 'None']].map(([a, v], k) => <div key={a}><dt>{a}</dt><dd className={k === 3 ? 'is-hot' : k === 4 ? 'is-none' : ''}>{v}</dd></div>)}</dl>
      </div>
      <span className="b-tf__ar" aria-hidden="true"><Icon name="arrow" size={22} /></span>
      <div className="b-tf__box b-tf__res">
        <b>Next best action</b><small>The decision layer makes the signal useful.</small>
        <p className="b-tf__m">+9.0%</p>
        <p className="b-tf__ml">search-to-order conversion</p>
        <p className="b-tf__out"><strong>Search is no longer treated as text.</strong> Context, ranking, action and a measured outcome.</p>
        <span className="u-pill is-ok b-tf__badge">Activated</span>
      </div>
    </Win>
  )
}

/** One decision in five stages. The rail on the left picks the stage; on its own it moves on every few seconds while on screen. */
function Stages() {
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef(null)
  const DUR = 5200
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return undefined
    let seen = false
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting }, { threshold: 0.35 })
    io.observe(el)
    const t = setInterval(() => { if (seen && !paused && !document.hidden) setCur((c) => (c + 1) % STORY.length) }, DUR)
    return () => { clearInterval(t); io.disconnect() }
  }, [paused])
  const s = STORY[cur]
  return (
    <Board className="b-ss" ref={ref}>
      <Tile className="b-ss__l" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <div>
          <Kicker icon="eye">The mechanism, in one frame</Kicker>
          <p className="b-ss__h" style={{ marginTop: 12 }}><span>Most stacks record</span> <strong>what happened.</strong> <span>Good systems decide</span> <strong>what happens next.</strong></p>
        </div>
        <ol className={`b-ss__rail${paused ? ' is-paused' : ''}`} role="tablist" aria-label="Stages of one decision">
          {STORY.map((x, k) => (
            <li key={x.id}>
              <button type="button" role="tab" aria-selected={k === cur} aria-controls="b-ss-panel" onClick={() => setCur(k)} style={{ '--dur': `${DUR}ms` }}>
                <small>{String(k + 1).padStart(2, '0')}</small>{x.k}<i aria-hidden="true"><b key={k === cur ? cur : 'x'} /></i>
              </button>
            </li>
          ))}
        </ol>
        <p className="b-ss__note">Illustration from the retention case. The repeat-order figure is from that case.</p>
      </Tile>
      <Stage kind="paint" name="noon" className="b-ss__r">
        <Win title={`Stage ${String(cur + 1).padStart(2, '0')} / ${s.k}`} className="b-ss__card">
          {STORY.map((x, k) => (
            <div key={x.id} id={k === cur ? 'b-ss-panel' : undefined} role="tabpanel" hidden={k !== cur} className="b-ss__panel">
              <h3>{x.t}</h3>
              <p>{x.d}</p>
              <div className="b-ss__ui">{x.rows.map(([a, b]) => <p key={a}><small>{a}</small><strong>{b}</strong></p>)}</div>
            </div>
          ))}
        </Win>
      </Stage>
    </Board>
  )
}

const LAYERS = [
  { title: 'GTM engineering', sub: 'Make every signal actionable', d: 'Instrument the journey, recover intent and connect acquisition with conversion.', steps: ['Acquisition signal', 'Customer intent', 'Conversion loop'], status: 'Available as consulting', scene: 'gtm' },
  { title: 'Revenue operations', sub: 'Make the decisions repeatable', d: 'Govern data, decision rules and handoffs between the people and tools that actually deliver.', steps: ['Trustworthy data', 'Operating rule', 'Measured action'], status: 'Available as consulting', scene: 'revops' },
  { title: 'ROQIVA', sub: 'Build the intelligence layer', d: 'Founder-led software in development to surface signals, prepare evidence and preserve human approval.', steps: ['Detect the signal', 'Draft the action', 'Human approval'], status: 'Independent product · in development', scene: 'agents' },
]

/** Three layers as vertical tabs; the chosen layer's steps beside a dot screen of it. */
function Layers() {
  const [i, setI] = useState(0)
  const refs = useRef([])
  const key = (e, k) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!d) return
    e.preventDefault()
    const n = (k + d + LAYERS.length) % LAYERS.length
    setI(n); refs.current[n]?.focus()
  }
  const l = LAYERS[i]
  return (
    <Board className="b-layers">
      <div className="b-layers__tabs" role="tablist" aria-label="Explore the architecture" aria-orientation="vertical">
        {LAYERS.map((x, k) => (
          <button key={x.title} ref={(el) => { refs.current[k] = el }} type="button" role="tab" id={`ly-t${k}`} aria-selected={k === i} aria-controls="ly-p" tabIndex={k === i ? 0 : -1} onClick={() => setI(k)} onKeyDown={(e) => key(e, k)}>
            <b>{x.title}</b><em>{x.sub}</em><Icon name="arrow" size={16} />
          </button>
        ))}
      </div>
      <div className="b-layers__p" role="tabpanel" id="ly-p" aria-labelledby={`ly-t${i}`} key={i}>
        <Tile className="b-layers__copy">
          <Kicker icon={<i className="b-live" />}>{l.status}</Kicker>
          <h3>{l.sub}.</h3>
          <p>{l.d}</p>
          <ol className="b-layers__steps">{l.steps.map((x, k) => <li key={x}><b>{k + 1}</b>{x}</li>)}</ol>
        </Tile>
        <div className="b-layers__art"><Screen scene={l.scene} label={l.title} /></div>
      </div>
    </Board>
  )
}

/** One small, different widget per service. Shapes only: no numbers, nothing to mistake for a result. */
function Mini({ i, s }) {
  const w = [86, 64, 41, 22]
  if (i === 0) return <div className="u-mini"><ul className="u-mini__bars">{w.map((x, k) => <li key={k}><i style={{ width: `${x}%` }} /><span>Finding {k + 1}</span></li>)}</ul></div>
  if (i === 1) return <div className="u-mini"><p className="u-mini__pills"><span className="is-on">{s.flow[0]}</span></p><p className="u-mini__pills"><span>Transient error → retry</span><span>Hard decline → human</span><span className="is-on">Warm intent → nudge</span></p></div>
  if (i === 2) return <div className="u-mini"><p className="u-mini__pills">{['New', 'Active', 'Due', 'Lapsing', 'Won back'].map((x, k) => <span key={x} className={k === 2 ? 'is-on' : ''}>{x}</span>)}</p></div>
  if (i === 3) return <div className="u-mini"><ol>{['Signal', 'Opportunity', 'Owner'].map((x, k) => <li key={x}><b>{k + 1}</b>{x}<span className="u-pill">{['ranked', 'sized', 'assigned'][k]}</span></li>)}</ol></div>
  if (i === 4) return <div className="u-mini"><p className="u-mini__pills">{s.flow.slice(0, 4).map((x) => <span key={x}>{x}</span>)}</p></div>
  return <div className="u-mini"><div className="u-mini__ab"><div><small>Held back</small><i style={{ height: '46%' }} /></div><div><small>Treated</small><i className="on" style={{ height: '72%' }} /></div></div><p>Lift = the gap between the two bars</p></div>
}
const SV_PAINT = ['dawn', 'noon', 'meadow', 'dusk', 'dawn', 'noon']

/** The project phases as tabs over one panel. */
function Phases() {
  const [i, setI] = useState(0)
  const p = gtm.phases[i]
  return (
    <Tile className="b-proc__t">
      <div className="b-proc__tabs" role="tablist" aria-label="Project phases">
        {gtm.phases.map((x, k) => <button key={x.id} type="button" role="tab" aria-selected={k === i} aria-controls="ph-p" onClick={() => setI(k)}><small>{String(k + 1).padStart(2, '0')}</small>{x.label}</button>)}
      </div>
      <div className="b-proc__p" role="tabpanel" id="ph-p" key={i}>
        <h3>{p.label} <small style={{ color: 'var(--text-3)', fontSize: 15 }}>{p.weeks}</small></h3>
        <p>{p.does}</p>
        <dl><div><dt>Your input</dt><dd>{p.you}</dd></div><div><dt>Deliverable</dt><dd>{p.out}</dd></div></dl>
      </div>
    </Tile>
  )
}
function Gantt() {
  const p = (x) => (x / 12) * 100
  return (
    <Win title="Twelve weeks" tag="Weeks from kickoff">
      <div className="u-gantt" role="table" aria-label="Project phases across twelve weeks">
        <div className="u-gantt__axis" role="row"><span role="columnheader" /><div className="u-gantt__ticks">{[0, 3, 6, 9, 12].map((t) => <span key={t} style={{ left: `${p(t)}%` }}>{t}</span>)}</div></div>
        {gtm.phases.map((r) => (
          <div className="u-gantt__row" role="row" key={r.id}>
            <div className="u-gantt__lab" role="rowheader"><b>{r.label}</b><small>{r.weeks}</small></div>
            <div className="u-gantt__track" role="cell"><span className="u-gantt__bar" style={{ left: `${p(r.start)}%`, width: `${p(r.span)}%` }} /></div>
          </div>
        ))}
      </div>
    </Win>
  )
}

export default function Hire() {
  const R = home.roqiva
  return (
    <PageMotion routeKey="/hire">
      <PageHead label="Selective consulting" tag="Hire" title="Build the ==systems== *behind growth.*" lead="I work where your product, CRM, analytics and operations meet. GTM engineering finds the leak. RevOps fixes the loop. ROQIVA is the product I’m founding to make the method repeatable."
        visual={<Stage kind="shader" name="ember"><BeforeAfter /></Stage>}>
        <div className="b-acts"><Button to="/contact?intent=consult#brief">Discuss a project <Arrow /></Button><Go to="#system">Explore the system</Go></div>
        <p className="b-k"><i className="b-live" />Open to the right product role, too. <a href="/contact?intent=job#brief" style={{ color: 'var(--text)' }}>Let’s talk ↗</a></p>
      </PageHead>

      <Sec id="story" label="The idea" tag="Scroll through one decision" title="One decision," sub="==five stages==." lead="One customer, one refill window, five stages. This is the loop I build for clients, and the loop ROQIVA is designed to run."><Stages /></Sec>

      <Sec id="build" label="What gets built" tag="Moving parts" title="Signals in, ==decisions out==," sub="and a person at every gate that matters." lead="Events from the tools you already run resolve to one customer, detectors find the leak, a decision layer chooses the action, and a held-back group proves the lift.">
        <Board className="b-build"><Stage kind="shader" name="violet"><ConsultMapScene /></Stage></Board>
      </Sec>

      <Sec id="system" label="One commercial system" tag="Three connected layers" title="From the first signal" sub="to the next ==measured outcome==." lead="Each layer solves a different part of the same problem."><Layers /></Sec>

      <Sec id="consulting" label="Engagements" tag="Six ways to start" title="Start with" sub="the ==constraint==." lead="A focused audit or a production-ready workflow: I scope the work around what has to change.">
        <Board className="b-svc">
          {gtm.services.slice(0, 6).map((s, i) => (
            <Tile key={s.id} className="b-svc__t">
              <Stage kind="paint" name={SV_PAINT[i]} className="b-svc__art" align="end"><Win title={s.official}><Mini i={i} s={s} /></Win></Stage>
              <div className="b-svc__b">
                <Kicker icon="target">{s.code} · {s.cat}</Kicker>
                <h3>{s.name}</h3>
                <p>{s.line}</p>
                <dl><div><dt>First result</dt><dd>{s.first}</dd></div><div><dt>Model</dt><dd>{s.model}</dd></div></dl>
                <Go to="/contact?intent=consult#brief">Discuss the scope</Go>
              </div>
            </Tile>
          ))}
        </Board>
      </Sec>

      <Sec id="process" label="How a project runs" tag="Twelve weeks, typically" title="Less theatre." sub="More ==shipped decisions==." lead="Find the problem, define the guardrails, build the fix, and measure its effect. Timelines depend on scope.">
        <Board className="b-proc">
          <Phases />
          <Stage kind="paint" name="noon"><Gantt /></Stage>
        </Board>
      </Sec>

      <Sec id="fit" label="Fit check" tag="Before we talk" title="Who this is ==for==," sub="and who it is not.">
        <Board className="b-fit">
          <Tile><h3>A good fit</h3><ul>{gtm.fitCheck.good.map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}</ul></Tile>
          <Tile tone="ink"><h3>Not what I do</h3><ul>{gtm.fitCheck.not.map((x) => <li key={x}><span aria-hidden="true">–</span>{x}</li>)}</ul></Tile>
        </Board>
      </Sec>

      <section id="roqiva" className="b-sec b-sec--ink" aria-labelledby="hire-rq-h">
        <div className="b-wrap">
          <Board className="b-rq b-rq--c">
            <Tile tone="ink" className="b-rq__id">
              <Kicker icon={<i className="b-live" />}>{R.eyebrow}</Kicker>
              <div className="b-rq__name"><WordReel word="roq" size="foot" label="ROQIVA" /></div>
              <H text={R.title} id="hire-rq-h" />
              <p className="b-lead">{R.lead}</p>
              <ul className="b-rq__s">{R.stats.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}</ul>
              <div className="b-acts"><Button to={R.primary.to}>{R.primary.label}<Arrow /></Button><Button to={R.secondary.to} variant="ghost">{R.secondary.label}</Button></div>
            </Tile>
            <Stage kind="shader" name="violet" className="b-rq__screen"><Screen scene="signals" className="b-rq__dots" /></Stage>
          </Board>
        </div>
      </section>

      <Sec id="role">
        <Tile className="b-role">
          <div><h2>A builder in your <em>product team.</em></h2><p>Alongside consulting, I’m open to conversations about owning consumer, growth and platform products — from discovery through delivery and measurement.</p></div>
          <Button to="/contact?intent=job#brief">Talk about a product role <Icon name="arrow" size={15} /></Button>
        </Tile>
      </Sec>

      <Cta title="Bring a ==real constraint==. *Let's design the next move.*" lead="Start with the problem and the tools involved. A short brief is enough." primary={{ label: 'Discuss consulting', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Talk about a product role', to: '/contact?intent=job#brief' }} />
    </PageMotion>
  )
}
