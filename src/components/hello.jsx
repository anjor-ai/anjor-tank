import { useEffect, useRef, useState } from 'react'
import { MQ, gsap } from '../lib/motion'

/** The hero greeting: "Hello" in a new language every couple of seconds.
    Each word leaves upward and the next springs up out of the same mask; the language name follows it.
    Pauses off-screen and in a background tab. Under reduced motion (and without JS) it is a still "Hello". */
export function Hello({ items }) {
  const [i, setI] = useState(0)
  const ref = useRef(null)
  const first = useRef(true)

  // Bring each new word in.
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const el = ref.current
    if (!el) return
    const tw = gsap.fromTo(el.querySelectorAll('.hey__i'), { yPercent: 115, rotate: 4, autoAlpha: 0 }, { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 0.75, ease: 'eSpring', stagger: 0.06 })
    return () => tw.kill()
  }, [i])

  // The clock: send the current word out, then swap.
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia(MQ.motion).matches) return
    let seen = true, out = null
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting }, { threshold: 0 })
    io.observe(el)
    const id = setInterval(() => {
      if (!seen || document.hidden) return
      out = gsap.to(el.querySelectorAll('.hey__i'), { yPercent: -115, rotate: -3, autoAlpha: 0, duration: 0.38, ease: 'eInOut', stagger: 0.04, onComplete: () => setI((x) => (x + 1) % items.length) })
    }, 2300)
    return () => { clearInterval(id); io.disconnect(); out && out.kill() }
  }, [items.length])

  const [word, lang, tag] = items[i]
  return (
    <p className="hey" ref={ref}>
      <span className="sr-only">Hello</span>
      <span className="hey__m" aria-hidden="true"><span className="hey__i hey__w" lang={tag} dir="auto">{word}</span></span>
      <span className="hey__m hey__lm" aria-hidden="true"><span className="hey__i hey__l">{lang}</span></span>
    </p>
  )
}
