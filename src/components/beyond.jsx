import { useState } from 'react'
import { ALT, GAMES, LOVES, PHOTOS, SHELF, WATCHLIST } from '../content'
import { Icon } from './icons'
import { AsciiCanvas } from './ascii'
import { SCENES, photosOf } from './Story'
import { Book } from '../scenes/BeyondFilm'

/* ═══════════════════════════════════════════════════════════════════════════
   Beyond work, the chapters. One card system for all of them, so the page reads as one piece of work:
   rounded white cards and dark tiles, photographs with frosted chips over them, round arrow badges,
   fact rows separated by dots. Each chapter changes the composition, not the language, and carries one
   thing to do (pick a frame, pick a title, filter the shelf). Text is all real; pictures are Anjor's own,
   and every drawn picture says so. Motion lives in pages/Beyond.jsx (one useGSAP scope for the page).
   ═══════════════════════════════════════════════════════════════════════════ */

const scene = (g) => SCENES.find((s) => s.g === g)
export const img = (src) => `/img/adventure/${src}.webp`
const pad = (n) => String(n).padStart(2, '0')
const Dots = ({ items }) => <p className="by-dots">{items.map((x) => <span key={x}>{x}</span>)}</p>

/** A chapter's heading: the chapter mark, the display word with its serif line, and the sub line opposite. */
function Head({ id, k, label, g, lede, sub, stop = true }) {
  return (
    <header className="by-head">
      <div className="by-head__t">
        <p className="by-k"><b>{k}</b>{label}</p>
        <h2 id={id} className="bx-h by-h"><span>{g}{stop ? '.' : ''}</span> <em>{lede}</em></h2>
      </div>
      {sub && <p className="by-sub">{sub}</p>}
    </header>
  )
}

/** A photograph in a card. `chip` floats over it, the caption sits under or over it. */
function Shot({ p, className = '', over = false, chip, children }) {
  return (
    <figure className={`by-shot ${over ? 'by-shot--over' : ''} ${className}`} data-by-card>
      <span className="by-shot__in"><img src={img(p.src)} width={p.w} height="998" alt={ALT[p.src]} loading="lazy" decoding="async" data-by-par /></span>
      {chip && <span className="by-chip by-chip--float">{chip}</span>}
      <figcaption>{p.cap}{children}</figcaption>
    </figure>
  )
}

/* ─────────── Intro: the statement and what the page holds ─────────── */
export function Intro() {
  const facts = [
    [String(PHOTOS.length), 'frames of my own'],
    [String(SHELF.length), SHELF.length === 1 ? 'book on the shelf' : 'books on the shelf'],
    [String(WATCHLIST.length), 'series queued'],
    [String(GAMES.length), 'games in the library'],
  ]
  return (
    <section className="by-intro" aria-label="About this page">
      <div className="container by-intro__in">
        <p className="by-k by-k--plain">The person behind the product</p>
        <p className="by-intro__s" data-by-card>A little less planned. <em>A lot more alive.</em> Water, mountains and back roads. Karts, a racing sim and the apex. Lights, lasers and a full room. A book on the shelf, an anime queued for later, and a game to finish.</p>
        <ul className="by-intro__facts">
          {facts.map(([n, l]) => <li key={l} data-by-card><b>{n}</b><span>{l}</span></li>)}
        </ul>
      </div>
    </section>
  )
}

/* ─────────── 01 Wander: a trail card you page through, with the route it draws ─────────── */
const PROFILE = (() => {
  const pts = []
  for (let i = 0; i <= 120; i++) {
    const x = i / 120
    const y = 0.55 - 0.18 * Math.sin(x * 5.2 + 0.4) - 0.1 * Math.sin(x * 13.1 + 1.2) - 0.05 * Math.sin(x * 29 + 2) - 0.12 * x
    pts.push([x * 300, 8 + y * 92])
  }
  return { d: pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '), at: (t) => pts[Math.round(t * 120)] }
})()

export function Wander() {
  const L = photosOf('Wander')
  const s = scene('Wander')
  const [i, setI] = useState(0)
  const p = L[i]
  const [dx, dy] = PROFILE.at(0.05 + i * (0.9 / (L.length - 1)))
  return (
    <section id="scene-wander" className="by-ch by-wander" aria-labelledby="bx-h-wander">
      <div className="container">
        <Head id="bx-h-wander" k="01" label={`Chapter · ${L.length} frames`} g={s.g} lede={s.lede} sub={s.sub} />
        <div className="by-wander__grid">
          <article className="by-trail" data-by-card>
            <div className="by-trail__media">
              {L.map((x, k) => <img key={x.src} className={k === i ? 'is-on' : ''} src={img(x.src)} width={x.w} height="998" alt={k === i ? ALT[x.src] : ''} aria-hidden={k !== i} loading="lazy" decoding="async" />)}
              <span className="by-chip by-chip--float">Frame {pad(i + 1)} of {pad(L.length)}</span>
              <div className="by-trail__bar">
                <p aria-live="polite"><b>{p.cap}</b><span>{s.sub}</span></p>
                <button type="button" className="by-glass" onClick={() => setI((n) => (n + 1) % L.length)}>Next frame <i><Icon name="arrow" size={15} /></i></button>
              </div>
            </div>
            <div className="by-trail__info">
              <div>
                <h3>{s.g}</h3>
                <p>{s.lede}</p>
                <Dots items={[`${L.length} frames`, 'My own photographs']} />
              </div>
              <figure className="by-route" aria-label="The route, drawn as a line with a marker at the current frame">
                <svg viewBox="0 0 300 96" aria-hidden="true">
                  <path className="by-route__line" d={PROFILE.d} />
                  {L.map((_, k) => { const [x, y] = PROFILE.at(0.05 + k * (0.9 / (L.length - 1))); return <circle key={k} className={`by-route__pin${k <= i ? ' is-past' : ''}`} cx={x} cy={y} r="3.2" /> })}
                  <g className="by-route__me" style={{ transform: `translate(${dx}px, ${dy}px)` }}><circle r="9" /><circle r="4.5" /></g>
                </svg>
              </figure>
            </div>
          </article>
          <ul className="by-thumbs" aria-label="Wander frames">
            {L.map((x, k) => (
              <li key={x.src} data-by-card>
                <button type="button" className={k === i ? 'is-on' : ''} aria-pressed={k === i} onClick={() => setI(k)}>
                  <img src={img(x.src)} width={x.w} height="998" alt="" loading="lazy" decoding="async" />
                  <span>{x.cap}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─────────── 02 Speed: a big point-of-view card, a circuit tile, and a pair of travel cards ─────────── */
export const TRACK = 'M 70 150 C 40 90, 90 40, 160 50 S 240 110, 300 80 S 380 20, 430 60 S 450 150, 380 170 S 250 150, 200 185 S 90 210, 70 150 Z'

export function Speed() {
  const L = photosOf('Speed')
  const s = scene('Speed')
  const by = Object.fromEntries(L.map((p) => [p.src, p]))
  return (
    <section id="scene-speed" className="by-ch by-speed" aria-labelledby="bx-h-speed">
      <div className="container">
        <Head id="bx-h-speed" k="02" label={`Chapter · ${L.length} frames`} g={s.g} lede={s.lede} sub={s.sub} />
        <div className="by-speed__grid">
          <Shot p={by['kart-pov']} over className="by-speed__pov" chip="Speed" />
          <div className="by-circuit" data-by-card>
            <div className="by-circuit__top"><span className="by-chip">Circuit</span><span className="by-ill"><i />Illustration</span></div>
            <svg viewBox="0 0 500 230" aria-hidden="true">
              <path d={TRACK} className="by-circuit__road" />
              <path id="by-trk" d={TRACK} className="by-circuit__line" />
              <circle className="by-circuit__car" r="8" cx="70" cy="150" />
            </svg>
            <p>{s.sub}</p>
          </div>
          <Shot p={by['kart-night']} over className="by-speed__night" />
          <article className="by-pair by-pair--text" data-by-card>
            <div className="by-pair__copy"><h3>{by['kart-grid'].cap}</h3><Dots items={['Speed', `Frame ${pad(L.indexOf(by['kart-grid']) + 1)} of ${pad(L.length)}`]} /></div>
            <span className="by-pair__img"><img src={img('kart-grid')} width={by['kart-grid'].w} height="998" alt={ALT['kart-grid']} loading="lazy" decoding="async" data-by-par /></span>
          </article>
          <article className="by-pair by-pair--img" data-by-card>
            <span className="by-pair__img"><img src={img('f1-sim')} width={by['f1-sim'].w} height="998" alt={ALT['f1-sim']} loading="lazy" decoding="async" data-by-par /></span>
            <div className="by-pair__copy"><h3>{by['f1-sim'].cap}</h3><Dots items={['Speed', `Frame ${pad(L.indexOf(by['f1-sim']) + 1)} of ${pad(L.length)}`]} /></div>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ─────────── 03 Live: a night field, one wide picture that breathes, three under it ─────────── */
export function Live() {
  const L = photosOf('Live')
  const s = scene('Live')
  const wide = L.find((p) => p.src === 'laser') || L[0]
  const rest = L.filter((p) => p !== wide)
  return (
    <section id="scene-live" className="by-ch by-live" aria-labelledby="bx-h-live">
      <div className="container">
        <Head id="bx-h-live" k="03" label={`Chapter · ${L.length} frames`} g={s.g} lede={s.lede} sub={s.sub} />
        <figure className="by-live__wide" data-by-card>
          <span className="by-live__frame"><img src={img(wide.src)} width={wide.w} height="998" alt={ALT[wide.src]} loading="lazy" decoding="async" data-by-zoom /></span>
          <figcaption><span className="by-chip by-chip--glass">Live</span><b>{wide.cap}</b></figcaption>
        </figure>
        <div className="by-live__row">
          {rest.map((p) => <Shot key={p.src} p={p} over className="by-live__shot" />)}
        </div>
      </div>
    </section>
  )
}

/* ─────────── 04 Read: one card, the book on a stage beside its details ─────────── */
export function Read() {
  return (
    <section id="scene-read" className="by-ch by-read" aria-labelledby="bx-h-read">
      <div className="container">
        <article className="by-read__card" data-by-card>
          <div className="by-read__stage"><Book className="book--page" /><span className="by-read__shadow" aria-hidden="true" /></div>
          <div className="by-read__copy">
            <p className="by-k"><b>04</b>Chapter · On the shelf</p>
            <h2 id="bx-h-read" className="bx-h by-h"><span>Read.</span> <em>What’s on the shelf.</em></h2>
            {SHELF.map((b) => (
              <div key={b.t} className="by-book">
                <h3>{b.t}</h3>
                <p>{b.s}</p>
                <Dots items={[b.a, b.p]} />
              </div>
            ))}
            <p className="by-note">Cover drawn for this page, not the publisher’s design</p>
          </div>
        </article>
      </div>
    </section>
  )
}

/* ─────────── 05 Watch: two title cards (one lit), then a strip of my photographs inked as panels ─────────── */
const PANELS = [['kart-pov', 'Eyes on the apex.'], ['kart-night', 'Night session.'], ['paddle', 'Golden hour, flat water.'], ['rainier', 'A mountain worth the drive.']]

export function Watch() {
  const [on, setOn] = useState(0)
  return (
    <section id="scene-watch" className="by-ch by-watch" aria-labelledby="bx-h-watch">
      <div className="container">
        <Head id="bx-h-watch" k="05" label="Chapter · Watchlist" g="Watch" lede="Mecha, strategy and one more episode." />
        <div className="by-titles" role="group" aria-label="Watchlist">
          {WATCHLIST.map((w, k) => (
            <button key={w.t} type="button" className={`by-title${k === on ? ' is-on' : ''}`} aria-pressed={k === on} onClick={() => setOn(k)} data-by-card>
              <span className="by-title__art"><AsciiCanvas scene={w.art} className="by-title__cv" label={`An abstract animated scene for ${w.t}`} /></span>
              <span className="by-badge" aria-hidden="true"><Icon name="play" size={13} /></span>
              <span className="by-title__copy">
                <b>{w.t}</b>
                {w.s && <em>{w.s}</em>}
                <span className="by-title__tags">{w.tags.map((t) => <span key={t} className="by-chip">{t}</span>)}</span>
                <span className="by-title__facts"><span><small>Studio</small>{w.st}</span><span><small>First aired</small>{w.y}</span></span>
              </span>
            </button>
          ))}
        </div>
        <p className="by-note">Scenes are abstract and drawn for this page. No artwork from either series is used.</p>
        <div className="by-panels">
          {PANELS.map(([src, cap]) => (
            <figure key={src} className="by-panel" data-by-card>
              <img src={`/img/manga/${src}.png`} alt={`${ALT[src]}, redrawn as a manga panel`} loading="lazy" decoding="async" />
              <figcaption className="by-chip by-chip--paper">{cap}</figcaption>
            </figure>
          ))}
        </div>
        <p className="by-note">Panels: my own photographs, inked and screentoned</p>
      </div>
    </section>
  )
}

/* ─────────── 06 Play: a featured title, category pills, and the library as dark tiles ─────────── */
const CATS = ['All', 'Action', 'Shooter', 'RPG', 'Horror', 'Strategy']

export function Play() {
  const [cat, setCat] = useState('All')
  const list = GAMES.filter((g) => cat === 'All' || g.c === cat)
  const [slug, setSlug] = useState(GAMES[0].slug)
  const g = list.find((x) => x.slug === slug) || list[0]
  const at = list.indexOf(g)
  const move = (d) => setSlug(list[(at + d + list.length) % list.length].slug)
  return (
    <section id="scene-play" className="by-ch by-play" aria-labelledby="bx-h-play">
      <div className="container">
        <Head id="bx-h-play" k="06" label={`Chapter · ${GAMES.length} on the shelf`} g="Play" lede="One more save before bed." />
        <div className="by-feat" data-by-card aria-live="polite">
          {GAMES.map((x) => <img key={x.slug} className={x.slug === g.slug ? 'is-on' : ''} src={`/img/games/${x.slug}.webp`} alt="" loading="lazy" decoding="async" />)}
          <div className="by-feat__copy">
            <span className="by-chip by-chip--glass">{cat === 'All' ? 'In my library' : cat}</span>
            <h3 key={g.slug}>{g.t}</h3>
            <dl className="by-feat__facts">
              <div><dt>Genre</dt><dd>{g.g}</dd></div>
              <div><dt>Studio</dt><dd>{g.st}</dd></div>
              <div><dt>First released</dt><dd>{g.y}</dd></div>
            </dl>
          </div>
          <div className="by-feat__nav">
            <span>Shelf position <b>{pad(GAMES.indexOf(g) + 1)} / {GAMES.length}</b></span>
            <button type="button" className="by-round" onClick={() => move(-1)} aria-label="Previous game"><Icon name="prev" size={16} /></button>
            <button type="button" className="by-glass by-glass--light" onClick={() => move(1)}>Next title <i><Icon name="arrow" size={15} /></i></button>
          </div>
        </div>
        <nav className="by-tabs" aria-label="Filter games by category">
          {CATS.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}<small>{c === 'All' ? GAMES.length : GAMES.filter((x) => x.c === c).length}</small></button>)}
        </nav>
        <ul className="by-lib" aria-label="Games I play">
          {list.map((x) => (
            <li key={x.slug} data-by-tile>
              <button type="button" className={x.slug === g.slug ? 'is-on' : ''} aria-pressed={x.slug === g.slug} onClick={() => setSlug(x.slug)}>
                <span className="by-lib__art"><img src={`/img/games/${x.slug}.webp`} alt="" loading="lazy" decoding="async" /></span>
                <span className="by-lib__t"><b>{x.t}</b><small>{x.c}</small></span>
              </button>
            </li>
          ))}
        </ul>
        <p className="by-note">Cover art is original and abstract, made for this page. No official artwork is used.</p>
      </div>
    </section>
  )
}

/* ─────────── 07 Radar: six cards, one of them dark ─────────── */
export function Radar() {
  return (
    <section id="radar" className="by-ch by-radar" aria-labelledby="bx-h-radar">
      <div className="container">
        <Head id="bx-h-radar" k="07" label="Curiosity doesn’t switch off when the working day ends" g="Always something" lede="on the radar." stop={false} />
        <ul className="by-radar__grid">
          {LOVES.map(([a, b], k) => (
            <li key={a} className={k === 0 ? 'is-ink' : ''} data-by-card>
              <span className="by-badge by-badge--n" aria-hidden="true">{pad(k + 1)}</span>
              <b>{a}</b>
              <p>{b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
