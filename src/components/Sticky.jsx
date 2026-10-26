import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/motion'
import { useWide } from '../showcase/primitives'
import { Rich } from './ui'

/* Sticky scroll: the text steps scroll on the left, one product screen stays put on the right and changes with the step in view.
   `items`: { id, eyebrow, title, lead, extra, visual: () => node }. On a narrow screen, and in the text snapshot, every step shows
   its own screen inline, so nothing depends on scroll position. Only the current screen is mounted on a wide screen. */
export function Sticky({ items, label }) {
  const wide = useWide(1200)
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  useGSAP(() => {
    if (!wide) return
    const steps = ref.current.querySelectorAll('.stk__step')
    steps.forEach((el, i) => {
      ScrollTrigger.create({ trigger: el, start: 'top 58%', end: 'bottom 58%', onToggle: (self) => { if (self.isActive) setActive(i) } })
    })
  }, { scope: ref, dependencies: [wide], revertOnUpdate: true })

  return (
    <div className={`stk${wide ? ' stk--wide' : ''}`} ref={ref} role="group" aria-label={label}>
      <div className="stk__steps">
        {items.map((it, i) => (
          <section key={it.id} id={it.id} className="stk__step" data-on={!wide || active === i ? 'true' : 'false'} aria-labelledby={`${it.id}-h`}>
            <div className="stk__txt">
              {it.eyebrow && <p className="label eyebrow">{it.eyebrow}</p>}
              <h2 className="h-2" id={`${it.id}-h`}><Rich text={it.title} /></h2>
              {it.lead && <p className="lead">{it.lead}</p>}
              {it.extra}
              {wide && <span className="stk__prog" aria-hidden="true">{items.map((_, k) => <i key={k} className={k === i ? 'is-on' : ''} />)}</span>}
            </div>
            {!wide && <div className="stk__inline">{it.visual()}</div>}
          </section>
        ))}
      </div>
      {wide && (
        <div className="stk__vis">
          <FitPin className="stk__pin" design={1000}>
            <div className="stk__frame" key={items[active].id}>{items[active].visual()}</div>
          </FitPin>
        </div>
      )}
    </div>
  )
}

/* A panel that shows a product screen at the size it was designed for, then fits it to the space it has.
   - `design` (px): the width the screen is laid out at. When the column is narrower, the screen keeps that layout and is scaled
     down to the column, so a desktop illustration never falls back to its phone layout just because it sits beside text. Below
     62% of that width (phones) the screen uses its own small layout instead, because scaling that far would be unreadable.
   - `cap` (px): also fit the height when the panel itself is not sticky but sits inside something that is, leaving `cap`
     pixels for whatever sits above or below it.
   - When the panel is sticky and the screen is taller than the space under the nav, it is scaled down further (never below 50%),
     so it is never cut off at the bottom.
   Only the size on screen changes: the layout, the text and the animation are the same. */
export function FitPin({ className = '', design = 0, cap, children, ...rest }) {
  const outer = useRef(null)
  const inner = useRef(null)
  useEffect(() => {
    const o = outer.current, n = inner.current
    if (!o || !n || typeof ResizeObserver === 'undefined') return undefined
    let last = ''
    const fit = () => {
      const ow = o.clientWidth
      const wide = design && ow < design && ow >= design * 0.62
      n.style.width = wide ? `${design}px` : ''
      const w = wide ? design : ow
      const h = n.offsetHeight // layout size: unaffected by the transform below
      let s = w > 0 ? Math.min(1, ow / w) : 1
      if (cap != null || getComputedStyle(o).position === 'sticky') {
        const nav = document.querySelector('.nav')?.offsetHeight || 0
        const sn = document.querySelector('.snav')?.offsetHeight || 0
        // A parent may scale this box with CSS zoom: convert screen pixels into its own pixels.
        const zr = o.offsetWidth ? o.getBoundingClientRect().width / o.offsetWidth : 1
        const avail = (window.innerHeight - nav - sn - 32) / (zr || 1) - (cap || 0)
        if (h * s > avail) s = Math.max(0.5, avail / h)
      }
      const key = `${w}|${h}|${s.toFixed(3)}`
      if (key === last) return
      last = key
      const x = Math.max(0, (ow - w * s) / 2)
      n.style.transform = s < 1 ? `translate3d(${x.toFixed(1)}px,0,0) scale(${s.toFixed(3)})` : ''
      o.style.height = s < 1 ? `${Math.ceil(h * s)}px` : ''
    }
    const ro = new ResizeObserver(fit)
    ro.observe(n)
    ro.observe(o)
    window.addEventListener('resize', fit)
    fit()
    const late = setTimeout(fit, 1600) // after entrance animations have settled
    return () => { ro.disconnect(); clearTimeout(late); window.removeEventListener('resize', fit) }
  }, [design, cap])
  return <div ref={outer} className={`fitbox ${className}`.trim()} {...rest}><div ref={inner} className="fitpin">{children}</div></div>
}
