import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { home, roqiva as R, site, workflow } from '../content'
import { gsap } from '../lib/motion'
import { DotCanvas } from '../art/ArtCanvas'
import { ANJOR_TILES, SCENES } from '../art/cards'
import { WordReel } from '../art/Reel'

/* How ROQIVA opens. Never mounted under reduced motion; both are skippable (button, Esc, or a click).
   - RoqivaFilm: on a direct visit or a reload. About eleven seconds, after the two reference films: kinetic type with hard colour
     cuts and a letter swapped for a picture, a checkerboard wipe, then one product card that shrinks, multiplies into the six
     steps, runs as a strip, and zooms until its screen fills the frame; it closes on the ROQIVA name.
     Colours are the site's own: warm black #141413, ivory #faf9f5, clay #0083ff. The ROQIVA name is the logo.
       0.0  ROQIVA       giant letters rise in; each turns into a screen and back
       1.6  checker      a clay checkerboard closes over the frame
       2.0  three cuts   clay · ivory · black: "Code computes." "Agents draft." "People decide.", a screen set in each line
       4.6  the card     on ivory: the Detect card, large; it shrinks, five more steps join it in a grid, the grid becomes a strip
                         that runs left, and the Measure card zooms until its dark screen is the whole frame
       8.6  the promise  the hero line, word by word; then the ROQIVA name, small, with its status
      10.6  hand-over    the frame wipes up and the page is underneath
     Everything is laid out on a 1600 × 900 stage, scaled to the screen (portrait screens use the central 1000 px).
   - RoqivaReel: on arriving from another page of the site. The ROQIVA word reel, once, then the frame wipes up. About 2 s. */

const plain = (s) => s.replace(/\*/g, '')
const STEPS = workflow.steps.map((s, k) => ({ n: s.n, name: s.name, art: ['signals', 'find', 'decide', 'agent', 'check', 'prove'][k] }))
const CUTS = [
  { bg: '#0083ff', ink: '#faf9f5', w: R.rule[0].split(' '), art: 'signals' },
  { bg: '#faf9f5', ink: '#141413', w: R.rule[1].split(' '), art: 'agent' },
  { bg: '#141413', ink: '#0083ff', w: R.rule[2].split(' '), art: 'check' },
]
const WORD = Array.from(R.name)
const WORD_ART = ['signals', 'find', 'decide', 'agent', 'check', 'prove']

function Screen({ art, cell = 4, className = '' }) {
  const fn = SCENES[art]
  return <span className={`rqf__scr ${className}`.trim()} aria-hidden="true"><DotCanvas draw={(D, t) => fn(D, t)} cell={cell} fps={18} still={3} /></span>
}

/** Locks the page while an intro plays, handles skipping, and scales the stage. */
function useIntro(ref, { onSkip }) {
  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.add('rq-lock')
    const fit = () => {
      const w = window.innerWidth, h = window.innerHeight
      const s = w < h ? w / 1000 : Math.min(w / 1600, h / 900)
      ref.current?.style.setProperty('--s', s)
      ref.current?.classList.toggle('rqf--tall', w < h) // portrait: the type is set smaller and the lines stack
    }
    fit()
    window.addEventListener('resize', fit)
    const key = (e) => { if (e.key === 'Escape') onSkip() }
    window.addEventListener('keydown', key)
    return () => { html.classList.remove('rq-lock'); window.removeEventListener('resize', fit); window.removeEventListener('keydown', key) }
  }, [])
}

export function RoqivaFilm({ onReveal, onDone }) {
  const ref = useRef(null)
  const tl = useRef(null)
  const left = useRef(false)
  // Skipping hands over at once: the frame wipes up from wherever the film is
  const skip = () => {
    if (left.current) return
    left.current = true
    tl.current?.pause()
    onReveal?.()
    gsap.to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: onDone })
  }
  useIntro(ref, { onSkip: skip })

  useLayoutEffect(() => {
    const q = gsap.utils.selector(ref)
    const ctx = gsap.context(() => {
      const t = gsap.timeline()
      tl.current = t
      const bg = q('.rqf__bg')
      // 0 · ROQIVA rises in, letters turn into screens and back
      gsap.set(q('.rqf__scene'), { autoAlpha: 0 })
      t.set(q('.rqf__s0'), { autoAlpha: 1 }, 0)
        .fromTo(q('.rqf__li'), { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05 }, 0.1)
      WORD.forEach((_, k) => {
        const at = 0.8 + k * 0.07
        t.to(q('.rqf__li')[k], { autoAlpha: 0, scale: 0.5, duration: 0.15, ease: 'power2.in' }, at)
          .fromTo(q('.rqf__s0 .rqf__scr')[k], { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, at + 0.05)
          .to(q('.rqf__s0 .rqf__scr')[k], { autoAlpha: 0, scale: 0.3, duration: 0.14, ease: 'power2.in' }, at + 0.45)
          .to(q('.rqf__li')[k], { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, at + 0.52)
      })
      // 1 · checkerboard closes in clay, the first cut opens under it
      t.fromTo(q('.rqf__ck i'), { scale: 0 }, { scale: 1.02, duration: 0.32, ease: 'power3.in', stagger: { grid: [9, 16], from: 'center', amount: 0.3 } }, 1.55)
        .set(q('.rqf__s0'), { autoAlpha: 0 }, 2.2)
        .set(bg, { backgroundColor: CUTS[0].bg }, 2.2)
        .set(q('.rqf__ck i'), { scale: 0 }, 2.2)
      // 2 · three hard cuts, a screen set in each line
      CUTS.forEach((c, k) => {
        const at = 2.2 + k * 0.82, s = q(`.rqf__c${k}`)
        t.set(bg, { backgroundColor: c.bg }, at)
          .set(s, { autoAlpha: 1 }, at)
          .fromTo(s, { scale: 1.14 }, { scale: 1, duration: 0.7, ease: 'expo.out' }, at) // a punch-in on every cut
          .fromTo(q(`.rqf__c${k} .rqf__wi`), { yPercent: 105, skewY: 6 }, { yPercent: 0, skewY: 0, duration: 0.5, ease: 'expo.out', stagger: 0.06 }, at)
          .fromTo(q(`.rqf__c${k} .rqf__scr`), { scale: 0, rotate: -12 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2.2)' }, at + 0.12)
          .set(s, { autoAlpha: 0 }, at + 0.82)
      })
      // 3 · the card: large, shrinks into a grid of six steps, runs as a strip, then Measure zooms to fill the frame
      const A = 2.2 + 3 * 0.82 // 4.66
      const cards = q('.rqf__card')
      const W = 300, G = 26
      const grid = (k) => ({ x: ((k % 3) - 1) * (W + G), y: (Math.floor(k / 3) - 0.5) * (210 + G) })
      const row = (k) => ({ x: (k - 2.5) * (W + G), y: 0 })
      t.set(bg, { backgroundColor: '#faf9f5' }, A)
        .set(q('.rqf__s3'), { autoAlpha: 1 }, A)
        .set(cards, { autoAlpha: 0 }, A)
        .fromTo(cards[0], { autoAlpha: 1, x: 0, y: 40, scale: 2.3 }, { y: 0, duration: 0.6, ease: 'expo.out' }, A)
        .fromTo(q('.rqf__lead'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, A + 0.15)
        .to(q('.rqf__lead'), { autoAlpha: 0, duration: 0.2 }, A + 1.05)
        .to(cards[0], { scale: 1, ...grid(0), duration: 0.7, ease: 'expo.inOut' }, A + 1.1)
      cards.forEach((c, k) => { if (k) t.fromTo(c, { autoAlpha: 0, scale: 0.4, ...grid(k) }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, A + 1.55 + k * 0.08) })
      t.to(cards, { x: (k) => row(k).x, y: 0, duration: 0.75, ease: 'expo.inOut', stagger: 0.03 }, A + 2.45)
        .to(q('.rqf__track'), { x: -520, duration: 1.4, ease: 'power1.inOut' }, A + 2.75)
        .to(cards.slice(0, 5), { autoAlpha: 0, duration: 0.25 }, A + 3.7)
        .to(cards[5], { x: 520, y: 225, scale: 7.5, duration: 0.85, ease: 'expo.in' }, A + 3.65)
        .set(bg, { backgroundColor: '#141413' }, A + 4.45)
        .set(q('.rqf__s3'), { autoAlpha: 0 }, A + 4.5)
      // 4 · the promise, then the name
      const B = A + 4.5 // 9.16
      t.set(q('.rqf__s4'), { autoAlpha: 1 }, B)
        .fromTo(q('.rqf__hw'), { autoAlpha: 0, y: 30, filter: 'blur(10px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', stagger: 0.06 }, B)
        .to(q('.rqf__hero'), { autoAlpha: 0, scale: 0.96, duration: 0.3 }, B + 1.2)
        .fromTo(q('.rqf__name'), { autoAlpha: 0, letterSpacing: '0.6em' }, { autoAlpha: 1, letterSpacing: '0.04em', duration: 0.7, ease: 'expo.out' }, B + 1.35)
        .fromTo(q('.rqf__status'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, B + 1.6)
        .call(skip, null, B + 2.3)
    }, ref)
    return () => ctx.revert()
  }, [])

  return createPortal(
    <div className="rqf" ref={ref} onClick={skip} role="presentation">
      <div className="rqf__bg" />
      <div className="rqf__stage">
        <div className="rqf__scene rqf__s0">
          <p className="rqf__word">{WORD.map((c, k) => <span key={k} className="rqf__l"><span className="rqf__li">{c}</span><Screen art={WORD_ART[k]} /></span>)}</p>
        </div>
        {CUTS.map((c, k) => (
          <div key={k} className={`rqf__scene rqf__cut rqf__c${k}`} style={{ color: c.ink }}>
            <p className="rqf__line">
              <span className="rqf__wm"><span className="rqf__wi">{c.w[0]}</span></span>
              <Screen art={c.art} className="rqf__scr--in" />
              {c.w.slice(1).map((w) => <span key={w} className="rqf__wm"><span className="rqf__wi">{w}</span></span>)}
            </p>
          </div>
        ))}
        <div className="rqf__scene rqf__s3">
          <div className="rqf__track">
            {STEPS.map((s, k) => (
              <div key={s.n} className="rqf__card">
                <Screen art={s.art} cell={3} />
                <p><span>{s.n}</span><b>{s.name}</b></p>
              </div>
            ))}
          </div>
          <p className="rqf__lead">{plain(R.flow.titles[0])}</p>
        </div>
        <div className="rqf__scene rqf__s4">
          <p className="rqf__hero">{plain(R.hero.title).split(' ').map((w, k) => <span key={k} className="rqf__hw">{w} </span>)}</p>
          <p className="rqf__name">{R.name}</p>
          <p className="rqf__status"><i />{R.fullName}</p>
        </div>
      </div>
      <div className="rqf__ck" aria-hidden="true">{Array.from({ length: 144 }, (_, k) => <i key={k} />)}</div>
      <button type="button" className="rqf__skip" onClick={(e) => { e.stopPropagation(); skip() }}>Skip intro</button>
    </div>,
    document.body,
  )
}

export function RoqivaReel({ onReveal, onDone }) {
  const ref = useRef(null)
  const gone = useRef(false)
  const out = () => {
    if (gone.current) return
    gone.current = true
    onReveal?.()
    gsap.to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: onDone })
  }
  useIntro(ref, { onSkip: out })
  useEffect(() => { gsap.fromTo(ref.current.querySelector('.rl'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'expo.out' }) }, [])
  return createPortal(
    <div className="rqf rqf--reel" ref={ref} onClick={out} role="presentation">
      <div className="rqf__bg" />
      <WordReel word="roq" size="intro" once onDone={out} label={R.name} />
      <button type="button" className="rqf__skip" onClick={(e) => { e.stopPropagation(); out() }}>Skip</button>
    </div>,
    document.body,
  )
}

/* ───────── The portfolio's own opening: once per visit, on a direct load. About seven seconds, after the ROQIVA film.
     0.0  ANJOR TANK   the name rises in; each letter turns into a small screen of the work and back
     1.6  checker      a blue checkerboard closes over the frame
     2.2  three cuts   "Find the leak." · "Fix the loop." · "Prove the lift."
     4.7  the line     who I am, then the name and the role; the frame wipes up
   Skippable with the button, Esc or a click. Never mounted under reduced motion. ───────── */
const SITE_CUTS = [
  { bg: '#0083ff', ink: '#faf9f5', w: `${home.band[0]}.`.split(' '), art: 'find' },
  { bg: '#faf9f5', ink: '#141413', w: `${home.band[1]}.`.split(' '), art: 'agent' },
  { bg: '#141413', ink: '#0083ff', w: `${home.band[2]}.`.split(' '), art: 'prove' },
]
const SITE_NAME = Array.from(site.name.toUpperCase())

export function SiteFilm({ onDone }) {
  const ref = useRef(null)
  const tl = useRef(null)
  const left = useRef(false)
  const skip = () => {
    if (left.current) return
    left.current = true
    tl.current?.pause()
    gsap.to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: onDone })
  }
  useIntro(ref, { onSkip: skip })

  useLayoutEffect(() => {
    const q = gsap.utils.selector(ref)
    const ctx = gsap.context(() => {
      const t = gsap.timeline()
      tl.current = t
      const bg = q('.rqf__bg')
      gsap.set(q('.rqf__scene'), { autoAlpha: 0 })
      const letters = q('.rqf__li'), screens = q('.rqf__s0 .rqf__scr')
      t.set(q('.rqf__s0'), { autoAlpha: 1 }, 0)
        .fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.04 }, 0.1)
      letters.forEach((_, k) => {
        const at = 0.7 + k * 0.07
        t.to(letters[k], { autoAlpha: 0, scale: 0.5, duration: 0.15, ease: 'power2.in' }, at)
          .fromTo(screens[k], { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, at + 0.05)
          .to(screens[k], { autoAlpha: 0, scale: 0.3, duration: 0.14, ease: 'power2.in' }, at + 0.42)
          .to(letters[k], { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, at + 0.5)
      })
      t.fromTo(q('.rqf__ck i'), { scale: 0 }, { scale: 1.02, duration: 0.32, ease: 'power3.in', stagger: { grid: [9, 16], from: 'center', amount: 0.3 } }, 1.65)
        .set(q('.rqf__s0'), { autoAlpha: 0 }, 2.3)
        .set(bg, { backgroundColor: SITE_CUTS[0].bg }, 2.3)
        .set(q('.rqf__ck i'), { scale: 0 }, 2.3)
      SITE_CUTS.forEach((c, k) => {
        const at = 2.3 + k * 0.82, s = q(`.rqf__c${k}`)
        t.set(bg, { backgroundColor: c.bg }, at)
          .set(s, { autoAlpha: 1 }, at)
          .fromTo(s, { scale: 1.14 }, { scale: 1, duration: 0.7, ease: 'expo.out' }, at)
          .fromTo(q(`.rqf__c${k} .rqf__wi`), { yPercent: 105, skewY: 6 }, { yPercent: 0, skewY: 0, duration: 0.5, ease: 'expo.out', stagger: 0.06 }, at)
          .fromTo(q(`.rqf__c${k} .rqf__scr`), { scale: 0, rotate: -12 }, { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(2.2)' }, at + 0.12)
          .set(s, { autoAlpha: 0 }, at + 0.82)
      })
      const B = 2.3 + 3 * 0.82 // 4.76
      t.set(bg, { backgroundColor: '#141413' }, B)
        .set(q('.rqf__s4'), { autoAlpha: 1 }, B)
        .fromTo(q('.rqf__hw'), { autoAlpha: 0, y: 30, filter: 'blur(10px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', stagger: 0.07 }, B)
        .to(q('.rqf__hero'), { autoAlpha: 0, scale: 0.96, duration: 0.3 }, B + 1.45)
        .fromTo(q('.rqf__name'), { autoAlpha: 0, letterSpacing: '0.6em' }, { autoAlpha: 1, letterSpacing: '0.04em', duration: 0.7, ease: 'expo.out' }, B + 1.6)
        .fromTo(q('.rqf__status'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, B + 1.85)
        .call(skip, null, B + 2.6)
    }, ref)
    return () => ctx.revert()
  }, [])

  return createPortal(
    <div className="rqf sif" ref={ref} onClick={skip} role="presentation">
      <div className="rqf__bg" />
      <div className="rqf__stage">
        <div className="rqf__scene rqf__s0">
          <p className="rqf__word">{SITE_NAME.map((c, k) => (c === ' '
            ? <span key={k} className="sif__sp" />
            : <span key={k} className="rqf__l"><span className="rqf__li">{c}</span><Screen art={ANJOR_TILES[SITE_NAME.slice(0, k).filter((x) => x !== ' ').length]} /></span>))}</p>
        </div>
        {SITE_CUTS.map((c, k) => (
          <div key={k} className={`rqf__scene rqf__cut rqf__c${k}`} style={{ color: c.ink }}>
            <p className="rqf__line">
              <span className="rqf__wm"><span className="rqf__wi">{c.w[0]}</span></span>
              <Screen art={c.art} className="rqf__scr--in" />
              {c.w.slice(1).map((w) => <span key={w} className="rqf__wm"><span className="rqf__wi">{w}</span></span>)}
            </p>
          </div>
        ))}
        <div className="rqf__scene rqf__s4">
          <p className="rqf__hero">{plain(home.hello.title).split(' ').map((w, k) => <span key={k} className="rqf__hw">{w} </span>)}</p>
          <p className="rqf__name">{site.name}</p>
          <p className="rqf__status"><i />Product Manager · Founder of ROQIVA</p>
        </div>
      </div>
      <div className="rqf__ck" aria-hidden="true">{Array.from({ length: 144 }, (_, k) => <i key={k} />)}</div>
      <button type="button" className="rqf__skip" onClick={(e) => { e.stopPropagation(); skip() }}>Skip intro</button>
    </div>,
    document.body,
  )
}
