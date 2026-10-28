import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GAMES } from '../content'

/* ═══════════════════════════════════════════════════════════════════════════
   Beyond work as a lap. The page is a circuit: start lights before the first chapter, a stretch of track
   between every chapter (sector 1 to 6), a chequered finish before the radar, and a dashboard that rides
   along with the car's place on the circuit, the sector, and a speed read from how fast you scroll.
   The car is an original silhouette, no team or livery. Everything settles still under reduced motion.
   ═══════════════════════════════════════════════════════════════════════════ */

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A generic open-wheel car in profile. */
export function Car({ className }) {
  return (
    <svg className={className} viewBox="0 0 240 64" aria-hidden="true">
      <path className="car__body" d="M6 44 L40 40 L70 30 L104 28 L118 20 L150 20 L160 28 L196 30 L214 18 L232 18 L232 40 L196 42 L170 46 L60 48 L8 50 Z" />
      <path className="car__wing" d="M2 50 L36 50 L36 46 L2 46 Z M214 14 L236 14 L236 20 L214 20 Z" />
      <path className="car__halo" d="M118 20 C 124 10, 146 10, 152 20" />
      <circle className="car__tyre" cx="58" cy="48" r="13" /><circle className="car__hub" cx="58" cy="48" r="4" />
      <circle className="car__tyre" cx="188" cy="46" r="15" /><circle className="car__hub" cx="188" cy="46" r="5" />
      <path className="car__stripe" d="M70 34 L170 32" />
    </svg>
  )
}

/** Five lights come on, one by one, then all go out. Fires `race:go` on the window when they go out. */
export function StartLights() {
  const ref = useRef(null)
  const [n, setN] = useState(0) // 0..5 lit, 6 = out
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (reduced()) { setN(6); return undefined }
    let timers = []
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || timers.length) return
      for (let k = 1; k <= 5; k++) timers.push(setTimeout(() => setN(k), k * 520))
      timers.push(setTimeout(() => { setN(6); window.dispatchEvent(new Event('race:go')) }, 5 * 520 + 700 + Math.random() * 500))
    }, { threshold: 0.6 })
    io.observe(el)
    return () => { io.disconnect(); timers.forEach(clearTimeout) }
  }, [])
  return (
    <div ref={ref} className={`sl${n === 6 ? ' is-out' : ''}`} aria-label={n === 6 ? 'Lights out' : 'Start lights'}>
      <div className="sl__gantry">{[1, 2, 3, 4, 5].map((k) => <span key={k} className={`sl__pod${n >= k && n < 6 ? ' is-on' : ''}`}><i /><i /></span>)}</div>
      <p className="sl__msg"><b>{n === 6 ? 'Lights out.' : n ? 'Wait for it.' : 'Grid ready.'}</b><span>Six sectors, one lap. Scroll is the throttle.</span></p>
    </div>
  )
}

/** A stretch of track between chapters: kerbs, the racing line, and the car crossing as you scroll past. */
export function TrackBand({ sector, name }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return undefined
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect(), vh = window.innerHeight
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
        el.style.setProperty('--p', p.toFixed(4))
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on) }
  }, [])
  return (
    <div ref={ref} className="tb" data-sector={sector} aria-hidden="true" style={{ '--p': 0.5 }}>
      <span className="tb__kerb tb__kerb--t" />
      <div className="tb__road">
        <span className="tb__line" />
        <span className="tb__label"><b>S{sector}</b>{name}</span>
        <span className="tb__streaks">{Array.from({ length: 7 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</span>
        <Car className="tb__car" />
      </div>
      <span className="tb__kerb tb__kerb--b" />
    </div>
  )
}

/** The chequered finish before the radar. */
export function Finish() {
  return (
    <div className="fin" aria-hidden="true">
      <span className="fin__flag" />
      <p><b>Finish.</b> Lap complete.</p>
      <span className="fin__flag" />
    </div>
  )
}

const CIRCUIT = 'M 30 70 C 20 40, 46 18, 80 22 S 128 46, 150 34 S 196 10, 214 30 S 212 74, 176 80 S 110 70, 86 88 S 40 100, 30 70 Z'

/** The dashboard that rides along: circuit position, sector, speed from scroll velocity, gear and lap time. */
export function RaceHud({ sectors }) {
  // Portalled to the body: the page wrapper animates its transform on route change, which would pin a fixed child to it.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return mounted ? createPortal(<Hud sectors={sectors} />, document.body) : null
}

function Hud({ sectors }) {
  const ref = useRef(null)
  const path = useRef(null)
  useEffect(() => {
    const el = ref.current, pth = path.current
    if (!el || !pth) return undefined
    const car = el.querySelector('.rh__car'), spd = el.querySelector('.rh__spd b'), gear = el.querySelector('.rh__gear b'), sec = el.querySelector('.rh__sec b'), sname = el.querySelector('.rh__sec span'), lap = el.querySelector('.rh__lap b'), bar = el.querySelector('.rh__rev i')
    const L = pth.getTotalLength()
    let lastY = window.scrollY, lastT = performance.now(), v = 0, raf = 0, go = 0, shown = false
    const start = () => { if (!go) go = performance.now() }
    window.addEventListener('race:go', start)
    const tick = (now) => {
      const y = window.scrollY, dt = Math.max(1, now - lastT)
      const inst = Math.abs(y - lastY) / dt // px per ms
      v += (inst - v) * 0.12
      lastY = y; lastT = now
      const root = document.querySelector('.bx')
      const first = document.getElementById('scene-wander'), fin = document.querySelector('.fin')
      if (root && first && fin) {
        const a = first.getBoundingClientRect().top + y - window.innerHeight * 0.6
        const b = fin.getBoundingClientRect().top + y - window.innerHeight * 0.6
        const p = Math.min(1, Math.max(0, (y - a) / (b - a)))
        const on = y > a - 200 && y < b + window.innerHeight * 0.3
        if (on !== shown) { shown = on; el.classList.toggle('is-on', on) }
        const pt = pth.getPointAtLength(p * L)
        car.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`)
        const kmh = Math.min(340, Math.round(v * 140))
        spd.textContent = String(kmh).padStart(3, '0')
        gear.textContent = kmh < 8 ? 'N' : String(Math.min(8, 1 + Math.floor(kmh / 45)))
        bar.style.transform = `scaleX(${Math.min(1, (kmh % 45) / 45 + (kmh > 300 ? 1 : 0)).toFixed(3)})`
        const k = Math.min(sectors.length - 1, Math.floor(p * sectors.length))
        sec.textContent = `S${k + 1}`; sname.textContent = sectors[k]
        if (go) { const s = (now - go) / 1000; lap.textContent = `${Math.floor(s / 60)}:${(s % 60).toFixed(3).padStart(6, '0')}` }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('race:go', start) }
  }, [sectors])
  return (
    <div ref={ref} className="rh" aria-hidden="true">
      <svg className="rh__map" viewBox="0 0 240 110">
        <path className="rh__road" d={CIRCUIT} />
        <path ref={path} className="rh__line" d={CIRCUIT} />
        <g className="rh__car"><circle r="8" className="rh__glow" /><circle r="4.5" /></g>
      </svg>
      <div className="rh__read">
        <p className="rh__sec"><b>S1</b><span>{sectors[0]}</span></p>
        <p className="rh__spd"><b>000</b><small>km/h</small></p>
        <p className="rh__gear"><small>Gear</small><b>N</b></p>
        <span className="rh__rev"><i /></span>
        <p className="rh__lap"><small>Lap</small><b>0:00.000</b></p>
      </div>
    </div>
  )
}

const CATS = ['All', 'Action', 'Shooter', 'RPG', 'Horror', 'Strategy']
const clock = () => new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false })

/** The console: a home screen in the manner of a games console. One game featured large with its facts,
    category tabs that filter the shelf, a shelf of fifteen, and a dock. Hover or focus picks; it also cycles on its own. */
export function Play() {
  const [cat, setCat] = useState('All')
  const list = GAMES.filter((g) => cat === 'All' || g.c === cat)
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  const [time, setTime] = useState('')
  const ref = useRef(null)
  const shelf = useRef(null)
  const g = list[Math.min(i, list.length - 1)]
  useEffect(() => { setTime(clock()); const t = setInterval(() => setTime(clock()), 30000); return () => clearInterval(t) }, [])
  useEffect(() => { setI(0) }, [cat])
  useEffect(() => {
    if (hold || reduced()) return undefined
    const el = ref.current
    let vis = false
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting }, { threshold: 0.3 })
    io.observe(el)
    const t = setInterval(() => { if (vis) setI((n) => (n + 1) % list.length) }, 4200)
    return () => { clearInterval(t); io.disconnect() }
  }, [hold, list.length])
  useEffect(() => {
    const s = shelf.current, b = s?.children[i]
    if (s && b) s.scrollTo({ left: b.offsetLeft - 40, behavior: reduced() ? 'auto' : 'smooth' })
  }, [i, cat])
  const move = (d) => setI((n) => (n + d + list.length) % list.length)
  return (
    <section id="scene-play" ref={ref} className="bx-ch bx-play" aria-labelledby="bx-h-play" data-chapter="06 Play">
      <div className="container">
        <header className="bx-ch__head ps__head">
          <p className="bx-ch__k"><b>06</b>Chapter · {GAMES.length} on the shelf</p>
          <h2 id="bx-h-play" className="bx-h"><span>Play.</span> <em>One more save before bed.</em></h2>
        </header>
      </div>
      <div className="ps" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
        <div className="ps__bg" aria-hidden="true">{GAMES.map((x) => <img key={x.slug} src={`/img/games/${x.slug}.webp`} alt="" loading="lazy" decoding="async" className={x.slug === g.slug ? 'is-on' : ''} />)}<span className="ps__scan" /></div>
        <div className="ps__status" aria-hidden="true">
          <span>{time || '--:--'}</span>
          <span className="ps__icons"><i className="ps__ic ps__ic--wifi" /><i className="ps__ic ps__ic--bell" /><i className="ps__ic ps__ic--pad" /></span>
          <span className="ps__user"><b>AT</b>Anjor</span>
        </div>
        <nav className="ps__tabs" aria-label="Filter games by category">
          {CATS.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}<small>{c === 'All' ? GAMES.length : GAMES.filter((x) => x.c === c).length}</small></button>)}
        </nav>
        <div className="ps__feat" aria-live="polite">
          <div className="ps__copy">
            <p className="ps__tag">{cat === 'All' ? 'In my library' : cat}</p>
            <h3 key={g.slug} className="ps__t">{g.t}</h3>
            <dl className="ps__facts">
              <div><dt>Genre</dt><dd>{g.g}</dd></div>
              <div><dt>Studio</dt><dd>{g.st}</dd></div>
              <div><dt>First released</dt><dd>{g.y}</dd></div>
            </dl>
          </div>
          <div className="ps__start">
            <p><span>Shelf position</span><b>{String(GAMES.indexOf(g) + 1).padStart(2, '0')} / {GAMES.length}</b></p>
            <span className="ps__prog"><i key={g.slug + hold} className={hold ? 'is-held' : ''} /></span>
            <div className="ps__nav">
              <button type="button" onClick={() => move(-1)} aria-label="Previous game">‹</button>
              <button type="button" className="ps__next" onClick={() => move(1)}>Next title <span aria-hidden="true">›</span></button>
            </div>
          </div>
        </div>
        <div ref={shelf} className="ps__shelf" role="group" aria-label="Games I play">
          {list.map((x, k) => (
            <button key={x.slug} type="button" className={`ps__tile${k === i ? ' is-on' : ''}`} aria-pressed={k === i} onClick={() => setI(k)} onMouseEnter={() => setI(k)} onFocus={() => setI(k)}>
              <span className="ps__art"><img src={`/img/games/${x.slug}.webp`} alt="" loading="lazy" decoding="async" /><b>{x.t}</b></span>
              <span className="ps__cap">{x.c}</span>
            </button>
          ))}
        </div>
        <div className="ps__dock" aria-hidden="true">{['◆', '♪', '◎', '⌂', '☺', '⚙', '⏻'].map((d, k) => <i key={k} className={k === 3 ? 'is-on' : ''}>{d}</i>)}</div>
      </div>
      <div className="container"><p className="bx-note">Cover art is original and abstract, made for this page. No official artwork is used.</p></div>
    </section>
  )
}
