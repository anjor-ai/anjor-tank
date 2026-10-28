import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons'
import { cx } from './kit'

/* ═══════════════════════════════════════════════════════════════════════════
   Second showcase layer: the career graph, the consulting workflow, the brief thread,
   the scroll story and the case wireframes. Everything here is an illustration of an idea, labelled as one,
   and every moving part stops under reduced motion (CSS) or off screen (useInView).
   ═══════════════════════════════════════════════════════════════════════════ */

/** True while the element is on screen. Starts false so prerendered HTML is the settled, still state. */
export function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, on]
}

/* ───────────── Career graph: now first, drawn like a commit log with ROQIVA on its own branch ───────────── */

export const CAREER = [
  { id: 'roqiva', lane: 1, g: [[1, 'down']], head: true, ref: 'founder/roqiva', when: '2026 – now', role: 'Founder', org: 'ROQIVA', sub: 'In development', d: 'Building a governed revenue system for commerce and D2C. It finds the leak, drafts the fix and waits for a person to approve it. A company will form around it.', stats: [['6', 'agents'], ['6', 'steps'], ['4', 'human gates']], to: '/roqiva', cta: 'Explore ROQIVA' },
  { id: 'gnc', lane: 0, g: [[0, 'down'], [1, 'full']], now: true, ref: 'main', when: 'Oct 2026 – now', role: 'Product Manager', org: 'GNC India', sub: 'Mumbai', d: 'Ecommerce, growth and the platforms behind a consumer wellness brand.' },
  { id: 'truemeds', lane: 0, g: [[0, 'full']], fork: 1, when: 'Dec 2023 – Jul 2026', role: 'Associate Product Manager', org: 'Truemeds', sub: 'Series C online pharmacy', d: 'Co-managed two pods across payments and portals. Six systems shipped 0-to-1.', stats: [['2', 'pods'], ['12', 'engineers']], to: '/work', cta: 'See the six systems', note: 'ROQIVA started here: the loop I ran by hand.' },
  { id: 'npd', lane: 0, when: 'Sep – Dec 2023', role: 'Management Trainee', org: 'Neil Patel Digital India', d: 'Client accounts and campaign targeting from consumer-behaviour data.' },
  { id: 'eggfirst', lane: 0, when: 'Apr – Sep 2022', role: 'Client Services Associate', org: 'Eggfirst', d: 'Dealer landing pages and a lead system for an automotive brand’s network.' },
]
export const LEARNING = [
  { id: 'mba', lane: 0, learn: true, when: '2021 – 2023', role: 'MBA · Marketing, Operations and SCM', org: 'NMIMS, Mumbai' },
  { id: 'btech', lane: 0, learn: true, end: true, when: '2018 – 2022', role: 'BTech · Electronics and Telecommunications', org: 'NMIMS, Mumbai' },
]

const LX = (lane) => 14 + lane * 26

/** One row of the graph: the lanes that pass through, the commit dot, and the card. */
function GraphRow({ r, i, n }) {
  // Which lanes pass through this row: 'full' (through), 'down' (starts at the dot), 'up' (ends at the dot).
  const first = i === 0
  const lanes = (r.g || [[r.lane, 'full']]).map(([l, k]) => [l, i === n - 1 && l === 0 ? 'up' : k])
  return (
    <li className={cx('cg__row', r.head && 'is-head', r.now && 'is-now', r.learn && 'is-learn')} style={{ '--i': i }}>
      <div className="cg__g" aria-hidden="true">
        {lanes.map(([l, kind]) => <i key={l} className={`cg__ln cg__ln--${kind} cg__ln--l${l}`} style={{ left: LX(l) }} />)}
        {r.fork && <svg className="cg__fork" width="60" height="34" viewBox="0 0 60 34"><path d={`M${LX(1)} 0 C ${LX(1)} 18, ${LX(0)} 12, ${LX(0)} 30`} /></svg>}
        <b className={cx('cg__dot', `cg__dot--l${r.lane}`)} style={{ left: LX(r.lane) }} />
        {first && <span className="cg__ping" style={{ left: LX(r.lane) }} />}
      </div>
      <div className="cg__card">
        <p className="cg__meta">
          {r.ref && <span className={cx('cg__ref', r.head && 'is-head')}>{r.head ? 'HEAD → ' : ''}{r.ref}</span>}
          {r.now && !r.head && <span className="cg__now"><i />Now</span>}
          <span className="cg__when">{r.when}</span>
        </p>
        <h3><b>{r.role}</b><span>{r.org}{r.sub && <em> · {r.sub}</em>}</span></h3>
        {r.d && <p className="cg__d">{r.d}</p>}
        {r.note && <p className="cg__note"><Icon name="branch" size={13} />{r.note}</p>}
        {(r.stats || r.to) && (
          <div className="cg__foot">
            {r.stats && <dl className="cg__stats">{r.stats.map(([v, l]) => <div key={l}><dt>{v}</dt><dd>{l}</dd></div>)}</dl>}
            {r.to && <a className="cg__go" href={r.to}>{r.cta}<Icon name="arrow" size={13} /></a>}
          </div>
        )}
      </div>
    </li>
  )
}

export function CareerGraph({ withLearning = false, className }) {
  const rows = withLearning ? [...CAREER, ...LEARNING] : CAREER
  const [ref, on] = useInView(0.15)
  return (
    <div ref={ref} className={cx('cg', on && 'is-on', className)}>
      <div className="cg__top">
        <span className="cg__cmd"><b>$</b> git log --graph --career</span>
        <span className="cg__legend"><i className="l1" />ROQIVA <i className="l0" />Career{withLearning && <><i className="lx" />Learning</>}</span>
      </div>
      <ol className="cg__rows">{rows.map((r, i) => <GraphRow key={r.id} r={r} i={i} n={rows.length} />)}</ol>
    </div>
  )
}

/* ───────────── The brief thread: what actually happens after you write ───────────── */

export function BriefThread({ topic = 'consult' }) {
  const [ref, on] = useInView(0.25)
  const steps = [
    { who: 'you', t: 'Your brief', d: topic === 'work' ? 'The number that will not move, and the tools behind it. Two minutes.' : 'One problem, the tools involved, and what should move. Two minutes.', chips: ['Prepaid conversion', 'Checkout', 'Payments'] },
    { who: 'me', t: 'A reply, usually within two working days', d: 'Questions that matter, and a time for a working session.' },
    { who: 'me', t: 'A working session', d: 'We map the journey together and agree where the leak most likely is.' },
    { who: 'card', t: 'Finding card', d: 'Payment failures were all treated alike. Transient errors never reached a retry rule.', rows: [['Evidence', 'Gateway codes by failure type'], ['Owner', 'Payments product'], ['Next step', 'Pilot a retry rule with a holdout']] },
  ]
  return (
    <div ref={ref} className={cx('bt', on && 'is-on')}>
      <div className="bt__bar"><span className="v-win__dots" aria-hidden="true"><i /><i /><i /></span><b>From brief to first finding</b><small>Illustration</small></div>
      <ol className="bt__list">
        {steps.map((s, k) => (
          <li key={s.t} className={`bt__m bt__m--${s.who}`} style={{ '--k': k }}>
            <span className="bt__av" aria-hidden="true">{s.who === 'you' ? 'You' : s.who === 'card' ? <Icon name="flag" size={13} /> : 'AT'}</span>
            <div className="bt__b">
              <b>{s.t}</b>
              <p>{s.d}</p>
              {s.chips && <span className="bt__chips">{s.chips.map((c) => <em key={c}>{c}</em>)}</span>}
              {s.rows && <dl>{s.rows.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>}
            </div>
          </li>
        ))}
        <li className="bt__typing" aria-hidden="true"><i /><i /><i /></li>
      </ol>
    </div>
  )
}

/* ───────────── Scroll story: the idea stays, the system changes around it ───────────── */

export const STORY = [
  { id: 'observe', k: 'Observe', t: 'Catch the moment worth acting on.', d: 'Customer, order, catalogue and support events become explicit commercial signals.', rows: [['Signal', 'Refill window'], ['Evidence', 'Past purchase cadence'], ['Question', 'Is this customer worth acting on now?']] },
  { id: 'context', k: 'Context', t: 'Know who you are talking to.', d: 'The signal gets joined to customer history and lifecycle state.', rows: [['Customer', 'Returning · 3 orders'], ['Sensitivity', 'Price-aware'], ['Recent contact', 'No open support case']] },
  { id: 'decide', k: 'Decide', t: 'Decide what should happen next.', d: 'Eligibility, prioritisation and suppression turn context into an explicit decision.', rows: [['Eligibility', 'Yes'], ['Confidence', 'High'], ['Decision', 'Trigger reminder']] },
  { id: 'activate', k: 'Activate', t: 'Fire on the channel they reply on.', d: 'The action is selected with timing, channel and a fallback attached.', rows: [['Channel', 'WhatsApp'], ['Timing', 'Inside the refill window'], ['Fallback', 'A human conversation']] },
  { id: 'measure', k: 'Measure', t: 'Feed the result back into the system.', d: 'The outcome becomes evidence for the next decision.', rows: [['Outcome', '~1,100 repeat orders a day'], ['Response', 'Accepted, ignored or switched'], ['Next cycle', 'The window estimate improves']] },
]

export function ScrollStory() {
  const [cur, setCur] = useState(0)
  const refs = useRef([])
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setCur(Number(e.target.dataset.i)) }), { rootMargin: '-45% 0px -45% 0px' })
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  const s = STORY[cur]
  return (
    <div className="ss">
      <div className="ss__stick">
        <p className="ss__k">The mechanism, in one frame</p>
        <p className="ss__h"><span>Most stacks record</span> <strong>what happened.</strong> <span>Good systems decide</span> <strong>what happens next.</strong></p>
        <ol className="ss__rail" aria-hidden="true">{STORY.map((x, k) => <li key={x.id} className={k === cur ? 'is-on' : k < cur ? 'is-done' : ''}><i />{x.k}</li>)}</ol>
        <p className="ss__stage">Stage <b>{String(cur + 1).padStart(2, '0')} / {s.k}</b></p>
      </div>
      <div className="ss__col">
        {STORY.map((x, k) => (
          <article key={x.id} ref={(el) => { refs.current[k] = el }} data-i={k} className={cx('ss__f', k === cur && 'is-on')}>
            <p className="ss__n">{String(k + 1).padStart(2, '0')} / {x.k}</p>
            <h3>{x.t}</h3>
            <p>{x.d}</p>
            <div className="ss__ui">{x.rows.map(([a, b]) => <p key={a}><small>{a}</small><strong>{b}</strong></p>)}</div>
          </article>
        ))}
        <p className="ss__note">Illustration from the retention case. The repeat-order figure is from that case.</p>
      </div>
    </div>
  )
}

/* ───────────── Case-page wireframes ───────────── */

/** Low-fidelity phone screens, one per workflow step: a storyboard of the flow. */
export function Storyboard({ steps }) {
  const kinds = ['list', 'form', 'confirm', 'choice', 'chart', 'list']
  return (
    <div className="wsb" role="img" aria-label={`Wireframe storyboard: ${steps.map((s) => s.t).join(', ')}`}>
      {steps.map((s, k) => {
        const kind = kinds[k % kinds.length]
        return (
          <figure key={s.t} className="wsb__f" data-reveal>
            <div className="wsb__ph">
              <span className="wsb__notch" />
              <p className="wsb__hd"><i />{s.t}</p>
              {kind === 'list' && <div className="wsb__ls">{[0, 1, 2].map((j) => <span key={j} className={j === 1 ? 'is-on' : ''}><i /><b /><em /></span>)}</div>}
              {kind === 'form' && <div className="wsb__fm"><b /><span /><b /><span className="is-on" /><b /><span /></div>}
              {kind === 'confirm' && <div className="wsb__cf"><span className="wsb__ring"><Icon name="lock" size={14} /></span><b /><em /></div>}
              {kind === 'choice' && <div className="wsb__ch">{[0, 1, 2].map((j) => <span key={j} className={j === 0 ? 'is-on' : ''}><i /><b /></span>)}</div>}
              {kind === 'chart' && <div className="wsb__ct">{[40, 55, 48, 70, 82].map((h, j) => <i key={j} style={{ height: `${h}%` }} />)}</div>}
              <span className="wsb__btn">{k === steps.length - 1 ? 'Done' : 'Continue'}</span>
            </div>
            <figcaption><b>{String(k + 1).padStart(2, '0')}</b>{s.t}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}

/** The system as boxes and wires: the parts of the architecture connected left to right. */
export function ArchWire({ parts }) {
  const [ref, on] = useInView(0.2)
  const half = Math.ceil(parts.length / 2)
  const rows = [parts.slice(0, half), parts.slice(half)]
  return (
    <div ref={ref} className={cx('aw', on && 'is-on')} role="img" aria-label={`System diagram: ${parts.map((p) => p.t).join(' → ')}`}>
      <p className="aw__tag">System map · illustration</p>
      {rows.map((row, r) => (
        <div key={r} className="aw__row">
          {row.map((p, k) => (
            <div key={p.t} className="aw__n" style={{ '--k': r * half + k }}>
              <small>{String(r * half + k + 1).padStart(2, '0')}</small>
              <b>{p.t}</b>
              {k < row.length - 1 && <span className="aw__w" aria-hidden="true"><i /></span>}
            </div>
          ))}
        </div>
      ))}
      <span className="aw__turn" aria-hidden="true"><i /></span>
    </div>
  )
}

/** A dashboard wireframe for the measurement plan: the primary metric, guardrails as rows, segments as filters. */
export function DashWire({ m }) {
  return (
    <div className="dw" role="img" aria-label={`Dashboard wireframe: ${m.primary[0]}, guarded by ${m.guard.join(', ')}`}>
      <div className="dw__bar"><span className="v-win__dots" aria-hidden="true"><i /><i /><i /></span><b>Outcome dashboard</b><small>Wireframe · no data</small></div>
      <div className="dw__body">
        <p className="dw__filters">{m.seg.slice(0, 5).map((s, k) => <span key={s} className={k === 0 ? 'is-on' : ''}>{s}</span>)}</p>
        <div className="dw__kpi">
          <small>Primary</small>
          <b>{m.primary[0]}</b>
          <svg viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 55 C 40 52, 70 50, 100 44 S 160 34, 190 30 S 250 18, 300 12" /></svg>
        </div>
        <ul className="dw__g">
          {m.guard.map((g, k) => <li key={g}><span>{g}</span><i><b style={{ width: `${[38, 52, 30, 46, 60, 42][k % 6]}%` }} /></i><em>Guardrail</em></li>)}
        </ul>
      </div>
    </div>
  )
}

/** Case sections as a dock at the bottom of the screen, shown once the hero has scrolled away. */
export function CaseDock({ items }) {
  const [active, setActive] = useState(items[0].id)
  const [show, setShow] = useState(false)
  const list = useRef(null)
  useEffect(() => {
    const sec = items.map((it) => document.getElementById(it.id)).filter(Boolean)
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-40% 0px -55% 0px' })
    sec.forEach((el) => io.observe(el))
    const vis = () => {
      const first = sec[0], foot = document.querySelector('.ft')
      const top = first ? first.getBoundingClientRect().top : 0
      const fb = foot ? foot.getBoundingClientRect().top : 1e9
      setShow(top < window.innerHeight * 0.6 && fb > window.innerHeight)
    }
    vis()
    window.addEventListener('scroll', vis, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', vis) }
  }, [items])
  useEffect(() => {
    const a = list.current?.querySelector('[aria-current="true"]')
    if (a && list.current) list.current.scrollTo({ left: a.offsetLeft - list.current.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' })
  }, [active])
  const i = items.findIndex((x) => x.id === active)
  return (
    <nav className={cx('dock', show && 'is-on')} aria-label="This case">
      <span className="dock__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}<small>/{items.length}</small></span>
      <ul ref={list}>{items.map((it) => <li key={it.id}><a href={`#${it.id}`} aria-current={active === it.id ? 'true' : undefined}>{it.label}</a></li>)}</ul>
      <span className="dock__p" aria-hidden="true"><i style={{ width: `${((i + 1) / items.length) * 100}%` }} /></span>
    </nav>
  )
}

/* ───────────── Transformation: one state of the system becomes another (from the search case) ───────────── */
export function Transform() {
  const [ref, on] = useInView(0.3)
  const [run, setRun] = useState(0)
  useEffect(() => {
    if (!on || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    setRun((n) => n + 1)
    const t = setInterval(() => setRun((n) => n + 1), 6500)
    return () => clearInterval(t)
  }, [on])
  return (
    <div ref={ref} className="tf" key={run} data-run={run ? '' : undefined}>
      <div className="tf__top"><span>Before → intervention → outcome</span><span className="tf__ok"><i />Search case</span></div>
      <div className="tf__sys">
        <div className="tf__box tf__src">
          <b>Raw signal</b><small>What the stack already knows.</small>
          <dl>{[['Event', 'Search: a misspelt medicine'], ['Customer', 'Returning'], ['History', '3 orders'], ['Timing', 'Due now'], ['Action', 'None']].map(([a, v], k) => <div key={a}><dt>{a}</dt><dd className={k === 3 ? 'is-hot' : k === 4 ? 'is-none' : ''}>{v}</dd></div>)}</dl>
        </div>
        <span className="tf__arrow" aria-hidden="true"><Icon name="arrow" size={22} /></span>
        <div className="tf__box tf__res">
          <b>Next best action</b><small>The decision layer makes the signal useful.</small>
          <p className="tf__metric">+9.0%</p>
          <p className="tf__ml">search-to-order conversion</p>
          <p className="tf__out"><strong>Search is no longer treated as text.</strong> Context, ranking, action and a measured outcome.</p>
          <span className="tf__badge">Activated</span>
        </div>
      </div>
    </div>
  )
}
