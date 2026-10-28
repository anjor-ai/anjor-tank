import { useEffect, useRef } from 'react'
import { PRESETS, mountShader } from './shader'

/** A shader gradient that fills its parent. `preset` is ember, violet or dawn (see shader.js).
    Server-rendered as a flat field of the preset's colours, so the page never flashes empty. */
export function Shader({ preset = 'violet', className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return undefined
    let s = null
    try { s = mountShader(c, preset, { still: window.matchMedia('(prefers-reduced-motion: reduce)').matches }) } catch { s = null }
    if (s) c.parentElement.classList.add('is-live')
    return () => s && s.destroy()
  }, [preset])
  const p = PRESETS[preset] || PRESETS.violet
  return (
    <div className={`shd shd--${preset} ${className}`.trim()} aria-hidden="true" style={{ '--c1': p.color1, '--c2': p.color2, '--c3': p.color3, '--bg': p.bg || 'transparent' }}>
      <canvas ref={ref} className="shd__cv" />
      {p.grain && <span className="shd__grain" />}
    </div>
  )
}
