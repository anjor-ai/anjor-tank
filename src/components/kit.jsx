import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from './icons'

/* ═══════════════════════════════════════════════════════════════════════════
   The component kit. Every section below a page hero is composed from these, and styled in one file (styles/kit.css).
   The idea, from the references: each section's visual is a realistic product window, not a stock diagram.
   Primitives first (section, header, tile, window, chip, tabs), then the widgets the windows are filled with.
   Anything that shows numbers is labelled with where they come from; illustrations say so.
   ═══════════════════════════════════════════════════════════════════════════ */

export const cx = (...a) => a.filter(Boolean).join(' ')
export const pad = (n) => String(n).padStart(2, '0')
/** The five tints, in the order cases use them. */
export const TINTS = ['peach', 'lilac', 'mint', 'sky', 'butter']

/** A page section on the shared grid. `tone` is '', 'soft' (a quiet second background) or 'dark'. */
export function KSection({ id, tone, className, children }) {
  return (
    <section id={id} className={cx('k-sec', tone && `k-sec--${tone}`, className)}>
      <div className="container">{children}</div>
    </section>
  )
}

/** Section header. A hairline label ("[01] SELECTED WORK ——— / SIX SYSTEMS"), the two-tone title and one line under it. */
export function KHead({ n, label, tag, title, sub, lead, as: Tag = 'h2', className, children }) {
  return (
    <header className={cx('k-head', className)} data-reveal>
      {label && <p className="k-rule">{n && <b>[{n}]</b>}<span>{label}</span><i />{tag && <small>/ {tag}</small>}</p>}
      <Tag className="k-h">{title}{sub && <> <em>{sub}</em></>}</Tag>
      {lead && <p className="k-lead">{lead}</p>}
      {children}
    </header>
  )
}

/** A bento tile. `tint` is one of peach, lilac, mint, sky, butter, ink. */
export function Tile({ tint, className, as: Tag = 'div', reveal = true, children, ...rest }) {
  return <Tag className={cx('k-tile', tint && `k-tile--${tint}`, className)} {...(reveal ? { 'data-reveal': true } : {})} {...rest}>{children}</Tag>
}

/** A product window: traffic lights, a mono title, an optional right-hand tag. */
export function Win({ title, tag, children, className, id }) {
  return (
    <div className={cx('k-win', className)} id={id}>
      <div className="k-win__bar">
        <span className="k-win__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="k-win__t">{title}</span>
        {tag && <span className="k-win__tag">{tag}</span>}
      </div>
      <div className="k-win__body">{children}</div>
    </div>
  )
}

export const Chip = ({ tone, children, className }) => <span className={cx('k-chip', tone && `k-chip--${tone}`, className)}>{children}</span>
export const Dot = ({ tone = 'ok' }) => <i className={`k-dot k-dot--${tone}`} aria-hidden="true" />

/** A mono caption under an illustration, so nobody mistakes it for a screenshot. */
export const Cap = ({ children = 'Illustration · sample data' }) => <p className="k-cap">{children}</p>

/** Segmented meter. Only ever fed a number that exists in the case or the content. */
export function Meter({ value, max = 100, segs = 28, tone = 'accent', label }) {
  const on = Math.round((value / max) * segs)
  return (
    <span className={`k-meter k-meter--${tone}`} role="img" aria-label={label || `${value} of ${max}`}>
      {Array.from({ length: segs }, (_, i) => <i key={i} className={i < on ? 'is-on' : ''} />)}
    </span>
  )
}

/** Step tabs: a segmented control over one panel. Arrow keys move between tabs. `children(step, index)` draws the panel. */
export function StepTabs({ steps, label, children, className, numbered = true }) {
  const [i, setI] = useState(0)
  const id = useId()
  const refs = useRef([])
  const key = (e, k) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!d) return
    e.preventDefault()
    const n = (k + d + steps.length) % steps.length
    setI(n)
    refs.current[n]?.focus()
  }
  return (
    <div className={cx('k-steps', className)}>
      <div className="k-steps__bar" role="tablist" aria-label={label} style={{ '--n': steps.length }}>
        {steps.map((s, k) => (
          <button key={s.id || s.label} ref={(el) => { refs.current[k] = el }} type="button" role="tab" id={`${id}t${k}`}
            aria-selected={k === i} aria-controls={`${id}p`} tabIndex={k === i ? 0 : -1} onClick={() => setI(k)} onKeyDown={(e) => key(e, k)}>
            {numbered && <small>{pad(k + 1)}</small>}{s.label}
          </button>
        ))}
      </div>
      <div className="k-steps__panel" role="tabpanel" id={`${id}p`} aria-labelledby={`${id}t${i}`} key={i}>{children(steps[i], i)}</div>
    </div>
  )
}

/** Vertical tabs: a list of questions on the left, the window for the chosen one on the right. */
export function ListTabs({ items, label, children, className }) {
  const [i, setI] = useState(0)
  const id = useId()
  const refs = useRef([])
  const key = (e, k) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!d) return
    e.preventDefault()
    const n = (k + d + items.length) % items.length
    setI(n)
    refs.current[n]?.focus()
  }
  return (
    <div className={cx('k-list', className)}>
      <div className="k-list__bar" role="tablist" aria-label={label} aria-orientation="vertical">
        {items.map((s, k) => (
          <button key={s.id || s.title} ref={(el) => { refs.current[k] = el }} type="button" role="tab" id={`${id}t${k}`}
            aria-selected={k === i} aria-controls={`${id}p`} tabIndex={k === i ? 0 : -1} onClick={() => setI(k)} onKeyDown={(e) => key(e, k)}>
            <small>{pad(k + 1)}</small>
            <span><b>{s.title}</b>{s.sub && <em>{s.sub}</em>}</span>
            <Icon name="arrow" size={15} />
          </button>
        ))}
      </div>
      <div className="k-list__panel" role="tabpanel" id={`${id}p`} aria-labelledby={`${id}t${i}`} key={i}>{children(items[i], i)}</div>
    </div>
  )
}

/** A roadmap: one row per item on a shared time axis. Rows are { label, sub, a, b, tone, open }, with a and b as decimal years. */
export function Gantt({ rows, from, to, ticks, now, labelW = 178, caption }) {
  const p = (x) => Math.max(0, Math.min(100, ((x - from) / (to - from)) * 100))
  return (
    <div className="k-gantt" style={{ '--lw': `${labelW}px` }} role="table" aria-label={caption || 'Timeline'}>
      <div className="k-gantt__axis" role="row">
        <span role="columnheader" />
        <div className="k-gantt__ticks">{ticks.map((t) => <span key={t} style={{ left: `${p(t)}%` }}>{Math.floor(t)}</span>)}</div>
      </div>
      <div className="k-gantt__rows">
        {rows.map((r) => {
          if (r.group) return <p className="k-gantt__grp" key={r.group}>{r.group}</p>
          const left = p(r.a), width = Math.max(p(r.b) - left, 2.4)
          return (
            <div className="k-gantt__row" role="row" key={r.label}>
              <div className="k-gantt__lab" role="rowheader"><b>{r.label}</b>{r.sub && <small>{r.sub}</small>}</div>
              <div className="k-gantt__track" role="cell">
                {ticks.map((t) => <i key={t} className="k-gantt__grid" style={{ left: `${p(t)}%` }} />)}
                <span className={cx('k-gantt__bar', `k-gantt__bar--${r.tone || 'peach'}`, r.open && 'is-open')} style={{ left: `${left}%`, width: `${width}%` }}>
                  {r.when && <em>{r.when}</em>}
                </span>
              </div>
            </div>
          )
        })}
        {now != null && <i className="k-gantt__now" style={{ left: `calc(var(--lw) + (100% - var(--lw)) * ${p(now) / 100})` }}><small>NOW</small></i>}
      </div>
    </div>
  )
}

/** The map of a decision: signals in on the left, the decision layer in the middle, outputs on the right.
    Drawn on a fixed 560 × 340 plane that scales as one picture, so the lines always meet the nodes. */
export function Flow({ left, hub, right, label }) {
  const ys = [68, 170, 272]
  const path = (side, y) => (side === 'l'
    ? `M 96 ${y} C 170 ${y}, 190 170, 248 170`
    : `M 312 170 C 370 170, 390 ${y}, 464 ${y}`)
  return (
    <div className="k-flow" role="img" aria-label={label}>
      <svg viewBox="0 0 560 340" aria-hidden="true">
        {left.map((_, k) => <path key={`l${k}`} className="k-flow__ln" d={path('l', ys[k])} />)}
        {right.map((_, k) => <path key={`r${k}`} className="k-flow__ln" d={path('r', ys[k])} />)}
        {left.map((_, k) => <path key={`pl${k}`} className="k-flow__pulse" style={{ animationDelay: `${k * 0.7}s` }} d={path('l', ys[k])} />)}
        {right.map((_, k) => <path key={`pr${k}`} className="k-flow__pulse k-flow__pulse--out" style={{ animationDelay: `${1.2 + k * 0.7}s` }} d={path('r', ys[k])} />)}
      </svg>
      {left.map((n, k) => <span key={n.label} className="k-flow__n" style={{ left: '15%', top: `${(ys[k] / 340) * 100}%` }}><Icon name={n.icon} size={15} />{n.label}</span>)}
      <span className="k-flow__hub" style={{ left: '50%', top: '50%' }}><i className="k-flow__ring" /><b>{hub.label}</b><small>{hub.sub}</small></span>
      {right.map((n, k) => <span key={n.label} className="k-flow__n k-flow__n--out" style={{ left: '85%', top: `${(ys[k] / 340) * 100}%` }}><Icon name={n.icon} size={15} />{n.label}</span>)}
    </div>
  )
}

/** A vertical timeline: dot, title, small line. */
export function Timeline({ items }) {
  return (
    <ol className="k-tl">
      {items.map((it) => (
        <li key={it.t} className={it.now ? 'is-now' : ''}>
          <i aria-hidden="true" />
          <div><b>{it.t}</b><small>{it.s}</small></div>
          {it.r && <span>{it.r}</span>}
        </li>
      ))}
    </ol>
  )
}

/** A dotted coastline with a pin: sea on the left, a mainland, and the narrow tongue Mumbai sits on. Abstract on purpose. */
export function DotMap({ city, caption }) {
  const coast = (y) => [[0, 10.5], [2, 9.6], [4, 10.6], [6, 9.4], [8, 10.2], [9, 10.9], [10, 11.4], [12, 12.4]].reduce((acc, p, i, a) => (y >= p[0] && a[i + 1] && y <= a[i + 1][0] ? p[1] + ((y - p[0]) / (a[i + 1][0] - p[0])) * (a[i + 1][1] - p[1]) : acc), 12.4)
  const dots = []
  for (let y = 0; y <= 12; y++) for (let x = 0; x < 26; x++) {
    const c = coast(y)
    const width = y > 7 ? Math.max(2.2, 15 - (y - 7) * 3.1) : 99
    if (x > c && x < c + width) dots.push([x, y])
  }
  return (
    <svg className="k-map" viewBox="0 0 260 130" role="img" aria-label={caption || city}>
      {dots.map(([x, y]) => <circle key={`${x}-${y}`} cx={x * 10 + 5} cy={y * 10 + 5} r="1.9" />)}
      <g className="k-map__pin" transform="translate(152 98)"><circle className="k-map__pulse" r="5" /><circle r="5" /></g>
    </svg>
  )
}

/** The local time in a city. Set after first paint, so the prerendered page never disagrees with the browser. */
export function useClock(tz = 'Asia/Kolkata') {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('en-IN', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true }))
    tick()
    const h = setInterval(tick, 30000)
    return () => clearInterval(h)
  }, [tz])
  return t
}
