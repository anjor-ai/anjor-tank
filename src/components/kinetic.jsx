import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/motion'
import { useMedia } from '../lib/hooks'
import { Icon } from './icons'

/* Motion pieces used across the site. Each one is plain markup first; the movement is added by GSAP only when motion is allowed.
   · Stat      a number that counts up when it scrolls into view ("+12.5pp", "~1,100", "−20%"); strings with two numbers stay still
   · Kinetic   big outlined type bands that slide sideways against the scroll (decorative: hidden from readers)
   · LayerStack  glass layers that start stacked and pull apart as the section scrolls, with the matching label lit
   · WorkRing  a curved 3D carousel of cards: drag, swipe, arrows or keys; a plain scroll row on small screens and under reduced motion */

const NUM = /^([^\d]*)(\d[\d,]*\.?\d*)([^\d]*)$/

export function Stat({ v, className = '' }) {
  const ref = useRef(null)
  const m = NUM.exec(v)
  useGSAP(() => {
    if (!m) return undefined
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const [, pre, num, suf] = m
      const dp = (num.split('.')[1] || '').length
      const to = parseFloat(num.replace(/,/g, ''))
      const fmt = (x) => (num.includes(',') ? x.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }) : x.toFixed(dp))
      const o = { v: 0 }
      ref.current.textContent = pre + fmt(0) + suf
      const st = ScrollTrigger.create({
        trigger: ref.current, start: 'top 94%', once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 1.5, ease: 'power3.out', onUpdate: () => { if (ref.current) ref.current.textContent = pre + fmt(o.v) + suf } }),
      })
      return () => { st.kill(); if (ref.current) ref.current.textContent = v }
    })
    return () => mm.revert()
  }, { scope: ref, dependencies: [v] })
  return <b ref={ref} className={className}>{v}</b>
}

/** Rows of large outlined type. Rows alternate direction and move with the scroll. */
export function Kinetic({ rows }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.utils.toArray('.kin__r', ref.current).forEach((r, k) => {
        const dir = k % 2 ? 1 : -1
        gsap.fromTo(r.firstElementChild, { xPercent: dir > 0 ? -34 : 0 }, { xPercent: dir > 0 ? 0 : -34, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
      })
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <div className="kin" ref={ref} aria-hidden="true">
      {rows.map((t, k) => (
        <div key={t} className={`kin__r${k % 2 ? ' is-fill' : ''}`}>
          <span>{Array.from({ length: 5 }, () => `${t} · `).join('')}</span>
        </div>
      ))}
    </div>
  )
}

/** Layers: `layers` = [{ id, n, t, s, d }], first is the top plate. Stacked while the section enters, pulled apart by the time it is centred. */
export function LayerStack({ layers, label }) {
  const ref = useRef(null)
  const [on, setOn] = useState(0)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const plates = gsap.utils.toArray('.lyr__p', ref.current)
      const n = plates.length
      const gap = window.innerWidth < 700 ? 52 : 74
      gsap.set(plates, { z: (i) => (n - 1 - i) * 8 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current, start: 'top 75%', end: 'center 45%', scrub: 0.7,
          onUpdate: (s) => setOn(Math.min(n - 1, Math.floor(s.progress * n * 0.999))),
        },
      })
      tl.to(plates, { z: (i) => (n - 1 - i) * gap, ease: 'none' }, 0)
        .fromTo(ref.current.querySelector('.lyr__st'), { rotateZ: -8 }, { rotateZ: -26, ease: 'none' }, 0)
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <div className="lyr" ref={ref} role="group" aria-label={label}>
      <div className="lyr__v" aria-hidden="true">
        <div className="lyr__st">
          {layers.map((l, i) => <span key={l.id} className={`lyr__p${on === i ? ' is-on' : ''}`}><i>{l.n}</i></span>)}
        </div>
      </div>
      <ol className="lyr__l">
        {layers.map((l, i) => (
          <li key={l.id} className={on === i ? 'is-on' : ''}>
            <span className="label">{l.n} · {l.s}</span>
            <h3 className="h-4">{l.t}</h3>
            <p>{l.d}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** The ring. `items` are rendered by `render(item, active)`; `onOpen(item)` is called for the front card. */
export function WorkRing({ items, render, label }) {
  const small = useMedia('(max-width: 860px)')
  const still = useMedia(MQ.reduce)
  const list = small || still
  const ref = useRef(null)
  const pos = useRef({ v: 0 })
  const [cur, setCur] = useState(0)
  const N = items.length

  const layout = useCallback(() => {
    const root = ref.current
    if (!root) return
    const w = root.clientWidth
    const R = Math.min(560, w * 0.42)
    root.querySelectorAll('.cwr__c').forEach((el, i) => {
      let d = i - pos.current.v
      d = ((((d + N / 2) % N) + N) % N) - N / 2
      const a = d * 0.7
      const x = Math.sin(a) * R * 1.12
      const z = (Math.cos(a) - 1) * R * 0.8
      const s = 1 - Math.min(Math.abs(d), 3) * 0.07
      el.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${(-a * 57.3 * 0.78).toFixed(2)}deg) scale(${s.toFixed(3)})`
      el.style.opacity = String(Math.max(0, 1 - Math.abs(d) / 2.7).toFixed(3))
      el.style.zIndex = String(100 - Math.round(Math.abs(d) * 10))
      el.style.pointerEvents = Math.abs(d) > 2.4 ? 'none' : 'auto'
    })
  }, [N])

  const go = useCallback((i) => {
    const base = Math.round(pos.current.v)
    const cur0 = ((base % N) + N) % N
    let diff = i - cur0
    if (diff > N / 2) diff -= N
    if (diff < -N / 2) diff += N
    const target = base + diff
    setCur(((target % N) + N) % N)
    gsap.to(pos.current, { v: target, duration: 1, ease: 'expo.out', overwrite: true, onUpdate: layout })
  }, [N, layout])

  useEffect(() => {
    if (list) return undefined
    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(ref.current)
    let sx = 0, sv = 0, drag = false, moved = 0
    const el = ref.current
    const down = (e) => { if (e.button > 0) return; drag = true; moved = 0; sx = e.clientX; sv = pos.current.v; gsap.killTweensOf(pos.current) }
    const move = (e) => {
      if (!drag) return
      const dx = e.clientX - sx
      moved = Math.max(moved, Math.abs(dx))
      if (moved > 6) { pos.current.v = sv - dx / 260; layout() }
    }
    const up = () => { if (!drag) return; drag = false; if (moved > 6) { const t = Math.round(pos.current.v); setCur(((t % N) + N) % N); gsap.to(pos.current, { v: t, duration: 0.7, ease: 'expo.out', onUpdate: layout }) } }
    const click = (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0 } }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    el.addEventListener('click', click, true)
    return () => { ro.disconnect(); el.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); el.removeEventListener('click', click, true); gsap.killTweensOf(pos.current) }
  }, [list, layout, N])

  const key = (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go((cur + 1) % N) } if (e.key === 'ArrowLeft') { e.preventDefault(); go((cur - 1 + N) % N) } }

  if (list) {
    return <ul className="cwr cwr--list" aria-label={label}>{items.map((it, i) => <li key={i} className="cwr__c">{render(it, true)}</li>)}</ul>
  }
  return (
    <div className="cwr" role="group" aria-roledescription="carousel" aria-label={label} tabIndex={0} onKeyDown={key}>
      <ul className="cwr__ring" ref={ref}>
        {items.map((it, i) => (
          <li key={i} className={`cwr__c${i === cur ? ' is-front' : ''}`} inert={i === cur ? undefined : ''}
            onClickCapture={(e) => { if (i !== cur) { e.preventDefault(); e.stopPropagation(); go(i) } }}>
            {render(it, i === cur)}
          </li>
        ))}
      </ul>
      <div className="cwr__ctl">
        <button type="button" className="chip" onClick={() => go((cur - 1 + N) % N)} aria-label="Previous case"><Icon name="arrow" size={14} className="cwr__prev" /></button>
        <span className="cwr__dots" aria-hidden="true">{items.map((_, i) => <i key={i} className={i === cur ? 'is-on' : ''} onClick={() => go(i)} />)}</span>
        <button type="button" className="chip" onClick={() => go((cur + 1) % N)} aria-label="Next case"><Icon name="arrow" size={14} /></button>
      </div>
    </div>
  )
}
