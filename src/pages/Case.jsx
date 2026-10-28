import { useEffect, useRef, useState } from 'react'
import { CASES, GLANCE, bridge } from '../content'
import { Arrow, Cta } from '../components/ui'
import { Board, Chips, Go, H, Kicker, PageHead, Stage, Tile, Win, cx } from '../components/board'
import { ArchMap, CASE_PAINT, CaseUI, DashWire, Storyboard } from '../components/frags'
import { Stat } from '../components/kinetic'
import { Icon } from '../components/icons'
import { PageMotion } from '../lib/PageMotion'
import { useRoute } from '../lib/router'

/* One case study, in the same eleven parts every time. Each part is one board that fits a screen:
   summary · problem · diagnosis · shift · architecture · workflow · requirements · measurement · rollout · impact · playbook.
   Then the line to ROQIVA, and the cases either side. A dock at the foot of the screen jumps between the parts. */

const NAV = [
  ['summary', 'Summary'], ['problem', 'Problem'], ['diagnosis', 'Diagnosis'], ['shift', 'Shift'], ['architecture', 'System'], ['workflow', 'Workflow'],
  ['requirements', 'Requirements'], ['measurement', 'Measurement'], ['rollout', 'Rollout'], ['impact', 'Impact'], ['playbook', 'Playbook'],
].map(([id, label]) => ({ id, label }))
const pad = (n) => String(n).padStart(2, '0')

/** A part: its number and name above the heading, the lead beside it, then its board. */
function Part({ id, n, name, head, lead, tone, children }) {
  return (
    <section id={id} className={cx('b-sec b-part', tone && `b-sec--${tone}`)} aria-labelledby={`${id}-h`}>
      <div className="b-wrap">
        <header className="b-head">
          <div><span className="b-pnum">{pad(n)} · {name}</span><H text={head} id={`${id}-h`} /></div>
          {lead && <div className="b-head__s"><p className="b-lead">{lead}</p></div>}
        </header>
        {children}
      </div>
    </section>
  )
}

/** The parts as a dock at the foot of the screen, once the head has scrolled away. */
function Dock() {
  const [active, setActive] = useState(NAV[0].id)
  const [show, setShow] = useState(false)
  const list = useRef(null)
  useEffect(() => {
    const sec = NAV.map((it) => document.getElementById(it.id)).filter(Boolean)
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-40% 0px -55% 0px' })
    sec.forEach((el) => io.observe(el))
    let tick = false
    const vis = () => {
      if (tick) return
      tick = true
      requestAnimationFrame(() => {
        tick = false
        const first = sec[0], end = document.getElementById('roqiva')
        const top = first ? first.getBoundingClientRect().top : 0
        const fb = end ? end.getBoundingClientRect().top : 1e9
        setShow(top < window.innerHeight * 0.6 && fb > window.innerHeight * 0.5)
      })
    }
    vis()
    window.addEventListener('scroll', vis, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', vis) }
  }, [])
  useEffect(() => {
    const a = list.current?.querySelector('[aria-current="true"]')
    if (a && list.current) list.current.scrollTo({ left: a.offsetLeft - list.current.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' })
  }, [active])
  return (
    <nav className={cx('b-dock', show && 'is-on')} aria-label="This case">
      <ul ref={list}>{NAV.map((it) => <li key={it.id}><a href={`#${it.id}`} aria-current={active === it.id ? 'true' : undefined}>{it.label}</a></li>)}</ul>
    </nav>
  )
}

/** The shift: the stages as a stepper (Back, Continue, "2 of 6"), the move in a dark tile beside it. */
function Shift({ s }) {
  const [k, setK] = useState(0)
  const n = s.stages.length, st = s.stages[k]
  return (
    <Board className="b-shift">
      <Tile className="b-step">
        <div className="b-step__bar" role="tablist" aria-label="Stages of the shift">
          {s.stages.map((x, j) => <button key={x.t} type="button" role="tab" aria-selected={j === k} className={j <= k ? 'is-past' : ''} onClick={() => setK(j)}><span className="sr-only">{x.t}</span></button>)}
        </div>
        <div className="b-step__body" key={k} role="tabpanel">
          <p className="b-step__k">Stage {k + 1} of {n}</p>
          <h3>{st.t}</h3>
          <p>{st.d}</p>
        </div>
        <footer className="b-step__f">
          <span>{k + 1} of {n}</span>
          <span className="b-step__btns">
            <button type="button" className="b-btn" onClick={() => setK((x) => Math.max(0, x - 1))} disabled={k === 0}>Back</button>
            <button type="button" className="b-btn b-btn--on" onClick={() => setK((x) => Math.min(n - 1, x + 1))} disabled={k === n - 1}>Continue</button>
          </span>
        </footer>
      </Tile>
      <Tile tone="ink" className="b-move">
        <Kicker icon="target">The strategic move</Kicker>
        <h3>{s.move}</h3>
        <blockquote>{s.quote}</blockquote>
      </Tile>
    </Board>
  )
}

/** A before-and-after meter, drawn only when a figure reads "A → B%" with both under 100. Nothing is invented. */
function Meter({ v }) {
  const m = /^([\d.]+)\s*→\s*([\d.]+)%$/.exec(String(v).trim())
  if (!m) return null
  const a = Number(m[1]), b = Number(m[2]), N = 32
  if (!(a <= 100 && b <= 100)) return null
  const ia = Math.round((a / 100) * N), ib = Math.round((b / 100) * N)
  return <span className="u-meter" role="img" aria-label={`From ${a}% to ${b}%`}>{Array.from({ length: N }, (_, i) => <i key={i} className={i < ia ? 'is-a' : i < ib ? 'is-b' : ''} />)}</span>
}

const LENS_IC = ['eye', 'chart', 'layers', 'target']

export default function Case() {
  const { route } = useRoute()
  const i = CASES.findIndex((c) => route.path === `/work/${c.slug}`)
  const c = CASES[i]
  if (!c) return null
  const g = GLANCE[c.slug]
  const br = bridge[c.slug]
  const S = c.summary
  const prev = CASES[(i - 1 + CASES.length) % CASES.length], next = CASES[(i + 1) % CASES.length]
  return (
    <PageMotion routeKey={route.path}>
      <PageHead className="b-cs-head" title={c.title} lead={c.hook}
        visual={<Stage kind="paint" name={CASE_PAINT[c.slug]}><CaseUI slug={c.slug} /></Stage>}>
        <p className="b-k"><span className="b-k__ic"><Icon name="layers" size={14} /></span>{c.n} · {c.cat} · Case study</p>
        <ul className="b-ph__nums">{c.metrics.map(([v, l]) => <li key={l}><b><Stat v={v} /></b><span>{l}</span></li>)}</ul>
        <Chips items={c.chips} />
      </PageHead>

      <Dock />

      <Part id="summary" n={1} name="Executive summary" head={S.head}>
        <Board className="b-sum">
          <Tile tone="ink" className="b-sum__m"><Kicker icon="target">Primary business metric</Kicker><h3>{S.metric}</h3></Tile>
          <Tile className="b-sum__g">
            <Kicker icon="eye">At a glance</Kicker>
            <dl>
              <div><dt>My role</dt><dd>{g.role}</dd></div>
              <div><dt>Worked with</dt><dd>{g.team}</dd></div>
              <div><dt>Built on</dt><dd><Chips items={g.stack} /></dd></div>
            </dl>
          </Tile>
          {[['layers', 'Product surface', S.surface, 's'], ['branch', 'System built', S.system, 'y'], ['target', 'Why it matters', S.why, 'w']].map(([ic, k, v, a]) => (
            <Tile key={k} className={`b-sum__f b-sum__f--${a}`}><Kicker icon={ic}>{k}</Kicker><p>{v}</p></Tile>
          ))}
        </Board>
      </Part>

      <Part id="problem" n={2} name="The problem" head={c.problem.head} lead={c.problem.lead}>
        <Stage kind="paint" name="dawn" className="b-leaks">
          <Win title="Where the journey leaked" tag={`${c.problem.items.length} leaks`} className="b-leaks__win">
            <ol className="b-list b-list--leak">
              {c.problem.items.map((it, k) => <li key={it.t}><b>{k + 1}</b><div><h3>{it.t}</h3><p>{it.d}</p></div></li>)}
            </ol>
          </Win>
        </Stage>
      </Part>

      <Part id="diagnosis" n={3} name="Diagnosis" head={c.diagnosis.head} lead={c.diagnosis.lead}>
        <ol className="b-list" data-board aria-label={`Diagnosis: ${c.diagnosis.steps.length} findings`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {c.diagnosis.steps.map((s, k) => <li key={s.t}><b>{k + 1}</b><div><h3>{s.t}</h3><p>{s.d}</p></div></li>)}
        </ol>
      </Part>

      <Part id="shift" n={4} name="The strategic shift" head={c.shift.head} lead={c.shift.lead}><Shift s={c.shift} /></Part>

      <Part id="architecture" n={5} name="Solution architecture" head={c.arch.head} lead={c.arch.lead}>
        <Board className="b-arch">
          <Stage kind="shader" name="violet" className="b-arch__map"><ArchMap parts={c.arch.parts} /></Stage>
          <ul className="b-arch__parts">
            {c.arch.parts.map((p) => <li key={p.t}><b>{p.t}</b><span>{p.d}</span></li>)}
            <li className="b-arch__pr"><span>Principle</span><p>{c.arch.principle}</p></li>
          </ul>
        </Board>
      </Part>

      <Part id="workflow" n={6} name="Workflow logic" head={c.flow.head} lead={c.flow.lead}>
        <Board className="b-wf">
          <Stage kind="paint" name="meadow"><Storyboard steps={c.flow.steps} /></Stage>
          <ol className="b-flow" style={{ '--n': c.flow.steps.length }}>
            {c.flow.steps.map((s, k) => <li key={s.t}><b>{k + 1}</b><h3>{s.t}</h3><p>{s.d}</p></li>)}
          </ol>
        </Board>
      </Part>

      <Part id="requirements" n={7} name="Product requirements" head={c.reqs.head}>
        <Board className="b-lens">
          {c.reqs.items.map(([k, v], j) => <Tile key={k}><Kicker icon={LENS_IC[j % LENS_IC.length]}>{k}</Kicker><p>{v}</p></Tile>)}
        </Board>
      </Part>

      <Part id="measurement" n={8} name="Measurement design" head={c.measure.head} lead={c.measure.lead}>
        <Board className="b-meas">
          <Tile tone="ink" className="b-meas__p"><Kicker icon="target">Primary success metric</Kicker><h3>{c.measure.primary[0]}</h3><p>{c.measure.primary[1]}</p></Tile>
          <Tile className="b-meas__g"><Kicker icon="shield">Guardrail metrics</Kicker><Chips items={c.measure.guard} /></Tile>
          <Tile className="b-meas__c"><Kicker icon="layers">Cut by</Kicker><Chips items={c.measure.seg} /></Tile>
          <Stage kind="paint" name="dusk" className="b-meas__d"><DashWire m={c.measure} /></Stage>
        </Board>
      </Part>

      <Part id="rollout" n={9} name="Rollout and governance" head={c.rollout.head} lead={c.rollout.lead}>
        <ol className="b-stairs" data-board style={{ '--n': c.rollout.steps.length }}>
          {c.rollout.steps.map((s, k) => <li key={s.t} style={{ '--k': k }}><b>Step {k + 1}</b><h3>{s.t}</h3><p>{s.d}</p></li>)}
        </ol>
      </Part>

      <Part id="impact" n={10} name="Impact" head={c.impact.head} lead={c.impact.lead}>
        <Board className="b-imp">
          {c.impact.rows.map(([v, l, t]) => {
            // A row is [figure, what it measures, note]; where the first cell is a name ("RTO") and the note holds the figure, the figure leads.
            const named = !/\d/.test(v) && t && /\d/.test(t)
            return (
              <Tile key={l} className="b-imp__i">
                <Kicker icon="chart">{named ? v : (t || 'Impact')}</Kicker>
                <b><Stat v={named ? t : v} /></b>
                <Meter v={v} />
                <span>{l}</span>
              </Tile>
            )
          })}
          <Tile tone="ink" className="b-imp__p"><Kicker icon="spark">What this proves</Kicker><h3>{c.impact.proves}</h3></Tile>
          <Tile className="b-imp__d">
            <Kicker icon="check">What drove it</Kicker>
            <ul className="b-drove">{c.impact.drove.map(([a, b]) => <li key={a}><Icon name="check" size={16} /><div><b>{a}</b>{b && <span>{b}</span>}</div></li>)}</ul>
          </Tile>
        </Board>
      </Part>

      <Part id="playbook" n={11} name="Reusable playbook" head={c.playbook.head} lead={c.playbook.lead}>
        <Board className="b-play">
          <Tile><Kicker icon="pin">Client fit</Kicker><Chips items={c.playbook.uses} /></Tile>
          <Tile tone="ink">
            <Kicker icon="clock">Best engagement shape</Kicker>
            <ol className="b-shape">{c.playbook.shape.map(([w, t], k) => <li key={t}>{k > 0 && <Arrow />}<span><b>{w}</b>{t}</span></li>)}</ol>
          </Tile>
        </Board>
      </Part>

      <section id="roqiva" className="b-sec" aria-label="What it became in ROQIVA">
        <div className="b-wrap">
          <Board className="b-bridge">
            <Tile tone="ink" className="b-bridge__c">
              <Kicker icon="branch">What it became in ROQIVA</Kicker>
              <h2>{br.became}</h2>
              <p>{br.d}</p>
              <dl><div><dt>Lane</dt><dd>{br.lane}</dd></div><div><dt>Who in ROQIVA</dt><dd>{br.agent}</dd></div></dl>
              <Go to="/roqiva#origin">See where ROQIVA comes from</Go>
            </Tile>
            <nav className="b-pn" aria-label="More cases">
              {[[prev, 'Previous'], [next, 'Next']].map(([x, w]) => (
                <a key={w} href={`/work/${x.slug}`} data-cursor={w}><span>{w} · {x.n}</span><b>{x.title}</b><Icon name="arrow" size={18} /></a>
              ))}
            </nav>
          </Board>
        </div>
      </section>

      <Cta topic="work" title="Want this *done on ==your system==?*" lead="Tell me the number that will not move." primary={{ label: 'Send a brief', to: '/contact?intent=consult#brief' }} secondary={{ label: 'See all cases', to: '/work' }} />
    </PageMotion>
  )
}
