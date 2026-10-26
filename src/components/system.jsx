import { useRef } from 'react'
import { consulting, gtm, home } from '../content'
import { Sticky } from './Sticky'
import { Icon } from './icons'
import { LinkArrow } from './ui'
import { FindingCard } from '../diagrams/FindingCard'
import { useCycle } from '../lib/useCycle'

/* One system, told in four steps: find the leak → fix the loop → prove the lift → run it in ROQIVA.
   SystemRail is the short version for the home page; SystemStory is the pinned scroll story on the Hire page. */

/** Home: four connected cards, the last one is ROQIVA. */
export function SystemRail() {
  const S = home.system
  return (
    <div className="sysr" data-reveal>
      <ol>
        {S.steps.map((s, k) => (
          <li key={s.n} className={k === S.steps.length - 1 ? 'is-end' : ''}>
            <span className="sysr__n">{s.n}</span>
            <h3 className="h-3">{s.t}</h3>
            <p>{s.d}</p>
            {k < S.steps.length - 1 && <Icon name="arrow" size={18} className="sysr__a" />}
          </li>
        ))}
      </ol>
      <p className="more"><LinkArrow to={S.link[1]}>{S.link[0]}</LinkArrow></p>
    </div>
  )
}

const Frame = ({ title, children, note }) => (
  <figure className="sysv">
    <div className="mk__bar"><span className="mk__dots" aria-hidden="true"><i /><i /><i /></span><span className="mk__title">{title}</span></div>
    <div className="sysv__body">{children}</div>
    {note && <figcaption className="label mk__cap">{note}</figcaption>}
  </figure>
)

/* 01 · the journey, with the stages that leak lit one after another */
function LeakVisual() {
  const ref = useRef(null)
  const stages = gtm.journey
  const [i] = useCycle(stages.length, 1500, ref)
  return (
    <Frame title="Journey · where revenue leaks" note="Illustration. The stages are the ones I audit.">
      <div ref={ref}>
        <ol className="sysv__j">{stages.map((s, k) => <li key={s.id} className={k === i ? 'is-leak' : ''}><i /><b>{s.label}</b></li>)}</ol>
        <p className="label sysv__mode">{stages[i].mode} · {stages[i].breaks}</p>
        <ul className="sysv__q">{gtm.problems.map((p) => <li key={p.id}><span className="label">{p.name}</span><q>{p.title.replace(/[“”]/g, '')}</q></li>)}</ul>
      </div>
    </Frame>
  )
}

/* 02 · the six offers as a ladder */
function LoopVisual() {
  return (
    <Frame title="Six offers · one ladder" note="Illustration. Timelines are typical, not promised.">
      <ol className="sysv__l">
        {gtm.services.map((s, k) => (
          <li key={s.id} style={{ '--k': k }}><span className="sysv__c">{s.code}</span><b>{s.name}</b><span>{s.line}</span><small>{s.first}</small></li>
        ))}
      </ol>
    </Frame>
  )
}

/* 03 · holdout and the twelve weeks */
function LiftVisual() {
  return (
    <Frame title="Holdout · what would have happened anyway" note="Illustration. Not a client result.">
      <div className="sysv__h">
        <div className="sysv__b"><span className="label">Holdout · never contacted</span><i style={{ '--w': '62%' }} /></div>
        <div className="sysv__b is-lift"><span className="label">Contacted</span><i style={{ '--w': '84%' }}><em>Incremental lift</em></i></div>
      </div>
      <ol className="sysv__w">
        {gtm.phases.map((p) => <li key={p.id} style={{ gridColumn: `${p.start + 1} / span ${p.span}` }}><b>{p.label}</b><small>{p.weeks}</small></li>)}
      </ol>
    </Frame>
  )
}

/* 04 · ROQIVA's finding card */
function RoqivaVisual() {
  return (
    <div className="sysv sysv--f">
      <FindingCard />
    </div>
  )
}

const VIS = [LeakVisual, LoopVisual, LiftVisual, RoqivaVisual]

/** Hire: the pinned story. */
export function SystemStory() {
  const items = consulting.story.map((s, k) => {
    const V = VIS[k]
    return {
      id: s.id, eyebrow: s.eyebrow, title: s.title, lead: s.lead,
      extra: <ul className="chips-sm gap-top">{s.chips.map((c) => <li key={c}>{c}</li>)}</ul>,
      visual: () => <V />,
    }
  })
  return <Sticky label="Find the leak, fix the loop, prove the lift, run it in ROQIVA" items={items} />
}
