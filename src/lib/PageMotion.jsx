import { useRef } from 'react'
import { MQ, ScrollTrigger, gsap, useGSAP } from './motion'

/* ═══════════════════════════════════════════════════════════════════════════
   The page's motion, built once per route inside one gsap.matchMedia (reverted on leaving; off under reduced motion).
   Pages do not reveal themselves: nothing is hidden on arrival and nothing slides in as you scroll. Motion lives in
   the things that are about motion (the hello board, the product demos, the dot scenes, the numbers) and in feedback
   on what you press.

   data-draw   an SVG line draws itself once, when it is first seen (charts and routes)
   ═══════════════════════════════════════════════════════════════════════════ */
export function PageMotion({ routeKey, children }) {
  const ref = useRef(null)
  useGSAP(() => {
    const root = ref.current
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.utils.toArray('[data-draw]', root).forEach((p) => gsap.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.4, ease: 'eInOut', scrollTrigger: { trigger: p, start: 'top 94%', toggleActions: 'play none none none' } }))
    })
    // Fonts and pictures settle after first paint and move what is below them: measure again, once things are quiet.
    const fix = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(fix)
    let t = 0, last = root.offsetHeight
    const ro = new ResizeObserver(() => {
      const h = root.offsetHeight
      if (Math.abs(h - last) < 24) return
      last = h
      clearTimeout(t); t = setTimeout(fix, 250)
    })
    ro.observe(root)
    return () => { clearTimeout(t); ro.disconnect(); mm.revert() }
  }, { scope: ref, dependencies: [routeKey], revertOnUpdate: true })
  return <div ref={ref} className="pagemotion" data-route={routeKey}>{children}</div>
}
