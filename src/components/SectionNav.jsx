import { useRef, useState } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/motion'

/** A sticky bar of in-page links. The link for the section on screen is marked current (scroll position, via ScrollTrigger). */
export function SectionNav({ items, label = 'On this page' }) {
  const ref = useRef(null)
  const [active, setActive] = useState(items[0].id)
  useGSAP(() => {
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      ScrollTrigger.create({ trigger: el, start: 'top 45%', end: 'bottom 45%', onToggle: (self) => { if (self.isActive) setActive(id) } })
    })
  }, { dependencies: [items.map((i) => i.id).join('|')], revertOnUpdate: true })
  return (
    <div className="snav" ref={ref}>
      <nav className="container snav__in" aria-label={label}>
        <span className="label snav__l">{label}</span>
        <ul>
          {items.map((it) => <li key={it.id}><a href={`#${it.id}`} aria-current={active === it.id ? 'true' : undefined}>{it.label}</a></li>)}
        </ul>
      </nav>
    </div>
  )
}
