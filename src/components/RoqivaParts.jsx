import { useRef } from 'react'
import { parts } from '../content'
import { Icon } from './icons'
import { Art } from './Art'
import { useCycle } from '../lib/useCycle'

/* ROQIVA's parts as an expanding carousel: seven panels, one open at a time, cycling while on screen until someone picks one.
   Used on the ROQIVA page and in the home page's ROQIVA band (which gives it the ROQIVA page's dark tokens). */
/* ───────── Parts: an expanding horizontal carousel ───────── */
const PART_ART = { brain: 'brain', detectors: 'scan', orchestrator: 'gate', drafting: 'agent', monitor: 'prove', people: 'person', tools: 'lock' }
const PART_ICON = { brain: 'brain', detectors: 'radar', orchestrator: 'branch', drafting: 'agent', monitor: 'chart', people: 'person', tools: 'layers' }
export function Parts() {
  const ref = useRef(null)
  const list = parts.items
  const [i, pick] = useCycle(list.length, 3800, ref)
  const ssr = typeof window === 'undefined'
  return (
    <div className="rqp" ref={ref} data-reveal>
      {list.map((p, k) => (
        <button key={p.id} type="button" className="rqp__panel" aria-expanded={ssr || i === k} onClick={() => pick(k)} onMouseEnter={() => pick(k)}>
          <span className="rqp__rail"><Icon name={PART_ICON[p.id]} size={16} /><span>{p.name}</span><em>0{k + 1}</em></span>
          <span className="rqp__open">
            <span className="rqp__art acard__art" aria-hidden="true"><Art art={PART_ART[p.id]} /></span>
            <span className="label">{p.kind}</span>
            <b className="h-3">{p.name}</b>
            <span className="rqp__d">{p.d}</span>
          </span>
        </button>
      ))}
    </div>
  )
}


/** The same seven parts for the home and Hire bands: a tidy accordion with its own layout, so every panel lines up.
   Collapsed panels show the icon, a vertical name and the number, all on one left edge; the open one shows the picture,
   the kind, the name and what it does. */
export function PartsRail() {
  const ref = useRef(null)
  const list = parts.items
  const [i, pick] = useCycle(list.length, 3800, ref)
  return (
    <div className="prl" ref={ref}>
      {list.map((p, k) => {
        const on = i === k
        return (
          <button key={p.id} type="button" className={`prl__p${on ? ' is-on' : ''}`} aria-expanded={on} onClick={() => pick(k)} onMouseEnter={() => pick(k)}>
            <span className="prl__top"><span className="prl__ic"><Icon name={PART_ICON[p.id]} size={15} /></span><em>0{k + 1}</em></span>
            {on ? (
              <span className="prl__open">
                <span className="prl__art" aria-hidden="true"><Art art={PART_ART[p.id]} /></span>
                <span className="prl__kind">{p.kind}</span>
                <b className="prl__name">{p.name}</b>
                <span className="prl__d">{p.d}</span>
              </span>
            ) : <span className="prl__v">{p.name}</span>}
          </button>
        )
      })}
    </div>
  )
}
