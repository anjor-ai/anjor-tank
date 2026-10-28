import { useState } from 'react'
import { Icon } from './icons'
import { Stat } from './kinetic'
import { Arrow } from './ui'
import { Chip, KHead, Tile, Timeline, Win, pad } from './kit'

/* ═══════════════════════════════════════════════════════════════════════════
   The eleven parts of a case study. Each part has its own composition:
   summary → a persona-style bento · problem and diagnosis → windows on paintings (Case.jsx stages them)
   shift → an onboarding stepper you click through · architecture → grid-backed feature cards
   workflow → numbered steps on a line · requirements → four lenses with icon discs
   measurement → one dark primary card, chip cards · rollout → steps that climb
   impact → insight cards, with a before-and-after meter only where both figures are real percentages
   playbook → where else it fits and how an engagement runs.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Section head used by every part: the part number, its name, the case's headline and the line under it. */
export function Part({ n, name, head, lead, children }) {
  return (
    <>
      <KHead n={pad(n)} label={name} title={head} lead={lead} />
      {children}
    </>
  )
}

/** Summary: the one number in a dark card, the role and team beside it, then the surface, the system and why. */
export function Summary({ S, g }) {
  return (
    <div className="cx-sum">
      <Tile tint="ink" className="cx-sum__m">
        <p className="s-k"><span>Primary business metric</span></p>
        <h3>{S.metric}</h3>
      </Tile>
      <Tile className="cx-sum__g">
        <p className="ps__h"><span className="ps__ic"><Icon name="eye" size={15} /></span>At a glance</p>
        <dl>
          <div><dt>My role</dt><dd>{g.role}</dd></div>
          <div><dt>Worked with</dt><dd>{g.team}</dd></div>
          <div><dt>Built on</dt><dd><ul className="k-chips">{g.stack.map((x) => <li key={x}><Chip>{x}</Chip></li>)}</ul></dd></div>
        </dl>
      </Tile>
      {[['layers', 'Product surface', S.surface], ['branch', 'System built', S.system], ['target', 'Why it matters', S.why]].map(([ic, k, v]) => (
        <Tile key={k} className="cx-sum__f">
          <p className="ps__h"><span className="ps__ic"><Icon name={ic} size={15} /></span>{k}</p>
          <p>{v}</p>
        </Tile>
      ))}
    </div>
  )
}

/** Problem: a leak log. */
export function Leakage({ items }) {
  return (
    <Win title="Where the journey leaked" tag={`${items.length} leaks`} className="k-leaks" id="leaks">
      <ol>
        {items.map((it, k) => (
          <li key={it.t}>
            <span className="k-leaks__n">{pad(k + 1)}</span>
            <div><h3>{it.t}</h3><p>{it.d}</p></div>
            <Chip tone="warn">Leak</Chip>
          </li>
        ))}
      </ol>
    </Win>
  )
}

/** Diagnosis: the findings, in the order they were found. */
export function Findings({ steps }) {
  return (
    <Win title="Diagnosis" tag={`${steps.length} findings`} className="k-find">
      <Timeline items={steps.map((s, k) => ({ t: s.t, s: s.d, r: `FINDING ${pad(k + 1)}`, now: k === steps.length - 1 }))} />
    </Win>
  )
}

/** Shift: the stages as an onboarding stepper (Back, Continue, "2 of 6"), the move in a dark card beside it. */
export function Shift({ s }) {
  const [k, setK] = useState(0)
  const n = s.stages.length, st = s.stages[k]
  return (
    <div className="cx-shift">
      <div className="cx-step" data-reveal>
        <div className="cx-step__bar" role="tablist" aria-label="Stages of the shift">
          {s.stages.map((x, j) => <button key={x.t} type="button" role="tab" aria-selected={j === k} className={j <= k ? 'is-past' : ''} onClick={() => setK(j)}><span className="sr-only">{x.t}</span></button>)}
        </div>
        <div className="cx-step__body" key={k} role="tabpanel">
          <p className="s-k"><b>{pad(k + 1)}</b>Stage {k + 1} of {n}</p>
          <h3>{st.t}</h3>
          <p>{st.d}</p>
        </div>
        <footer className="cx-step__f">
          <span>{k + 1} of {n}</span>
          <span className="cx-step__btns">
            <button type="button" className="cx-btn" onClick={() => setK((x) => Math.max(0, x - 1))} disabled={k === 0}>Back</button>
            <button type="button" className="cx-btn cx-btn--on" onClick={() => setK((x) => Math.min(n - 1, x + 1))} disabled={k === n - 1}>Continue</button>
          </span>
        </footer>
      </div>
      <Tile tint="ink" className="cx-move">
        <p className="s-k"><span>The strategic move</span></p>
        <h3>{s.move}</h3>
        <blockquote>{s.quote}</blockquote>
      </Tile>
    </div>
  )
}

/** Architecture: six parts as grid-backed feature cards, then the principle. */
export function Architecture({ a }) {
  return (
    <div className="cx-arch">
      {a.parts.map((p, k) => (
        <article key={p.t} className="cx-feat" data-reveal>
          <div className="cx-feat__grid" aria-hidden="true"><b>{pad(k + 1)}</b></div>
          <h3>{p.t}</h3><p>{p.d}</p>
        </article>
      ))}
      <Tile tint="soft" className="cx-principle"><p className="s-k"><span>Principle</span></p><p>{a.principle}</p></Tile>
    </div>
  )
}

/** Workflow: numbered steps on one line. */
export function Chevrons({ steps }) {
  return (
    <ol className="cx-flow" style={{ '--n': steps.length }}>
      {steps.map((s, k) => (
        <li key={s.t} data-reveal>
          <span className="cx-flow__n">{k + 1}</span>
          <h3>{s.t}</h3><p>{s.d}</p>
        </li>
      ))}
    </ol>
  )
}

/** Requirements: four lenses, each with its own icon disc. */
const LENS_IC = ['eye', 'chart', 'layers', 'target']
export function Lenses({ items }) {
  return (
    <div className="cx-lens">
      {items.map(([k, v], i) => (
        <Tile key={k} className="cx-lens__c">
          <p className="ps__h"><span className="ps__ic"><Icon name={LENS_IC[i % LENS_IC.length]} size={15} /></span>{k}</p>
          <p>{v}</p>
        </Tile>
      ))}
    </div>
  )
}

/** Measurement: one primary number, the guardrails and the cuts. */
export function Measure({ m }) {
  return (
    <div className="cx-meas">
      <Tile tint="ink" className="cx-meas__p">
        <p className="s-k"><Icon name="target" size={14} /><span>Primary success metric</span></p>
        <h3>{m.primary[0]}</h3>
        <p>{m.primary[1]}</p>
      </Tile>
      <Tile className="cx-meas__c">
        <p className="ps__h"><span className="ps__ic"><Icon name="shield" size={15} /></span>Guardrail metrics</p>
        <ul className="k-chips k-chips--lg">{m.guard.map((g) => <li key={g}><Chip tone="ok">{g}</Chip></li>)}</ul>
      </Tile>
      <Tile className="cx-meas__c">
        <p className="ps__h"><span className="ps__ic"><Icon name="layers" size={15} /></span>Cut by</p>
        <ul className="k-chips k-chips--lg">{m.seg.map((g) => <li key={g}><Chip>{g}</Chip></li>)}</ul>
      </Tile>
    </div>
  )
}

/** Rollout: steps that climb. */
export function Stairs({ steps }) {
  return (
    <ol className="k-stairs" style={{ '--n': steps.length }}>
      {steps.map((s, k) => (
        <li key={s.t} data-reveal style={{ '--k': k }} className="k-stairs__s">
          <b>{k + 1}</b><h3>{s.t}</h3><p>{s.d}</p>
        </li>
      ))}
    </ol>
  )
}

/** A before-and-after meter, drawn only when a figure reads "A → B%" with both under 100. Nothing is invented. */
function Meter({ v }) {
  const m = /^([\d.]+)\s*→\s*([\d.]+)%$/.exec(String(v).trim())
  if (!m) return null
  const a = Number(m[1]), b = Number(m[2]), N = 32
  if (!(a <= 100 && b <= 100)) return null
  const ia = Math.round((a / 100) * N), ib = Math.round((b / 100) * N)
  return (
    <span className="cx-meter" role="img" aria-label={`From ${a}% to ${b}%`}>
      {Array.from({ length: N }, (_, i) => <i key={i} className={i < ia ? 'is-a' : i < ib ? 'is-b' : ''} />)}
    </span>
  )
}

/** Impact: insight cards (the numbers count up), then what they prove and what drove them. */
export function Impact({ i }) {
  return (
    <div className="cx-imp">
      {i.rows.map(([v, l, t]) => (
        <Tile key={l} className="cx-ins">
          <p className="s-k"><span>{t || 'Impact'}</span></p>
          <b><Stat v={v} /></b>
          <Meter v={v} />
          <span>{l}</span>
        </Tile>
      ))}
      <Tile tint="ink" className="cx-proves"><p className="s-k"><span>What this proves</span></p><h3>{i.proves}</h3></Tile>
      <Tile className="cx-drove">
        <p className="ps__h"><span className="ps__ic"><Icon name="check" size={15} /></span>What drove it</p>
        <ul className="k-drove">{i.drove.map(([a, b]) => <li key={a}><Icon name="check" size={15} /><div><b>{a}</b>{b && <span>{b}</span>}</div></li>)}</ul>
      </Tile>
    </div>
  )
}

/** Playbook: where else it fits, and how an engagement would run. */
export function Playbook({ p }) {
  return (
    <div className="cx-play">
      <Tile className="cx-play__fit">
        <p className="ps__h"><span className="ps__ic"><Icon name="pin" size={15} /></span>Client fit</p>
        <ul className="k-chips k-chips--lg">{p.uses.map((u) => <li key={u}><Chip>{u}</Chip></li>)}</ul>
      </Tile>
      <Tile tint="ink" className="cx-play__shape">
        <p className="s-k"><span>Best engagement shape</span></p>
        <ol className="k-shape">{p.shape.map(([w, t], k) => <li key={t}>{k > 0 && <Arrow />}<span><b>{w}</b>{t}</span></li>)}</ol>
      </Tile>
    </div>
  )
}
