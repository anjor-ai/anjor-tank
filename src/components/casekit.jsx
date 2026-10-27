import { Icon } from './icons'
import { Stat } from './kinetic'
import { Arrow } from './ui'
import { Chip, KHead, StepTabs, TINTS, Tile, Timeline, Win, pad } from './kit'

/* The eleven parts of a case study, each drawn as a small product window or a bento rather than set as text:
   problem → a leak log · diagnosis → an investigation timeline · shift → six step tabs · architecture → six tiles
   workflow → a pipeline · requirements → four lenses · measurement → one number and its guardrails · rollout → stairs · impact → numbers. */

/** Section head used by every part: the part number, its name, the PDF's headline and the line under it. */
export function Part({ n, name, head, lead, children }) {
  return (
    <>
      <KHead n={pad(n)} label={name} title={head} lead={lead} />
      {children}
    </>
  )
}

/** Summary: the one number, then the four facts, with the role beside them. */
export function Summary({ S, g, tint }) {
  return (
    <div className="k-bento k-bento--sum">
      <Tile tint={tint} className="k-c8 k-sum__m">
        <p className="k-tile__k"><span>Primary business metric</span></p>
        <h3>{S.metric}</h3>
      </Tile>
      <Tile className="k-c4 k-r2 k-glance">
        <p className="k-tile__k"><span>At a glance</span></p>
        <dl>
          <div><dt>My role</dt><dd>{g.role}</dd></div>
          <div><dt>Worked with</dt><dd>{g.team}</dd></div>
          <div><dt>Built on</dt><dd><ul className="k-chips">{g.stack.map((x) => <li key={x}><Chip>{x}</Chip></li>)}</ul></dd></div>
        </dl>
      </Tile>
      {[['Product surface', S.surface], ['System built', S.system]].map(([k, v]) => <Tile key={k} className="k-c4"><p className="k-tile__k"><span>{k}</span></p><p className="k-fact">{v}</p></Tile>)}
      <Tile tint="soft" className="k-c8"><p className="k-tile__k"><span>Why it matters</span></p><p className="k-fact">{S.why}</p></Tile>
    </div>
  )
}

/** Problem: a leak log. */
export function Leakage({ items }) {
  return (
    <Win title="Where the journey leaked" tag={`${items.length} leaks`} className="k-leaks" id="leaks">
      <ol>
        {items.map((it, k) => (
          <li key={it.t} style={{ '--c': `var(--ts-${TINTS[k % TINTS.length]})` }}>
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

/** Shift: six stages as step tabs, then the move. */
export function Shift({ s }) {
  return (
    <div className="k-shift">
      <StepTabs steps={s.stages.map((x) => ({ label: x.t }))} label="Stages of the shift">
        {(st, k) => (
          <Tile tint={TINTS[k % TINTS.length]} className="k-shift__p" reveal={false}>
            <p className="k-tile__k"><b>{pad(k + 1)}</b>Stage {k + 1} of {s.stages.length}</p>
            <h3>{s.stages[k].t}</h3>
            <p>{s.stages[k].d}</p>
            <span className="k-shift__bar" aria-hidden="true">{s.stages.map((_, j) => <i key={j} className={j <= k ? 'is-on' : ''} />)}</span>
          </Tile>
        )}
      </StepTabs>
      <Tile tint="ink" className="k-move">
        <p className="k-tile__k"><span>The strategic move</span></p>
        <h3>{s.move}</h3>
        <blockquote>{s.quote}</blockquote>
      </Tile>
    </div>
  )
}

/** Architecture: six parts, then the principle. */
export function Architecture({ a }) {
  return (
    <div className="k-bento">
      {a.parts.map((p, k) => (
        <Tile key={p.t} tint={k % 3 === 0 ? TINTS[(k / 3) % TINTS.length] : undefined} className="k-c4 k-part">
          <p className="k-tile__k"><b>{pad(k + 1)}</b></p>
          <h3>{p.t}</h3><p>{p.d}</p>
        </Tile>
      ))}
      <Tile tint="soft" className="k-c12 k-principle"><span className="k-tile__k"><span>Principle</span></span><p>{a.principle}</p></Tile>
    </div>
  )
}

/** Workflow: five nodes on one line. */
export function Chevrons({ steps }) {
  return (
    <ol className="k-pipe" style={{ '--n': steps.length }}>
      {steps.map((s, k) => (
        <li key={s.t} data-reveal>
          <span className="k-pipe__n">{k + 1}</span>
          <h3>{s.t}</h3><p>{s.d}</p>
        </li>
      ))}
    </ol>
  )
}

/** Requirements: four lenses. */
export function Lenses({ items }) {
  return (
    <div className="k-bento">
      {items.map(([k, v], i) => (
        <Tile key={k} tint={TINTS[i % TINTS.length]} className="k-c6 k-lens">
          <p className="k-tile__k"><b>{pad(i + 1)}</b>{k}</p>
          <p className="k-lens__t">{v}</p>
        </Tile>
      ))}
    </div>
  )
}

/** Measurement: one primary number, the guardrails and the cuts. */
export function Measure({ m }) {
  return (
    <div className="k-bento">
      <Tile tint="ink" className="k-c5 k-r2 k-prim">
        <p className="k-tile__k"><Icon name="target" size={14} /><span>Primary success metric</span></p>
        <h3>{m.primary[0]}</h3>
        <p>{m.primary[1]}</p>
      </Tile>
      <Tile className="k-c7">
        <p className="k-tile__k"><Icon name="shield" size={14} /><span>Guardrail metrics</span></p>
        <ul className="k-chips k-chips--lg">{m.guard.map((g) => <li key={g}><Chip tone="ok">{g}</Chip></li>)}</ul>
      </Tile>
      <Tile className="k-c7">
        <p className="k-tile__k"><Icon name="layers" size={14} /><span>Cut by</span></p>
        <ul className="k-chips k-chips--lg">{m.seg.map((g) => <li key={g}><Chip>{g}</Chip></li>)}</ul>
      </Tile>
    </div>
  )
}

/** Rollout: five steps that climb. */
export function Stairs({ steps }) {
  return (
    <ol className="k-stairs" style={{ '--n': steps.length }}>
      {steps.map((s, k) => (
        <li key={s.t} data-reveal style={{ '--k': k }} className={`k-stairs__s k-stairs__s--${TINTS[k % TINTS.length]}`}>
          <b>{k + 1}</b><h3>{s.t}</h3><p>{s.d}</p>
        </li>
      ))}
    </ol>
  )
}

/** Impact: the numbers (they count up), what they prove, what drove them. */
export function Impact({ i }) {
  return (
    <div className="k-bento">
      {i.rows.map(([v, l, t], k) => (
        <Tile key={l} tint={TINTS[k % TINTS.length]} className="k-c4 k-num">
          <b><Stat v={v} /></b>
          <span>{l}</span>
          {t && <Chip>{t}</Chip>}
        </Tile>
      ))}
      <Tile tint="ink" className="k-c6 k-proves"><p className="k-tile__k"><span>What this proves</span></p><h3>{i.proves}</h3></Tile>
      <Tile className="k-c6">
        <p className="k-tile__k"><span>What drove it</span></p>
        <ul className="k-drove">{i.drove.map(([a, b]) => <li key={a}><Icon name="check" size={15} /><div><b>{a}</b>{b && <span>{b}</span>}</div></li>)}</ul>
      </Tile>
    </div>
  )
}

/** Playbook: where else it fits, and how an engagement would run. */
export function Playbook({ p }) {
  return (
    <div className="k-bento">
      <Tile tint="sky" className="k-c5">
        <p className="k-tile__k"><span>Client fit</span></p>
        <ul className="k-chips k-chips--lg">{p.uses.map((u) => <li key={u}><Chip>{u}</Chip></li>)}</ul>
      </Tile>
      <Tile className="k-c7">
        <p className="k-tile__k"><span>Best engagement shape</span></p>
        <ol className="k-shape">{p.shape.map(([w, t], k) => <li key={t}>{k > 0 && <Arrow />}<span><b>{w}</b>{t}</span></li>)}</ol>
      </Tile>
    </div>
  )
}
