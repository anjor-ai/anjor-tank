import { useRef, useState } from 'react'
import { gtm } from '../content'
import { DataTable } from './ui'
import { Icon } from './icons'
import { useCycle } from '../lib/useCycle'

/* GTM engineering and RevOps: the interactive blocks of the /gtm page. Data from content/gtm.js. */

const offerName = (id) => gtm.services.find((s) => s.id === id)

/** Vertical tabs with a panel: the pattern shared by "five leaks" and "compare". `items` need an id and a label. */
function VTabs({ items, label, tab, panel, initial = 0 }) {
  const [i, setI] = useState(initial)
  const refs = useRef([])
  const key = (e, k) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!d) return
    e.preventDefault()
    const n = (k + d + items.length) % items.length
    setI(n); refs.current[n]?.focus()
  }
  const it = items[i]
  return (
    <div className="vt" data-reveal>
      <div className="vt__tabs" role="tablist" aria-label={label} aria-orientation="vertical">
        {items.map((x, k) => (
          <button key={x.id} ref={(el) => { refs.current[k] = el }} type="button" role="tab" id={`vt-${label}-${x.id}`} aria-selected={k === i} aria-controls={`vt-${label}-p`} tabIndex={k === i ? 0 : -1}
            className="vt__tab" onClick={() => setI(k)} onKeyDown={(e) => key(e, k)}>{tab(x, k)}</button>
        ))}
      </div>
      <div className="vt__panel" id={`vt-${label}-p`} role="tabpanel" aria-labelledby={`vt-${label}-${it.id}`} key={it.id}>{panel(it, i)}</div>
    </div>
  )
}

/** The five ways revenue leaks: pick the sentence you recognise. */
export function Leaks({ onOffer }) {
  return (
    <VTabs items={gtm.problems} label="leaks"
      tab={(p, k) => <><span className="vt__n">0{k + 1}</span><span className="vt__t"><b>{p.name}</b><small>{p.title}</small></span><Icon name="arrow" size={14} /></>}
      panel={(p) => {
        const o = offerName(p.offer)
        return (
          <>
            <p className="label">{p.name}</p>
            <h3 className="h-2">{p.title}</h3>
            <p className="lead">{p.line}</p>
            <dl className="vt__dl">
              <div><dt className="label">What it looks like</dt><dd>{p.looks}</dd></div>
              <div><dt className="label">What it costs</dt><dd>{p.costs}</dd></div>
              <div><dt className="label">The offer that closes it</dt><dd><a className="accent" href="#offers" onClick={() => onOffer && onOffer(o.cat)}>{o.name}</a></dd></div>
            </dl>
          </>
        )
      }} />
  )
}

/** Eight stages of the journey: step through them; each shows what breaks, what I look at and what the fix does. */
export function JourneyMap() {
  const ref = useRef(null)
  const [i, pick] = useCycle(gtm.journey.length, 4200, ref)
  const s = gtm.journey[i]
  return (
    <div className="jm" ref={ref} data-reveal>
      <ol className="jm__rail" role="tablist" aria-label="Journey stages">
        {gtm.journey.map((x, k) => (
          <li key={x.id}>
            <button type="button" role="tab" aria-selected={k === i} aria-controls="jm-panel" id={`jm-${x.id}`} className="jm__st" onClick={() => pick(k)}>
              <span className="jm__n">0{k + 1}</span><b>{x.label}</b>
            </button>
          </li>
        ))}
      </ol>
      <div className="jm__panel" id="jm-panel" role="tabpanel" aria-labelledby={`jm-${s.id}`} key={s.id} aria-live="polite">
        <p className="label">Stage 0{i + 1} · failure mode <b className="jm__mode">{s.mode}</b></p>
        <h3 className="h-2">{s.label}</h3>
        <div className="jm__cols">
          <div><p className="label">What breaks</p><p>{s.breaks}</p></div>
          <div><p className="label">What I look at</p><p>{s.sees}</p></div>
          <div className="jm__fix"><p className="label">What the fix does</p><p>{s.does}</p></div>
        </div>
      </div>
    </div>
  )
}

/** Six offers. Filter by what they do; every card shows the output, the timeline, the model and the proof. */
export function Offers({ cat, setCat }) {
  const list = gtm.services.filter((s) => cat === 'all' || s.cat === cat)
  return (
    <>
      <div className="chips-row" role="group" aria-label="Filter offers" data-reveal>
        {gtm.categories.map((c) => <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>)}
      </div>
      <ul className="offers" aria-live="polite">
        {list.map((o) => (
          <li key={o.id} className="offer" data-reveal>
            <div className="offer__h"><span className="offer__c">{o.code}</span><span className="label">{gtm.categories.find((c) => c.id === o.cat).label}</span></div>
            <h3 className="h-3">{o.name}</h3>
            <p className="label offer__off">{o.official}</p>
            <p className="offer__line">{o.line}</p>
            <ol className="offer__flow" aria-label="How it flows">{o.flow.map((f) => <li key={f}>{f}</li>)}</ol>
            <p className="offer__p"><b>{o.principle}</b> {o.catch}</p>
            <ul className="bl">{o.gets.map((g) => <li key={g}>{g}</li>)}</ul>
            <dl className="offer__meta">
              <div><dt className="label">First result</dt><dd>{o.first}</dd></div>
              <div><dt className="label">Model</dt><dd>{o.model}</dd></div>
              <div><dt className="label">Measured by</dt><dd>{o.metric}</dd></div>
            </dl>
            {o.proof && <p className="offer__proof"><Icon name="check" size={13} />{o.proof}</p>}
          </li>
        ))}
      </ul>
    </>
  )
}

/** The four phases on a twelve-week bar; pick one to see what happens, what I need and what you get. */
export function Phases() {
  const [i, setI] = useState(0)
  const p = gtm.phases[i]
  return (
    <div className="ph" data-reveal>
      <div className="ph__bar" role="tablist" aria-label="Phases">
        {gtm.phases.map((x, k) => (
          <button key={x.id} type="button" role="tab" aria-selected={k === i} className="ph__seg" style={{ gridColumn: `${x.start + 1} / span ${x.span}` }} onClick={() => setI(k)}>
            <b>{x.label}</b><small>{x.weeks}</small>
          </button>
        ))}
      </div>
      <div className="ph__panel" role="tabpanel" key={p.id}>
        <div><p className="label">What happens</p><p>{p.does}</p></div>
        <div><p className="label">What I need from you</p><p>{p.you}</p></div>
        <div><p className="label">What you get</p><p><b>{p.out}</b></p></div>
      </div>
    </div>
  )
}

/** Four ways to work together, with a bar showing where each sits on the twelve weeks. */
export function Shapes() {
  return (
    <ul className="shp">
      {gtm.shapes.map((s) => (
        <li key={s.id} className="shp__c" data-reveal>
          <p className="label">{s.length} · {s.model}</p>
          <h3 className="h-3">{s.label}</h3>
          <span className="shp__bar" aria-hidden="true"><i style={{ left: `${(s.bar.start / 12) * 100}%`, width: `${(s.bar.span / 12) * 100}%` }} /></span>
          <p className="muted">{s.best}</p>
          <ul className="shp__gets">{s.gets.map((g) => <li key={g}>{g}</li>)}</ul>
        </li>
      ))}
    </ul>
  )
}

/** Guardrails and the AI boundary: what is always code, and the few places a model is allowed to help. */
export function Guardrails() {
  return (
    <>
      <ul className="grd">
        {gtm.guardrails.map((g, i) => (
          <li key={g.t} className="grd__c" data-reveal><span className="label">0{i + 1}</span><h3 className="h-4">{g.t}</h3><p className="muted">{g.d}</p></li>
        ))}
      </ul>
      <div className="aib" data-reveal>
        <div className="aib__c aib__c--fix"><p className="label"><Icon name="lock" size={12} />Always deterministic code</p><ul>{gtm.aiBoundary.fixed.map((t) => <li key={t}>{t}</li>)}</ul></div>
        <div className="aib__c"><p className="label"><Icon name="spark" size={12} />Where a model may help</p><ul>{gtm.aiBoundary.llm.map((t) => <li key={t}>{t}</li>)}</ul></div>
      </div>
    </>
  )
}

const mono = (n) => n.replace(/[^A-Za-z0-9]/g, '').slice(0, 2)

/** The tools the work runs on: filter by area. No third-party logos, just names and what each one is used for. */
export function Stack() {
  const [cat, setCat] = useState('all')
  const core = new Set(gtm.coreStack)
  const list = gtm.tools.filter((t) => cat === 'all' || t.cat === cat).sort((a, b) => Number(core.has(b.name)) - Number(core.has(a.name)))
  return (
    <>
      <div className="chips-row" role="group" aria-label="Filter tools" data-reveal>
        <button type="button" className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>All</button>
        {gtm.toolCats.map((c) => <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>)}
      </div>
      <ul className="stk2" aria-live="polite">
        {list.map((t) => {
          const c = gtm.toolCats.find((x) => x.id === t.cat)
          return (
            <li key={t.name} className={core.has(t.name) ? 'is-core' : ''} style={{ '--tone': c.tone }}>
              <span className="stk2__m" aria-hidden="true">{mono(t.name)}</span>
              <b>{t.name}</b>
              <small>{t.does}</small>
            </li>
          )
        })}
      </ul>
    </>
  )
}

/** Compare with the usual options: pick what you use today. */
export function Versus() {
  return (
    <VTabs items={gtm.versus.rivals} label="compare"
      tab={(r) => <span className="vt__t"><b>{r.label}</b><small>{r.eg}</small></span>}
      panel={(r) => (
        <>
          <p className="label">{r.label}</p>
          <h3 className="h-2">{r.head} <span className="em">{r.accent}</span></h3>
          <DataTable cols={['', r.label, 'With me']} rows={r.rows} caption={`${r.label} compared with working with me`} />
          <p className="vt__tog"><Icon name="check" size={14} />{r.together}</p>
        </>
      )} />
  )
}

