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

/* ───────────── Home: the six systems on a rail that runs sideways while the section is pinned ─────────────
   Each card is a painting with the system's window on it and its first result in a white panel. On a phone the
   rail is a native swipe. The whole card opens the case; Quick view opens the summary in place. */
export function CaseShowcase({ onOpen }) {
  return (
    <section className="hs" data-hscroll aria-label="Six systems">
      <div className="hs__view">
        <ol className="hs__track">
          {CASES.map((c, k) => (
            <li key={c.slug} className="hs__card" data-cursor="Read">
              <Paint name={PAINTS[k % PAINTS.length]} fit="bleed" className="hs__paint" tilt={false}>
                <div className="hs__mock"><CaseMock slug={c.slug} /></div>
              </Paint>
              <span className="hs__chip">{c.cat}</span>
              <a className="hs__a" href={`/work/${c.slug}`} aria-label={`${c.title}: read the case`} />
              <div className="hs__body">
                <p className="hs__n">{c.n} <span>/ 0{CASES.length}</span></p>
                <h3>{c.title}</h3>
                <p className="hs__l">{c.line}</p>
                <p className="hs__m"><b><Stat v={c.metrics[0][0]} /></b><span>{c.metrics[0][1]}</span></p>
                <div className="hs__acts">
                  {onOpen && <button type="button" className="hs__q" onClick={() => onOpen(c.slug)}><Icon name="eye" size={14} />Quick view</button>}
                  <span className="hs__go">Read the case<i><Icon name="ne" size={14} /></i></span>
                </div>
              </div>
            </li>
          ))}
          <li className="hs__end"><a href="/work" data-cursor="Open"><span>Explore all six case studies</span><i><Icon name="arrow" size={22} /></i></a></li>
        </ol>
      </div>
      <div className="hs__bar" aria-hidden="true"><i /></div>
    </section>
  )
}

/** A case as a card (the Work page): the title on paper, the system's window on a painting inset below it,
    then where it sits among the six and its numbers. The whole card links to the case. */
export function CaseCard({ c, k = 0 }) {
  return (
    <article className="wc" data-reveal data-cursor="Read">
      <a className="wc__a" href={`/work/${c.slug}`} aria-label={`${c.title}: read the case`} />
      <header className="wc__head">
        <p className="wc__k"><b>{c.n}</b>{c.cat}</p>
        <h3>{c.title}</h3>
      </header>
      <Paint name={PAINTS[k % PAINTS.length]} fit="bleed" className="wc__paint" tilt={false}>
        <div className="wc__mock"><CaseMock slug={c.slug} /></div>
      </Paint>
      <footer className="wc__foot">
        <ul className="wc__m">{c.metrics.slice(0, 2).map(([v, l]) => <li key={l}><b><Stat v={v} /></b><span>{l}</span></li>)}</ul>
        <span className="wc__go">Read the case<i><Icon name="ne" size={14} /></i></span>
      </footer>
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
  const [on, setOn] = useState(0)
  return (
    <section id="beyond" className="bb" aria-labelledby="v-beyond-h">
      <div className="container bb__head">
        <p className="s-label bb__k"><b>05</b><span>Beyond work</span></p>
        <h2 id="v-beyond-h" className="bb__h"><span aria-hidden="true">OFF THE CLOCK</span><em>Away from the roadmap, still curious.</em></h2>
        <p className="bb__lead" data-split="lines">Karting, music, travel, a book and an anime queue. I care about how things work, and about experiencing them for myself.</p>
      </div>
      <ul className="bb__acc">
        {REEL.map(([src, g, cap], k) => (
          <li key={g} className={k === on ? 'is-on' : ''} onMouseEnter={() => setOn(k)} data-reveal>
            <a href={`/beyond#scene-${g.toLowerCase()}`} aria-label={`${g}: ${cap}`} onFocus={() => setOn(k)} data-cursor="Enter">
              <span className="bb__img">
                {src === 'book'
                  ? <span className="v-beyond__book" aria-hidden="true"><b>AI<br />ENGINEERING</b><small>Chip Huyen</small></span>
                  : <img src={src} alt="" loading="lazy" decoding="async" />}
              </span>
              <span className="bb__cap"><small>0{k + 1}</small><b>{g}</b><em>{cap}</em></span>
              <span className="bb__go" aria-hidden="true"><Icon name="ne" size={16} /></span>
            </a>
          </li>
        ))}
      </ul>
      <div className="container bb__foot"><Button to="/beyond">Enter beyond work <Arrow /></Button><span>It opens with a short film.</span></div>
    </section>
  )
}
