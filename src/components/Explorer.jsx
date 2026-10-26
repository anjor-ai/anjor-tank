import { useId, useState } from 'react'
import { Icon } from './icons'

/* A spec browser: grouped sections in a sidebar, one open section on the right, in a window like a settings screen.
   Replaces long accordion lists. `groups`: [{ label, items: [{ id, icon, title, body }] }]. In the text snapshot every
   section is rendered; in the browser one is shown at a time. On a narrow screen the sidebar becomes a scrolling row. */
export function Explorer({ title, groups }) {
  const flat = groups.flatMap((g) => g.items)
  const [cur, setCur] = useState(flat[0].id)
  const base = useId()
  const ssr = typeof window === 'undefined'
  const it = flat.find((x) => x.id === cur)
  return (
    <div className="ex" data-reveal>
      <div className="ex__bar"><span className="app__dots" aria-hidden="true"><i /><i /><i /></span><span className="ex__t">{title}</span><span className="ex__n">{flat.length} sections</span></div>
      <div className="ex__body">
        <nav className="ex__side" aria-label={title}>
          {groups.map((g) => (
            <div key={g.label} className="ex__grp">
              <p className="ex__gl">{g.label}</p>
              <ul role="tablist" aria-orientation="vertical">
                {g.items.map((x) => (
                  <li key={x.id}>
                    <button type="button" role="tab" id={`${base}-${x.id}-t`} aria-selected={cur === x.id} aria-controls={`${base}-${x.id}`} className="ex__tab" onClick={() => setCur(x.id)}>
                      <span className="ex__ico"><Icon name={x.icon || 'doc'} size={14} /></span>
                      <span>{x.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="ex__main">
          {(ssr ? flat : [it]).map((x) => (
            <section key={x.id} id={`${base}-${x.id}`} role="tabpanel" aria-labelledby={`${base}-${x.id}-t`} className="ex__panel">
              <h3 className="h-3 ex__h">{x.title}</h3>
              {x.body}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Phases as a stepper: a row of phases, the open phase's detail underneath. */
export function PhaseStepper({ phases }) {
  const [i, setI] = useState(0)
  const ssr = typeof window === 'undefined'
  const show = ssr ? phases : [phases[i]]
  return (
    <div className="ps">
      <ol className="ps__rail">
        {phases.map((p, k) => (
          <li key={p.n}>
            <button type="button" className="ps__b" aria-pressed={i === k} data-done={k < i || undefined} onClick={() => setI(k)}>
              <span className="ps__n">{p.n}</span><span className="ps__name">{p.name}</span>
              {/^Gate \d/.test(p.exit) && <span className="ps__g"><Icon name="gate" size={10} />{p.exit.split(':')[0]}</span>}
            </button>
          </li>
        ))}
      </ol>
      {show.map((p) => (
        <div key={p.n} className="ps__card">
          <p className="ps__goal"><span className="label">Phase {p.n} · {p.name}</span>{p.goal}</p>
          <dl className="ps__grid">
            <div><dt><i className="ps__k ps__k--us" />What we do</dt><dd>{p.we}</dd></div>
            <div><dt><i className="ps__k ps__k--you" />What you do</dt><dd>{p.brand}</dd></div>
            <div><dt><Icon name="doc" size={12} />Produces</dt><dd>{p.out}</dd></div>
            <div><dt><Icon name="check" size={12} />Exit check</dt><dd>{p.exit}</dd></div>
          </dl>
          {!ssr && (
            <div className="ps__nav">
              <button type="button" className="ps__btn" disabled={i === 0} onClick={() => setI(i - 1)}><Icon name="back" size={12} />Previous</button>
              <span className="label">{i + 1} of {phases.length}</span>
              <button type="button" className="ps__btn" disabled={i === phases.length - 1} onClick={() => setI(i + 1)}>Next<Icon name="arrow" size={12} /></button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
