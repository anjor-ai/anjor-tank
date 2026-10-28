import { useRef } from 'react'
import { MQ, ScrollTrigger, SplitText, gsap, useGSAP } from './motion'

/* ═══════════════════════════════════════════════════════════════════════════
   The page's motion, declared in markup and built here, once per route (keyed), inside one gsap.matchMedia
   so it is all reverted together on leaving, and none of it runs under reduced motion. Hidden start states are
   set here in JS, never in CSS: with no JS, or reduced motion, every page is simply there.

   data-split="lines|words"   text rises line by line (or word by word) out of masks as it enters
   data-reveal                 fades up, batched and staggered with its neighbours
   data-clip                   a picture or stage opens from a sliver, its contents settling from a zoom
   data-par="n"                drifts against the scroll (n = strength, negative to drift down)
   data-scrubwords             a statement lights up word by word as it crosses the screen
   data-stack                  its children stick in turn; each one sinks back as the next covers it
   data-hscroll                its .hs__track runs sideways while the section is pinned (wide screens)
   data-zoom                   a pinned stage: its [data-zoom-el] grows from a card to the full screen
   data-kin                    a heading set word by word (components/kin.jsx), its ==highlights== swept in
   The older data-v-* hooks keep animating the windows on paintings.
   ═══════════════════════════════════════════════════════════════════════════ */
export function PageMotion({ routeKey, children }) {
  const ref = useRef(null)
  useGSAP(() => {
    const root = ref.current
    const q = (s) => gsap.utils.toArray(s, root)
    const once = (trigger, start = 'top 86%') => ({ trigger, start, toggleActions: 'play none none none' })
    const mm = gsap.matchMedia()

    mm.add(MQ.motion, () => {
      // Text, line by line.
      q('[data-split]').forEach((el) => {
        const type = el.dataset.split === 'words' ? 'words' : 'lines'
        SplitText.create(el, {
          type, mask: type, autoSplit: true, linesClass: 'spl', wordsClass: 'spw',
          onSplit: (self) => gsap.from(self[type], { yPercent: 115, rotate: type === 'lines' ? 2.5 : 0, duration: 1.1, stagger: type === 'lines' ? 0.09 : 0.035, ease: 'eExpo', scrollTrigger: once(el, 'top 88%') }),
        })
      })
      // Blocks, batched.
      const items = q('[data-reveal]')
      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y: 40 })
        ScrollTrigger.batch(items, { start: 'top 92%', once: true, batchMax: 6, onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: 1.05, stagger: 0.08, ease: 'eExpo', overwrite: true, clearProps: 'transform' }) })
      }
      // Pictures and stages open from a sliver.
      q('[data-clip]').forEach((el) => {
        const inner = el.querySelector('img, canvas, .v-paint__img, .shd') || null
        const tl = gsap.timeline({ scrollTrigger: once(el, 'top 88%') })
        tl.fromTo(el, { clipPath: 'inset(18% 12% 18% 12% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.4, ease: 'eExpo', clearProps: 'clipPath' })
        if (inner) tl.fromTo(inner, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'eExpo' }, 0)
      })
      // Drift.
      q('[data-par]').forEach((el) => {
        const n = Number(el.dataset.par) || 0.15
        gsap.fromTo(el, { yPercent: -n * 50 }, { yPercent: n * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      // Statements light up word by word.
      q('[data-scrubwords]').forEach((el) => {
        const st = SplitText.create(el, { type: 'words', wordsClass: 'spw' })
        gsap.fromTo(st.words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: 0.5 } })
      })
      q('[data-scrub]').forEach((h) => gsap.fromTo(h.querySelectorAll('.sw-w'), { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 88%', end: 'top 48%', scrub: 0.4 } }))
      q('.stage[data-grow]').forEach((el) => gsap.fromTo(el, { scale: 0.93 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 40%', scrub: 0.5 } }))
      // Kinetic headings (kin.jsx): words rise, highlights sweep in.
      q('[data-kin]:not([data-kin-hero])').forEach((h) => {
        const tl = gsap.timeline({ scrollTrigger: once(h, 'top 88%') })
        tl.fromTo(h.querySelectorAll('.kw__i'), { yPercent: 115, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 1.05, ease: 'eExpo', stagger: 0.045, clearProps: 'transform' })
        h.querySelectorAll('mark.kin-hl').forEach((m, j) => {
          const to = getComputedStyle(m).color, from = getComputedStyle(m.parentElement).color
          tl.fromTo(m, { '--hl': 0, color: from }, { '--hl': 1, color: to, duration: 0.8, ease: 'eInOut', clearProps: 'color' }, j ? '<0.1' : '>-0.25')
        })
      })
      // Stacked cards: each sinks back as the next arrives.
      q('[data-stack]').forEach((st) => {
        const cards = gsap.utils.toArray(st.children)
        cards.forEach((c, k) => {
          if (k === cards.length - 1) return
          gsap.to(c, { scale: 0.92, filter: 'brightness(0.82)', ease: 'none', scrollTrigger: { trigger: cards[k + 1], start: 'top bottom', end: 'top 18%', scrub: true } })
        })
      })
      // Section heads and the hairline in their label.
      q('.k-h:not([data-kin]), .v-feat__h').forEach((h) => {
        gsap.fromTo(h, { clipPath: 'inset(0% 0% 100% 0%)', y: 28 }, { clipPath: 'inset(0% 0% -20% 0%)', y: 0, duration: 1.1, ease: 'eExpo', clearProps: 'clipPath', scrollTrigger: once(h, 'top 90%') })
      })
      // Windows on paintings (the showcase layer).
      q('[data-v-paint]').forEach((img) => gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }))
      q('[data-v-win]').forEach((w) => {
        if (w.getBoundingClientRect().top < window.innerHeight) return
        gsap.fromTo(w, { y: 90, rotateX: 10, transformPerspective: 1400, transformOrigin: '50% 100%' }, { y: 0, rotateX: 0, ease: 'none', scrollTrigger: { trigger: w.closest('[data-v-panel]') || w, start: 'top bottom', end: 'top 40%', scrub: 0.6 } })
      })
      q('[data-v-float]').forEach((f) => {
        const d = Number(f.dataset.vFloat) || 1
        gsap.fromTo(f, { y: 36 * d }, { y: -20 * d, ease: 'none', scrollTrigger: { trigger: f.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      q('[data-v-seq]').forEach((list) => gsap.fromTo(list.children, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'eExpo', scrollTrigger: once(list, 'top 88%') }))
      q('[data-v-pop]').forEach((el) => gsap.fromTo(el, { scale: 0.86, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, delay: 0.4, ease: 'eSpring', scrollTrigger: once(el, 'top 90%') }))
      q('[data-v-draw]').forEach((p) => gsap.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.8, delay: 0.6, ease: 'eInOut', scrollTrigger: once(p, 'top 92%') }))
    })

    // Pinned choreography, only where the screen is big enough to hold it.
    mm.add(`${MQ.motion} and (min-width: 961px) and (min-height: 640px)`, () => {
      q('[data-hscroll]').forEach((sec) => {
        const track = sec.querySelector('.hs__track')
        if (!track) return
        const dist = () => Math.max(0, track.scrollWidth - track.parentElement.clientWidth)
        const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1 } })
        const bar = sec.querySelector('.hs__bar i')
        if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${dist()}`, scrub: true } })
        // Cards in the track tilt a little as they travel.
        track.querySelectorAll('.hs__card').forEach((c) => gsap.fromTo(c, { rotate: 2.5, y: 30 }, { rotate: -1.5, y: -10, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }))
      })
      q('[data-zoom]').forEach((sec) => {
        const el = sec.querySelector('[data-zoom-el]')
        if (!el) return
        const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: '+=120%', pin: true, scrub: 0.8, anticipatePin: 1 } })
        tl.fromTo(el, { scale: 0.42, borderRadius: 48 }, { scale: 1, borderRadius: 0, ease: 'none' })
        sec.querySelectorAll('[data-zoom-fade]').forEach((f) => tl.to(f, { autoAlpha: 0, y: -60, ease: 'none' }, 0))
      })
    })

    // Fonts, diagrams and pictures settle after first paint and move what is below them: measure again.
    const fix = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(fix)
    let t = 0, last = root.offsetHeight
    const ro = new ResizeObserver(() => {
      const h = root.offsetHeight
      if (Math.abs(h - last) < 2) return
      last = h
      clearTimeout(t); t = setTimeout(fix, 180)
    })
    ro.observe(root)
    return () => { clearTimeout(t); ro.disconnect(); mm.revert() }
  }, { scope: ref, dependencies: [routeKey], revertOnUpdate: true })
  return <div ref={ref} className="pagemotion" data-route={routeKey}>{children}</div>
}
