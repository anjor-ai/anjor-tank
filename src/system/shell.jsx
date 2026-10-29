import { useEffect, useRef } from 'react'
import { MQ, gsap } from '../lib/motion'

/* ═══════════════════════════════════════════════════════════════════════════
   The cursor that names what a press does (the opening film lives in app.jsx). Pages change without a curtain.
   Every piece stands down under reduced motion, on touch screens where it makes no sense, and for test runners.
   ═══════════════════════════════════════════════════════════════════════════ */
const motionOK = () => typeof window !== 'undefined' && window.matchMedia(MQ.motion).matches && !window.__OI_TEST__

/** A soft cursor that grows over anything you can press, and names what a press does where it is told to (data-cursor). */
export function Cursor() {
  const ref = useRef(null)
  useEffect(() => {
    if (!motionOK() || !window.matchMedia('(pointer: fine)').matches) return undefined
    const el = ref.current, txt = el.querySelector('b')
    document.documentElement.classList.add('has-cursor')
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    const move = (e) => { x(e.clientX); y(e.clientY); el.classList.add('is-on') }
    const over = (e) => {
      const t = e.target.closest?.('a, button, [role="tab"], [data-cursor], input, textarea, select, label')
      const field = t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)
      el.classList.toggle('is-hover', !!t && !field)
      el.classList.toggle('is-field', !!field)
      const name = t?.closest('[data-cursor]')?.getAttribute('data-cursor') || ''
      txt.textContent = name
      el.classList.toggle('is-label', !!name)
    }
    const out = () => el.classList.remove('is-on')
    const down = () => el.classList.add('is-down'), up = () => el.classList.remove('is-down')
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', out)
    window.addEventListener('pointerdown', down); window.addEventListener('pointerup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move); document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', out)
      window.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up)
    }
  }, [])
  return <div className="ptr" ref={ref} aria-hidden="true"><b /></div>
}
