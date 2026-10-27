import { useEffect, useRef } from 'react'
import { Icon } from './icons'
import { cx } from './kit'

/* Painted panels and product windows: the stage every showcase on the site is built on.
   Paintings are original, procedurally painted for this site (public/img/paint). PageMotion animates the
   data-v-* hooks (parallax, the window rising, floating cards); nothing here moves without it. */

export const PAINTS = ['dawn', 'noon', 'meadow', 'dusk', 'night']

/** Follows the pointer with a small tilt, written to CSS variables so React never re-renders on move. */
function useTilt() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return undefined
    let raf = 0
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => { el.style.setProperty('--tx', x.toFixed(3)); el.style.setProperty('--ty', y.toFixed(3)) })
    }
    const leave = () => { cancelAnimationFrame(raf); el.style.setProperty('--tx', 0); el.style.setProperty('--ty', 0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [])
  return ref
}

/** A painted panel. Children sit above the painting; `fit` centres them, `bleed` lets the window run off the right and bottom edges. */
export function Paint({ name = 'dawn', fit = 'center', className, children, label, tilt = true }) {
  const ref = useTilt()
  return (
    <div ref={tilt ? ref : undefined} className={cx('v-paint', `v-paint--${fit}`, className)} data-v-panel>
      <img className="v-paint__img" src={`/img/paint/${name}.webp`} alt="" width="1600" height="1000" loading="lazy" decoding="async" data-v-paint />
      <div className="v-paint__stage">{children}</div>
      {label && <span className="v-paint__label">{label}</span>}
    </div>
  )
}

/** A product window with real app chrome: optional sidebar, a title, an optional right-hand tag. */
export function AppWin({ title, tag, side, active = 0, className, children }) {
  return (
    <div className={cx('v-win', side && 'v-win--side', className)} data-v-win>
      <div className="v-win__bar"><span className="v-win__dots" aria-hidden="true"><i /><i /><i /></span><span className="v-win__t">{title}</span>{tag && <span className="v-win__tag">{tag}</span>}</div>
      <div className="v-win__main">
        {side && (
          <nav className="v-win__side" aria-hidden="true">
            <p className="v-win__brand"><span>◆</span>{side.brand}</p>
            {side.items.map(([icon, label], k) => <span key={label} className={k === active ? 'is-on' : ''}><Icon name={icon} size={13} />{label}</span>)}
          </nav>
        )}
        <div className="v-win__body">{children}</div>
      </div>
    </div>
  )
}

/** A small card that floats above a painting. `depth` sets how far it drifts with scroll and pointer. */
export function Float({ className, depth = 1, children }) {
  return <div className={cx('v-float', className)} data-v-float={depth} style={{ '--d': depth }}>{children}</div>
}

