import { useEffect, useRef, useState } from 'react'
import { LAND } from '../art/land'
import { MQ } from '../lib/motion'

/* ═══════════════════════════════════════════════════════════════════════════
   Based in: a dotted globe that sways around Mumbai, a live clock in Mumbai time, and the day as a bar.
   The globe is Natural Earth land (art/land.js) drawn as dots in an orthographic projection on one 2D canvas,
   redrawn only while it is on screen. Under reduced motion it holds still, centred on Mumbai.
   ═══════════════════════════════════════════════════════════════════════════ */

const HOME = [72.88, 19.08] // Mumbai
const R = Math.PI / 180

export function Globe({ className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return undefined
    const x = cv.getContext('2d')
    const still = !window.matchMedia(MQ.motion).matches
    let raf = 0, seen = false, last = 0
    const draw = (now) => {
      if (now - last < 33 && !still) { raf = requestAnimationFrame(draw); return }
      last = now
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = cv.clientWidth, h = cv.clientHeight
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr) }
      x.setTransform(dpr, 0, 0, dpr, 0, 0)
      x.clearRect(0, 0, w, h)
      const css = getComputedStyle(cv)
      const ink = css.getPropertyValue('--g-ink').trim() || '#121311'
      const pin = css.getPropertyValue('--g-pin').trim() || '#0a6cff'
      const r = Math.min(w, h) * 0.46, cx = w / 2, cy = h / 2
      const t = still ? 0 : now / 1000
      const l0 = (HOME[0] + 38 * Math.sin(t * 0.18)) * R, p0 = 14 * R
      const sp = Math.sin(p0), cp = Math.cos(p0)
      const proj = (lon, lat) => {
        const l = lon * R - l0, p = lat * R
        const cosc = sp * Math.sin(p) + cp * Math.cos(p) * Math.cos(l)
        return [cx + r * Math.cos(p) * Math.sin(l), cy - r * (cp * Math.sin(p) - sp * Math.cos(p) * Math.cos(l)), cosc]
      }
      // the rim
      x.globalAlpha = 0.12; x.strokeStyle = ink; x.lineWidth = 1
      x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke()
      x.fillStyle = ink
      for (let i = 0; i < LAND.length; i += 2) {
        const [px, py, z] = proj(LAND[i], LAND[i + 1])
        if (z < -0.05) continue
        x.globalAlpha = z < 0 ? 0.05 : 0.18 + 0.62 * z
        const s = 0.9 + 1.1 * Math.max(0, z)
        x.fillRect(px - s / 2, py - s / 2, s, s)
      }
      const [hx, hy, hz] = proj(HOME[0], HOME[1])
      if (hz > 0) {
        const k = still ? 0.5 : (t % 2.2) / 2.2
        x.globalAlpha = 0.5 * (1 - k); x.strokeStyle = pin; x.lineWidth = 1.5
        x.beginPath(); x.arc(hx, hy, 5 + k * 18, 0, Math.PI * 2); x.stroke()
        x.globalAlpha = 1; x.fillStyle = pin
        x.beginPath(); x.arc(hx, hy, 4.5, 0, Math.PI * 2); x.fill()
        x.strokeStyle = css.getPropertyValue('--g-ring').trim() || '#fff'; x.lineWidth = 2; x.stroke()
      }
      x.globalAlpha = 1
      if (seen && !still) raf = requestAnimationFrame(draw)
    }
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; cancelAnimationFrame(raf); if (seen) raf = requestAnimationFrame(draw) })
    io.observe(cv)
    draw(0)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [])
  return <canvas ref={ref} className={`globe ${className}`.trim()} role="img" aria-label="A dotted globe with a pin on Mumbai" />
}

/** Mumbai time, to the minute, and where it sits in the day (0–1). */
export function useMumbai() {
  const [now, setNow] = useState(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const h = setInterval(tick, 20000)
    return () => clearInterval(h)
  }, [])
  if (!now) return { time: '', day: 0.5, ampm: '' }
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(now).map((p) => [p.type, p.value]))
  const h24 = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hourCycle: 'h23' }).format(now))
  const m = Number(parts.minute)
  return { time: `${parts.hour}:${parts.minute}`, ampm: (parts.dayPeriod || '').toLowerCase(), day: (h24 * 60 + m) / 1440 }
}

export function BasedIn() {
  const { time, ampm, day } = useMumbai()
  return (
    <div className="gb">
      <div className="gb__top"><span className="gb__k">Based in</span><span className="gb__tz">IST · UTC+5:30</span></div>
      <Globe className="gb__globe" />
      <div className="gb__foot">
        <p className="gb__city"><b>Mumbai</b><span>India</span></p>
        <p className="gb__time" aria-label={time ? `Local time ${time} ${ampm}` : undefined}><b>{time || '--:--'}</b><span>{ampm}</span></p>
      </div>
      <div className="gb__day" aria-hidden="true"><i style={{ left: `${day * 100}%` }} /></div>
    </div>
  )
}
