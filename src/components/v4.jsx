import { useEffect, useState } from 'react'
import { CASES } from '../content'
import { Icon } from './icons'
import { Arrow, Button, LinkArrow, Rich } from './ui'
import { CaseMock } from './mocks'
import { Stat } from './kinetic'
import { cx } from './kit'
import { AppWin, Float, PAINTS, Paint } from './paint'

/* ═══════════════════════════════════════════════════════════════════════════
   The showcase layer. Product windows set on painted panels, the way good product sites stage their software:
   the painting gives depth and warmth, the window stays crisp, small cards float above both.
   Paintings are original, procedurally painted for this site (public/img/paint). Motion hooks are data attributes
   (data-v-paint, data-v-win, data-v-float) that PageMotion animates; nothing here moves without it.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ───────────── Home hero: the idea in motion. A decision trace on the checkout case. ───────────── */
const TRACE = [
  ['warn', 'Order changed after payment', 'Checkout'],
  ['warn', 'Prepaid option sat below the fold', 'Payment'],
  ['info', 'Cash on delivery at high intent', 'Payment'],
  ['warn', 'Cancelled after dispatch', 'Fulfilment'],
]
export function HeroTrace() {
  return (
    <Paint name="dawn" className="v-hero__paint" fit="bleed">
      <AppWin title="Decision layer · checkout" tag="Illustration" side={{ brand: 'Decision layer', items: [['eye', 'Signals'], ['branch', 'Decisions'], ['layers', 'Experiments'], ['chart', 'Outcomes']] }} active={1} className="v-trace">
        <div className="v-trace__grid">
          <section className="v-trace__col" aria-label="Signals">
            <p className="v-k">Signals <b>4 new</b></p>
            <ul className="v-trace__sig" data-v-seq>
              {TRACE.map(([tone, t, s]) => <li key={t} className={`is-${tone}`}><i /><span><b>{t}</b><small>{s}</small></span></li>)}
            </ul>
          </section>
          <section className="v-trace__col v-trace__dec" aria-label="Decision">
            <p className="v-k">Decision</p>
            <div className="v-trace__card" data-v-pop>
              <span className="v-trace__ring" aria-hidden="true" />
              <b>Lock the price at checkout</b>
              <p>Absorb small batch changes. Surface prepaid at the moment of intent. Hand clean orders to the warehouse.</p>
              <p className="v-trace__pills"><span className="is-ok">Eligible</span><span>Guardrails on</span><span>Holdout set</span></p>
            </div>
          </section>
          <section className="v-trace__col v-trace__out" aria-label="Outcome">
            <p className="v-k">Outcome · prepaid order-to-delivery</p>
            <p className="v-trace__big"><span>77.2%</span><Icon name="arrow" size={18} /><b><Stat v="89.7%" /></b></p>
            <svg className="v-trace__spark" viewBox="0 0 300 70" aria-hidden="true"><path className="v-trace__area" d="M0 58 C40 56 60 52 90 50 S150 40 180 30 S240 16 300 10 L300 70 L0 70 Z" /><path className="v-trace__line" d="M0 58 C40 56 60 52 90 50 S150 40 180 30 S240 16 300 10" data-v-draw /><circle cx="300" cy="10" r="4" /></svg>
            <p className="v-trace__chips"><span>+12.5pp</span><span>RTO −1.9pp</span><span>Cancellations −3.3pp</span></p>
          </section>
        </div>
      </AppWin>
      <Float className="v-toast v-toast--a" depth={1.6}><Icon name="lock" size={14} /><span><b>Price locked</b><small>Order total held after payment</small></span></Float>
      <Float className="v-toast v-toast--b" depth={2.2}><b>+12.5pp</b><small>Prepaid order-to-delivery · checkout case</small></Float>
    </Paint>
  )
}

/* ───────────── Work showcase: six systems, one stage ───────────── */
export function CaseShowcase({ onOpen, auto = 7000 }) {
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  const c = CASES[i]
  useEffect(() => {
    if (hold || typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const t = setTimeout(() => setI((n) => (n + 1) % CASES.length), auto)
    return () => clearTimeout(t)
  }, [i, hold, auto])
  return (
    <div className="v-show" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="v-show__list" role="tablist" aria-label="Six systems">
        {CASES.map((x, k) => (
          <button key={x.slug} type="button" role="tab" aria-selected={k === i} aria-controls="v-show-stage" className={k === i ? 'is-on' : ''} onClick={() => setI(k)} style={{ '--auto': `${auto}ms` }}>
            <small>{x.n}</small>
            <span><b>{x.title}</b><em>{x.cat}</em></span>
            <strong>{x.metrics[0][0]}</strong>
            {k === i && !hold && <i className="v-show__bar" aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="v-show__stage" id="v-show-stage" role="tabpanel" aria-live="polite">
        <Paint name={PAINTS[i % PAINTS.length]} fit="bleed" key={c.slug} className="v-show__paint">
          <div className="v-show__mock"><CaseMock slug={c.slug} /></div>
          <Float className="v-metric" depth={1.8}>
            {c.metrics.slice(0, 2).map(([v, l]) => <span key={l}><b><Stat v={v} /></b><small>{l}</small></span>)}
          </Float>
        </Paint>
        <div className="v-show__foot">
          <p><b>{c.title}.</b> {c.line}</p>
          <p className="v-show__acts">
            {onOpen && <button type="button" className="v-btn-q" onClick={() => onOpen(c.slug)}><Icon name="eye" size={14} />Quick view</button>}
            <LinkArrow to={`/work/${c.slug}`}>Read the case</LinkArrow>
          </p>
        </div>
      </div>
    </div>
  )
}

/** A case as a card: words on top, the product on a painting underneath. The whole card links to the case. */
export function CaseCard({ c, k = 0 }) {
  return (
    <article className="v-card" data-reveal>
      <a className="v-card__a" href={`/work/${c.slug}`} aria-label={`${c.title}: read the case`} />
      <div className="v-card__top">
        <p className="v-k"><b>{c.n}</b>{c.cat}</p>
        <h3>{c.title}</h3>
        <ul className="v-card__m">{c.metrics.slice(0, 2).map(([v, l]) => <li key={l}><b><Stat v={v} /></b><span>{l}</span></li>)}</ul>
      </div>
      <Paint name={PAINTS[k % PAINTS.length]} fit="bleed" className="v-card__paint" tilt={false}>
        <div className="v-card__mock"><CaseMock slug={c.slug} /></div>
      </Paint>
      <span className="v-card__go">Read the case<Arrow /></span>
    </article>
  )
}

/* ───────────── A feature row: words on one side, a painted stage on the other ───────────── */
export function Feature({ k, title, sub, lead, points, link, paint = 'noon', flip, fit = 'center', children, className }) {
  return (
    <div className={cx('v-feat', flip && 'v-feat--flip', className)}>
      <div className="v-feat__copy" data-reveal>
        {k && <p className="v-k">{k}</p>}
        <h3 className="v-feat__h">{title}{sub && <em> {sub}</em>}</h3>
        {lead && <p className="v-feat__lead">{lead}</p>}
        {points && <ul className="v-feat__pts">{points.map(([icon, t]) => <li key={t}><span><Icon name={icon} size={14} /></span>{t}</li>)}</ul>}
        {link}
      </div>
      <Paint name={paint} fit={fit} className="v-feat__paint">{children}</Paint>
    </div>
  )
}

/* ───────────── Home: a door into Beyond work, already in that room's language ───────────── */
const REEL = [
  ['/img/adventure/rainier.webp', 'Wander', 'Water, mountains and back roads.'],
  ['/img/adventure/kart-pov.webp', 'Speed', 'Karts, a racing sim and the apex.'],
  ['/img/adventure/laser.webp', 'Live', 'Lights, lasers and a full room.'],
  ['book', 'Read', 'On the shelf.'],
  ['/img/manga/paddle.png', 'Watch', 'Mecha, strategy, one more episode.'],
]
export function BeyondBand() {
  return (
    <section id="beyond" className="v-beyond" aria-labelledby="v-beyond-h">
      <div className="container">
        <p className="v-beyond__k"><span>05</span>Beyond work</p>
        <h2 id="v-beyond-h" className="v-beyond__h"><span aria-hidden="true">OFF THE CLOCK</span><em>Away from the roadmap, still curious.</em></h2>
        <p className="v-beyond__lead">Karting, music, travel, a book and an anime queue. I care about how things work, and about experiencing them for myself.</p>
      </div>
      <ul className="v-beyond__reel" data-v-seq>
        {REEL.map(([src, g, cap], k) => (
          <li key={g} style={{ '--r': `${[-3, 2, -1.5, 3, -2][k]}deg` }}>
            <a href={`/beyond#scene-${g.toLowerCase()}`} aria-label={`${g}: ${cap}`}>
              <span className="v-beyond__img">
                {src === 'book'
                  ? <span className="v-beyond__book" aria-hidden="true"><b>AI<br />ENGINEERING</b><small>Chip Huyen</small></span>
                  : <img src={src} alt="" loading="lazy" decoding="async" />}
              </span>
              <span className="v-beyond__cap"><b>0{k + 1}</b>{g}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="container v-beyond__go"><Button to="/beyond">Enter beyond work <Arrow /></Button><span>It opens with a short film.</span></div>
    </section>
  )
}

