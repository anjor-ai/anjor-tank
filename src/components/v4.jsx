import { useEffect, useState } from 'react'
import { CASES } from '../content'
import { Icon } from './icons'
import { Arrow, Button, LinkArrow } from './ui'
import { CaseMock } from './mocks'
import { Stat } from './kinetic'
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

/* ───────────── Work showcase: a quiet ledger beside one sticky stage ─────────────
   Pointing at a row (or focusing it, or tapping it) puts that system's window on the painting.
   It pages through on its own until the visitor touches it, then it is theirs. */
export function CaseShowcase({ onOpen, auto = 6500 }) {
  const [i, setI] = useState(0)
  const [mine, setMine] = useState(false)
  const c = CASES[i]
  useEffect(() => {
    if (mine || typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const t = setTimeout(() => setI((n) => (n + 1) % CASES.length), auto)
    return () => clearTimeout(t)
  }, [i, mine, auto])
  const pick = (k) => { setMine(true); setI(k) }
  return (
    <div className="wl">
      <div className="wl__list" role="tablist" aria-label="Six systems">
        {CASES.map((x, k) => (
          <button key={x.slug} type="button" role="tab" aria-selected={k === i} aria-controls="wl-stage" className={k === i ? 'is-on' : ''}
            onClick={() => pick(k)} onMouseEnter={() => pick(k)} onFocus={() => pick(k)} style={{ '--auto': `${auto}ms` }} data-reveal>
            <small>{x.n}</small>
            <span><b>{x.title}</b><em>{x.cat}</em></span>
            <strong>{x.metrics[0][0]}</strong>
            {k === i && !mine && <i className="wl__bar" aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="wl__stage" id="wl-stage" role="tabpanel" aria-live="polite">
        <Paint name={PAINTS[i % PAINTS.length]} fit="bleed" key={c.slug} className="wl__paint">
          <div className="wl__mock"><CaseMock slug={c.slug} /></div>
          <Float className="wl__metric" depth={1.8}>
            {c.metrics.slice(0, 2).map(([v, l]) => <span key={l}><b><Stat v={v} /></b><small>{l}</small></span>)}
          </Float>
        </Paint>
        <div className="wl__foot">
          <p><b>{c.title}.</b> {c.line}</p>
          <p className="wl__acts">
            {onOpen && <button type="button" className="v-btn-q" onClick={() => onOpen(c.slug)}><Icon name="eye" size={14} />Quick view</button>}
            <LinkArrow to={`/work/${c.slug}`}>Read the case</LinkArrow>
          </p>
        </div>
      </div>
    </div>
  )
}

/** A case as a card: the system's window on a painting with its numbers floating over it, the words on paper beneath.
    The whole card links to the case. */
export function CaseCard({ c, k = 0 }) {
  return (
    <article className="cc" data-reveal>
      <a className="cc__a" href={`/work/${c.slug}`} aria-label={`${c.title}: read the case`} />
      <Paint name={PAINTS[k % PAINTS.length]} fit="bleed" className="cc__paint" tilt={false}>
        <div className="cc__mock"><CaseMock slug={c.slug} /></div>
        <ul className="cc__m">{c.metrics.slice(0, 2).map(([v, l]) => <li key={l}><b><Stat v={v} /></b><span>{l}</span></li>)}</ul>
      </Paint>
      <div className="cc__body">
        <p className="cc__k"><b>{c.n}</b>{c.cat}</p>
        <h3>{c.title}</h3>
        <span className="cc__go">Read the case<i><Icon name="ne" size={15} /></i></span>
      </div>
    </article>
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
          <li key={g}>
            <a href={`/beyond#scene-${g.toLowerCase()}`} aria-label={`${g}: ${cap}`}>
              <span className="v-beyond__img">
                {src === 'book'
                  ? <span className="v-beyond__book" aria-hidden="true"><b>AI<br />ENGINEERING</b><small>Chip Huyen</small></span>
                  : <img src={src} alt="" loading="lazy" decoding="async" />}
              </span>
              <span className="v-beyond__badge" aria-hidden="true"><Icon name="ne" size={15} /></span>
              <span className="v-beyond__cap"><b>0{k + 1}</b>{g}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="container v-beyond__go"><Button to="/beyond">Enter beyond work <Arrow /></Button><span>It opens with a short film.</span></div>
    </section>
  )
}

