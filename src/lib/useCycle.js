import { useEffect, useRef, useState } from 'react'
import { MQ } from './motion'

/** Step through `n` states every `ms`, until a person picks one. Off under reduced motion. Pauses while off screen when `ref` is given. */
export function useCycle(n, ms = 3200, ref) {
  const [i, setI] = useState(0)
  const human = useRef(false)
  const seen = useRef(true)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia(MQ.motion).matches) return
    let io
    if (ref && ref.current && typeof IntersectionObserver !== 'undefined') {
      seen.current = false
      io = new IntersectionObserver(([e]) => { seen.current = e.isIntersecting }, { threshold: 0.25 })
      io.observe(ref.current)
    }
    const t = setInterval(() => { if (!human.current && seen.current) setI((x) => (x + 1) % n) }, ms)
    return () => { clearInterval(t); io && io.disconnect() }
  }, [n, ms, ref])
  return [i, (k) => { human.current = true; setI(k) }]
}
