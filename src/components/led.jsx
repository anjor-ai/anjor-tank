import { useEffect, useRef, useState } from 'react'

/* ═══════════════════════════════════════════════════════════════════════════
   The welcome board: a dot-matrix display that says hello in one language after another, like the departure board
   of a station. Any script works: each word is drawn small on a hidden canvas, and every dot of the board lights
   where that drawing has ink. Words change with a sweep across the board.
   One 2D canvas, redrawn only while a change is running; paused off screen and in background tabs.
   Under reduced motion (and without JS) the board holds a still "Hello".
   ═══════════════════════════════════════════════════════════════════════════ */

const ROWS = 15
const FONT = '"Space Grotesk", "Noto Sans", "Noto Sans Devanagari", "Noto Sans Gujarati", "Noto Sans Tamil", "Noto Sans Bengali", "Noto Sans JP", "Noto Sans KR", "Noto Sans Arabic", system-ui, sans-serif'

/** Which dots a word lights, on a grid `cols` wide and ROWS tall, centred. */
function rasterise(word, cols) {
  const c = document.createElement('canvas')
  c.width = cols; c.height = ROWS
  const x = c.getContext('2d', { willReadFrequently: true })
  let size = ROWS * 0.92
  x.font = `600 ${size}px ${FONT}`
  const w = x.measureText(word).width
  const room = cols - 4
  if (w > room) { size *= room / w; x.font = `600 ${size}px ${FONT}` }
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#000'
  x.fillText(word, cols / 2, ROWS / 2 + 0.5)
  const d = x.getImageData(0, 0, cols, ROWS).data
  const on = new Uint8Array(cols * ROWS)
  for (let i = 0; i < on.length; i++) on[i] = d[i * 4 + 3] > 96 ? 1 : 0
  return on
}

export function LedBoard({ items, className = '' }) {
  const ref = useRef(null)
  const [i, setI] = useState(0)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return undefined
    const ctx = cv.getContext('2d')
    const css = getComputedStyle(cv)
    const lit = css.getPropertyValue('--led-on').trim() || '#ff6a1a'
    const dim = css.getPropertyValue('--led-off').trim() || 'rgba(255,255,255,0.07)'
    const still = !window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    let cols = 64, pitch = 8, from = null, to = null, k = 0, t0 = 0, raf = 0, timer = 0, seen = false
    let level = new Float32Array(0)

    const size = () => {
      const r = cv.getBoundingClientRect()
      if (r.width < 24 || r.height < 8) return // not laid out (hidden, or leaving the page)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      pitch = r.height / ROWS
      cols = Math.max(24, Math.floor(r.width / pitch))
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, (r.width - cols * pitch) / 2 * dpr, 0)
      to = rasterise(items[k][0], cols)
      level = Float32Array.from(to)
      from = to
      draw()
    }
    const draw = () => {
      if (!level.length) return
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore()
      const rad = pitch * 0.34
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < cols; x++) {
        const v = level[y * cols + x]
        ctx.fillStyle = dim
        ctx.beginPath(); ctx.arc(x * pitch + pitch / 2, y * pitch + pitch / 2, rad, 0, Math.PI * 2); ctx.fill()
        if (v > 0.02) {
          ctx.globalAlpha = v
          ctx.fillStyle = lit
          ctx.beginPath(); ctx.arc(x * pitch + pitch / 2, y * pitch + pitch / 2, rad, 0, Math.PI * 2); ctx.fill()
          ctx.globalAlpha = 1
        }
      }
    }
    // A sweep from left to right: the old word goes out a few columns ahead of the new one coming in.
    const DUR = 900
    const frame = (now) => {
      if (!t0) t0 = now
      const p = Math.min(1, (now - t0) / DUR)
      const edge = p * (cols + 14)
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < cols; x++) {
        const j = y * cols + x
        const out = Math.min(1, Math.max(0, (edge - x) / 6))
        const inn = Math.min(1, Math.max(0, (edge - 10 - x) / 6))
        level[j] = from[j] * (1 - out) + to[j] * inn
      }
      draw()
      if (p < 1) raf = requestAnimationFrame(frame)
      else { raf = 0; from = to }
    }
    const next = () => {
      if (!seen || document.hidden || raf || !to) return
      k = (k + 1) % items.length
      setI(k)
      from = to
      to = rasterise(items[k][0], cols)
      t0 = 0
      raf = requestAnimationFrame(frame)
    }
    const ro = new ResizeObserver(size)
    ro.observe(cv)
    document.fonts?.ready.then(size)
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting }, { threshold: 0.1 })
    io.observe(cv)
    if (!still) timer = setInterval(next, 2600)
    return () => { clearInterval(timer); cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [items])
  const [word, lang, tag] = items[i]
  return (
    <div className={`led ${className}`.trim()}>
      <canvas ref={ref} className="led__cv" aria-hidden="true" />
      <p className="led__fallback" aria-hidden="true">Hello</p>
      <p className="led__cap"><span className="sr-only">Hello. </span><span aria-hidden="true"><b lang={tag}>{word}</b><span>{lang}</span></span><span className="led__n" aria-hidden="true">{String(i + 1).padStart(2, '0')} / {items.length}</span></p>
    </div>
  )
}
