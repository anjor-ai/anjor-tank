import { useEffect, useRef, useState } from 'react'
import { CASES, PROOF, bridge, fit as FIT, gtm } from '../content'
import { Arrow, LinkArrow } from './ui'
import { Icon } from './icons'

/* Portfolio building blocks shared by several pages: the numbers strip, "Where I fit", case cards, the journey leak strip. */

const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ease = (t) => 1 - (1 - t) ** 3

/** Runs 0 → 1 once when the element scrolls into view. Resolves at once under reduced motion and without IntersectionObserver. */
export function useInView(ref, { threshold = 0.35 } = {}) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (reduced() || typeof IntersectionObserver === 'undefined') { setOn(true); return undefined }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
  return on
}

function useCount(on, ms = 1400) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (!on) return undefined
    if (reduced()) { setP(1); return undefined }
    let raf, t0
    const tick = (t) => {
      t0 = t0 ?? t
      const k = Math.min(1, (t - t0) / ms)
      setP(ease(k))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, ms])
  return on ? p : 0
}

function Proof({ x, on }) {
  const p = useCount(on)
  const v = x.text ? x.text : `${x.pre || ''}${((x.from || 0) + ((x.to - (x.from || 0)) * p)).toFixed(x.dp || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${x.suf || ''}`
  const final = x.text ? x.text : `${x.pre || ''}${x.to.toFixed(x.dp || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${x.suf || ''}`
  return (
    <li className="prf" data-reveal>
      <a className="prf__a" href={`/work/${x.case}`}>
        <span className="label prf__tag">{x.tag}</span>
        <strong className="prf__v" aria-label={final}><span aria-hidden="true">{on ? v : final}</span></strong>
        <p className="prf__l">{x.label}</p>
        <span className="prf__go">Read the case<Arrow /></span>
      </a>
    </li>
  )
}

/** The four headline numbers, counting up when they come into view. Each one opens its case. */
export function ProofStrip() {
  const ref = useRef(null)
  const on = useInView(ref)
  return <ul className="prfs" ref={ref}>{PROOF.map((x) => <Proof key={x.label} x={x} on={on} />)}</ul>
}

/** "Where I fit": the seats on the left, the proof and the starting point for the chosen one on the right. */
export function WhereIFit({ initial = 0 }) {
  const [i, setI] = useState(initial)
  const refs = useRef([])
  const s = FIT[i]
  const c = s.case && CASES.find((x) => x.slug === s.case)
  const key = (e, k) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!d) return
    e.preventDefault()
    const n = (k + d + FIT.length) % FIT.length
    setI(n)
    refs.current[n]?.focus()
  }
  return (
    <div className="wif" data-reveal>
      <div className="wif__tabs" role="tablist" aria-label="Seats" aria-orientation="vertical">
        {FIT.map((x, k) => (
          <button key={x.id} ref={(el) => { refs.current[k] = el }} type="button" role="tab" id={`wif-t-${x.id}`} aria-selected={k === i} aria-controls="wif-panel" tabIndex={k === i ? 0 : -1}
            className="wif__tab" onClick={() => setI(k)} onKeyDown={(e) => key(e, k)}>
            <span className="wif__n">0{k + 1}</span><span className="wif__s">{x.seat}</span><Icon name="arrow" size={14} />
          </button>
        ))}
      </div>
      <div className="wif__panel" id="wif-panel" role="tabpanel" aria-labelledby={`wif-t-${s.id}`} key={s.id}>
        <p className="label">Seat 0{i + 1}</p>
        <h3 className="h-2">{s.seat}</h3>
        <p className="lead">{s.d}</p>
        <dl className="wif__dl">
          <div><dt className="label">The proof</dt><dd>{s.proof}</dd></div>
          <div><dt className="label">Where I would start</dt><dd>{s.start}</dd></div>
        </dl>
        <LinkArrow to={c ? `/work/${c.slug}` : s.to}>{c ? `Read the case: ${c.title}` : s.to === '/gtm' ? 'See the practice' : 'See ROQIVA'}</LinkArrow>
      </div>
    </div>
  )
}

/** One case, as a card: number, area, title, the line, the three numbers, and what it became in ROQIVA. */
export function CaseCard({ c, compact = false }) {
  const b = bridge[c.slug]
  return (
    <li className={`ccd${compact ? ' ccd--c' : ''}`} data-reveal>
      <a className="ccd__a" href={`/work/${c.slug}`}>
        <span className="ccd__top"><span className="ccd__n">{c.n}</span><span className="label">{c.cat}</span><span className="ccd__yr label">{c.year}</span></span>
        <h3 className="h-3">{c.title}</h3>
        <p className="muted ccd__line">{c.line}</p>
        <ul className="ccd__m">{c.metrics.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}</ul>
        {b && !compact && <p className="ccd__b"><span className="label">In ROQIVA</span>{b.became}</p>}
        <span className="ccd__go">Open the case<Arrow /></span>
      </a>
    </li>
  )
}

/** The journey as a column of eight stages; the stages where revenue leaks most are marked. Used in the home story. */
export function LeakStrip() {
  const hot = new Set(['search', 'availability', 'cart', 'payment', 'fulfilment'])
  return (
    <div className="lks" aria-label="Eight stages of the customer journey, five of them leaking">
      <p className="label lks__cap">One customer journey · where revenue leaks</p>
      <ol>
        {gtm.journey.map((s, i) => (
          <li key={s.id} className={hot.has(s.id) ? 'is-leak' : ''}>
            <span className="lks__n">0{i + 1}</span>
            <b>{s.label}</b>
            <span className="lks__m">{s.mode}</span>
            <span className="lks__b">{hot.has(s.id) ? s.breaks : 'Holds'}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Three case numbers stacked like product cards. Used in the home story. */
export function CaseStack() {
  const pick = ['price-lock-checkout', 'sku-substitution-engine', 'ai-automation']
  return (
    <ul className="cstk" aria-label="Three of the seven cases">
      {pick.map((slug) => {
        const c = CASES.find((x) => x.slug === slug)
        return (
          <li key={slug}>
            <a href={`/work/${slug}`}>
              <span className="label">{c.n} · {c.tag}</span>
              <b>{c.title}</b>
              <span className="cstk__m">{c.metrics.map(([v, l]) => <span key={l}><i>{v}</i>{l}</span>)}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
