import { createContext, useContext, useRef, useSyncExternalStore } from 'react'
import { MQ, ScrollTrigger, afterOpener, gsap, useGSAP } from '../lib/motion'

/* Showcase primitives: a gradient Stage that holds app Windows, and the motion that plays inside a Window.
   · Every Window renders in its final state. With no JS, or under reduced motion, nothing is hidden and nothing moves.
   · With motion allowed, GSAP hides the marked parts, then plays them once: data-in (rise), data-line (stream),
     data-draw (stroke draw-on), data-fade (opacity only, for dashed strokes), data-run (a token that travels part of the way along its parent), data-grow="x|y" (bars), data-pop (spring in).
   · When it starts is set by PlayCtx: 'view' (scroll into view, once), 'mount' (as soon as it mounts), 'active' (when the parent
     panel's data-active turns true, for the pinned stepper) or 'pane' (the same, in every layout, for the hero player). */

export const PlayCtx = createContext('view')

const add = (tl, targets, vars, at) => { if (targets.length) tl.to(targets, vars, at) }

export function useWindowMotion(ref, forced) {
  const ctxMode = useContext(PlayCtx)
  const mode = forced || ctxMode
  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()
    const conds = mode === 'active' ? { pin: MQ.pinned, free: MQ.free } : { motion: MQ.motion }  // not `all`: GSAP reads that key as always-true
    // 'active' watches the parent panel only while the stepper is pinned; 'pane' always watches it (the hero player).
    mm.add(conds, (ctx) => {
      const q = (s) => gsap.utils.toArray(s, el)
      const ins = q('[data-in]'), lines = q('[data-line]'), pops = q('[data-pop]'), draws = q('[data-draw]'), fades = q('[data-fade]'), runs = q('[data-run]')
      const gx = q('[data-grow="x"]'), gy = q('[data-grow="y"]')
      if (!(ins.length + lines.length + pops.length + draws.length + fades.length + runs.length + gx.length + gy.length)) return

      // Hidden start state, set here and never in CSS.
      if (ins.length) gsap.set(ins, { autoAlpha: 0, y: 10 })
      if (lines.length) gsap.set(lines, { autoAlpha: 0, x: -8 })
      if (fades.length) gsap.set(fades, { autoAlpha: 0 })
      if (runs.length) gsap.set(runs, { autoAlpha: 0, x: 0 })
      if (pops.length) gsap.set(pops, { autoAlpha: 0, scale: 0.6 })
      if (draws.length) gsap.set(draws, { drawSVG: '0%' })
      if (gx.length) gsap.set(gx, { scaleX: 0, transformOrigin: '0 50%' })
      if (gy.length) gsap.set(gy, { scaleY: 0, transformOrigin: '50% 100%' })

      const tl = gsap.timeline({ paused: true })
      add(tl, ins, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0)
      add(tl, lines, { autoAlpha: 1, x: 0, duration: 0.32, stagger: 0.2 }, 0.15)
      add(tl, fades, { autoAlpha: 1, duration: 0.6, stagger: 0.1 }, 0.9)
      add(tl, draws, { drawSVG: '100%', duration: 0.9, stagger: 0.14, ease: 'eInOut' }, 0.2)
      add(tl, gx, { scaleX: 1, duration: 0.8, stagger: 0.08 }, 0.3)
      add(tl, gy, { scaleY: 1, duration: 0.7, stagger: 0.06 }, 0.3)
      // A token that travels part of the way along its parent (data-run is the fraction) and stops where the line breaks.
      runs.forEach((r) => {
        const to = parseFloat(r.getAttribute('data-run')) || 1
        tl.to(r, { autoAlpha: 1, duration: 0.2 }, 0.9)
          .to(r, { x: () => r.parentElement.offsetWidth * to, duration: 0.9, ease: 'power2.inOut' }, 0.9)
          .to(r, { scale: 2.2, autoAlpha: 0, duration: 0.35, ease: 'power1.out' }, 1.85)
      })
      add(tl, pops, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'eSpring', stagger: 0.16 }, 0.7)

      let stopOpener = () => {}
      let started = false
      const play = () => { if (started) return; started = true; stopOpener = afterOpener(() => tl.play(0)) }
      let st, mo
      const active = mode === 'pane' || (mode === 'active' && ctx.conditions.pin)
      if (mode === 'mount') play()
      else if (active) {
        const host = el.closest('[data-active]')
        const sync = () => {
          if (host && host.getAttribute('data-active') === 'true') { started = false; stopOpener(); play() }
          else { stopOpener(); started = false; tl.pause(0) }
        }
        sync()
        if (host) { mo = new MutationObserver(sync); mo.observe(host, { attributes: true, attributeFilter: ['data-active'] }) }
      } else {
        st = ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: play, onRefresh: (self) => { if (self.progress > 0) play() } })
      }
      return () => { st && st.kill(); mo && mo.disconnect(); stopOpener(); tl.kill() }
    })
    return () => mm.revert()
  }, { scope: ref })
}

/** A gradient backdrop that holds one or more windows. The glow drifts slightly with scroll; nothing else moves. */
export function Stage({ tone = 'violet', className = '', children, label, grow = false }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.utils.toArray('[data-par]', ref.current).forEach((g, i) => {
        gsap.fromTo(g, { yPercent: i ? 8 : -8 }, { yPercent: i ? -8 : 8, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 } })
      })
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <div className={`stage stage--${tone} ${className}`.trim()} ref={ref} role={label ? 'group' : undefined} aria-label={label} data-grow={grow || undefined}>
      <span className="stage__glow stage__glow--a" data-par aria-hidden />
      <span className="stage__glow stage__glow--b" data-par aria-hidden />
      <span className="stage__grid" aria-hidden />
      <div className="stage__in">{children}</div>
    </div>
  )
}

/** The window chrome alone: title bar, body, optional foot. No motion. */
export function Frame({ title, badge = null, foot, className = '', label, innerRef, children }) {
  return (
    <figure className={`win ${className}`.trim()} ref={innerRef} aria-label={label || title}>
      <div className="win__bar">
        <span className="win__dots" aria-hidden><i /><i /><i /></span>
        <span className="win__title">{title}</span>
        {badge && <span className="status status--amber win__badge">{badge}</span>}
      </div>
      <div className="win__body">{children}</div>
      {foot && <p className="win__foot label" data-in>{foot}</p>}
    </figure>
  )
}

/** An app window whose contents animate through useWindowMotion. */
export function Window(props) {
  const ref = useRef(null)
  useWindowMotion(ref)
  return <Frame {...props} innerRef={ref} />
}

/** True when the viewport is at least `px` wide. The server and the first snapshot say false, so the compact version is what exists without script. */
export function useWide(px) {
  const q = `(min-width: ${px}px)`
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(q); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) },
    () => window.matchMedia(q).matches,
    () => false,
  )
}

/** Plays a one-shot token along an SVG path once the host has scrolled into view (and the opener is done). */
export function useToken(ref, { start = 0, duration = 6, hold = 0.4 } = {}) {
  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const dot = el.querySelector('[data-token]')
      const path = el.querySelector('[data-route]')
      if (!dot || !path) return
      gsap.set(dot, { autoAlpha: 0 })
      let stop = () => {}
      const run = () => { stop = afterOpener(() => {
        gsap.timeline({ delay: start })
          .set(dot, { autoAlpha: 1 })
          .to(dot, { duration, ease: 'none', motionPath: { path, align: path, alignOrigin: [0.5, 0.5] } })
          .to(dot, { autoAlpha: 0, duration: 0.4 }, `+=${hold}`)
      }) }
      const st = ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: run, onRefresh: (self) => { if (self.progress > 0) run() } })
      return () => { st.kill(); stop() }
    })
    return () => mm.revert()
  }, { scope: ref })
}
