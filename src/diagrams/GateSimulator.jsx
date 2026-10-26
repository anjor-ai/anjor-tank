import { useMemo, useReducer, useState } from 'react'
import { examples } from '../content'
import { Actor } from '../components/ui'
import { Icon } from '../components/icons'
import { buildSequence } from './sequence'

const RUN = {
  Detect: 'Detectors logged a signal: data captured that no decision reads.',
  Audit: 'Analyst wrote ranked finding cards, each labelled Confirmed, Supported or Hypothesis.',
  Decide: 'Research, Architect and Product drafted solutions. One solution chosen, with evidence.',
  Build: 'Product, Design, Architect and QA drafted the handoff pack: PRD, wireframe, tickets, test checklist, sources.',
  Release: 'The brand’s engineers shipped. QA reported passed, failed and not tested.',
  Measure: 'Monitor measured the result against the baseline. Verdict: keep, tune or roll back.',
}

const init = { pos: 0, log: [], merged: false, tick: 0 }
function reduce(s, a) {
  const seq = buildSequence({ merged: s.merged })
  const cur = seq[s.pos]
  const add = (text, kind = 'info') => ({ id: s.tick + 1, text, kind })
  switch (a.type) {
    case 'run': return cur?.type === 'step' ? { ...s, pos: s.pos + 1, tick: s.tick + 1, log: [...s.log, add(RUN[cur.name] || `${cur.name} complete.`, 'step')] } : s
    case 'approve': return cur?.type === 'gate' ? { ...s, pos: s.pos + 1, tick: s.tick + 1, log: [...s.log, add(`${cur.name}: approved by ${cur.who}.`, 'ok')] } : s
    case 'back': {
      if (cur?.type !== 'gate') return s
      return { ...s, pos: s.pos - 1, tick: s.tick + 1, log: [...s.log, add(`${cur.name}: sent back to ${seq[s.pos - 1].name}. Reason: ${a.reason}.`, 'back')] }
    }
    case 'merge': {
      const next = buildSequence({ merged: a.on })
      const idx = next.findIndex((x) => x.name === 'Decide')
      if (s.pos > idx) return s // Gates 2 and 3 may only be merged before the Decide step has run
      return { ...s, merged: a.on, tick: s.tick + 1, log: [...s.log, add(a.on ? 'Gates 2 and 3 merged for a small change. Gates 1 and 4 stay.' : 'Gates 2 and 3 separate again.', 'info')] }
    }
    case 'reset': return { ...init, tick: s.tick + 1 }
    default: return s
  }
}

/** A work item through the real sequence. Steps run, gates approve or send back with a reason, every decision lands in the Brain log. */
export function GateSimulator() {
  const [s, dispatch] = useReducer(reduce, init)
  const [choosing, setChoosing] = useState(false)
  const seq = useMemo(() => buildSequence({ merged: s.merged }), [s.merged])
  const cur = seq[s.pos]
  const decideIdx = seq.findIndex((x) => x.name === 'Decide')
  const canMerge = s.pos <= decideIdx
  const done = s.pos >= seq.length
  const sends = s.log.filter((l) => l.kind === 'back').length

  const act = (a) => { setChoosing(false); dispatch(a) }

  return (
    <div className="gsim">
      <div className="gsim__main">
        <ol className="gsim__list" aria-label="Work item sequence">
          {seq.map((x, i) => {
            const state = i < s.pos ? 'done' : i === s.pos ? 'now' : 'next'
            return (
              <li key={x.key} className={`gsim__item gsim__item--${x.type} is-${state}`} aria-current={state === 'now' ? 'step' : undefined}>
                <span className="gsim__mark" aria-hidden>{state === 'done' ? <Icon name="check" size={13} /> : x.type === 'gate' ? <Icon name="gate" size={12} /> : x.n}</span>
                <span className="gsim__name">{x.name}</span>
                <span className="gsim__by">{x.by.map((k) => <Actor key={k} kind={k} />)}</span>
                {x.locked && <span className="label gsim__lock"><Icon name="lock" size={11} />Never skipped</span>}
              </li>
            )
          })}
        </ol>

        <div className="gsim__panel" aria-live="polite">
          {done ? (
            <>
              <p className="label">Work item closed</p>
              <p className="gsim__big">Every approval and every reason is in the Brain log{sends ? `, including ${sends} send-back${sends > 1 ? 's' : ''}` : ''}.</p>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => act({ type: 'reset' })}><Icon name="replay" size={14} />Run another work item</button>
            </>
          ) : cur.type === 'step' ? (
            <>
              <p className="label">Next · {cur.name}</p>
              <p className="gsim__big">{cur.who}</p>
              <p className="muted">Produces: {cur.text}</p>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => act({ type: 'run' })}>Run {cur.name}<Icon name="arrow" size={15} /></button>
            </>
          ) : (
            <>
              <p className="label">{cur.name}</p>
              <p className="gsim__big">{cur.text}.</p>
              {!choosing ? (
                <div className="gsim__acts">
                  <button type="button" className="btn btn--primary btn--sm" onClick={() => act({ type: 'approve' })}><Icon name="check" size={15} />Approve</button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => setChoosing(true)}><Icon name="back" size={15} />Send back one step</button>
                </div>
              ) : (
                <div className="gsim__why" role="group" aria-label="Choose a reason">
                  <p className="label">Reason, stored in the Brain</p>
                  <div className="gsim__chips">
                    {examples.gates.reasons.map((r) => <button key={r} type="button" className="chip" onClick={() => act({ type: 'back', reason: r.toLowerCase() })}>{r}</button>)}
                    <button type="button" className="chip chip--quiet" onClick={() => setChoosing(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </>
          )}
          {!done && <label className={`gsim__merge${canMerge ? '' : ' is-off'}`}>
            <input type="checkbox" checked={s.merged} disabled={!canMerge} onChange={(e) => act({ type: 'merge', on: e.target.checked })} />
            <span>Merge Gates 2 and 3 for a small change</span>
            <small>{canMerge ? 'Gates 1 and 4 can never be merged or skipped.' : 'Choose before the Decide step runs.'}</small>
          </label>}
        </div>
      </div>

      <aside className="gsim__log" aria-label="Brain log">
        <p className="label gsim__logh"><Icon name="brain" size={13} />Brain log</p>
        {s.log.length === 0 ? <p className="muted gsim__empty">Nothing recorded yet. Run the first step.</p> : (
          <ol>{s.log.map((l, i) => <li key={l.id + '-' + i} className={`is-${l.kind}`}><span className="label tnum">{String(i + 1).padStart(2, '0')}</span><span>{l.text}</span></li>)}</ol>
        )}
        {s.log.length > 0 && <button type="button" className="gsim__reset label" onClick={() => act({ type: 'reset' })}>Reset</button>}
      </aside>
    </div>
  )
}
