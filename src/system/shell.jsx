import { useEffect, useRef, useState } from 'react'
import { routes, site } from '../content'
import { MQ, ScrollTrigger, gsap } from '../lib/motion'
import { soundOn } from './sound'
import { Shader } from './Shader'

/* ═══════════════════════════════════════════════════════════════════════════
   The theatre around the pages: the curtain between routes, the cursor, and the opening on a first visit.
   Every piece stands down under reduced motion, on touch screens where it makes no sense, and for test runners.
   ═══════════════════════════════════════════════════════════════════════════ */
const motionOK = () => typeof window !== 'undefined' && window.matchMedia(MQ.motion).matches && !window.__OI_TEST__

/** Between pages: two panels rise over the page with the next page's name, then lift away from the new one. */
export function Curtain({ routeKey }) {
  const ref = useRef(null)
  const label = useRef(null)
  const closed = useRef(false)
  useEffect(() => {
    if (!motionOK()) return undefined
    const el = ref.current, panels = el.querySelectorAll('.cu__p')
    window.__curtain = {
      close: (path) => new Promise((res) => {
        const r = routes.find((x) => x.path === path) || (path.startsWith('/work/') ? { label: 'Case study' } : null)
        label.current.textContent = r ? r.label : ''
        closed.current = true
        let done = false
        const fin = () => { if (!done) { done = true; res() } }
        setTimeout(fin, 900)
        gsap.timeline({ onComplete: fin })
          .set(el, { visibility: 'visible' })
          .fromTo(panels, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'eCurtain', stagger: 0.07 })
          .fromTo(label.current, { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'eExpo' }, 0.3)
      }),
    }
    return () => { delete window.__curtain }
  }, [])
  // The new page is under the curtain: lift it.
  useEffect(() => {
    if (!closed.current) return
    closed.current = false
    const el = ref.current
    requestAnimationFrame(() => {
      gsap.timeline({ onComplete: () => { gsap.set(el, { visibility: 'hidden' }); ScrollTrigger.refresh() } })
        .to(label.current, { yPercent: -120, autoAlpha: 0, duration: 0.4, ease: 'eInOut' })
        .to(el.querySelectorAll('.cu__p'), { yPercent: -100, duration: 0.85, ease: 'eCurtain', stagger: { each: 0.07, from: 'end' } }, 0.1)
    })
  }, [routeKey])
  return (
    <div className="cu" ref={ref} aria-hidden="true">
      <span className="cu__p cu__p--a" />
      <span className="cu__p cu__p--b"><b ref={label} /></span>
    </div>
  )
}

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

/** The opening, once per visit to the home page (and on "Replay"): the name rises over the shader, and the visitor
    chooses to come in with sound or quietly. It never waits: with no choice it opens quietly on its own. */
export function Intro() {
  const [on, setOn] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const play = () => { if (motionOK()) setOn(true) }
    try {
      if (window.location.pathname === '/' && sessionStorage.getItem('at-intro-v3') !== '1') { play(); sessionStorage.setItem('at-intro-v3', '1') }
    } catch { /* storage is optional */ }
    window.addEventListener('replay-site-film', play)
    return () => window.removeEventListener('replay-site-film', play)
  }, [])
  useEffect(() => {
    const r = document.documentElement
    if (!on) { r.removeAttribute('data-film'); return undefined }
    r.setAttribute('data-film', ''); r.classList.add('rq-lock')
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.in__c', { yPercent: 120, rotate: 6, duration: 1.1, stagger: 0.045, ease: 'eExpo' }, 0.2)
        .from('.in__r > *', { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.08, ease: 'eExpo' }, 0.8)
    }, el)
    const t = setTimeout(() => leave(false), 5200)
    const key = (e) => { if (e.key === 'Escape' || e.key === 'Enter') leave(false) }
    window.addEventListener('keydown', key)
    el.querySelector('.in__go')?.focus({ preventScroll: true })
    return () => { clearTimeout(t); ctx.revert(); r.classList.remove('rq-lock'); window.removeEventListener('keydown', key) }
  }, [on]) // eslint-disable-line react-hooks/exhaustive-deps
  const leave = (sound) => {
    if (sound) soundOn()
    const el = ref.current
    if (!el || el.dataset.leaving) return
    el.dataset.leaving = '1'
    gsap.timeline({ onComplete: () => { setOn(false); requestAnimationFrame(() => ScrollTrigger.refresh()) } })
      .to(el.querySelectorAll('.in__c'), { yPercent: -120, duration: 0.6, stagger: 0.02, ease: 'eInOut' })
      .to(el.querySelectorAll('.in__r'), { autoAlpha: 0, duration: 0.3 }, 0)
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'eCurtain' }, 0.35)
  }
  if (!on) return null
  return (
    <div className="in" ref={ref} role="dialog" aria-modal="true" aria-label={`${site.name}: opening`}>
      <Shader preset="violet" className="in__bg" />
      <div className="in__mid">
        <p className="in__name" aria-label={site.name}>{site.name.split('').map((c, i) => <span key={i} className="in__m" aria-hidden="true"><span className="in__c">{c === ' ' ? ' ' : c}</span></span>)}</p>
        <div className="in__r">
          <p>Product manager. Systems thinker. Builder.</p>
          <div className="in__btns">
            <button type="button" className="in__go" onClick={() => leave(true)}><span className="in__eq" aria-hidden="true"><i /><i /><i /><i /></span>Enter with sound</button>
            <button type="button" className="in__q" onClick={() => leave(false)}>Enter quietly</button>
          </div>
        </div>
      </div>
    </div>
  )
}
