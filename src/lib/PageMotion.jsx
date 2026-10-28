import { useRef } from 'react'
import { MQ, ScrollTrigger, gsap, useGSAP } from './motion'

/* ═══════════════════════════════════════════════════════════════════════════
   The page's motion, declared in markup and built here once per route, inside one gsap.matchMedia so it is all
   reverted together on leaving and none of it runs under reduced motion. Start states are set in JS only: with
   no JS, or reduced motion, every page is simply there.

   Everything here animates transform and opacity, once, as things enter. Nothing is pinned and nothing is scrubbed
   against a long stretch of scroll: the browser's own scroll stays smooth.

   data-board      the tiles of a board rise in, staggered (direct children, or [data-tile] inside it)
   data-reveal     fades up, batched and staggered with its neighbours
   data-kin        a heading set word by word (components/kin.jsx): words rise, ==highlights== sweep in
   data-draw       an SVG path draws itself
   data-seq        a list's items arrive one after another
   ═══════════════════════════════════════════════════════════════════════════ */
export function PageMotion({ routeKey, children }) {
  const ref = useRef(null)
  useGSAP(() => {
    const root = ref.current
    const q = (s) => gsap.utils.toArray(s, root)
    const once = (trigger, start = 'top 88%') => ({ trigger, start, toggleActions: 'play none none none' })
    const mm = gsap.matchMedia()

    mm.add(MQ.motion, () => {
      // Headings: words rise out of their masks; highlights sweep in after them.
      const film = document.documentElement
      const watchers = []
      q('[data-kin]').forEach((h) => {
        const hero = h.hasAttribute('data-kin-hero')
        const tl = gsap.timeline(hero ? { delay: 0.15, paused: film.hasAttribute('data-film') } : { scrollTrigger: once(h, 'top 90%') })
        tl.fromTo(h.querySelectorAll('.kw__i'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'eExpo', stagger: 0.035, clearProps: 'transform' })
        h.querySelectorAll('mark.kin-hl').forEach((m, j) => tl.fromTo(m, { '--hl': 0 }, { '--hl': 1, duration: 0.7, ease: 'eInOut' }, j ? '<0.08' : '>-0.35'))
        // The opening film is on: the hero's words wait under it and rise as it clears.
        if (hero && tl.paused()) {
          const mo = new MutationObserver(() => { if (!film.hasAttribute('data-film')) { mo.disconnect(); tl.play() } })
          mo.observe(film, { attributes: true, attributeFilter: ['data-film'] })
          watchers.push(mo)
        }
      })
      // Boards: tiles rise in, in reading order.
      q('[data-board]').forEach((b) => {
        const tiles = b.querySelectorAll(':scope > *, [data-tile]')
        if (!tiles.length) return
        gsap.fromTo(tiles, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'eExpo', stagger: 0.07, clearProps: 'transform,opacity,visibility', scrollTrigger: once(b, 'top 86%') })
      })
      // Single blocks, batched with their neighbours.
      const items = q('[data-reveal]')
      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y: 28 })
        ScrollTrigger.batch(items, { start: 'top 92%', once: true, batchMax: 6, onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.07, ease: 'eExpo', overwrite: true, clearProps: 'transform' }) })
      }
      q('[data-seq]').forEach((list) => gsap.fromTo(list.children, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'eExpo', clearProps: 'transform', scrollTrigger: once(list, 'top 90%') }))
      q('[data-draw]').forEach((p) => gsap.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.6, ease: 'eInOut', scrollTrigger: once(p, 'top 94%') }))
      return () => watchers.forEach((m) => m.disconnect())
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
