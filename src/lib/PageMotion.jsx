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
  return <div ref={ref} className="pagemotion">{children}</div>
}
