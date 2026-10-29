import { useEffect, useRef, useState } from 'react'
import { gtm } from '../content'
import { Arrow, Button, Cta } from '../components/ui'
import { Icon } from '../components/icons'
import { Board, Go, PageHead, Sec, Tile } from '../components/board'
import { ConsultMapScene } from '../scenes/ConsultMap'
import { MQ } from '../lib/motion'
import { PageMotion } from '../lib/PageMotion'

/* Hire: four screens, each carried by its picture rather than its paragraphs.
   1. The head: an engagement as a run, phase by phase, with what each phase hands over.
   2. What gets built: the system map.
   3. Six ways to start: compact cards, each with a small picture of the work.
   4. How a project runs: twelve weeks as a timeline; open a phase to see your input and the deliverable.
   Then the fit check and the close. */

const P = gtm.phases
const pad = (n) => String(n).padStart(2, '0')

/** Step a value forward every `ms` while the element is on screen, until someone picks one. */
function useAuto(n, ms, ref) {
  const [i, setI] = useState(0)
  const human = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia(MQ.motion).matches) return undefined
    let seen = false
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting }, { threshold: 0.3 })
    io.observe(el)
    const t = setInterval(() => { if (seen && !human.current && !document.hidden) setI((x) => (x + 1) % n) }, ms)
    return () => { clearInterval(t); io.disconnect() }
  }, [n, ms, ref])
  return [i, (k) => { human.current = true; setI(k) }]
}

/** The head's picture: one engagement, phase by phase. */
function EngagementRun() {
  const ref = useRef(null)
  const [i, pick] = useAuto(P.length, 3200, ref)
  return (
    <div className="hr-run" ref={ref}>
      <div className="hr-run__bar"><span className="hr-dots" aria-hidden="true"><i /><i /><i /></span><b>Engagement</b><span className="hr-run__step">Phase {i + 1} of {P.length}</span></div>
      <ol className="hr-run__phases">
        {P.map((p, k) => (
          <li key={p.id}>
            <button type="button" className={k === i ? 'is-on' : k < i ? 'is-done' : ''} aria-pressed={k === i} onClick={() => pick(k)}>
              <small>{pad(k + 1)}</small>
              <b>{p.label}</b>
              <span>{p.weeks}</span>
              <i aria-hidden="true">{k < i ? <Icon name="check" size={11} /> : null}</i>
            </button>
          </li>
        ))}
      </ol>
      <div className="hr-run__out" key={i}>
        <p><small>Does</small>{P[i].does}</p>
        <p><small>Hands over</small><b>{P[i].out}</b></p>
      </div>
    </div>
  )
}

/** One small picture per service. Shapes only: no numbers, nothing to mistake for a result. */
function Mini({ i, s }) {
  const w = [86, 64, 41, 22]
  if (i === 0) return <ul className="u-mini__bars">{w.map((x, k) => <li key={k}><i style={{ width: `${x}%` }} /><span>Finding {k + 1}</span></li>)}</ul>
  if (i === 1) return <><p className="u-mini__pills"><span className="is-on">{s.flow[0]}</span></p><p className="u-mini__pills"><span>Transient error → retry</span><span className="is-on">Warm intent → nudge</span></p></>
  if (i === 2) return <p className="u-mini__pills">{['New', 'Active', 'Due', 'Lapsing', 'Won back'].map((x, k) => <span key={x} className={k === 2 ? 'is-on' : ''}>{x}</span>)}</p>
  if (i === 3) return <ol>{['Signal', 'Opportunity', 'Owner'].map((x, k) => <li key={x}><b>{k + 1}</b>{x}<span className="u-pill">{['ranked', 'sized', 'assigned'][k]}</span></li>)}</ol>
  if (i === 4) return <p className="u-mini__pills">{s.flow.slice(0, 4).map((x) => <span key={x}>{x}</span>)}</p>
  return <div className="u-mini__ab"><div><small>Held back</small><i style={{ height: '46%' }} /></div><div><small>Treated</small><i className="on" style={{ height: '72%' }} /></div></div>
}

/** Twelve weeks as a timeline. Each phase is a row; the open one shows your input and the deliverable. */
function Timeline() {
  const ref = useRef(null)
  const [i, pick] = useAuto(P.length, 4200, ref)
  const x = (w) => (w / 12) * 100
  return (
    <div className="hr-tl" ref={ref}>
      <div className="hr-tl__axis" aria-hidden="true"><span /><div className="hr-tl__ticks">{[0, 3, 6, 9, 12].map((t) => <em key={t} style={{ left: `${x(t)}%` }}>Week {t}</em>)}</div></div>
      <ol className="hr-tl__rows">
        {P.map((p, k) => (
          <li key={p.id} className={k === i ? 'is-on' : ''}>
            <button type="button" aria-expanded={k === i} onClick={() => pick(k)}>
              <span className="hr-tl__lab"><small>{pad(k + 1)}</small><b>{p.label}</b><em>{p.weeks}</em></span>
              <span className="hr-tl__track"><i style={{ left: `${x(p.start)}%`, width: `${x(p.span)}%` }} /></span>
            </button>
            {k === i && (
              <dl className="hr-tl__d">
                <div><dt>Your input</dt><dd>{p.you}</dd></div>
                <div><dt>Deliverable</dt><dd>{p.out}</dd></div>
              </dl>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Hire() {
  return (
    <PageMotion routeKey="/hire">
      <PageHead label="Selective consulting" tag="Hire" title="Build the ==systems== *behind growth.*" lead="I work where your product, CRM, analytics and operations meet. GTM engineering finds the leak. RevOps fixes the loop."
        visual={<div className="hr-head"><EngagementRun /></div>}>
        <div className="b-acts"><Button to="/contact?intent=consult#brief">Discuss a project <Arrow /></Button><Go to="#consulting">Six ways to start</Go></div>
        <p className="b-k"><i className="b-live" />Open to the right product role, too. <a href="/contact?intent=job#brief" style={{ color: 'var(--text)' }}>Let’s talk ↗</a></p>
      </PageHead>

      <Sec id="build" label="What gets built" tag="Moving parts" title="Signals in, ==decisions out==," sub="and a person at every gate that matters.">
        <Board className="b-build hr-build"><div className="hr-build__field"><ConsultMapScene /></div></Board>
      </Sec>

      <Sec id="consulting" label="Engagements" tag="Six ways to start" title="Start with" sub="the ==constraint==." aside={<Go to="/contact?intent=consult#brief">Discuss the scope</Go>}>
        <ul className="hr-svc">
          {gtm.services.slice(0, 6).map((s, i) => (
            <li key={s.id} className="hr-svc__t">
              <div className="hr-svc__art u-mini" aria-hidden="true"><Mini i={i} s={s} /></div>
              <p className="hr-svc__k"><b>{s.code}</b><span>{s.official}</span></p>
              <h3>{s.name}</h3>
              <p className="hr-svc__l">{s.line}</p>
              <p className="hr-svc__f"><span><small>First result</small>{s.first}</span><span><small>Model</small>{s.model}</span></p>
            </li>
          ))}
        </ul>
      </Sec>

      <Sec id="process" label="How a project runs" tag="Twelve weeks, typically" title="Less theatre." sub="More ==shipped decisions==.">
        <Board className="hr-proc">
          <Timeline />
          <div className="hr-fit">
            <Tile className="hr-fit__t"><h3><Icon name="check" size={16} />A good fit</h3><ul>{gtm.fitCheck.good.map((x) => <li key={x}>{x}</li>)}</ul></Tile>
            <Tile tone="ink" className="hr-fit__t"><h3><Icon name="x" size={16} />Not what I do</h3><ul>{gtm.fitCheck.not.map((x) => <li key={x}>{x}</li>)}</ul></Tile>
          </div>
        </Board>
      </Sec>

      <Cta title="Pick ==one constraint==. *We'll design the next move.*" lead="Start with the problem and the tools involved. A short brief is enough." primary={{ label: 'Discuss consulting', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Talk about a product role', to: '/contact?intent=job#brief' }} />
    </PageMotion>
  )
}
