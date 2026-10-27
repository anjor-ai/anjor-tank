import { useLayoutEffect, useRef, useState } from 'react'
import { ALT, LOVES, SHELF, WATCHLIST } from '../content'
import { Cta } from '../components/ui'
import { Icon } from '../components/icons'
import { SCENES, photosOf } from '../components/Story'
import BeyondFilm, { Book } from '../scenes/BeyondFilm'
import { MQ, gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { PageMotion } from '../lib/PageMotion'

/* Beyond work. Deliberately a different room from the rest of the site: dark, photographic, condensed display type,
   each chapter with its own material (paper, carbon, light, ink). The page opens with its own film (scenes/BeyondFilm),
   once per visit, and hands straight into the hero. Decorative display words are aria-hidden; the real headings are below them. */

const CHAPTERS = [
  { id: 'wander', k: '01', name: 'Wander' },
  { id: 'speed', k: '02', name: 'Speed' },
  { id: 'live', k: '03', name: 'Live' },
  { id: 'read', k: '04', name: 'Read' },
  { id: 'watch', k: '05', name: 'Watch' },
]
const COVERS = [['rainier', 'Wander', 'The long way'], ['kart-pov', 'Speed', 'The next apex'], ['laser', 'Live', 'One more set']]
const scene = (g) => SCENES.find((s) => s.g === g)
const img = (src) => `/img/adventure/${src}.webp`

const Split = ({ text, className }) => <span className={className} aria-hidden="true">{text.split('').map((c, k) => <span key={k} className="bx-lm"><span className="bx-li">{c === ' ' ? ' ' : c}</span></span>)}</span>

/* The elevation profile for Wander: a deterministic ridge line with a waypoint per photograph. */
const PROFILE = (() => {
  const pts = []
  for (let i = 0; i <= 120; i++) {
    const x = i / 120
    const y = 0.55 - 0.18 * Math.sin(x * 5.2 + 0.4) - 0.1 * Math.sin(x * 13.1 + 1.2) - 0.05 * Math.sin(x * 29 + 2) - 0.12 * x
    pts.push([x * 1000, y * 240])
  }
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${d} L1000 240 L0 240 Z`
  return { d, area, at: (t) => pts[Math.round(t * 120)] }
})()

function Wander() {
  const L = photosOf('Wander')
  const s = scene('Wander')
  return (
    <section id="scene-wander" className="bx-ch bx-wander" aria-labelledby="bx-h-wander" data-chapter="01 Wander">
      <div className="bx-ch__big" aria-hidden="true">WANDER</div>
      <div className="container">
        <header className="bx-ch__head">
          <p className="bx-ch__k"><b>01</b>Chapter · {L.length} frames</p>
          <h2 id="bx-h-wander" className="bx-h"><span>{s.g}.</span> <em>{s.lede}</em></h2>
          <p className="bx-ch__sub">{s.sub}</p>
        </header>
        <figure className="bx-route" aria-label="A route drawn as an elevation line, one waypoint per photograph">
          <svg viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="bx-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".14" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
            <path className="bx-route__area" d={PROFILE.area} fill="url(#bx-fill)" />
            <path className="bx-route__line" d={PROFILE.d} />
          </svg>
          <ol className="bx-route__pins">
            {L.map((p, k) => {
              const t = 0.06 + k * (0.88 / (L.length - 1))
              const [x, y] = PROFILE.at(t)
              return <li key={p.src} style={{ left: `${x / 10}%`, top: `${(y / 260) * 100}%` }}><i /><span><b>{String(k + 1).padStart(2, '0')}</b>{p.cap}</span></li>
            })}
          </ol>
        </figure>
      </div>
      <div className="bx-reel">
        <div className="bx-reel__track" tabIndex={0} aria-label="Wander photographs, scroll sideways">
          {L.map((p, k) => (
            <figure key={p.src} className="bx-frame">
              <span className="bx-frame__in"><img src={img(p.src)} width={p.w} height="998" alt={ALT[p.src]} loading="lazy" decoding="async" /></span>
              <figcaption><b>FR {String(k + 1).padStart(2, '0')}</b>{p.cap}</figcaption>
            </figure>
          ))}
          <div className="bx-reel__end" aria-hidden="true"><span>END OF ROLL</span></div>
        </div>
      </div>
    </section>
  )
}

const TRACK = 'M 70 150 C 40 90, 90 40, 160 50 S 240 110, 300 80 S 380 20, 430 60 S 450 150, 380 170 S 250 150, 200 185 S 90 210, 70 150 Z'

function Speed() {
  const L = photosOf('Speed')
  const s = scene('Speed')
  return (
    <section id="scene-speed" className="bx-ch bx-speed" aria-labelledby="bx-h-speed" data-chapter="02 Speed">
      <div className="container">
        <header className="bx-ch__head">
          <p className="bx-ch__k"><b>02</b>Chapter · {L.length} frames</p>
          <h2 id="bx-h-speed" className="bx-h"><span>{s.g}.</span> <em>{s.lede}</em></h2>
          <p className="bx-ch__sub">{s.sub}</p>
        </header>
      </div>
      <div className="bx-fill" aria-hidden="true" style={{ backgroundImage: `url(${img('kart-pov')})` }}>SPEED</div>
      <div className="container">
        <div className="bx-hud">
          <div className="bx-hud__p bx-hud__map">
            <p className="bx-hud__t"><span>Circuit</span><span className="bx-live-dot">Live</span></p>
            <svg viewBox="0 0 500 230" aria-hidden="true">
              <path d={TRACK} className="bx-trk__road" />
              <path id="bx-trk" d={TRACK} className="bx-trk__line" />
              <circle className="bx-trk__car" r="7" cx="70" cy="150" />
              {[[160, 50, 'S1'], [430, 60, 'S2'], [200, 185, 'S3']].map(([x, y, l]) => <g key={l} transform={`translate(${x} ${y})`}><circle r="4" className="bx-trk__s" /><text y="-12" textAnchor="middle">{l}</text></g>)}
            </svg>
          </div>
          <div className="bx-hud__p bx-hud__gauge">
            <p className="bx-hud__t"><span>Speed</span><span>km/h</span></p>
            <svg viewBox="0 0 220 130" aria-hidden="true">
              <path d="M 20 120 A 90 90 0 0 1 200 120" className="bx-g__t" />
              <path d="M 20 120 A 90 90 0 0 1 200 120" className="bx-g__v" />
              {Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (1 - i / 10); return <line key={i} x1={110 + Math.cos(a) * 78} y1={120 - Math.sin(a) * 78} x2={110 + Math.cos(a) * 70} y2={120 - Math.sin(a) * 70} className="bx-g__tick" /> })}
              <g className="bx-g__n"><line x1="110" y1="120" x2="110" y2="46" /><circle cx="110" cy="120" r="6" /></g>
            </svg>
            <b className="bx-hud__num" data-num="64">0</b>
          </div>
          <div className="bx-hud__p bx-hud__laps">
            <p className="bx-hud__t"><span>Lap</span><span className="bx-lap">0:00.000</span></p>
            <ul>{['Sector 1', 'Sector 2', 'Sector 3'].map((x, k) => <li key={x}><span>{x}</span><i><b style={{ width: `${[78, 61, 88][k]}%` }} /></i><em>{['purple', 'green', 'yellow'][k]}</em></li>)}</ul>
          </div>
          <p className="bx-note">Illustrated telemetry · for the love of racing</p>
        </div>
        <div className="bx-speed__ph">
          {[0, 2, 3].map((n) => (
            <figure key={L[n].src} className="bx-shot">
              <span className="bx-shot__in"><img src={img(L[n].src)} width={L[n].w} height="998" alt={ALT[L[n].src]} loading="lazy" decoding="async" /></span>
              <i className="bx-br" aria-hidden="true" />
              <figcaption>{L[n].cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Live() {
  const L = photosOf('Live')
  const s = scene('Live')
  return (
    <section id="scene-live" className="bx-ch bx-live" aria-labelledby="bx-h-live" data-chapter="03 Live">
      <div className="bx-lasers" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
      <div className="container">
        <header className="bx-ch__head">
          <p className="bx-ch__k"><b>03</b>Chapter · {L.length} frames</p>
          <h2 id="bx-h-live" className="bx-h"><span>{s.g}.</span> <em>{s.lede}</em></h2>
          <p className="bx-ch__sub">{s.sub}</p>
        </header>
        <div className="bx-eq" aria-hidden="true">{Array.from({ length: 48 }, (_, k) => <i key={k} style={{ '--k': k, '--d': `${0.7 + ((k * 37) % 11) / 10}s` }} />)}</div>
        <div className="bx-live__row">
          {L.map((p, k) => (
            <figure key={p.src} className="bx-stage" style={{ '--r': `${[-2, 1.5, -1, 2][k]}deg` }}>
              <span className="bx-stage__in"><img src={img(p.src)} width={p.w} height="998" alt={ALT[p.src]} loading="lazy" decoding="async" /></span>
              <figcaption><b>0{k + 1}</b>{p.cap}</figcaption>
            </figure>
          ))}
        </div>
        <p className="bx-note">Visual rhythm study · no audio plays</p>
      </div>
      <div className="bx-marquee" aria-hidden="true"><div>{[0, 1].map((r) => <span key={r}>{L.map((p) => <em key={p.src}>{p.cap.replace('.', '')} <b>✶</b></em>)}</span>)}</div></div>
    </section>
  )
}

function Read() {
  return (
    <section id="scene-read" className="bx-ch bx-read" aria-labelledby="bx-h-read" data-chapter="04 Read">
      <div className="container bx-read__in">
        <div className="bx-read__stage"><Book className="book--page" /><span className="bx-read__shadow" aria-hidden="true" /></div>
        <div className="bx-read__copy">
          <p className="bx-ch__k"><b>04</b>Chapter · On the shelf</p>
          <h2 id="bx-h-read" className="bx-h"><span>Read.</span> <em>What’s on the shelf.</em></h2>
          <ul className="bx-shelf">
            {SHELF.map((b) => (
              <li key={b.t}>
                <small>{b.p}</small>
                <b>{b.t}</b>
                <em>{b.s}</em>
                <span>{b.a}</span>
              </li>
            ))}
          </ul>
          <p className="bx-note">Cover drawn for this page, not the publisher’s design</p>
        </div>
      </div>
    </section>
  )
}

/** Dot-matrix art: an abstract field of dots, sized by a shape function. Nothing figurative. */
function DotArt({ kind }) {
  const cols = 34, rows = 24, dots = []
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = c / (cols - 1) - 0.5, y = r / (rows - 1) - 0.5
    let v
    if (kind === 'orbit') { const d = Math.hypot(x * 1.25 + 0.12, y + 0.05); v = (Math.cos(d * 34) * 0.5 + 0.5) * Math.exp(-(d * d) / 0.09) }
    else { v = Math.max(0, Math.sin(x * 14 + Math.sin(y * 6) * 2) * 0.5 + 0.5) * Math.exp(-(y * y) / 0.08) }
    dots.push([c, r, Math.min(1, v)])
  }
  return (
    <svg className="bx-dots" viewBox={`0 0 ${cols * 10} ${rows * 10}`} aria-hidden="true">
      {dots.map(([c, r, v]) => <circle key={`${c}-${r}`} cx={c * 10 + 5} cy={r * 10 + 5} r={0.9 + v * 3.6} style={{ opacity: 0.35 + v * 0.65 }} />)}
    </svg>
  )
}

function Watch() {
  const panels = [
    ['kart-pov', 'Eyes on the apex.'], ['kart-night', 'Night session.'], ['paddle', 'Golden hour, flat water.'], ['rainier', 'A mountain worth the drive.'],
  ]
  return (
    <section id="scene-watch" className="bx-ch bx-watch" aria-labelledby="bx-h-watch" data-chapter="05 Watch">
      <div className="bx-watch__v" aria-hidden="true">WATCHLIST</div>
      <div className="container bx-watch__in">
        <header className="bx-ch__head">
          <p className="bx-ch__k"><b>05</b>Chapter · Watchlist</p>
          <h2 id="bx-h-watch" className="bx-h"><span>Watch.</span> <em>Mecha, strategy and one more episode.</em></h2>
        </header>
        <div className="bx-manga">
          {panels.map(([src, cap], k) => (
            <figure key={src} className={`bx-panel bx-panel--${k}`}>
              <img src={`/img/manga/${src}.png`} alt={`${ALT[src]}, redrawn as a manga panel`} loading="lazy" decoding="async" />
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
        <p className="bx-note bx-note--ink">Panels: my own photographs, inked and screentoned</p>
        <ul className="bx-wl">
          {WATCHLIST.map((w) => (
            <li key={w.t} className="bx-wl__c">
              <div className="bx-wl__art"><DotArt kind={w.art} /></div>
              <div className="bx-wl__b">
                <h3>{w.t}{w.s && <small>{w.s}</small>}</h3>
                <ul>{[w.k, w.n].map((x) => <li key={x}>{x}.</li>)}</ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Beyond() {
  const root = useRef(null)
  const intro = useRef(null)
  const [film, setFilm] = useState(false)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(root.current)
      // Hero entry: panels rise, the title assembles from a scatter, the index slides in. Plays after the film, or at once.
      const t = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      t.fromTo(q('.bx-tri__p'), { yPercent: 104 }, { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'expo.inOut' }, 0)
        .fromTo(q('.bx-tri__p img'), { scale: 1.35 }, { scale: 1, duration: 1.8 }, 0.2)
        .fromTo(q('.bx-title .bx-li'), { yPercent: (i) => (i % 2 ? -120 : 120), rotate: (i) => (i % 3 - 1) * 8, autoAlpha: 0 }, { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 1, stagger: 0.035 }, 0.55)
        .fromTo(q('.bx-hero__top > *, .bx-hero__lede, .bx-index > *'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05 }, 1.0)
      intro.current = t
      // Headings: the display half rises out of a mask, the serif half follows.
      q('.bx-h').forEach((h) => gsap.fromTo(h.children, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%', once: true } }))
      // Giant chapter words drift against the scroll.
      q('.bx-ch__big, .bx-watch__v').forEach((el) => gsap.fromTo(el, { xPercent: 8 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }))
      // Wander: the route draws itself, pins drop in as the line reaches them.
      const line = q('.bx-route__line')[0]
      if (line) {
        const pins = q('.bx-route__pins li')
        gsap.set(pins, { autoAlpha: 0, y: -10 })
        gsap.fromTo(line, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: '.bx-route', start: 'top 80%', end: 'bottom 45%', scrub: 0.6,
          onUpdate: (st) => pins.forEach((p, k) => { const on = st.progress > 0.06 + k * (0.88 / (pins.length - 1)) - 0.02; if (on !== !!p._on) { p._on = on; gsap.to(p, { autoAlpha: on ? 1 : 0, y: on ? 0 : -10, duration: 0.35, ease: 'back.out(2)' }) } }) } })
      }
      // Speed: the photograph slides inside the letters; the car laps the circuit while the panel is on screen.
      const fill = q('.bx-fill')[0]
      if (fill) gsap.fromTo(fill, { backgroundPosition: '50% 48%' }, { backgroundPosition: '50% 88%', ease: 'none', scrollTrigger: { trigger: fill, start: 'top bottom', end: 'bottom top', scrub: true } })
      const car = q('.bx-trk__car')[0]
      if (car) {
        const lap = gsap.to(car, { motionPath: { path: q('#bx-trk')[0], align: q('#bx-trk')[0], alignOrigin: [0.5, 0.5] }, duration: 5, repeat: -1, ease: 'none', paused: true })
        const clock = { t: 0 }, lt = q('.bx-lap')[0]
        const timer = gsap.to(clock, { t: 5, duration: 5, repeat: -1, ease: 'none', paused: true, onUpdate: () => { const s = 58 + clock.t * 1.37; lt.textContent = `${Math.floor(s / 60)}:${(s % 60).toFixed(3).padStart(6, '0')}` } })
        ScrollTrigger.create({ trigger: '.bx-hud', start: 'top bottom', end: 'bottom top', onToggle: (st) => { lap[st.isActive ? 'play' : 'pause'](); timer[st.isActive ? 'play' : 'pause']() } })
        const num = q('.bx-hud__num')[0], o = { v: 0 }
        gsap.timeline({ scrollTrigger: { trigger: '.bx-hud', start: 'top 80%', once: true } })
          .fromTo(q('.bx-g__n'), { rotation: -90, svgOrigin: '110 120' }, { rotation: 52, svgOrigin: '110 120', duration: 1.6, ease: 'elastic.out(1, 0.55)' }, 0)
          .fromTo(q('.bx-g__v'), { drawSVG: '0%' }, { drawSVG: '79%', duration: 1.4, ease: 'expo.out' }, 0)
          .to(o, { v: Number(num.dataset.num), duration: 1.4, ease: 'expo.out', onUpdate: () => { num.textContent = Math.round(o.v) } }, 0)
          .fromTo(q('.bx-hud__laps b'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.12, ease: 'expo.out' }, 0.2)
      }
      q('.bx-shot').forEach((f) => gsap.fromTo(f.querySelector('.bx-shot__in'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'expo.inOut', scrollTrigger: { trigger: f, start: 'top 88%', once: true } }))
      // Live: each photograph strobes on, like a stage light catching it.
      q('.bx-stage').forEach((f, k) => gsap.fromTo(f, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'steps(6)', delay: k * 0.08, scrollTrigger: { trigger: f, start: 'top 90%', once: true } }))
      // Read: the book turns as you pass it.
      const book = q('.book--page')[0]
      if (book) gsap.fromTo(book, { rotateY: -42, rotateX: 8 }, { rotateY: 18, rotateX: -4, ease: 'none', scrollTrigger: { trigger: '.bx-read', start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
      // Watch: panels slam in, one after another.
      gsap.fromTo(q('.bx-panel'), { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.7, stagger: 0.14, ease: 'expo.inOut', scrollTrigger: { trigger: '.bx-manga', start: 'top 75%', once: true } })
      gsap.fromTo(q('.bx-dots circle'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: { each: 0.0015, from: 'random' }, scrollTrigger: { trigger: '.bx-wl', start: 'top 85%', once: true } })
      // The chapter readout on the right edge.
      const hud = q('.bx-chhud b')[0]
      q('[data-chapter]').forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: (st) => { if (st.isActive && hud) hud.textContent = s.dataset.chapter } }))
      ScrollTrigger.create({ trigger: '.bx-wander', start: 'top 55%', endTrigger: '.bx-watch', end: 'bottom 55%', toggleClass: { targets: q('.bx-chhud')[0], className: 'is-on' } })
    })
    // Wander's roll scrolls sideways while the page is pinned, on screens big enough to pin.
    mm.add(`${MQ.motion} and (min-width: 900px)`, () => {
      const track = root.current.querySelector('.bx-reel__track')
      if (!track) return
      const dist = () => track.scrollWidth - window.innerWidth + 64
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.bx-reel', start: 'center center', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } })
    })
    return () => mm.revert()
  }, { scope: root })

  // Once per visit, unless motion is reduced or a test runner is driving the page. Decided before first paint.
  useLayoutEffect(() => {
    let seen = true
    try { seen = sessionStorage.getItem('at-beyond-film') === '1' } catch { /* storage blocked: treat as seen */ }
    const ok = window.matchMedia(MQ.motion).matches && !window.__OI_TEST__
    if (!seen && ok) { try { sessionStorage.setItem('at-beyond-film', '1') } catch { /* ignore */ } setFilm(true) }
    else intro.current?.play()
  }, [])

  const replay = () => { intro.current?.pause(0); setFilm(true) }

  return (
    <PageMotion routeKey="/beyond">
      <div ref={root} className="bx">
        {film && <BeyondFilm onDone={() => { setFilm(false); intro.current?.play(0); ScrollTrigger.refresh() }} />}
        <header className="bx-hero" aria-labelledby="bx-h1">
          <div className="bx-tri">
            {COVERS.map(([src, g, line], k) => (
              <a key={src} className="bx-tri__p" href={`#scene-${g.toLowerCase()}`}>
                <span className="bx-tri__clip"><img src={img(src)} alt={ALT[src]} fetchpriority={k === 0 ? 'high' : undefined} /></span>
                <span className="bx-tri__l"><b>0{k + 1}</b>{g}<small>{line}</small></span>
              </a>
            ))}
          </div>
          <div className="bx-hero__shade" aria-hidden="true" />
          <h1 id="bx-h1" className="sr-only">Beyond work: off the clock</h1>
          <div className="bx-title" aria-hidden="true"><Split text="OFF THE" className="bx-title__a" /><Split text="CLOCK" className="bx-title__b" /></div>
          <div className="bx-hero__top">
            <span>Anjor / beyond work</span>
            <button type="button" className="bx-replay" onClick={replay}><Icon name="arrow" size={13} />Replay the film</button>
          </div>
          <p className="bx-hero__lede">Some of the best stories happen <em>outside the roadmap.</em></p>
          <nav className="bx-index" aria-label="Chapters">
            {CHAPTERS.map((c) => <a key={c.id} href={`#scene-${c.id}`}><b>{c.k}</b>{c.name}</a>)}
          </nav>
        </header>

        <p className="bx-chhud" aria-hidden="true"><i /><b>01 Wander</b></p>

        <section className="bx-intro">
          <div className="container">
            <p className="bx-intro__k">The person behind the product</p>
            <p className="bx-intro__s">A little less planned. <em>A lot more alive.</em> Water, mountains and back roads. Karts, a racing sim and the apex. Lights, lasers and a full room. A book on the shelf, and an anime queued for later.</p>
          </div>
        </section>

        <Wander />
        <Speed />
        <Live />
        <Read />
        <Watch />

        <section id="radar" className="bx-radar" aria-labelledby="bx-h-radar">
          <div className="container">
            <p className="bx-ch__k"><b>06</b>Curiosity doesn’t switch off when the working day ends</p>
            <h2 id="bx-h-radar" className="bx-h"><span>Always something</span> <em>on the radar.</em></h2>
            <ol className="bx-radar__l">
              {LOVES.map(([a, b], k) => <li key={a} data-reveal><span>{String(k + 1).padStart(2, '0')}</span><b>{a}</b><p>{b}</p></li>)}
            </ol>
          </div>
        </section>
        <Cta title="Say hello *about anything.*" lead="A kart track, a gig, a book, a product problem. All fair game." primary={{ label: 'Say hello', to: '/contact#brief' }} secondary={{ label: 'See where I fit', to: '/hire' }} />
      </div>
    </PageMotion>
  )
}
