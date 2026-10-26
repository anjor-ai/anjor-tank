import { useCallback, useEffect, useRef, useState } from 'react'
import { agents, auditScene, brainLog, rankedFindings, run, score, signalLog } from '../content'
import { Icon } from '../components/icons'
import { MQ } from '../lib/motion'

/* The hero product screen: the ROQIVA workspace as one clean app window. The sidebar works: every item opens its view.
   While nobody is using it, a cursor walks the sidebar and opens each view in turn; any real pointer or keyboard use takes over.
   Every value comes from the same illustrative work item the rest of the site uses. */

const ranked = [...rankedFindings].map((f) => ({ ...f, s: score(f) })).sort((a, b) => b.s - a.s)
const gaps = signalLog.lines.filter((l) => l.state === 'gap').length
const LABEL = { confirmed: 'ok', supported: 'sky', hypothesis: 'grey' }
const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

const NAV = [
  { id: 'item', icon: 'target', label: 'Work item', meta: run.id },
  { id: 'signals', icon: 'radar', label: 'Signals', meta: `${gaps} gaps` },
  { id: 'findings', icon: 'search', label: 'Findings', meta: String(ranked.length) },
  { id: 'brain', icon: 'brain', label: 'Brain log', meta: String(brainLog.entries.length) },
  { id: 'agents', icon: 'agent', label: 'Agents', meta: String(agents.items.length) },
]
const ORDER = NAV.map((n) => n.id)
const TITLE = { item: run.title, signals: signalLog.title, findings: 'Findings inbox', brain: brainLog.title, agents: 'Six agents, one artifact each' }

function ItemView() {
  return (
    <div className="ha__chat">
      <p className="ha__ask">{auditScene.ask}</p>
      <p className="ha__say">Code matched {signalLog.lines.length} signals to the decisions that read them. {gaps} have no decision that reads them. <b>{ranked[0].id}</b> ranks first: {ranked[0].path}.</p>
      <p className="ha__step"><Icon name="check" size={12} />Read {auditScene.reads.map((r) => r[1]).join(', ')}<Icon name="chev" size={11} /></p>
      <p className="ha__step"><Icon name="check" size={12} />Ranked {ranked.length} findings by value × confidence ÷ effort<Icon name="chev" size={11} /></p>
      <p className="ha__step is-run"><i className="ha__spin" />Waiting for Gate 1 · Brand PM</p>
    </div>
  )
}
function SignalsView() {
  return (
    <ul className="ha__list">
      {signalLog.lines.map((l) => (
        <li key={l.sig} className="ha__row"><code>{l.sig}</code><span className="ha__muted">{l.from} → {l.to}</span><i className={`ha__pill ha__pill--${l.state === 'ok' ? 'ok' : 'amber'}`}>{l.state === 'ok' ? 'Read' : 'Gap'}</i></li>
      ))}
    </ul>
  )
}
function FindingsView() {
  return (
    <ul className="ha__list">
      {ranked.map((f) => (
        <li key={f.id} className="ha__row ha__row--f"><code>{f.id}</code><span className="ha__t">{f.t}<small>{f.path}</small></span><i className={`ha__pill ha__pill--${LABEL[f.label]}`}>{f.label}</i><b>{fmt(f.s)}</b></li>
      ))}
    </ul>
  )
}
function BrainView() {
  return (
    <ul className="ha__list">
      {brainLog.entries.map((e, i) => (
        <li key={i} className="ha__row ha__row--b"><i className={`ha__dot ha__dot--${e.tone}`} /><span className="ha__t"><b>{e.g}</b> · {e.what}<small>{e.why}</small></span><span className="ha__muted">{e.who}</span></li>
      ))}
    </ul>
  )
}
function AgentsView() {
  return (
    <ul className="ha__grid">
      {agents.items.map((a) => (
        <li key={a.id} className="ha__agent"><b>{a.name}</b><span>{a.glance}</span><small>Goes to · {a.after}</small></li>
      ))}
    </ul>
  )
}
const VIEW = { item: ItemView, signals: SignalsView, findings: FindingsView, brain: BrainView, agents: AgentsView }

export function HeroApp({ brand = 'ROQIVA' }) {
  const [view, setView] = useState('item')
  const [cur, setCur] = useState(null)       // the demo cursor: { x, y, click }
  const human = useRef(false)
  const root = useRef(null)
  const btns = useRef({})

  const take = useCallback(() => { human.current = true; setCur(null) }, [])

  // The walk: move to the next item, click, open it. Stops for good once a person uses the window. Off under reduced motion.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia(MQ.motion).matches) return
    let i = 0, t1, t2, t3
    const step = () => {
      if (human.current) return
      i = (i + 1) % ORDER.length
      const b = btns.current[ORDER[i]], r = root.current
      if (!b || !r) return
      const rb = b.getBoundingClientRect(), rr = r.getBoundingClientRect()
      const k = (r.offsetWidth && rr.width / r.offsetWidth) || 1 // the window may be scaled by a parent
      setCur({ x: (rb.left - rr.left + rb.width * 0.55) / k, y: (rb.top - rr.top + rb.height * 0.6) / k, click: false })
      t2 = setTimeout(() => { if (human.current) return; setCur((c) => c && { ...c, click: true }); setView(ORDER[i]) }, 850)
      t3 = setTimeout(() => { setCur((c) => c && { ...c, click: false }) }, 1300)
      t1 = setTimeout(step, 4200)
    }
    t1 = setTimeout(step, 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const V = VIEW[view]
  return (
    <div className="ha" ref={root} onPointerDown={take} onKeyDown={take} aria-label={`The ${brand} workspace, with sample data`}>
      <aside className="ha__side">
        <div className="ha__tb" aria-hidden="true"><span className="ha__dots"><i /><i /><i /></span><Icon name="grid" size={14} /><Icon name="back" size={14} /></div>
        <button type="button" className="ha__new" onClick={() => setView('item')}><Icon name="arrow" size={13} />Open sample work item</button>
        <nav className="ha__nav" aria-label="Workspace">
          {NAV.map((n) => (
            <button key={n.id} type="button" ref={(el) => { btns.current[n.id] = el }} className="ha__nb" aria-pressed={view === n.id} onClick={() => setView(n.id)}>
              <Icon name={n.icon} size={14} /><span>{n.label}</span><small>{n.meta}</small>
            </button>
          ))}
        </nav>
        <p className="ha__sec">Pinned</p>
        <button type="button" className="ha__nb ha__nb--sub" onClick={() => setView('item')}><Icon name="pin" size={13} /><span>{run.id} · {run.title}</span></button>
        <p className="ha__sec">Gates</p>
        <button type="button" className="ha__nb ha__nb--sub" onClick={() => setView('brain')}><Icon name="gate" size={13} /><span>4 gates · 1 outcome review</span></button>
        <div className="ha__me"><span className="ha__av">PM</span><span>Your PM</span><Icon name="chev" size={11} /></div>
      </aside>
      <section className="ha__main">
        <header className="ha__head"><b>{run.id}</b><span>/</span><span className="ha__ttl">{TITLE[view]}</span><Icon name="chev" size={12} /></header>
        <div className="ha__view" key={view}><V /></div>
        <div className="ha__comp">
          <p className="ha__ph">Describe a revenue problem or ask the Brain</p>
          <p className="ha__cr"><Icon name="plus" size={14} /><span className="ha__muted">Read-only</span><span className="ha__sp" /><span>Analyst</span><span className="ha__muted">Gate 1</span><Icon name="send" size={13} /></p>
        </div>
      </section>
      {cur && (
        <span className={`ha__cur${cur.click ? ' is-click' : ''}`} style={{ transform: `translate(${cur.x}px, ${cur.y}px)` }} aria-hidden="true">
          <i className="ha__ring" />
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 2l16 8-7 2.5L10 20z" fill="currentColor" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
          <em>Your PM</em>
        </span>
      )}
    </div>
  )
}
