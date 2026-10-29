import { useEffect, useRef, useState } from 'react'
import { ALT, GAMES, LOVES, PHOTOS, SHELF, WATCHLIST } from '../content'
import { Icon } from './icons'
import { AsciiCanvas } from './ascii'
import { SCENES, photosOf } from './Story'
import { BPM, PATTERN, createTechno } from '../lib/techno'
import { MQ } from '../lib/motion'
import { asciiFor } from '../art/gameAscii'

/* ═══════════════════════════════════════════════════════════════════════════
   Beyond work, the chapters. One card system for all of them, so the page reads as one piece of work:
   rounded white cards and dark tiles, photographs with frosted chips over them, round arrow badges,
   fact rows separated by dots. Each chapter changes the composition, not the language, and carries one
   thing to do (pick a frame, pick a book, pick a game). Text is all real; photographs are Anjor's own,
   and covers and game scenes are drawn for the page. Motion lives in pages/Beyond.jsx (one useGSAP scope for the page).
   ═══════════════════════════════════════════════════════════════════════════ */

/** A small book object drawn in CSS, its cover set from the title (one drawn style for the whole shelf). */
export function Book({ className = '', b }) {
  const size = b.t.length > 40 ? 's' : b.t.length > 22 ? 'm' : 'l'
  return (
    <div className={`book book--${size} ${className}`} style={{ '--bk': b.c }} aria-hidden="true">
      <div className="book__front">
        <span className="book__lat">{Array.from({ length: 30 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</span>
        <b>{b.t}</b>
        <em>{b.s}</em>
        <small>{b.a}</small>
      </div>
      <div className="book__spine"><span>{b.t.toUpperCase()} · {b.a.split(',')[0].toUpperCase()}</span></div>
      <div className="book__pages" />
    </div>
  )
}

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
        <p className="by-intro__s" data-by-card>A little less planned. <em>A lot more alive.</em> Water, mountains and back roads. Karts, a racing sim and the apex. Lights, lasers and a full room. Books on the shelf, an anime queued for later, and a game to finish.</p>
        <ul className="by-intro__facts">
          {facts.map(([n, l]) => <li key={l} data-by-card><b>{n}</b><span>{l}</span></li>)}
        </ul>
      </div>
    </section>
  )
}

/* ─────────── 01 Wander: a shelf of tall photo cards you scroll through, like a trail app ─────────── */
export function Wander() {
  const L = photosOf('Wander')
  const s = scene('Wander')
  const row = useRef(null)
  const go = (d) => { const el = row.current; if (!el) return; const card = el.querySelector('li'); el.scrollBy({ left: d * ((card?.offsetWidth || 280) + 12), behavior: window.matchMedia(MQ.motion).matches ? 'smooth' : 'auto' }) }
  return (
    <section id="scene-wander" className="by-ch by-wander" aria-labelledby="bx-h-wander">
      <div className="container">
        <Head id="bx-h-wander" k="01" label={`Chapter · ${L.length} frames`} g={s.g} lede={s.lede} sub={s.sub} />
        <div className="by-wd2">
          <ul className="by-wd2__row" ref={row} aria-label="Wander frames">
            {L.map((p, k) => (
              <li key={p.src} className={k === 0 ? 'is-lead' : ''} data-by-card>
                <img src={img(p.src)} width={p.w} height="998" alt={ALT[p.src]} loading="lazy" decoding="async" />
                <span className="by-wd2__n">{pad(k + 1)}</span>
                <span className="by-wd2__cap"><b>{p.cap}</b></span>
              </li>
            ))}
          </ul>
          <div className="by-wd2__nav">
            <button type="button" className="by-round by-round--soft" onClick={() => go(-1)} aria-label="Previous frames"><Icon name="prev" size={16} /></button>
            <button type="button" className="by-round by-round--ink" onClick={() => go(1)} aria-label="Next frames"><Icon name="arrow" size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────── 02 Speed: the circuit as the lead card, the point of view, the sim and the night session ─────────── */
export const TRACK = 'M 70 150 C 40 90, 90 40, 160 50 S 240 110, 300 80 S 380 20, 430 60 S 450 150, 380 170 S 250 150, 200 185 S 90 210, 70 150 Z'

export function Speed() {
  const L = photosOf('Speed')
  const s = scene('Speed')
  const by = Object.fromEntries(L.map((p) => [p.src, p]))
  return (
    <section id="scene-speed" className="by-ch by-speed" aria-labelledby="bx-h-speed">
      <div className="container">
        <Head id="bx-h-speed" k="02" label="Chapter · Karts, a sim and Formula 1" g={s.g} lede={s.lede} sub="Karts, a racing sim, the apex and Formula 1." />
        <div className="by-sp2">
          <div className="by-circuit by-sp2__track" data-by-card>
            <div className="by-circuit__top"><span className="by-chip">Circuit</span><span className="by-sec"><i />S1<i />S2<i />S3</span></div>
            <svg viewBox="0 0 500 230" aria-hidden="true">
              <path d={TRACK} className="by-circuit__road" />
              <path id="by-trk" d={TRACK} className="by-circuit__line" />
              <circle className="by-circuit__car" r="8" cx="70" cy="150" />
            </svg>
            <p className="by-sp2__cap"><b>Speed</b><span>{s.sub}</span></p>
          </div>
          <Shot p={by['kart-pov']} over className="by-sp2__pov" />
          <Shot p={by['f1-sim']} over className="by-sp2__sim" />
          <Shot p={by['kart-night']} over className="by-sp2__night" />
        </div>
      </div>
    </section>
  )
}

/* ─────────── 03 Music: a player (a techno loop made in the browser, and Arctic Monkeys), and the live rooms ─────────── */
const AM = 'https://open.spotify.com/artist/7Ln80lUS6He07XvHI8qqHH'
function Player() {
  const [st, setSt] = useState('techno')
  const [playing, setPlaying] = useState(false)
  const [beat, setBeat] = useState(-1)
  const synth = useRef(null)
  const cv = useRef(null)
  useEffect(() => () => { synth.current?.close(); synth.current = null }, [])
  // The visual: the loop's spectrum while it plays; a slow idle wave otherwise. Drawn only while on screen.
  useEffect(() => {
    const c = cv.current
    if (!c) return undefined
    const x = c.getContext('2d')
    let raf = 0, seen = false
    const data = new Uint8Array(64)
    const still = !window.matchMedia(MQ.motion).matches
    const draw = (now) => {
      const w = (c.width = c.clientWidth * 2), h = (c.height = c.clientHeight * 2)
      x.clearRect(0, 0, w, h)
      const n = 48, gap = w / n
      const a = synth.current?.playing && synth.current.analyser
      if (a) a.getByteFrequencyData(data)
      for (let k = 0; k < n; k++) {
        const v = a ? data[Math.min(63, Math.floor(k * 1.2))] / 255 : 0.18 + 0.12 * Math.sin(now / 700 + k * 0.35) + 0.06 * Math.sin(now / 300 + k)
        const bh = Math.max(4, v * h * 0.9)
        x.fillStyle = st === 'techno' ? `hsla(${190 + k * 1.6}, 95%, ${55 + v * 20}%, ${0.55 + v * 0.45})` : `hsla(${28 + k * 0.4}, 90%, ${58 + v * 15}%, ${0.5 + v * 0.5})`
        x.fillRect(k * gap + gap * 0.2, (h - bh) / 2, gap * 0.6, bh)
      }
      if (seen && !still) raf = requestAnimationFrame(draw)
    }
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; cancelAnimationFrame(raf); if (seen) raf = requestAnimationFrame(draw) })
    io.observe(c)
    draw(0)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [st])
  const toggle = async () => {
    if (!synth.current) synth.current = createTechno({ onStep: setBeat })
    if (!synth.current) return
    if (synth.current.playing) { synth.current.stop(); setPlaying(false); setBeat(-1) } else { await synth.current.start(); setPlaying(true) }
  }
  const pick = (k) => { if (k !== 'techno' && synth.current?.playing) { synth.current.stop(); setPlaying(false); setBeat(-1) } setSt(k) }
  return (
    <div className={`by-pl by-pl--${st}`} data-by-card>
      <canvas ref={cv} className="by-pl__cv" aria-hidden="true" />
      <div className="by-pl__main">
        <div className="by-pl__top">
          <span className="by-chip by-chip--glass"><i className={`by-pl__live${playing ? ' is-on' : ''}`} />{playing ? 'Playing' : 'On repeat'}</span>
          <div className="by-pl__seg" role="group" aria-label="Station">
            <button type="button" aria-pressed={st === 'techno'} onClick={() => pick('techno')}>Techno</button>
            <button type="button" aria-pressed={st === 'am'} onClick={() => pick('am')}>Arctic Monkeys</button>
          </div>
        </div>
        {st === 'techno' ? (
          <>
            <div className="by-pl__t"><b>Techno</b><span>{BPM} BPM · four to the floor</span></div>
            <div className="by-pl__seq" aria-hidden="true">
              {Object.entries(PATTERN).map(([name, row]) => (
                <p key={name}><small>{name}</small>{row.map((v, k) => <i key={k} className={`${v ? 'is-hit' : ''}${k === beat ? ' is-now' : ''}`} />)}</p>
              ))}
            </div>
          </>
        ) : (
          <div className="by-pl__t"><b>Arctic Monkeys</b><span>Indie rock · Sheffield</span></div>
        )}
      </div>
      <div className="by-pl__ctl">
        {st === 'techno'
          ? <button type="button" className="by-pl__play" onClick={toggle} aria-label={playing ? 'Stop the beat' : 'Play a beat'}><Icon name={playing ? 'pause' : 'play'} size={22} /></button>
          : <a className="by-pl__play" href={AM} target="_blank" rel="noopener noreferrer" aria-label="Open Arctic Monkeys on Spotify"><Icon name="ne" size={22} /></a>}
        <small>{st === 'techno' ? (playing ? 'Stop' : 'Play a beat') : 'Spotify'}</small>
      </div>
    </div>
  )
}

export function Music() {
  const L = photosOf('Live')
  const s = scene('Live')
  return (
    <section id="scene-music" className="by-ch by-live" aria-labelledby="bx-h-music">
      <div className="container">
        <Head id="bx-h-music" k="03" label={`Chapter · ${L.length} frames`} g="Music" lede={s.lede} sub={`Arctic Monkeys, techno, and ${s.sub.charAt(0).toLowerCase()}${s.sub.slice(1)}`} />
        <div className="by-mu">
          <Player />
          <ul className="by-mu__row">
            {L.slice(0, 4).map((p) => <li key={p.src}><Shot p={p} over className="by-live__shot" /></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ─────────── 04 Read: the library. The picked book on a stage, the shelf of spines beside it ─────────── */
const AREAS = ['All', ...new Set(SHELF.map((b) => b.k))]

export function Read() {
  const [area, setArea] = useState('All')
  const [pick, setPick] = useState(0)
  const list = SHELF.map((b, i) => [b, i]).filter(([b]) => area === 'All' || b.k === area)
  const b = SHELF[list.some(([, i]) => i === pick) ? pick : list[0][1]]
  return (
    <section id="scene-read" className="by-ch by-read" aria-labelledby="bx-h-read">
      <div className="container">
        <article className="by-read__card" data-by-card>
          <div className="by-read__stage"><Book className="book--page" b={b} /><span className="by-read__shadow" aria-hidden="true" /></div>
          <div className="by-read__copy">
            <p className="by-k"><b>04</b>Chapter · {SHELF.length} on the shelf</p>
            <h2 id="bx-h-read" className="bx-h by-h"><span>Read.</span> <em>AI engineering, data and the systems under them.</em></h2>
            <nav className="by-tabs by-tabs--read" aria-label="Filter books by area">
              {AREAS.map((a) => <button key={a} type="button" aria-pressed={area === a} onClick={() => setArea(a)}>{a}<small>{a === 'All' ? SHELF.length : SHELF.filter((x) => x.k === a).length}</small></button>)}
            </nav>
            <ul className="by-spines" aria-label="The shelf">
              {list.map(([x, i]) => (
                <li key={x.t}>
                  <button type="button" className={x === b ? 'is-on' : ''} aria-pressed={x === b} onClick={() => setPick(i)} style={{ '--bk': x.c, '--h': `${78 + ((x.t.length * 7) % 22)}%` }}>
                    <span>{x.t}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="by-book" aria-live="polite">
              <span className="by-chip">{b.k}</span>
              <h3>{b.t}</h3>
              <p>{b.s}</p>
              <Dots items={[b.a, b.p]} />
            </div>
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
        <div className="by-panels">
          {PANELS.map(([src, cap]) => (
            <figure key={src} className="by-panel" data-by-card>
              <img src={`/img/manga/${src}.png`} alt={`${ALT[src]}, redrawn as a manga panel`} loading="lazy" decoding="async" />
              <figcaption className="by-chip by-chip--paper">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/** A game's scene as ASCII (art/gameAscii.js). `live` drifts it while on screen; motion off keeps the first frame. */
function GameArt({ slug, cols, rows, live = false, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !live || !window.matchMedia(MQ.motion).matches) return undefined
    let seen = false, raf = 0, last = 0
    const t0 = performance.now()
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting })
    io.observe(el)
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (!seen || document.hidden || now - last < 120) return
      last = now
      el.textContent = asciiFor(slug, cols, rows, (now - t0) / 1000)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [slug, cols, rows, live])
  return <span className={`by-ascii ${className}`} style={{ '--cols': cols, '--rows': rows }} aria-hidden="true"><pre key={slug} ref={ref}>{asciiFor(slug, cols, rows, 0)}</pre></span>
}

const TINT = {
  'wuthering-waves': '#7fc8ff', halo: '#9fe3b0', 'god-of-war': '#ff8a6b', 'assassins-creed': '#f2d7a2', warframe: '#b9a6ff',
  'call-of-duty': '#c9d36b', doom: '#ff6a3d', 'ghost-of-tsushima': '#ffb0b0', 'resident-evil': '#9fc5a8', 'silent-hill': '#cfcfc4',
  civilization: '#e8c46b', batman: '#ffd36b', 'spider-man': '#ff7b7b', 'elden-ring': '#ffd98a', 'the-last-of-us': '#a8d18c',
}

/* ─────────── 06 Play: a featured title, category pills, and the library as dark tiles, every scene in ASCII ─────────── */
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
        <div className="by-play__board">
          <div className="by-feat" data-by-card aria-live="polite" style={{ '--tint': TINT[g.slug] }}>
            <GameArt slug={g.slug} cols={110} rows={44} live className="by-feat__art" />
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
          <aside className="by-shelf" aria-label="The library">
            <nav className="by-tabs" aria-label="Filter games by category">
              {CATS.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}<small>{c === 'All' ? GAMES.length : GAMES.filter((x) => x.c === c).length}</small></button>)}
            </nav>
            <ul className="by-lib" aria-label="Games I play">
              {list.map((x) => (
                <li key={x.slug} data-by-tile>
                  <button type="button" className={x.slug === g.slug ? 'is-on' : ''} aria-pressed={x.slug === g.slug} onClick={() => setSlug(x.slug)}>
                    <span className="by-lib__art" style={{ '--tint': TINT[x.slug] }}><GameArt slug={x.slug} cols={44} rows={22} /></span>
                    <span className="by-lib__t"><b>{x.t}</b><small>{x.c}</small></span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
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
