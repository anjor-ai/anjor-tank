import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ALT } from '../content'
import { gsap } from '../lib/motion'

/* The Beyond-work opener. A short film in five cuts, one per chapter, shot like a camera roll:
   eyelids open into a letterbox, each cut is a photograph in a card with its word passing behind it (solid) and over it (outline),
   the colour of the room changes per chapter, a timecode runs, and the lids close on the last frame to hand over to the page.
   Click, Escape or "Skip" ends it at once. It never mounts under reduced motion (the page decides). */

export const CUTS = [
  { w: 'WANDER', k: '01', cap: 'Finding the longer route.', img: '/img/adventure/rainier.webp', alt: ALT.rainier, tone: 'wander' },
  { w: 'SPEED', k: '02', cap: 'Chasing a better lap.', img: '/img/adventure/kart-pov.webp', alt: ALT['kart-pov'], tone: 'speed' },
  { w: 'LIVE', k: '03', cap: 'Listening to something loud.', img: '/img/adventure/laser.webp', alt: ALT.laser, tone: 'live' },
  { w: 'READ', k: '04', cap: 'On the shelf.', book: true, tone: 'read' },
  { w: 'WATCH', k: '05', cap: 'Gundam, Code Geass, one more episode.', img: '/img/manga/kart-night.png', alt: 'My own night-session photo, inked as a manga panel', tone: 'watch' },
]

const Letters = ({ w, className }) => (
  <p className={className} aria-hidden="true">{w.split('').map((c, k) => <span key={k} className="bf__lm"><span className="bf__li">{c}</span></span>)}</p>
)

/** A small original book object, drawn in CSS. Used in the film and on the page. */
export function Book({ className = '' }) {
  return (
    <div className={`book ${className}`} aria-hidden="true">
      <div className="book__front">
        <span className="book__lat">{Array.from({ length: 30 }, (_, k) => <i key={k} style={{ '--k': k }} />)}</span>
        <b>AI<br />ENGINEERING</b>
        <em>Building Applications with Foundation Models</em>
        <small>Chip Huyen</small>
      </div>
      <div className="book__spine"><span>AI ENGINEERING · CHIP HUYEN</span></div>
      <div className="book__pages" />
    </div>
  )
}

export default function BeyondFilm({ onDone }) {
  const ref = useRef(null)
  const tl = useRef(null)
  const left = useRef(false)

  const finish = () => {
    if (left.current) return
    left.current = true
    tl.current?.pause()
    const q = gsap.utils.selector(ref)
    gsap.timeline({ onComplete: onDone })
      .to(q('.bf__lid'), { height: '50.5%', duration: 0.35, ease: 'expo.in' })
      .to(ref.current, { autoAlpha: 0, duration: 0.25, ease: 'none' })
  }

  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.add('rq-lock')
    const key = (e) => { if (e.key === 'Escape') finish() }
    window.addEventListener('keydown', key)
    const q = gsap.utils.selector(ref)
    const ctx = gsap.context(() => {
      const t = gsap.timeline()
      tl.current = t
      const tc = q('.bf__tc')[0]
      const clock = { f: 0 }
      gsap.set(q('.bf__cut'), { autoAlpha: 0 })
      gsap.set(q('.bf__lid'), { height: '50.5%' })
      t.to(clock, { f: 6.2 * 24, duration: 6.2, ease: 'none', onUpdate: () => {
        const f = Math.floor(clock.f); tc.textContent = `00:00:${String(Math.floor(f / 24)).padStart(2, '0')}:${String(f % 24).padStart(2, '0')}`
      } }, 0)
      // The eyelids open into a letterbox.
      t.to(q('.bf__lid'), { height: '9vh', duration: 0.7, ease: 'expo.inOut' }, 0.05)
        .fromTo(q('.bf__hud > *'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.05 }, 0.45)
      const D = 0.86, S = 0.42
      CUTS.forEach((c, k) => {
        const at = S + k * D, cut = q(`.bf__cut--${k}`)
        const from = k % 2 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)'
        t.set(cut, { autoAlpha: 1 }, at)
          .set(q('.bf__room')[0], { attr: { 'data-tone': c.tone } }, at)
          .fromTo(q(`.bf__cut--${k} .bf__card`), { clipPath: k ? from : 'inset(50% 0% 50% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'expo.out' }, at)
          .fromTo(q(`.bf__cut--${k} .bf__card img, .bf__cut--${k} .bf__card .book`), { scale: 1.28 }, { scale: 1.04, duration: 1.3, ease: 'expo.out' }, at)
          .fromTo(q(`.bf__cut--${k} .bf__li`), { yPercent: k % 2 ? -110 : 110 }, { yPercent: 0, duration: 0.55, ease: 'expo.out', stagger: 0.035 }, at + 0.04)
          .fromTo(q(`.bf__cut--${k} .bf__cap`), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.18)
        if (c.tone === 'speed') t.fromTo(q('.bf__streak'), { scaleX: 0, xPercent: -40 }, { scaleX: 1, xPercent: 40, duration: 0.6, ease: 'power3.out', stagger: 0.02 }, at)
        if (c.tone === 'live') t.fromTo(q('.bf__beam'), { rotate: (i) => -40 + i * 16, autoAlpha: 0 }, { rotate: (i) => -20 + i * 8, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, at)
          .fromTo(q('.bf__flash'), { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 0.25, ease: 'none' }, at + 0.3)
        if (c.tone === 'read') t.fromTo(q('.bf__cut--3 .book'), { rotateY: -55 }, { rotateY: -18, duration: 0.9, ease: 'expo.out' }, at)
        if (c.tone === 'watch') t.fromTo(q('.bf__burst'), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)' }, at)
        if (k) t.set(q(`.bf__cut--${k - 1}`), { autoAlpha: 0 }, at + 0.5)
      })
      t.call(finish, null, S + CUTS.length * D + 0.25)
    }, ref)
    return () => { ctx.revert(); html.classList.remove('rq-lock'); window.removeEventListener('keydown', key) }
  }, [])

  return createPortal(
    <div className="bf" ref={ref} onClick={finish} role="presentation">
      <div className="bf__room" data-tone="wander" />
      <div className="bf__tone" aria-hidden="true" />
      {CUTS.map((c, k) => (
        <div key={c.w} className={`bf__cut bf__cut--${k} bf__cut--${c.tone}`}>
          {c.tone === 'speed' && <div className="bf__streaks" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} className="bf__streak" style={{ top: `${18 + i * 8}%` }} />)}</div>}
          {c.tone === 'live' && <div className="bf__beams" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <i key={i} className="bf__beam" />)}<b className="bf__flash" /></div>}
          {c.tone === 'watch' && <div className="bf__burst" aria-hidden="true" />}
          <Letters w={c.w} className="bf__word" />
          <figure className="bf__card">{c.book ? <Book /> : <img src={c.img} alt="" />}</figure>
          <Letters w={c.w} className="bf__word bf__word--line" />
          <p className="bf__cap"><b>{c.k}</b>{c.cap}</p>
        </div>
      ))}
      <div className="bf__lid bf__lid--t" /><div className="bf__lid bf__lid--b" />
      <div className="bf__hud" aria-hidden="true">
        <span className="bf__hud-tl">Anjor / off the clock</span>
        <span className="bf__hud-tr"><i /> REC <b className="bf__tc">00:00:00:00</b></span>
        <span className="bf__hud-bl">Field notes · five chapters</span>
      </div>
      <button type="button" className="bf__skip" onClick={(e) => { e.stopPropagation(); finish() }}>Skip</button>
    </div>,
    document.body,
  )
}
