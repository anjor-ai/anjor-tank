import { useCallback, useState } from 'react'
import { run, workflow } from '../content'
import { Actor } from '../components/ui'
import { Icon } from '../components/icons'
import { Stage } from '../showcase/primitives'
import { AuditScene, DecideScene, MonitorScene, ReleaseScene } from './FlowScenes'
import { BuildStage } from './BuildStage'

/* One work item, signal to measured result, played inside a tool screen: the six steps in a sidebar, the live scene on the right.
   Each stage is a scene: a person and an agent working in an app window. Only the current scene is mounted, so nothing piles up.
   variant 'run' (home): it plays itself and moves on when a scene finishes; a click takes over and that scene loops.
   variant 'steps' (platform): the same tool, scenes loop, and what the step does is written out underneath. */

const STEPS = workflow.steps
const GATES = STEPS.filter((s) => s.gate && s.gate.n !== '↻').length
const SPEED = 1.7

const Detect = (p) => <AuditScene part="detect" {...p} />
const Audit = (p) => <AuditScene part="audit" {...p} />
const VIEWS = [[Detect, 0], [Audit, 1], [DecideScene, 2], [BuildStage, 3], [ReleaseScene, 4], [MonitorScene, 5]]
const LIST = VIEWS.map(([View, n]) => {
  const st = STEPS[n]
  return { View, st, key: String(n), num: st.n, name: st.name, gate: st.gate ? (st.gate.n === '↻' ? 'Review' : `Gate ${st.gate.n}`) : null }
})

function Detail({ st, n }) {
  return (
    <div className="wsp__d">
      <header className="spanel__head">
        <p className="label">Step {st.n} of 0{n}</p>
        <h3 className="h-2">{st.name}</h3>
        <p className="spanel__tags">{st.by.map((k) => <Actor key={k} kind={k} />)}</p>
      </header>
      <p className="spanel__does">{st.does}</p>
      <dl className="spanel__facts">
        <div><dt className="label">Who works</dt><dd>{st.who}</dd></div>
        <div><dt className="label">Produces</dt><dd>{st.out}</dd></div>
        <div><dt className="label">Then</dt><dd>{st.gate ? <span className="spanel__gate"><Icon name="gate" size={14} />{st.gate.n === '↻' ? 'Outcome review' : `Gate ${st.gate.n} · ${st.gate.name}`}. {st.gate.who} {st.gate.does}.</span> : st.gateNote}</dd></div>
      </dl>
    </div>
  )
}

export function Workspace({ variant = 'run' }) {
  const hero = variant === 'run'
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(hero)
  const advance = useCallback(() => setI((x) => (x + 1) % LIST.length), [])
  const pick = (k) => { setAuto(false); setI(k) }
  const resume = () => { setAuto(true); setI(0) }
  const ssr = typeof window === 'undefined'   // the text snapshot for crawlers lists every stage; the browser mounts one at a time
  const cur = LIST[i]
  const Cur = cur.View
  const done = Math.round(((i + 1) / LIST.length) * 100)

  return (
    <div className={`wsp wsp--${variant}`}>
      <Stage grow={!hero} tone={hero ? 'violet' : 'soft'} label={hero ? 'End-to-end run' : 'The workflow, step by step'} className="wsp__stage">
        <div className="wt">
          <div className="wt__bar">
            <span className="app__dots" aria-hidden="true"><i /><i /><i /></span>
            <p className="wt__path"><Icon name="grid" size={13} /><span>Workspace</span><Icon name="chev" size={11} /><span className="is-last">{run.id}</span></p>
            <span className="wt__live" aria-hidden="true"><i />{auto ? 'Playing the run' : 'Step on loop'}</span>
          </div>
          <div className="wt__body">
            <aside className="wt__side" aria-label="Workflow">
              <div className="wt__wi">
                <p className="label">Work item</p>
                <p className="wt__wit"><b>{run.id}</b>{run.title}</p>
                <span className="wt__prog" aria-hidden="true"><i style={{ width: `${done}%` }} /></span>
                <p className="wt__cnt"><span>Step {i + 1} of {LIST.length}</span><span>{GATES} gates</span></p>
              </div>
              <p className="label wt__h">Workflow</p>
              <ol className="wt__steps">
                {LIST.map((s, k) => (
                  <li key={s.key}>
                    <button type="button" className="wt__step" data-state={i === k ? 'current' : k < i ? 'done' : 'todo'} aria-current={i === k ? 'step' : undefined} onClick={() => pick(k)}>
                      <span className="wt__n">{k < i ? <Icon name="check" size={11} /> : s.num}</span>
                      <span className="wt__txt">
                        <b>{s.name}</b>
                        <span className="wt__by" aria-hidden="true">{s.st.by.map((b) => <i key={b} className={`wt__k wt__k--${b}`} />)}<small>{s.st.who}</small></span>
                      </span>
                      {s.gate && <span className="wt__g"><Icon name="gate" size={10} />{s.gate}</span>}
                    </button>
                  </li>
                ))}
              </ol>
              <div className="wt__foot">
                {hero && !auto
                  ? <button type="button" className="wt__play" onClick={resume}><Icon name="play" size={11} />Play the whole run</button>
                  : <p className="label">Every send-back is stored in the Brain</p>}
              </div>
            </aside>
            <div className="wt__main">
              {ssr
                ? LIST.map((s) => <s.View key={s.key} />)
                : <Cur key={`${i}-${auto}`} mode={auto ? 'active' : 'view'} onDone={advance} auto={auto} speed={hero ? SPEED : 1.4} hold={hero ? 1.2 : 3} phoneH={890} />}
            </div>
          </div>
        </div>
      </Stage>
      {!hero && (ssr ? LIST.map((s) => <Detail key={s.key} st={s.st} n={STEPS.length} />) : <Detail st={cur.st} n={STEPS.length} />)}
    </div>
  )
}
