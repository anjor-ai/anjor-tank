import { useEffect, useRef, useState } from 'react'
import { Icon } from './icons'
import { Screen, cx } from './board'
import { MQ } from '../lib/motion'

/* ═══════════════════════════════════════════════════════════════════════════
   How I think: six steps from a signal to a measured outcome, and the rules that hold them together.
   A run window: the steps on the left with the four gates between them, the open step on the right
   (what happens, who runs it, what it hands on), and the rules along the bottom.
   While nobody is using it the run steps itself forward; a click or key press hands it over for good.
   ═══════════════════════════════════════════════════════════════════════════ */

export const STEPS = [
  { k: 'Detect', icon: 'radar', scene: 'find', d: 'Match every signal to the decision that reads it. Flag the ones nothing reads.', who: ['Code'], out: 'Gaps flagged' },
  { k: 'Audit', icon: 'search', scene: 'find', d: 'Check the evidence, label each finding Confirmed, Supported or Hypothesis, and rank it.', who: ['Analyst'], out: 'Ranked findings', gate: 'Gate 1 · Open the work item' },
  { k: 'Decide', icon: 'branch', scene: 'decide', d: 'Draft two or three ways to fix it, the cheapest always among them. A person picks one.', who: ['Research', 'Architect', 'Product'], out: 'One chosen option', gate: 'Gate 2 · Pick the fix' },
  { k: 'Build', icon: 'layers', scene: 'decide', d: 'Write the spec, the prototype, the system design and the checks as one handoff pack.', who: ['Product', 'Design', 'QA'], out: 'Handoff pack', gate: 'Gate 3 · Approve the handoff' },
  { k: 'Release', icon: 'check', scene: 'prove', d: 'The team that owns the tools builds and ships. QA reports what passed, what failed and what went untested.', who: ['Your engineers', 'QA'], out: 'Signed release', gate: 'Gate 4 · Sign the release' },
  { k: 'Measure', icon: 'chart', scene: 'prove', d: 'Check the release against its spec and a frozen baseline, then keep it, tune it or roll it back.', who: ['Monitor'], out: 'Keep, tune or roll back', gate: 'Outcome review' },
]
export const RULES = ['Code computes every count, join and ranking.', 'Drafts never approve themselves.', 'People decide at named gates.', 'Nothing ships or rolls back on its own.']

export function MethodRun() {
  const [i, setI] = useState(0)
  const human = useRef(false)
  const root = useRef(null)
  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return undefined
    let seen = false
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting }, { threshold: 0.35 })
    io.observe(root.current)
    const t = setInterval(() => { if (seen && !human.current && !document.hidden) setI((n) => (n + 1) % STEPS.length) }, 3800)
    return () => { clearInterval(t); io.disconnect() }
  }, [])
  const take = () => { human.current = true }
  const s = STEPS[i]
  return (
    <div className="mt" ref={root} onPointerDown={take} onKeyDown={take}>
      <div className="mt__bar"><span className="mt__dots" aria-hidden="true"><i /><i /><i /></span><b>One run</b><span className="mt__crumb">Signal to outcome</span><span className="mt__pg">{String(i + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</span></div>
      <div className="mt__body">
        <ol className="mt__steps" aria-label="The six steps">
          {STEPS.map((x, k) => (
            <li key={x.k}>
              <button type="button" className={cx('mt__step', k === i && 'is-on', k < i && 'is-done')} aria-pressed={k === i} onClick={() => setI(k)}>
                <span className="mt__n">{String(k + 1).padStart(2, '0')}</span>
                <span className="mt__ic"><Icon name={x.icon} size={14} /></span>
                <b>{x.k}</b>
                <small>{x.who[0]}</small>
              </button>
              {x.gate && <p className={cx('mt__gate', k < i && 'is-done', k === i && 'is-on')}><Icon name="gate" size={11} />{x.gate}</p>}
            </li>
          ))}
        </ol>
        <article className="mt__view" aria-live="polite">
          <Screen scene={s.scene} className="mt__screen" />
          <div className="u-stack">
            {STEPS.map((x, k) => (
              <div key={x.k} className={cx('mt__copy', k === i ? 'is-on' : 'u-sizer')} aria-hidden={k !== i || undefined}>
                <p className="mt__k"><span>Step {String(k + 1).padStart(2, '0')}</span>{x.k}</p>
                <h3>{x.d}</h3>
                <dl className="mt__facts">
                  <div><dt>Run by</dt><dd>{x.who.map((w) => <span key={w} className="mt__chip">{w}</span>)}</dd></div>
                  <div><dt>Hands on</dt><dd>{x.out}</dd></div>
                  {x.gate && <div><dt>Then</dt><dd>{x.gate}</dd></div>}
                </dl>
              </div>
            ))}
          </div>
        </article>
      </div>
      <ul className="mt__rules" aria-label="The rules">
        {RULES.map((r) => <li key={r}><Icon name="check" size={13} />{r}</li>)}
      </ul>
    </div>
  )
}
