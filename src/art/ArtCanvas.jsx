import { useEffect, useRef } from 'react'
import { blit, makeAscii, makeDots, RAMP } from './space'

/* Two canvases for the art engine. Both size themselves to their box, run only while on screen and the tab is visible,
   cap their frame rate, and draw one still frame under reduced motion. They are decorative: aria-hidden, no text. */

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useArtLoop(ref, { fps, still, setup, render, clock, fromView = false }) {
  const live = useRef({}); live.current = { render, clock, setup }
  useEffect(() => {
    const cv = ref.current
    if (!cv) return undefined
    const ctx = cv.getContext('2d')
    let raf = 0, visible = false, last = 0, ready = false, seen = false
    let t0 = performance.now()
    const now = () => (live.current.clock ? live.current.clock() : (performance.now() - t0) / 1000)
    const draw = () => {
      if (!ready) return
      const s0 = performance.now()
      live.current.render(ctx, reduced() ? still : now())
      // Test hook: per-canvas frame cost, only when a test runner sets __OI_TEST__
      if (window.__OI_TEST__) { const a = (window.__ART ||= {}); const k = cv.className + ' ' + cv.width + 'x' + cv.height; a[k] = a[k] || [0, 0]; a[k][0] += performance.now() - s0; a[k][1]++ }
    }
    // The larger of the on-screen box and the layout box: a transform may be shrinking the canvas for an entrance (a tile that
    // pops in from scale 0.2), and the picture should be drawn for the size it ends at
    const size = () => { const b = cv.getBoundingClientRect(); const r = { width: Math.max(b.width, cv.offsetWidth), height: Math.max(b.height, cv.offsetHeight) }; if (r.width < 2 || r.height < 2) return; ready = live.current.setup(cv, ctx, r) !== false; draw() }
    const loop = (ts) => { raf = requestAnimationFrame(loop); if (ts - last < 1000 / fps) return; last = ts; draw() }
    const start = () => { if (!raf && !reduced()) raf = requestAnimationFrame(loop) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }
    const ro = new ResizeObserver(size); ro.observe(cv)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && fromView && !seen) { seen = true; t0 = performance.now() } // start the scene when it is first seen
      if (visible && !document.hidden) start(); else stop()
    }, { rootMargin: fromView ? '0px' : '120px' })
    io.observe(cv)
    const vis = () => { if (document.hidden || !visible) stop(); else start() }
    document.addEventListener('visibilitychange', vis)
    size()
    return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis) }
  }, [fps, still])
}

/** Dot-matrix canvas. `draw(D, t)` fills the cell grid; `overlay(ctx, D, k, t)` can add hairlines on top. */
export function DotCanvas({ draw, overlay, cell = 5, k = 3, gap = 1, fps = 24, still = 3, clock, className = '' }) {
  const ref = useRef(null)
  const st = useRef({})
  useArtLoop(ref, {
    fps, still, clock,
    setup: (cv, ctx, r) => {
      const cols = Math.max(8, Math.round(r.width / cell)), rows = Math.max(8, Math.round(r.height / cell))
      if (st.current.D && st.current.D.cols === cols && st.current.D.rows === rows) return true
      st.current.D = makeDots(cols, rows)
      cv.width = cols * k; cv.height = rows * k
      st.current.img = ctx.createImageData(cv.width, cv.height)
      return true
    },
    render: (ctx, t) => {
      const { D, img } = st.current
      D.buf.fill(0); D.m = null
      draw(D, t)
      blit(ctx, img, D, k, gap)
      if (overlay) overlay(ctx, D, k, t)
    },
  })
  return <canvas ref={ref} className={`artcv artcv--dots ${className}`.trim()} aria-hidden="true" />
}

/** ASCII canvas. `draw(A, t)` fills brightness and kind per glyph cell; `colors[kind]` picks the ink. */
export function AsciiCanvas({ draw, colors, font = 12, fps = 24, still = 3.2, clock, fromView = false, className = '' }) {
  const ref = useRef(null)
  const st = useRef({})
  useArtLoop(ref, {
    fps, still, clock, fromView,
    setup: (cv, ctx, r) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const cw = Math.round(font * 0.62 * dpr), ch = Math.round(font * 1.12 * dpr)
      const cols = Math.max(4, Math.floor((r.width * dpr) / cw)), rows = Math.max(4, Math.floor((r.height * dpr) / ch))
      cv.width = cols * cw; cv.height = rows * ch
      st.current = { A: makeAscii(cols, rows), cw, ch, atlas: colors.map((c) => {
        if (!c) return null
        const a = document.createElement('canvas'); a.width = cw * RAMP.length; a.height = ch
        const x = a.getContext('2d'); x.fillStyle = c; x.textBaseline = 'middle'; x.textAlign = 'center'
        x.font = `500 ${Math.round(font * dpr)}px "IBM Plex Mono", ui-monospace, monospace`
        for (let g = 1; g < RAMP.length; g++) x.fillText(RAMP[g], g * cw + cw / 2, ch / 2 + dpr * 0.5)
        return a
      }) }
      return true
    },
    render: (ctx, t) => {
      const { A, cw, ch, atlas } = st.current
      draw(A, t)
      ctx.clearRect(0, 0, A.cols * cw, A.rows * ch)
      const n = RAMP.length - 1
      for (let j = 0; j < A.rows; j++) for (let i = 0; i < A.cols; i++) {
        const p = j * A.cols + i, v = A.v[p]
        if (v <= 0) continue
        const g = Math.max(1, Math.min(n, Math.round(v * n))), a = atlas[A.k[p]]
        if (a) ctx.drawImage(a, g * cw, 0, cw, ch, i * cw, j * ch, cw, ch)
      }
    },
  })
  return <canvas ref={ref} className={`artcv artcv--ascii ${className}`.trim()} aria-hidden="true" />
}
