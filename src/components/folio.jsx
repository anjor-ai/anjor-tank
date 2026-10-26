import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CASES, bridge, fit as FIT, home, roqiva } from '../content'
import { Arrow, Button, LinkArrow, Rich } from './ui'
import { Icon } from './icons'
import { CaseMock } from './mocks'
import { WordReel } from '../art/Reel'
import { HeroApp } from '../scenes/HeroApp'

/* Portfolio building blocks used on more than one page: the hello card, Where I fit, case cards with the quick view, the ROQIVA founder band. */

const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** The welcome: a greeting that changes language, the live time in Mumbai, and three lines on where I am now. */
export function HelloCard() {
  const H = home.hello
  const [i, setI] = useState(0)
  const [time, setTime] = useState('')
  useEffect(() => {
    const clock = () => setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }))
    clock()
    const c = setInterval(clock, 20000)
    const g = reduced() ? null : setInterval(() => setI((x) => (x + 1) % H.greeting.length), 2400)
    return () => { clearInterval(c); if (g) clearInterval(g) }
  }, [H.greeting.length])
  return (
    <aside className="hlc" aria-label="Hello">
      <figure className="hlc__ph"><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" decoding="async" /></figure>
      <div className="hlc__b">
        <p className="hlc__hi" aria-live="off"><span key={i} className="hlc__w">{H.greeting[i]}</span></p>
        <p className="hlc__t label"><i />Mumbai{time ? ` · ${time}` : ''}</p>
        <dl className="hlc__f">{H.facts.map(([k, v]) => <div key={k}><dt className="label">{k}</dt><dd>{v}</dd></div>)}</dl>
      </div>
    </aside>
  )
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
          <div><dt className="label">Proof</dt><dd>{s.proof}</dd></div>
          <div><dt className="label">Where I start</dt><dd>{s.start}</dd></div>
        </dl>
        <LinkArrow to={c ? `/work/${c.slug}` : s.to}>{c ? 'Read the case' : s.to === '/roqiva' ? 'See ROQIVA' : 'See the consulting'}</LinkArrow>
      </div>
    </div>
  )
}

/** One case, as a card. With `onOpen` the card opens the quick view; the full case is always one link away. */
export function CaseCard({ c, onOpen }) {
  const b = bridge[c.slug]
  return (
    <li className="ccd" data-reveal>
      <div className="ccd__a" onClick={onOpen ? () => onOpen(c.slug) : undefined}>
        <span className="ccd__top"><span className="ccd__n">{c.n}</span><span className="label">{c.cat}</span><span className="ccd__yr label">{c.year}</span></span>
        <h3 className="h-3">{c.title}</h3>
        <ul className="ccd__m">{c.metrics.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}</ul>
        {b && !onOpen && <p className="ccd__b"><span className="label">In ROQIVA</span>{b.became}</p>}
        <span className="ccd__acts">
          {onOpen && <button type="button" className="ccd__go" onClick={(e) => { e.stopPropagation(); onOpen(c.slug) }}>Quick view<Icon name="eye" size={14} /></button>}
          <a className="ccd__full" href={`/work/${c.slug}`} onClick={(e) => e.stopPropagation()}>Full case<Arrow /></a>
        </span>
      </div>
    </li>
  )
}

/** The quick view: the illustration, the three numbers and the problem, the call and the result, without leaving the page. */
export function CaseModal({ slug, setSlug, onClose }) {
  const i = CASES.findIndex((c) => c.slug === slug)
  const c = CASES[i]
  const ref = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setSlug(CASES[(i + 1) % CASES.length].slug)
      if (e.key === 'ArrowLeft') setSlug(CASES[(i - 1 + CASES.length) % CASES.length].slug)
      if (e.key === 'Tab') {
        const f = [...document.querySelectorAll('.cqv button, .cqv a')]
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.() }
  }, [i, onClose, setSlug])
  if (!c) return null
  return createPortal(
    <div className="cqv" role="dialog" aria-modal="true" aria-label={`Quick view: ${c.title}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cqv__p">
        <header className="cqv__h">
          <div><p className="label">Case {c.n} · {c.cat} · {c.year}</p><h2 className="h-2" key={c.slug}>{c.title}</h2></div>
          <button type="button" ref={ref} className="kbd cqv__x" onClick={onClose} aria-label="Close quick view">Esc</button>
        </header>
        <div className="cqv__b" key={c.slug}>
          <p className="lead">{c.hook}</p>
          <ul className="cs__m">{c.metrics.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}</ul>
          <CaseMock slug={c.slug} />
          <div className="cs__quick">
            {[['Problem', c.quick.problem], ['The call', c.quick.call], ['Result', c.quick.result]].map(([k, v]) => <div key={k} className="cs__q"><p className="label">{k}</p><p>{v}</p></div>)}
          </div>
        </div>
        <footer className="cqv__f">
          <button type="button" className="chip" onClick={() => setSlug(CASES[(i - 1 + CASES.length) % CASES.length].slug)}>← Previous</button>
          <Button to={`/work/${c.slug}`}>Open the full case<Arrow /></Button>
          <button type="button" className="chip" onClick={() => setSlug(CASES[(i + 1) % CASES.length].slug)}>Next →</button>
        </footer>
      </div>
    </div>,
    document.body
  )
}

/** The ROQIVA founder band. Full on the home page, with the live workspace; compact on the hire page. */
export function RoqivaFounder({ compact = false }) {
  const R = home.roqiva
  return (
    <div className={`fdr${compact ? ' fdr--c' : ''}`} data-reveal>
      <div className="fdr__id">
        <p className="label fdr__eyebrow"><i className="rqh__live" />{R.eyebrow}</p>
        <div className="fdr__name"><WordReel word="roq" size="foot" label={roqiva.name} /></div>
        <h2 className="h-2 fdr__h"><Rich text={R.title} /></h2>
        <p className="fdr__lead">{R.lead}</p>
        <ul className="fdr__s">{R.stats.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}</ul>
        <div className="fdr__btns">
          <Button to={R.primary.to}>{R.primary.label}<Arrow /></Button>
          <Button to={R.secondary.to} variant="ghost">{R.secondary.label}</Button>
        </div>
      </div>
      {!compact && <div className="fdr__app" aria-label="ROQIVA workspace, sample data"><HeroApp brand="ROQIVA" /></div>}
    </div>
  )
}
