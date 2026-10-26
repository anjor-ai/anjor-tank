import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useGSAP } from '@gsap/react'

/* ═══════════════════════════════════════════════════════════════════════════
   Motion. One place for GSAP setup on this site.
   · Plugins are registered once, here. Bundled from npm, so the strict CSP (script-src 'self') still holds.
   · Every effect runs inside useGSAP with a scope ref, so tweens and ScrollTriggers are reverted on unmount.
   · Hidden start states are set in JS only. With no JS, or under prefers-reduced-motion, content is simply there.
   · Only transforms and autoAlpha are animated.
   ═══════════════════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, CustomEase, DrawSVGPlugin, MotionPathPlugin, useGSAP)
CustomEase.create('eOut', '.22,.85,.3,1')
CustomEase.create('eSpring', '.34,1.4,.64,1')
CustomEase.create('eInOut', '.65,0,.35,1')
gsap.defaults({ duration: 0.7, ease: 'eOut' })
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, useGSAP }
// Test hook: a test runner sets window.__OI_TEST__ before load to inspect trigger counts. Inert otherwise.
if (typeof window !== 'undefined' && window.__OI_TEST__) window.__ST = ScrollTrigger

export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  pinned: '(min-width: 961px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)',
  // Motion allowed, but the stepper is not pinned (small screen or short window): every panel is on the page at once.
  free: '(prefers-reduced-motion: no-preference) and (max-width: 960px), (prefers-reduced-motion: no-preference) and (max-height: 759px)',
}

/** Run `cb` now. Kept as one entry point so every scene starts the same way. Returns a cleanup. */
export function afterOpener(cb) { cb(); return () => {} }
