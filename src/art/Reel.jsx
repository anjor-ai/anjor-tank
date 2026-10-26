import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { DotCanvas } from './ArtCanvas'
import { ANJOR_TILES, ROQ_TILES, SCENES } from './cards'

/* The word reel, after the reference video: the word sits on its own; one letter at a time turns into a small screen with a scene
   in it, until the whole word is screens; then, one at a time, the screens turn back into letters. It loops.
   - ANJOR TANK (the footer): letters set in the display face; scenes of the work (an astronaut, a launch, GTM engineering, RevOps,
     a funnel, an upward trend, monitoring, AI agents, signals).
   - ROQIVA (its intro on in-app navigation): letters set in the display face; scenes of ROQIVA's steps. Plays once.
   Letters are always there for readers and under reduced motion; the screens are decoration (opacity 0 in CSS until animated). */

const WORDS = {
  anjor: { tiles: ANJOR_TILES, order: [4, 1, 7, 0, 6, 3, 8, 2, 5], back: [0, 1, 2, 3, 4, 5, 6, 7, 8], text: 'ANJOR TANK' },
  roq: { tiles: ROQ_TILES, order: [0, 1, 2, 3, 4, 5], back: [0, 1, 2, 3, 4, 5], text: 'ROQIVA' },
}
// Timing per size: word on screen, step between letters, screens on screen. `dot` sets the canvas resolution.
const SIZE = {
  nav: { hold: 3.2, step: 0.16, full: 1.4, dot: { cell: 1, k: 2, gap: 0, fps: 12 } },
  foot: { hold: 1.4, step: 0.3, full: 1.6, dot: { cell: 4, fps: 14 } },
  intro: { hold: 0.2, step: 0.075, full: 0.35, dot: { cell: 4, fps: 18 } },
}

function Tile({ kind, dot }) {
  const fn = SCENES[kind]
  return <span className="rl__tile" aria-hidden="true"><DotCanvas draw={(D, t) => fn(D, t)} still={3} {...dot} /></span>
}

/** `still` shows the word only (no screens). `once` plays a single word → screens → word pass and calls `onDone`. */
export function WordReel({ word = 'anjor', size = 'foot', still = false, once = false, onDone, label, className = '' }) {
  const ref = useRef(null)
  const W = WORDS[word], S = SIZE[size]
  useGSAP(() => {
    if (still) return undefined
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(ref)
      const tiles = q('.rl__tile'), letters = q('.rl__ch')
      const tl = gsap.timeline({ repeat: once ? 0 : -1, paused: !once, onComplete: () => onDone?.() })
      W.order.forEach((k, n) => {
        const at = S.hold + n * S.step
        tl.to(letters[k], { autoAlpha: 0, scale: 0.4, duration: 0.22, ease: 'power2.in' }, at)
          .fromTo(tiles[k], { opacity: 0, scale: 0.2, rotate: -8 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.42, ease: 'back.out(2.4)' }, at + 0.08)
      })
      const back = S.hold + W.order.length * S.step + 0.3 + S.full
      W.back.forEach((k, n) => {
        const at = back + n * S.step
        tl.to(tiles[k], { opacity: 0, scale: 0.2, rotate: 8, duration: 0.24, ease: 'power2.in' }, at)
          .to(letters[k], { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, at + 0.1)
      })
      if (!once) {
        tl.to({}, { duration: 0.2 }) // a breath before the loop starts again on the word
        // play only while the reel is on screen
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()))
        io.observe(ref.current)
        return () => { io.disconnect(); tl.kill() }
      }
      return () => tl.kill()
    })
    // Under reduced motion a single pass has nothing to show: hand over at once
    if (once && !window.matchMedia(MQ.motion).matches) onDone?.()
    return () => mm.revert()
  }, { scope: ref, dependencies: [word, size, still, once] })

  let tile = -1
  return (
    <span className={`rl rl--${word} rl--${size} ${className}`.trim()} ref={ref} role="img" aria-label={label || W.text}>
      {Array.from(W.text).map((c, k) => {
        if (c === ' ') return <span key={k} className="rl__sp" aria-hidden="true" />
        tile += 1
        return (
          <span key={k} className="rl__slot rl__slot--txt">
            <span className="rl__ch rl__ch--txt">{c}</span>
            {!still && <Tile kind={W.tiles[tile]} dot={S.dot} />}
          </span>
        )
      })}
    </span>
  )
}
