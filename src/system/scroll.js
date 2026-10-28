import Lenis from 'lenis'
import { MQ, ScrollTrigger, gsap } from '../lib/motion'

/* Smooth scroll. Lenis drives the page and ScrollTrigger reads from it, on GSAP's one ticker.
   Off under reduced motion and on touch screens (their own scrolling is better). Any scroll lock the site
   already uses (the menu, modals, the films) pauses it, so locked pages stay locked. */
let lenis = null

export function initScroll() {
  if (typeof window === 'undefined' || lenis) return lenis
  if (!window.matchMedia(MQ.motion).matches || window.matchMedia('(pointer: coarse)').matches || window.__OI_TEST__) return null
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: false, autoRaf: false, prevent: (n) => n.closest?.('[data-lenis-prevent], .modal, .mmenu, [role="dialog"]') })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  const locked = () => document.documentElement.classList.contains('rq-lock') || document.body.style.overflow === 'hidden'
  const sync = () => (locked() ? lenis.stop() : lenis.start())
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['style'] })
  window.__lenis = lenis
  return lenis
}

/** Scroll to a y offset or an element, through Lenis when it runs. */
export function scrollToY(target, { immediate = false, offset = 0 } = {}) {
  if (lenis) { lenis.scrollTo(target, { immediate, offset, duration: 1.2, force: true }); return }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'instant' : 'smooth' })
  else target?.scrollIntoView?.({ behavior: immediate ? 'instant' : 'smooth', block: 'start' })
}
