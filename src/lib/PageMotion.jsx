import { useRef } from 'react'
import { MQ, ScrollTrigger, gsap, useGSAP } from './motion'

/** Wraps one page. Reveals every [data-reveal] element as it nears the viewport, once, staggered within a batch.
    Mounted per route (keyed), so triggers never accumulate. ScrollTrigger is measured again when fonts load or the page height changes. */
export function PageMotion({ routeKey, children }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const items = gsap.utils.toArray('[data-reveal]', ref.current)
      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y: 18 })
        ScrollTrigger.batch(items, {
          start: 'top 94%', once: true, batchMax: 6,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, overwrite: true, clearProps: 'transform' }),
        })
      }
      // Frames grow into place as they scroll in: a short, scrubbed scale-up, finished before the frame reaches the middle of the screen.
      gsap.utils.toArray('[data-grow]', ref.current).forEach((el) => {
        gsap.fromTo(el, { scale: 0.93 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 40%', scrub: 0.5 } })
      })
      // A subtle depth shift on editorial graphics; scoped and disabled for reduced motion.
      gsap.utils.toArray('[data-editorial-drift]', ref.current).forEach((el) => {
        gsap.fromTo(el, { y: 14 }, { y: -14, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } })
      })
      // Statements light up word by word as they cross the screen.
      gsap.utils.toArray('[data-scrub]', ref.current).forEach((h) => {
        gsap.fromTo(h.querySelectorAll('.sw-w'), { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 88%', end: 'top 48%', scrub: 0.4 } })
      })
      // Section titles rise out of a mask; the hairline in the label draws itself.
      // Kinetic headings: each word rises out of its own mask, then the ==highlighted== words take the accent
      // (the stroke sweeps under them, the ink changes colour, the words give one small emphasis bounce).
      gsap.utils.toArray('[data-kin]:not([data-kin-hero])', ref.current).forEach((h) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 88%', toggleActions: 'play none none none' } })
        tl.fromTo(h.querySelectorAll('.kw__i'), { yPercent: 110, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 0.95, ease: 'eOut', stagger: 0.05, clearProps: 'transform' })
        h.querySelectorAll('mark.kin-hl').forEach((m, j) => {
          const to = getComputedStyle(m).color, from = getComputedStyle(m.parentElement).color
          const at = j ? '<0.1' : '>-0.2'
          tl.fromTo(m, { '--hl': 0, color: from }, { '--hl': 1, color: to, duration: 0.8, ease: 'eInOut', clearProps: 'color' }, at)
          tl.to(m.querySelectorAll('.kw__i'), { keyframes: [{ scale: 1.07, yPercent: -6, duration: 0.18, ease: 'eOut' }, { scale: 1, yPercent: 0, duration: 0.5, ease: 'eSpring' }], stagger: 0.04, transformOrigin: '50% 85%', clearProps: 'transform' }, '<0.25')
        })
      })
      gsap.utils.toArray('.k-h:not([data-kin]), .v-feat__h, .v-cta__h:not([data-kin])', ref.current).forEach((h) => {
        gsap.fromTo(h, { clipPath: 'inset(0% 0% 100% 0%)', y: 28 }, { clipPath: 'inset(0% 0% -20% 0%)', y: 0, duration: 1.1, ease: 'expo.out', clearProps: 'clipPath', scrollTrigger: { trigger: h, start: 'top 90%', once: true } })
      })
      gsap.utils.toArray('.k-rule i', ref.current).forEach((i) => {
        gsap.fromTo(i, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: i, start: 'top 92%', once: true } })
      })
      // Paintings drift against the scroll; the window on them settles from a slight tilt; floating cards ride at their own depth.
      gsap.utils.toArray('[data-v-paint]', ref.current).forEach((img) => {
        gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      gsap.utils.toArray('[data-v-win]', ref.current).forEach((w) => {
        if (w.getBoundingClientRect().top < window.innerHeight) return // already on screen: leave it settled
        gsap.fromTo(w, { y: 70, rotateX: 9, transformPerspective: 1400, transformOrigin: '50% 100%' }, { y: 0, rotateX: 0, ease: 'none', scrollTrigger: { trigger: w.closest('[data-v-panel]') || w, start: 'top bottom', end: 'top 45%', scrub: 0.6 } })
      })
      gsap.utils.toArray('[data-v-float]', ref.current).forEach((f) => {
        const d = Number(f.dataset.vFloat) || 1
        gsap.fromTo(f, { y: 30 * d }, { y: -18 * d, ease: 'none', scrollTrigger: { trigger: f.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      gsap.utils.toArray('[data-v-seq]', ref.current).forEach((list) => {
        gsap.fromTo(list.children, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: list, start: 'top 88%', once: true } })
      })
      gsap.utils.toArray('[data-v-pop]', ref.current).forEach((el) => {
        gsap.fromTo(el, { scale: 0.86, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, delay: 0.5, ease: 'back.out(1.8)', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })
      gsap.utils.toArray('[data-v-draw]', ref.current).forEach((p) => {
        gsap.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.8, delay: 0.8, ease: 'expo.inOut', scrollTrigger: { trigger: p, start: 'top 92%', once: true } })
      })
      // Fonts, diagrams and tables settle after first paint and move everything below them: measure again.
      const fix = () => ScrollTrigger.refresh()
      document.fonts?.ready.then(fix)
      let t = 0, last = ref.current ? ref.current.offsetHeight : 0
      const ro = typeof ResizeObserver !== 'undefined' && ref.current ? new ResizeObserver(() => {
        const h = ref.current.offsetHeight
        if (Math.abs(h - last) < 2) return
        last = h
        clearTimeout(t); t = setTimeout(fix, 160)
      }) : null
      if (ro) ro.observe(ref.current)
      return () => { clearTimeout(t); ro && ro.disconnect() }
    })
    return () => mm.revert()
  }, { scope: ref, dependencies: [routeKey], revertOnUpdate: true })
  return <div ref={ref} className="pagemotion" data-route={routeKey}>{children}</div>
}
