import { useState } from 'react'
import { evidence, findingCard, rankedFindings } from '../content'

const F = rankedFindings[0]
const LABEL = { confirmed: 'ok', supported: 'sky', hypothesis: 'grey' }

/** The seven-field finding card. `interactive` lets the reader flip the evidence label to see how each is defined. */
export function FindingCard({ interactive = false }) {
  const [label, setLabel] = useState('supported')
  const def = evidence.find((e) => e.id === label)
  return (
    <article className="fcard">
      <header className="fcard__head">
        <div>
          <p className="label">{F.id} · {F.lane} lane</p>
          <h3 className="h-3">{F.t}</h3>
        </div>
      </header>
      <dl className="fcard__fields">
        {findingCard.fields.map((f) => (
          <div key={f.id} className={`fcard__row${f.id === 'unseen' ? ' is-unseen' : ''}`}>
            <dt><span className="label">{f.k}</span><small>{f.q}</small></dt>
            <dd>
              {f.id === 'label'
                ? <span className="fcard__label"><span className={`status status--${LABEL[label]}`}>{def.label}</span><span className="muted">{def.d}</span></span>
                : f.ex}
            </dd>
          </div>
        ))}
      </dl>
      {interactive && (
        <div className="fcard__toggle" role="group" aria-label="Try each evidence label">
          <span className="label">Try each label</span>
          {evidence.map((e) => (
            <button key={e.id} type="button" className="chip" aria-pressed={label === e.id} onClick={() => setLabel(e.id)}>{e.label}</button>
          ))}
        </div>
      )}
      <p className="fcard__note label">{findingCard.note}</p>
    </article>
  )
}
