import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { Stat } from './kinetic'
import { Arrow, Rich } from './ui'

/* The visual parts of a case study. Each part of the PDF is drawn as a diagram, not set as text:
   problem → four cards · diagnosis → four findings · shift → six stages on a line · architecture → six parts
   workflow → chevrons · requirements → four lenses · measurement → one number and its guardrails · rollout → stairs · impact → numbers. */

const pad = (n) => String(n).padStart(2, '0')

/** Section head used by every part: the part number, its name, the PDF's headline, and one line under it. */
export function Part({ id, n, name, head, lead, children }) {
  return (
    <div id={id} className="cz">
      <header className="cz__h" data-reveal>
        <p className="label cz__k"><span>{pad(n)}</span>{name}</p>
        <h2 className="h-2">{head}</h2>
        {lead && <p className="lead">{lead}</p>}
      </header>
      {children}
    </div>
  )
}

/** Problem: four leaks, each with a large faint numeral. */
export function Leakage({ items }) {
  return (
    <ul className="czq">
      {items.map((it, k) => (
        <li key={it.t} data-reveal><span className="czq__n" aria-hidden="true">{pad(k + 1)}</span><h3 className="h-4">{it.t}</h3><p>{it.d}</p></li>
      ))}
    </ul>
  )
}

/** Diagnosis: four findings, joined by a line that fills as it scrolls in. */
export function Findings({ steps }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const l = ref.current.querySelector('.czf__line i')
      if (l) gsap.fromTo(l, { scaleX: 0 }, { scaleX: 1, ease: 'none', transformOrigin: '0 50%', scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 55%', scrub: 0.5 } })
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <div className="czf" ref={ref}>
      <span className="czf__line" aria-hidden="true"><i /></span>
      <ol>
        {steps.map((s, k) => (
          <li key={s.t} data-reveal><span className="czf__dot" aria-hidden="true" /><p className="label">Finding {pad(k + 1)}</p><h3 className="h-4">{s.t}</h3><p>{s.d}</p></li>
        ))}
      </ol>
    </div>
  )
}

/** Shift: six stages on one line, then the move and the line that sums it up. */
export function Shift({ s }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const l = ref.current.querySelector('.czs__line i')
      const nodes = gsap.utils.toArray('.czs__n', ref.current)
      if (l) gsap.fromTo(l, { scaleX: 0 }, { scaleX: 1, ease: 'none', transformOrigin: '0 50%', scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.5 } })
      nodes.forEach((n, k) => gsap.fromTo(n, { scale: 0.6, autoAlpha: 0.3 }, { scale: 1, autoAlpha: 1, ease: 'back.out(2)', duration: 0.5, scrollTrigger: { trigger: ref.current, start: `top ${78 - k * 3}%`, once: true } }))
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <div ref={ref}>
      <div className="czs">
        <span className="czs__line" aria-hidden="true"><i /></span>
        <ol>{s.stages.map((x, k) => <li key={x.t}><span className="czs__n">{k + 1}</span><h3 className="h-4">{x.t}</h3><p>{x.d}</p></li>)}</ol>
      </div>
      <div className="czs__move" data-reveal>
        <p className="label">The strategic move</p>
        <p className="czs__m">{s.move}</p>
        <blockquote>{s.quote}</blockquote>
      </div>
    </div>
  )
}

/** Architecture: six numbered parts, then the principle. */
export function Architecture({ a }) {
  return (
    <div>
      <ul className="cza">{a.parts.map((p, k) => <li key={p.t} data-reveal><span className="cza__n">{pad(k + 1)}</span><h3 className="h-4">{p.t}</h3><p>{p.d}</p></li>)}</ul>
      <p className="cza__p" data-reveal><span className="label">Principle</span>{a.principle}</p>
    </div>
  )
}

/** Workflow: five chevrons in a row, each with its one line. */
export function Chevrons({ steps }) {
  return (
    <ol className="czw">
      {steps.map((s, k) => (
        <li key={s.t} data-reveal><span className="czw__c"><b>{k + 1}</b>{s.t}</span><p>{s.d}</p></li>
      ))}
    </ol>
  )
}

/** Requirements: four lenses. */
export function Lenses({ items }) {
  return (
    <ul className="czl">
      {items.map(([k, v], i) => <li key={k} data-reveal><span className="label">{pad(i + 1)} · {k}</span><p>{v}</p></li>)}
    </ul>
  )
}

/** Measurement: one primary number on the left, the guardrails and the cuts on the right. */
export function Measure({ m }) {
  return (
    <div className="czm">
      <div className="czm__p" data-reveal>
        <p className="label">Primary success metric</p>
        <h3 className="czm__t">{m.primary[0]}</h3>
        <p>{m.primary[1]}</p>
      </div>
      <div className="czm__g" data-reveal>
        <p className="label">Guardrail metrics</p>
        <ul className="czm__c czm__c--g">{m.guard.map((g) => <li key={g}>{g}</li>)}</ul>
        <p className="label">Cut by</p>
        <ul className="czm__c">{m.seg.map((g) => <li key={g}>{g}</li>)}</ul>
      </div>
    </div>
  )
}

/** Rollout: five steps that climb. */
export function Stairs({ steps }) {
  return (
    <ol className="czr">
      {steps.map((s, k) => <li key={s.t} data-reveal style={{ '--k': k }}><span className="czr__n">{k + 1}</span><h3 className="h-4">{s.t}</h3><p>{s.d}</p></li>)}
    </ol>
  )
}

/** Impact: the numbers (they count up), what they prove, what drove them. */
export function Impact({ i }) {
  return (
    <div className="czi">
      <ul className="czi__n">
        {i.rows.map(([v, l, t]) => <li key={l} data-reveal><Stat v={v} className="czi__v" /><span>{l}</span>{t && <small className="label">{t}</small>}</li>)}
      </ul>
      <div className="czi__x" data-reveal>
        <p className="label">What this proves</p>
        <p className="czi__pv">{i.proves}</p>
        <p className="label">What drove it</p>
        <ul className="czi__d">{i.drove.map(([a, b]) => <li key={a}><b>{a}</b>{b && <span>{b}</span>}</li>)}</ul>
      </div>
    </div>
  )
}

/** Playbook: where else it fits, and how an engagement would run. */
export function Playbook({ p }) {
  return (
    <div className="czp" data-reveal>
      <div>
        <p className="label">Client fit</p>
        <ul className="czm__c">{p.uses.map((u) => <li key={u}>{u}</li>)}</ul>
      </div>
      <div>
        <p className="label">Best engagement shape</p>
        <ol className="czp__s">
          {p.shape.map(([w, t], k) => <li key={t}>{k > 0 && <Arrow />}<span><b>{w}</b>{t}</span></li>)}
        </ol>
      </div>
    </div>
  )
}

export { Rich }
