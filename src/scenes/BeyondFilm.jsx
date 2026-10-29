import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from '../lib/motion'

/* ═══════════════════════════════════════════════════════════════════════════
   The Beyond-work opener: a short film, about ten seconds, with no captions.
   It starts on a Formula 1 grid: five red lights come on one by one, then lights out. Six chapters follow, cut with
   whip-pans and light leaks under letterbox bars and film grain. Each is a full-bleed photograph pushing in, its word
   driving across the frame and a material of its own: a route line over the mountain, speed streaks, strobes on the
   beat, a book turning, a screentone panel, save slots flickering. It ends on a montage that assembles OFF THE CLOCK,
   then the bars close and hand over to the page. Click, Escape or "Skip" ends it at once. Never mounts under reduced
   motion.
   All photographs are Anjor's own; the game tiles are original abstract art.
   ═══════════════════════════════════════════════════════════════════════════ */

const A = (s) => `/img/adventure/${s}.webp`
export const CUTS = [
  { w: 'WANDER', img: A('rainier'), fx: 'route' },
  { w: 'SPEED', img: A('kart-pov'), fx: 'speed' },
  { w: 'MUSIC', img: A('laser'), fx: 'live' },
  { w: 'READ', fx: 'read' },
  { w: 'WATCH', img: '/img/manga/kart-night.png', fx: 'watch' },
  { w: 'PLAY', fx: 'play' },
]
const MONTAGE = ['lake-overlook', 'kart-grid', 'festival', 'waterfall', 'f1-sim', 'stage-unreal', 'jeep', 'paddle'].map(A)
const GAMES = ['wuthering-waves', 'halo', 'god-of-war', 'assassins-creed', 'warframe', 'elden-ring', 'doom', 'ghost-of-tsushima', 'silent-hill'].map((g) => `/img/games/${g}.webp`)
const ROUTE = (() => {
  let d = ''
  for (let i = 0; i <= 80; i++) {
    const x = i / 80, y = 0.62 - 0.2 * Math.sin(x * 5.1 + 0.3) - 0.09 * Math.sin(x * 12.7 + 1) - 0.14 * x
    d += `${i ? 'L' : 'M'}${(x * 1000).toFixed(1)} ${(y * 200).toFixed(1)}`
  }
  return d
})()

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

const Word = ({ w }) => <p className="fx-word" aria-hidden="true">{w.split('').map((c, k) => (c === ' ' ? <span key={k} className="fx-word__sp" /> : <span key={k} className="fx-word__m"><span className="fx-word__c">{c}</span></span>))}</p>

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
      .to(q('.fx-bar'), { height: '50.5%', duration: 0.45, ease: 'expo.in' })
      .to(ref.current, { autoAlpha: 0, duration: 0.3, ease: 'none' })
  }

  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.add('rq-lock')
    const key = (e) => { if (e.key === 'Escape') finish() }
    window.addEventListener('keydown', key)
    const q = gsap.utils.selector(ref)
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.current = t
      gsap.set(q('.fx-shot, .fx-lights, .fx-end'), { autoAlpha: 0 })
      gsap.set(q('.fx-bar'), { height: '50.5%' })
      const END = 10.4
      // The bars part into a 2.39 letterbox on a dark grid: five red lights, one by one, then lights out.
      t.to(q('.fx-bar'), { height: '11.5vh', duration: 0.8, ease: 'expo.inOut' }, 0.05)
        .set(q('.fx-lights'), { autoAlpha: 1 }, 0.2)
        .fromTo(q('.fx-lights__col'), { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.04 }, 0.2)
      q('.fx-lights__col').forEach((c, k) => t.to(c, { className: 'fx-lights__col is-on', duration: 0.01 }, 0.55 + k * 0.22))
      t.to(q('.fx-lights__col'), { className: 'fx-lights__col', duration: 0.01 }, 1.75)
        .to(q('.fx-lights'), { autoAlpha: 0, duration: 0.08 }, 1.78)

      // Six chapters. Each: a whip-pan in, the photograph pushing in, the word driving across, its material.
      const S = 1.86, D = 1.18
      CUTS.forEach((c, k) => {
        const at = S + k * D, shot = q(`.fx-shot--${k}`), dir = k % 2 ? -1 : 1
        t.set(shot, { autoAlpha: 1 }, at)
          .fromTo(shot, { xPercent: 18 * dir, skewX: -8 * dir }, { xPercent: 0, skewX: 0, duration: 0.42, ease: 'expo.out' }, at)
          .fromTo(q(`.fx-shot--${k} .fx-bg`), { scale: 1.32 }, { scale: 1.06, duration: D + 0.4, ease: 'power2.out' }, at)
          .fromTo(q('.fx-leak'), { autoAlpha: 0.85, xPercent: -40 * dir }, { autoAlpha: 0, xPercent: 40 * dir, duration: 0.5, ease: 'power2.out', immediateRender: false }, at)
          .fromTo(q(`.fx-shot--${k} .fx-word__c`), { yPercent: 110 * dir, skewY: 8 * dir }, { yPercent: 0, skewY: 0, duration: 0.6, stagger: 0.03 }, at + 0.06)
          .fromTo(q(`.fx-shot--${k} .fx-word`), { xPercent: 6 * dir }, { xPercent: -6 * dir, duration: D + 0.2, ease: 'none' }, at)
        if (c.fx === 'route') t.fromTo(q('.fx-route path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: D, ease: 'power2.inOut' }, at + 0.1)
          .fromTo(q('.fx-route circle'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, at + D - 0.1)
        if (c.fx === 'speed') t.fromTo(q('.fx-streak'), { scaleX: 0, xPercent: -60 }, { scaleX: 1, xPercent: 80, duration: 0.7, ease: 'power3.out', stagger: { each: 0.025, from: 'random' } }, at)
          .fromTo(q('.fx-shot--1 .fx-bg'), { x: -6 }, { x: 6, duration: 0.05, repeat: 9, yoyo: true, ease: 'none' }, at + 0.1)
        // Music: beams sweep in and the strobe hits on the beat, 128 BPM.
        if (c.fx === 'live') {
          t.fromTo(q('.fx-beam'), { rotate: (i) => -60 + i * 22, autoAlpha: 0 }, { rotate: (i) => -30 + i * 12, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, at)
          for (let b = 0; b < 3; b++) t.fromTo(q('.fx-strobe'), { autoAlpha: 0.85 }, { autoAlpha: 0, duration: 0.18, ease: 'power2.out' }, at + 0.12 + b * (60 / 128))
          t.fromTo(q('.fx-shot--2 .fx-word'), { scale: 1.06 }, { scale: 1, duration: 0.2, repeat: 2, repeatDelay: 60 / 128 - 0.2, ease: 'power2.out' }, at + 0.12)
        }
        if (c.fx === 'read') t.fromTo(q('.fx-shot--3 .book'), { rotateY: -70, rotateX: 12, y: 40 }, { rotateY: -16, rotateX: 4, y: 0, duration: 1.1 }, at)
        if (c.fx === 'watch') t.fromTo(q('.fx-burst'), { scale: 0.5, autoAlpha: 0, rotate: -8 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' }, at)
        if (c.fx === 'play') t.fromTo(q('.fx-slot'), { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: { each: 0.04, grid: [3, 3], from: 'center' } }, at)
          .fromTo(q('.fx-slot--on'), { boxShadow: '0 0 0 0px #c8ff3d' }, { boxShadow: '0 0 0 4px #c8ff3d', duration: 0.12, repeat: 3, yoyo: true }, at + 0.5)
        if (k) t.set(q(`.fx-shot--${k - 1}`), { autoAlpha: 0 }, at + 0.42)
      })

      // The montage, then the title.
      const M = S + CUTS.length * D
      t.set(q(`.fx-shot--${CUTS.length - 1}`), { autoAlpha: 0 }, M + 0.05)
        .set(q('.fx-end'), { autoAlpha: 1 }, M)
      q('.fx-flash img').forEach((im, k) => t.fromTo(im, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, M + 0.09 * (k + 1)))
      t.fromTo(q('.fx-mosaic'), { scale: 1.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1, ease: 'expo.out' }, M + 0.75)
        .fromTo(q('.fx-title .fx-word__c'), { yPercent: (i) => (i % 2 ? -120 : 120), autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.04 }, M + 0.85)
      t.call(finish, null, END)
    }, ref)
    return () => { ctx.revert(); html.classList.remove('rq-lock'); window.removeEventListener('keydown', key) }
  }, [])

  return createPortal(
    <div className="fx" ref={ref} onClick={finish} role="presentation">
      <div className="fx-lights" aria-hidden="true">{Array.from({ length: 5 }, (_, k) => <span key={k} className="fx-lights__col"><i /><i /></span>)}</div>

      {CUTS.map((c, k) => (
        <section key={c.w} className={`fx-shot fx-shot--${k} fx-shot--${c.fx}`} aria-hidden="true">
          {c.img && <img className="fx-bg" src={c.img} alt="" />}
          {c.fx === 'read' && <div className="fx-bg fx-paper"><Book /></div>}
          {c.fx === 'play' && <div className="fx-bg fx-slots">{GAMES.map((g, i) => <img key={g} className={`fx-slot${i === 4 ? ' fx-slot--on' : ''}`} src={g} alt="" />)}</div>}
          {c.fx === 'route' && <svg className="fx-route" viewBox="0 0 1000 200" preserveAspectRatio="none"><path d={ROUTE} /><circle cx="1000" cy={(0.62 - 0.2 * Math.sin(5.4) - 0.09 * Math.sin(13.7) - 0.14) * 200} r="7" /></svg>}
          {c.fx === 'speed' && <div className="fx-streaks">{Array.from({ length: 14 }, (_, i) => <i key={i} className="fx-streak" style={{ top: `${8 + i * 6.4}%` }} />)}</div>}
          {c.fx === 'live' && <div className="fx-beams">{Array.from({ length: 6 }, (_, i) => <i key={i} className="fx-beam" />)}<b className="fx-strobe" /></div>}
          {c.fx === 'watch' && <div className="fx-burst" />}
          <div className="fx-shade" />
          <Word w={c.w} />
        </section>
      ))}

      <section className="fx-end" aria-hidden="true">
        <div className="fx-flash">{[...MONTAGE].reverse().map((s) => <img key={s} src={s} alt="" />)}</div>
        <div className="fx-mosaic">{MONTAGE.slice(0, 6).map((s) => <img key={s} src={s} alt="" />)}</div>
        <div className="fx-shade fx-shade--end" />
        <div className="fx-title"><Word w="OFF THE" /><Word w="CLOCK" /></div>
      </section>

      <div className="fx-leak" aria-hidden="true" />
      <div className="fx-grain" aria-hidden="true" />
      <div className="fx-vignette" aria-hidden="true" />
      <div className="fx-bar fx-bar--t" /><div className="fx-bar fx-bar--b" />
      <button type="button" className="fx-skip" onClick={(e) => { e.stopPropagation(); finish() }}>Skip</button>
    </div>,
    document.body,
  )
}
