import { useEffect, useRef, useState } from 'react'
import { ALT, GAMES, LOVES, PHOTOS, SHELF, WATCHLIST } from '../content'
import { Icon } from './icons'
import { AsciiCanvas } from './ascii'
import { SCENES, photosOf } from './Story'
import { Book } from '../scenes/BeyondFilm'
import { BPM, PATTERN, createTechno } from '../lib/techno'
import { MQ } from '../lib/motion'

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

/* ─────────── 01 Wander: one frame at a time, full bleed, the route drawn over it and a stepper under it ─────────── */
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
  const go = (d) => setI((n) => (n + d + L.length) % L.length)
  const [dx, dy] = PROFILE.at(0.05 + i * (0.9 / (L.length - 1)))
  return (
    <section id="scene-wander" className="by-ch by-wander" aria-labelledby="bx-h-wander">
      <div className="container">
        <Head id="bx-h-wander" k="01" label={`Chapter · ${L.length} frames`} g={s.g} lede={s.lede} sub={s.sub} />
        <figure className="by-wd" data-by-card>
          {L.map((x, k) => <img key={x.src} className={k === i ? 'is-on' : ''} src={img(x.src)} width={x.w} height="998" alt={k === i ? ALT[x.src] : ''} aria-hidden={k !== i} loading="lazy" decoding="async" />)}
          <span className="by-wd__shade" aria-hidden="true" />
          <svg className="by-wd__route" viewBox="0 0 300 110" aria-hidden="true">
            <path className="by-route__line" d={PROFILE.d} />
            {L.map((_, k) => { const [x, y] = PROFILE.at(0.05 + k * (0.9 / (L.length - 1))); return <circle key={k} className={`by-route__pin${k <= i ? ' is-past' : ''}`} cx={x} cy={y} r="3" /> })}
            <g className="by-route__me" style={{ transform: `translate(${dx}px, ${dy}px)` }}><circle r="8" /><circle r="4" /></g>
          </svg>
          <figcaption className="by-wd__cap" aria-live="polite">
            <span className="by-chip by-chip--glass">Frame {pad(i + 1)} of {pad(L.length)}</span>
            <b>{p.cap}</b>
          </figcaption>
          <div className="by-wd__bar">
            <ol className="by-wd__steps" aria-label="Frames">
              {L.map((x, k) => <li key={x.src}><button type="button" className={k === i ? 'is-on' : ''} aria-pressed={k === i} aria-label={x.cap} onClick={() => setI(k)}>{pad(k + 1)}</button></li>)}
            </ol>
            <div className="by-wd__nav">
              <button type="button" className="by-round" onClick={() => go(-1)} aria-label="Previous frame"><Icon name="prev" size={16} /></button>
              <button type="button" className="by-round by-round--light" onClick={() => go(1)} aria-label="Next frame"><Icon name="arrow" size={16} /></button>
            </div>
          </div>
        </figure>
      </div>
    </section>
  )
}

/* ─────────── 02 Speed: a start gantry you can race, the point of view, the circuit and the sim ─────────── */
export const TRACK = 'M 70 150 C 40 90, 90 40, 160 50 S 240 110, 300 80 S 380 20, 430 60 S 450 150, 380 170 S 250 150, 200 185 S 90 210, 70 150 Z'

/** Lights out: five lights come on a second apart, then go out after a random hold. React as fast as you can. */
function LightsOut() {
  const [on, setOn] = useState(0)          // lights lit, 0–5
  const [state, setState] = useState('idle') // idle | count | hold | go | done | jump
  const [ms, setMs] = useState(0)
  const [best, setBest] = useState(0)
  const t = useRef([])
  const t0 = useRef(0)
  const clear = () => { t.current.forEach(clearTimeout); t.current = [] }
  useEffect(() => clear, [])
  const start = () => {
    clear(); setOn(0); setMs(0); setState('count')
    for (let k = 1; k <= 5; k++) t.current.push(setTimeout(() => setOn(k), k * 1000))
    const hold = 5000 + 200 + Math.random() * 2600
    t.current.push(setTimeout(() => setState('hold'), 5000))
    t.current.push(setTimeout(() => { setOn(0); setState('go'); t0.current = performance.now() }, hold))
  }
  const press = () => {
    if (state === 'idle' || state === 'done' || state === 'jump') return start()
    if (state === 'count' || state === 'hold') { clear(); setOn(0); setState('jump'); return undefined }
    const r = Math.round(performance.now() - t0.current)
    setMs(r); setBest((b) => (b ? Math.min(b, r) : r)); setState('done')
    return undefined
  }
  const say = { idle: 'Press to start. React when the lights go out.', count: 'Wait for it.', hold: 'Wait for it.', go: 'Go.', done: `${(ms / 1000).toFixed(3)} s`, jump: 'Jump start. Press to try again.' }[state]
  return (
    <div className={`by-lo by-lo--${state}`} data-by-card>
      <div className="by-lo__top"><span className="by-chip">Lights out</span>{best > 0 && <span className="by-lo__best">Best this visit <b>{(best / 1000).toFixed(3)} s</b></span>}</div>
      <button type="button" className="by-lo__gantry" onClick={press} aria-label={state === 'go' ? 'React now' : 'Start the lights'}>
        {Array.from({ length: 5 }, (_, k) => <span key={k} className={k < on ? 'is-on' : ''}><i /><i /></span>)}
      </button>
      <p className="by-lo__say" aria-live="polite">{say}</p>
    </div>
  )
}

export function Speed() {
  const L = photosOf('Speed')
  const s = scene('Speed')
  const by = Object.fromEntries(L.map((p) => [p.src, p]))
  return (
    <section id="scene-speed" className="by-ch by-speed" aria-labelledby="bx-h-speed">
      <div className="container">
        <Head id="bx-h-speed" k="02" label="Chapter · Karts, a sim and Formula 1" g={s.g} lede={s.lede} sub="Karts, a racing sim, the apex and Formula 1." />
        <div className="by-speed__grid">
          <Shot p={by['kart-pov']} over className="by-speed__pov" chip="Speed" />
          <LightsOut />
          <Shot p={by['f1-sim']} over className="by-speed__sim" />
          <div className="by-circuit" data-by-card>
            <div className="by-circuit__top"><span className="by-chip">Circuit</span><span className="by-sec"><i />S1<i />S2<i />S3</span></div>
            <svg viewBox="0 0 500 230" aria-hidden="true">
              <path d={TRACK} className="by-circuit__road" />
              <path id="by-trk" d={TRACK} className="by-circuit__line" />
              <circle className="by-circuit__car" r="8" cx="70" cy="150" />
            </svg>
          </div>
          <Shot p={by['kart-night']} over className="by-speed__night" />
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
      <div className="by-pl__top">
        <span className="by-chip by-chip--glass"><i className={`by-pl__live${playing ? ' is-on' : ''}`} />{playing ? 'Playing' : 'On repeat'}</span>
        <div className="by-pl__seg" role="group" aria-label="Station">
          <button type="button" aria-pressed={st === 'techno'} onClick={() => pick('techno')}>Techno</button>
          <button type="button" aria-pressed={st === 'am'} onClick={() => pick('am')}>Arctic Monkeys</button>
        </div>
      </div>
      <canvas ref={cv} className="by-pl__cv" aria-hidden="true" />
      {st === 'techno' ? (
        <div className="by-pl__body">
          <div className="by-pl__t"><b>Techno</b><span>{BPM} BPM · four to the floor</span></div>
          <div className="by-pl__seq" aria-hidden="true">
            {Object.entries(PATTERN).map(([name, row]) => (
              <p key={name}><small>{name}</small>{row.map((v, k) => <i key={k} className={`${v ? 'is-hit' : ''}${k === beat ? ' is-now' : ''}`} />)}</p>
            ))}
          </div>
          <button type="button" className="by-glass by-glass--light by-pl__go" onClick={toggle}>{playing ? 'Stop the beat' : 'Play a beat'}<i><Icon name={playing ? 'pause' : 'play'} size={14} /></i></button>
        </div>
      ) : (
        <div className="by-pl__body">
          <div className="by-pl__t"><b>Arctic Monkeys</b><span>Indie rock · Sheffield</span></div>
          <a className="by-glass by-glass--light by-pl__go" href={AM} target="_blank" rel="noopener noreferrer">Open on Spotify<i><Icon name="ne" size={14} /></i></a>
        </div>
      )}
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
        <div className="by-live__board">
          <Player />
          <div className="by-live__row">
            {L.slice(0, 4).map((p) => <Shot key={p.src} p={p} over className="by-live__shot" />)}
          </div>
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
        <div className="by-play__board">
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
          <aside className="by-shelf" aria-label="The library">
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
          </aside>
        </div>
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
