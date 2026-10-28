import { useEffect, useRef } from 'react'

/* The name in the nav, as an ASCII decode: each letter runs through characters from dense to light, left to right,
   and lands on the real letter. Plays on load, every 12 seconds while the tab is visible, and on hover or focus.
   Layout never moves: every slot keeps the width of its final letter. Reduced motion shows the name, still. */
const GLYPHS = '@#%&*+=-:./<>[]{}$01'

export function AsciiName({ text }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const slots = [...el.querySelectorAll('.an__g')]
    let raf = 0, t0 = 0, running = false
    const run = () => {
      if (running) return
      running = true; t0 = performance.now(); el.classList.add('is-run')
      const step = (now) => {
        const t = (now - t0) / 1000
        let done = true
        slots.forEach((s, k) => {
          const start = k * 0.055, end = start + 0.42
          if (t < start) { s.textContent = '·'; done = false }
          else if (t < end) { s.textContent = GLYPHS[(Math.floor(t * 30) + k * 7) % GLYPHS.length]; done = false }
          else s.textContent = s.dataset.c
        })
        if (!done) raf = requestAnimationFrame(step)
        else { running = false; el.classList.remove('is-run') }
      }
      raf = requestAnimationFrame(step)
    }
    run()
    const iv = setInterval(() => { if (!document.hidden) run() }, 12000)
    const a = el.closest('a')
    a?.addEventListener('mouseenter', run); a?.addEventListener('focus', run)
    return () => { cancelAnimationFrame(raf); clearInterval(iv); a?.removeEventListener('mouseenter', run); a?.removeEventListener('focus', run) }
  }, [text])
  return (
    <span ref={ref} className="wordmark an" aria-hidden="true">
      {text.split('').map((c, k) => c === ' '
        ? <span key={k} className="an__sp"> </span>
        : <span key={k} className="an__c"><span className="an__w">{c}</span><span className="an__g" data-c={c}>{c}</span></span>)}
    </span>
  )
}
