import { useEffect, useRef, useState } from 'react'
import { consult as C } from '../content'
import { Icon } from './icons'
import { cx } from './board'
import { MQ } from '../lib/motion'

/* ═══════════════════════════════════════════════════════════════════════════
   Consulting, as the brief sets it out: two disciplines (Strategy = what + why, Architecture = how) and ROQIVA,
   a product in development. Every picture here is a small working diagram, not a decoration:
   · FlowHero      business challenge → strategic direction → system blueprint, one stage lit at a time
   · Discipline    an editorial panel with its own workflow strip
   · Compare       the two disciplines side by side (core question, focus, output)
   · Connect       one row of cards (question, Strategy, Architecture, result) and the three ways through it
   · Branches      the home page's three panels: Strategy, Architecture, ROQIVA
   Motion steps forward only while on screen and stops for good under reduced motion.
   ═══════════════════════════════════════════════════════════════════════════ */

/** A value that steps 0..n-1 every `ms` while `ref` is on screen; a click takes over for good. */
export function useStep(n, ms, ref) {
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

/* ─────────── The hero picture: three stages, each a small screen of its own ─────────── */
function ChallengeView() {
  return (
    <ul className="cs-chal">
      {[['Checkout', 'Drop-off after payment step'], ['CRM', 'Reminders sent to everyone'], ['Analytics', 'Two numbers for one funnel'], ['Support', 'Same question, every week']].map(([t, d], k) => (
        <li key={t} style={{ '--k': k }}><b>{t}</b><span>{d}</span><i aria-hidden="true" /></li>
      ))}
    </ul>
  )
}
function DirectionView() {
  return (
    <ol className="cs-dir">
      {[['Fix the payment retry first', 'High value · clear owner'], ['Time reminders to the reorder window', 'Medium value'], ['One source for funnel numbers', 'Enabler']].map(([t, d], k) => (
        <li key={t} style={{ '--k': k }}><b>{k + 1}</b><span><strong>{t}</strong><small>{d}</small></span></li>
      ))}
    </ol>
  )
}
function BlueprintView() {
  return (
    <div className="cs-bp" aria-hidden="true">
      <svg viewBox="0 0 320 150" className="cs-bp__wires"><path d="M70 40 C 120 40, 120 75, 160 75" /><path d="M70 110 C 120 110, 120 75, 160 75" /><path d="M200 75 L 250 75" /></svg>
      <span className="cs-bp__n" style={{ left: '4%', top: '14%' }}>Events</span>
      <span className="cs-bp__n" style={{ left: '4%', top: '62%' }}>Customer data</span>
      <span className="cs-bp__n cs-bp__n--hub" style={{ left: '44%', top: '38%' }}>Decision rule</span>
      <span className="cs-bp__n cs-bp__n--ok" style={{ left: '76%', top: '38%' }}>Workflow</span>
    </div>
  )
}
const VIEWS = [ChallengeView, DirectionView, BlueprintView]

export function FlowHero() {
  const ref = useRef(null)
  const [i, pick] = useStep(3, 3400, ref)
  const V = VIEWS[i]
  return (
    <div className="cs-hero" ref={ref}>
      <ol className="cs-hero__rail">
        {C.hero.flow.map((s, k) => (
          <li key={s.k}>
            <button type="button" className={cx(k === i && 'is-on', k < i && 'is-done')} aria-pressed={k === i} onClick={() => pick(k)}>
              <span className="cs-hero__ic"><Icon name={s.icon} size={15} /></span>
              <span><b>{s.k}</b><small>{s.d}</small></span>
            </button>
          </li>
        ))}
      </ol>
      <div className="cs-hero__win">
        <p className="cs-hero__bar"><span className="cs-dots" aria-hidden="true"><i /><i /><i /></span><b>{C.hero.flow[i].k}</b><em>{String(i + 1).padStart(2, '0')} / 03</em></p>
        <div className="cs-hero__view" key={i}><V /></div>
      </div>
    </div>
  )
}

/* ─────────── A workflow strip: steps with one lit at a time ─────────── */
export function Steps({ steps, tone = 'a', on = true }) {
  const ref = useRef(null)
  const [i] = useStep(steps.length, 1600, ref)
  return (
    <ol className={cx('cs-steps', `cs-steps--${tone}`)} ref={ref} aria-label="Workflow">
      {steps.map((s, k) => <li key={s} className={cx(on && k === i && 'is-on', on && k < i && 'is-done')}><small>{String(k + 1).padStart(2, '0')}</small><b>{s}</b></li>)}
    </ol>
  )
}

/* ─────────── The two disciplines ─────────── */
export function Discipline({ d }) {
  return (
    <article className={`cs-disc cs-disc--${d.id}`} aria-labelledby={`cs-${d.id}`}>
      <header className="cs-disc__top">
        <span className="cs-disc__key">{d.key}</span>
        <span className="cs-disc__kind">{d.kind}</span>
      </header>
      <p className="cs-disc__name" id={`cs-${d.id}`}>{d.name}</p>
      <h3>{d.title}</h3>
      <p className="cs-disc__copy">{d.copy}</p>
      <Steps steps={d.flow} tone={d.key.toLowerCase()} />
      <div className="cs-disc__cols">
        <div><p className="cs-disc__k">Focus</p><ul className="cs-chips">{d.focus.map((x) => <li key={x}>{x}</li>)}</ul></div>
        <div><p className="cs-disc__k">Outputs</p><ul className="cs-outs">{d.outputs.map((x) => <li key={x}><Icon name="doc" size={13} />{x}</li>)}</ul></div>
      </div>
    </article>
  )
}

export function Compare() {
  const [a, b] = C.disciplines
  const rows = [['Core question', 'question'], ['Focus', 'area'], ['Output', 'output']]
  return (
    <div className="cs-cmp" role="table" aria-label="The two disciplines compared">
      <div className="cs-cmp__r cs-cmp__h" role="row"><span role="columnheader" /><span role="columnheader"><i className="cs-dot cs-dot--a" />{a.name}</span><span role="columnheader"><i className="cs-dot cs-dot--b" />{b.name}</span></div>
      {rows.map(([l, k]) => (
        <div key={k} className="cs-cmp__r" role="row"><span role="rowheader">{l}</span><span role="cell">{a[k]}</span><span role="cell">{b[k]}</span></div>
      ))}
    </div>
  )
}

/* ─────────── How they connect: one row of cards, three ways through it ─────────── */
export function Connect() {
  const ref = useRef(null)
  const P = C.connect.paths
  const [p, pick] = useStep(P.length, 3200, ref)
  const [a, b] = C.disciplines
  const via = P[p].via
  const cards = [
    { id: 'q', key: <Icon name="radar" size={14} />, kind: 'Start', name: C.connect.steps[0] },
    { id: 'a', key: 'A', kind: a.kind, name: 'Strategy', d: a.question },
    { id: 'b', key: 'B', kind: b.kind, name: 'Architecture', d: b.question },
    { id: 'out', key: <Icon name="check" size={14} />, kind: 'Result', name: C.connect.steps[3] },
  ]
  const on = (id) => id === 'q' || id === 'out' || via.includes(id)
  return (
    <div className="cs-con" ref={ref}>
      <div className="cs-con__tabs" role="tablist" aria-label="Ways through">
        {P.map((x, k) => (
          <button key={x.k} type="button" role="tab" aria-selected={k === p} className={cx(k === p && 'is-on')} onClick={() => pick(k)}>
            <span className="cs-con__route" aria-hidden="true">{['a', 'b'].map((id) => <i key={id} className={cx(`is-${id}`, x.via.includes(id) && 'is-lit')} />)}</span>
            {x.k}
          </button>
        ))}
      </div>
      <ol className="cs-con__row" aria-label={`${P[p].k}: ${cards.filter((c) => on(c.id)).map((c) => c.name).join(', then ')}`}>
        {cards.map((c) => (
          <li key={c.id} className={cx(`cs-con__c cs-con__c--${c.id}`, on(c.id) ? 'is-on' : 'is-off')}>
            <span className="cs-con__top"><span className="cs-disc__key">{c.key}</span><span className="cs-disc__kind">{c.kind}</span></span>
            <b>{c.name}</b>
            {c.d && <small>{c.d}</small>}
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ─────────── The home page's three branches ─────────── */
export function Branches() {
  const [a, b] = C.disciplines
  const R = C.roqiva
  return (
    <div className="cs-br">
      {[a, b].map((d) => (
        <a key={d.id} href={`/hire#${d.id}`} className={`cs-br__t cs-br__t--${d.id}`}>
          <span className="cs-br__top"><span className="cs-disc__key">{d.key}</span><span className="cs-disc__kind">{d.kind}</span><Icon name="ne" size={15} /></span>
          <b className="cs-br__name">{d.name}</b>
          <span className="cs-br__h">{d.title}</span>
          <Steps steps={d.flow} tone={d.key.toLowerCase()} />
          <span className="cs-br__out"><small>Outputs</small>{d.outputs.slice(0, 3).join(' · ')}</span>
        </a>
      ))}
      <a href={R.cta.to} className="cs-br__t cs-br__t--roq">
        <span className="cs-br__top"><span className="cs-disc__key"><i className="b-live" /></span><span className="cs-disc__kind">{R.eyebrow}</span><Icon name="ne" size={15} /></span>
        <b className="cs-br__name">ROQIVA</b>
        <span className="cs-br__h">Intelligence built for growth.</span>
        <Steps steps={R.flow} tone="r" />
        <span className="cs-br__out"><small>Status</small>{R.micro}</span>
      </a>
    </div>
  )
}
