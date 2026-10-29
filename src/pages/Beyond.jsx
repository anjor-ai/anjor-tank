import { useLayoutEffect, useRef, useState } from 'react'
import { ALT } from '../content'
import { Cta } from '../components/ui'
import { Icon } from '../components/icons'
import BeyondFilm from '../scenes/BeyondFilm'
import { MQ, gsap, ScrollTrigger, useGSAP } from '../lib/motion'
import { Intro, Live, Play, Radar, Read, Speed, Wander, Watch, img } from '../components/beyond'
import { PageMotion } from '../lib/PageMotion'

/* Beyond work. The hero is its own room: dark, photographic, condensed display type, opened by a short film
   (scenes/BeyondFilm) once per visit. The chapters after it share one card system (components/beyond.jsx)
   and follow the site's theme. Decorative display words are aria-hidden; the real headings carry the meaning. */

const CHAPTERS = [
  { id: 'wander', k: '01', name: 'Wander' },
  { id: 'speed', k: '02', name: 'Speed' },
  { id: 'live', k: '03', name: 'Live' },
  { id: 'read', k: '04', name: 'Read' },
  { id: 'watch', k: '05', name: 'Watch' },
  { id: 'play', k: '06', name: 'Play' },
]
const COVERS = [['rainier', 'Wander', 'The long way'], ['kart-pov', 'Speed', 'The next apex'], ['laser', 'Live', 'One more set']]

const Split = ({ text, className }) => <span className={className} aria-hidden="true">{text.split('').map((c, k) => <span key={k} className="bx-lm"><span className="bx-li">{c === ' ' ? ' ' : c}</span></span>)}</span>

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
      const once = (trigger, start = 'top 85%') => ({ trigger, start, toggleActions: 'play none none none' })
      // Chapters do not reveal themselves: only the drawn things move (the route, the lap, the book).
      // Wander: the route draws itself once the card is in view.
      q('.by-route__line').forEach((l) => gsap.fromTo(l, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.8, ease: 'eInOut', scrollTrigger: once(l, 'top 90%') }))
      // Speed: the car laps the circuit while the tile is on screen; the line draws first.
      const car = q('.by-circuit__car')[0], trk = q('#by-trk')[0]
      if (car && trk) {
        gsap.fromTo(trk, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'eInOut', scrollTrigger: once(trk, 'top 90%') })
        const lap = gsap.to(car, { motionPath: { path: trk, align: trk, alignOrigin: [0.5, 0.5] }, duration: 6, repeat: -1, ease: 'none', paused: true })
        ScrollTrigger.create({ trigger: trk, start: 'top bottom', end: 'bottom top', onToggle: (st) => (st.isActive ? lap.play() : lap.pause()) })
      }
      // Read: the book turns as you pass it.
      const book = q('.book--page')[0]
      if (book) gsap.fromTo(book, { rotateY: -42, rotateX: 8 }, { rotateY: 18, rotateX: -4, ease: 'none', scrollTrigger: { trigger: '.by-read', start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
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

        <Intro />

        <Wander />
        <Speed />
        <Live />
        <Read />
        <Watch />
        <Play />
        <Radar />
        <Cta title="Say hello *about ==anything==.*" lead="A kart track, a gig, a book, a product problem. All fair game." primary={{ label: 'Say hello', to: '/contact#brief' }} secondary={{ label: 'See where I fit', to: '/hire' }} />
      </div>
    </PageMotion>
  )
}
