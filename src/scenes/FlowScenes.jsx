import { architectScene as Ar, auditScene as A, brief, researchScene as Rs, systemDesign, brainLog, decideScene as Dc, brainScene as B, monitor, monitorScene as M, options, qa, rankedFindings, releaseScene as R, score, signalLog } from '../content'
import { Icon } from '../components/icons'
import { Cur, Scene, Words } from './engine'
import { Composer, Msg, Pill, Steps, Swap, Thread } from './kit'
import { gatePress, pmAsk } from './moves'

/* The rest of the workflow, as live scenes: audit, decide, release, measure and the Brain log.
   Same window system as the PRD and wireframe scenes. Every number is computed from the content, never typed here. */

const LABEL_TONE = { confirmed: 'ok', supported: 'sky', hypothesis: 'amber' }
const LANE_TONE = { Incident: 'warn', Opportunity: 'grey' }
const ranked = [...rankedFindings].sort((a, b) => score(b) - score(a))
const top = Math.max(...ranked.map(score))
const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

/** The gate strip under an artifact. With a button it is pressed by a person in the script. */
function GateBar({ g, wait = 'Waiting', done, doneTone = 'ok' }) {
  return (
    <div className="gate" data-k="gate">
      <Icon name="gate" size={14} />
      <b>{g.text}</b>
      <span>{g.who}</span>
      {g.btn && <span className="gate__btn" data-k="gbtn">{g.btn}</span>}
      <Swap k="gs" items={[['wait', 'grey', wait], ['ok', doneTone, done, doneTone === 'ok' ? 'check' : undefined]]} />
    </div>
  )
}

/* ───────────────────────── Audit ───────────────────────── */
/** `part`: 'detect' is the Detectors matching signals to decisions (code, no gate); 'audit' is the Analyst ranking what they found
 *  and a person approving at Gate 1; 'all' plays both, one after the other. */
export function buildAudit(d, { part = 'all' } = {}) {
  const pm = d.cur('pm'), ag = d.cur('ag')
  const $ = d.$
  const detect = part !== 'audit', audit = part !== 'detect'
  const lines = d.$$('lg-i')
  const rows = d.$$('ib-i')

  d.hide(['m1', 'm2', 'm3', 'm4', 'm5'].map($), { y: 10 })
  d.hide([$('m2-p')], { y: 4 })
  d.hide(lines, { y: 6 }); d.hide(d.$$('lg-st'), { scale: 0.6 }); d.hide([$('lg-f')], { y: 4 })
  d.hide(rows, { y: 8 })
  d.hide(d.$$('sc-i'), { scaleX: 0, transformOrigin: '0 50%' })
  d.hide([$('hl')], { x: 0, y: 0, width: 0, height: 0 })
  d.hide([$('gate'), $('ver-f'), $('gs-ok')])
  if (part === 'all') d.hide([$('v-inbox')])

  let t = 0.5
  if (detect) {
    // a person asks; the Detectors (code) match signals to decisions
    t = pmAsk(d, pm, 0, t, 'm1')
    pm.hide(t - 0.1)
    d.show($('m2'), t + 0.1)
    d.steps('st1', t + 0.3, { each: 0.75 })
    d.scroll('tcol', 'm2', t + 0.3, { align: 'bottom', margin: 12 })
    // the log fills in as the match step runs
    const l0 = t + 0.3 + 0.75 * 2
    d.show(lines, l0, { dur: 0.3, stagger: 0.28 })
    d.show(d.$$('lg-st'), l0 + 0.25, { dur: 0.3, stagger: 0.28, ease: 'eSpring' })
    const lEnd = l0 + 0.28 * lines.length + 0.4
    t = d.show($('lg-f'), lEnd, { dur: 0.3 })
    d.show($('m2-p'), lEnd, { dur: 0.3 })
    if (!audit) {
      d.swap('ver-s', 'ver-f', t)
      d.show($('gate'), t + 0.2, { dur: 0.35 })
      d.swap('gs-wait', 'gs-ok', t + 0.6)
      return
    }
  }
  // the Analyst checks and ranks
  let a0 = t
  if (!detect) {
    a0 = pmAsk(d, pm, 0, 0.5, 'm1')
    pm.hide(a0 - 0.1)
  }
  d.show($('m3'), a0 + 0.2)
  d.scroll('tcol', 'm3', a0 + 0.2, { align: 'bottom', margin: 12 })
  ag.at(detect ? 'v-log' : 'v-inbox', a0 + 0.4, { fx: 0.9, fy: 0.9, dx: 20, dy: 20 })
  t = d.steps('st2', a0 + 0.5, { each: 0.8 })
  // the view turns into the ranked inbox
  if (detect) d.swap('v-log', 'v-inbox', t + 0.2, 0.35)
  d.swap('ver-s', 'ver-f', t + 0.2)
  d.show(rows, t + 0.5, { dur: 0.35, stagger: 0.14 })
  d.tl.to(d.$$('sc-i'), { scaleX: 1, duration: 0.55, ease: 'power2.out', stagger: 0.14 }, t + 0.7)
  ag.to(rows[0], t + 0.5, { fx: 0.5, fy: 0.5, dur: 0.6 })
  t = t + 0.5 + 0.14 * rows.length + 0.4
  d.show($('m4'), t - 0.3)
  d.scroll('tcol', 'm4', t - 0.3, { align: 'bottom', margin: 12 })
  t = d.stream('m4w', t - 0.2, { wps: 16 })
  ag.hide(t)
  // a person approves F-001 at Gate 1
  d.show($('gate'), t + 0.2, { dur: 0.35 })
  let a = pm.at(rows[0], t + 0.4, { fx: 0.9, fy: 0.5, dx: 60, dy: 40 })
  a = pm.to(rows[0], a, { fx: 0.4, fy: 0.5, dur: 0.8 })
  pm.click(a + 0.05)
  d.focus('hl', rows[0], a + 0.05, { within: 'ibl', pad: 0, dur: 0.4 })
  a = pmAsk(d, pm, 1, a + 0.5, 'm5', { first: false })
  a = gatePress(d, pm, a + 0.3)
  pm.hide(a + 0.2)
}

export function AuditScene({ part = 'all', ...props }) {
  const n = signalLog.lines.length
  const gaps = signalLog.lines.filter((l) => l.state === 'gap').length
  const detect = part !== 'audit', audit = part !== 'detect'
  const texts = part === 'audit' ? [A.askRank, A.approve] : audit ? [A.ask, A.approve] : [A.ask]
  const tab = !audit ? ['terminal', 'Detectors log', `${gaps} gaps`] : [audit && !detect ? 'search' : 'search', 'Findings inbox', `${ranked.length} ranked`]
  const gate = !audit ? { text: 'No gate', who: A.noGate } : A.gate
  const views = [
    detect && (
      <div key="log" className="vw lg" data-k="v-log">
        <p className="lg__h"><Icon name="terminal" size={13} />{signalLog.title}<Pill tone="ok">Code</Pill></p>
        <ul className="lg__ls">
          {signalLog.lines.map((l) => (
            <li key={l.sig} className="lg__l" data-k="lg-i">
              <code className="lg__sig">{l.sig}</code>
              <span className="lg__path">{l.from}<Icon name="arrow" size={11} />{l.to}</span>
              <span className="lg__st" data-k="lg-st"><Pill tone={l.state === 'gap' ? 'amber' : 'ok'}>{l.state === 'gap' ? 'Gap' : 'Read'}</Pill></span>
            </li>
          ))}
        </ul>
        <p className="lg__f" data-k="lg-f"><b>{gaps}</b> of {n} signals have no decision that reads them. {signalLog.foot}</p>
      </div>
    ),
    audit && (
      <div key="inbox" className="vw ibx" data-k="v-inbox">
        <ol className="ibl" data-k="ibl">
          <i className="hl hl--p" data-k="hl" aria-hidden="true" />
          {ranked.map((f) => (
            <li key={f.id} className="ib" data-k="ib-i">
              <code className="ib__id">{f.id}</code>
              <span className="ib__t"><b>{f.t}</b><small>{f.path}</small></span>
              <span className="ib__tags"><Pill tone={LANE_TONE[f.lane]}>{f.lane}</Pill><Pill tone={LABEL_TONE[f.label]}>{f.label[0].toUpperCase() + f.label.slice(1)}</Pill></span>
              <span className="ib__sc"><i className="ib__bar"><i data-k="sc-i" style={{ width: `${(score(f) / top) * 100}%` }} /></i><code>{fmt(score(f))}</code></span>
            </li>
          ))}
        </ol>
        <p className="vw__f label">Score = value × confidence ÷ effort. Sample values, not measurements.</p>
      </div>
    ),
  ].filter(Boolean)
  return (
    <Scene id={`audit-${part}`} title="Audit" crumbs={part === 'detect' ? A.crumbsDetect : A.crumbs} build={(d) => buildAudit(d, { part })} speed={1.3} {...props}>
      <Thread agent={detect && !audit ? { ...A.agent, name: A.detectors.name, sub: 'Code. No agent.', icon: A.detectors.icon, tone: A.detectors.tone } : A.agent} composer={<Composer agent={A.agent.name} placeholder={A.placeholder} texts={texts} />}>
        <Msg who="you" name="Your PM" ini="PM" k="m1"><p>{texts[0]}</p></Msg>
        {detect && (
          <Msg who="ag" name={A.detectors.name} icon={A.detectors.icon} tone={A.detectors.tone} k="m2">
            <Steps k="st1" items={[...A.reads, ['Match', `${n} signals to decisions`]]} />
            <p data-k="m2-p">{A.matched}</p>
          </Msg>
        )}
        {audit && (
          <>
            <Msg who="ag" name={A.agent.name} icon={A.agent.icon} tone={A.agent.tone} k="m3">
              <Steps k="st2" items={A.rank} />
              <p><Words k="m4w" text={A.ranked} /></p>
            </Msg>
            <Msg who="you" name="Your PM" ini="PM" k="m5"><p>{A.approve}</p></Msg>
          </>
        )}
      </Thread>

      <section className="art" aria-label={tab[1]}>
        <div className="art__tabs">
          <span className="ftab"><Icon name={tab[0]} size={13} />{tab[1]}</span>
          <Swap k="ver" items={[['s', 'sky', audit ? 'Ranking' : 'Scanning'], ['f', 'ok', tab[2]]]} />
        </div>
        <div className="views">{views}</div>
        <GateBar g={gate} wait={audit ? 'Waiting' : 'Not needed'} done={audit ? A.gate.done : 'Logged'} />
      </section>
      <Cur id="pm" name="Your PM" tone="person" />
      <Cur id="ag" name={A.agent.name} tone="agent" />
    </Scene>
  )
}

/* ───────────────────────── Decide ───────────────────────── */
export function buildDecide(d) {
  const pm = d.cur('pm'), ag = d.cur('ag')
  const $ = d.$
  const ids = options.items.map((o) => o.id)
  d.hide(['m1', 'm2', 'm3', 'm4'].map($), { y: 10 })
  d.hide(ids.map((i) => $(`op-${i}`)), { y: 12 })
  ids.forEach((i) => { d.hide(d.$$(`op-r-${i}`), { y: 4 }); d.hide(d.$$(`op-ch-${i}`), { scale: 0.6 }) })
  d.hide([$('op-sel')], {})
  d.hide([$('gate'), $('gs-ok'), $('ver-d')])

  let t = pmAsk(d, pm, 0, 0.5, 'm1')
  pm.hide(t - 0.1)
  d.show($('m2'), t + 0.1)
  d.scroll('tcol', 'm2', t + 0.1, { align: 'bottom', margin: 12 })
  d.steps('st1', t + 0.3, { each: 0.22, spin: 1.7 })
  // Product drafts the cards while the other two finish
  let c = t + 1.6
  ag.at('op-a', c, { fx: 0.9, fy: 0.3, dx: 60, dy: -10 })
  ids.forEach((id, i) => {
    const at = c + i * 0.9
    ag.to(`op-${id}`, at, { fx: 0.9, fy: 0.25, dx: 0, dy: 0, dur: 0.5 })
    d.show($(`op-${id}`), at + 0.2, { dur: 0.4 })
    d.show(d.$$(`op-r-${id}`), at + 0.5, { dur: 0.3, stagger: 0.15 })
    d.show(d.$$(`op-ch-${id}`), at + 0.6, { dur: 0.3, ease: 'eSpring' })
  })
  c += ids.length * 0.9 + 0.6
  ag.hide(c)
  d.swap('ver-b', 'ver-d', c)
  t = d.show($('m3'), c)
  d.scroll('tcol', 'm3', c, { align: 'bottom', margin: 12 })
  t = d.stream('m3w', t - 0.1, { wps: 16 })
  // a person picks
  d.show($('gate'), t + 0.2, { dur: 0.35 })
  let a = pm.at('op-a', t + 0.5, { fx: 0.9, fy: 0.5, dx: 70, dy: 50 })
  a = pm.to('op-a', a, { fx: 0.5, fy: 0.45, dur: 0.8 })
  pm.click(a + 0.05)
  d.show($('op-sel'), a + 0.05, { dur: 0.35 })
  d.tl.to(ids.filter((i) => i !== 'a').map((i) => $(`op-${i}`)), { opacity: 0.45, duration: 0.4 }, a + 0.1)
  a = pmAsk(d, pm, 1, a + 0.6, 'm4', { first: false })
  a = gatePress(d, pm, a + 0.3)
  pm.hide(a + 0.2)
}

export function DecideScene(props) {
  return (
    <Scene id="decide" title="Decide" crumbs={Dc.crumbs} build={buildDecide} speed={1.3} phoneH={885} {...props}>
      <Thread agent={Dc.agent} composer={<Composer agent={Dc.agent.name} placeholder={Dc.placeholder} texts={[Dc.ask, Dc.pick]} />}>
        <Msg who="you" name="Your PM" ini="PM" k="m1"><p>{Dc.ask}</p></Msg>
        <Msg who="ag" name={Dc.agent.name} icon={Dc.agent.icon} tone={Dc.agent.tone} k="m2"><Steps k="st1" items={Dc.steps} /></Msg>
        <Msg who="ag" name={Dc.agent.name} icon={Dc.agent.icon} tone={Dc.agent.tone} k="m3"><p><Words k="m3w" text={Dc.done} /></p></Msg>
        <Msg who="you" name="Your PM" ini="PM" k="m4"><p>{Dc.pick}</p></Msg>
      </Thread>
      <section className="art" aria-label="Solutions">
        <div className="art__tabs">
          <span className="ftab"><Icon name="branch" size={13} />{options.title}</span>
          <Swap k="ver" items={[['b', 'sky', 'Drafting'], ['d', 'ok', `${options.items.length} solutions`]]} />
        </div>
        <div className="ops" data-k="ops">
          {options.items.map((o) => (
            <article key={o.id} className="op" data-k={`op-${o.id}`}>
              {o.id === options.pick && <i className="op__sel" data-k="op-sel" aria-hidden="true"><Icon name="check" size={12} /></i>}
              <p className="op__k"><code>{o.id.toUpperCase()}</code>{o.k}{o.cheap && <span data-k={`op-ch-${o.id}`}><Pill tone="ok">Cheapest</Pill></span>}</p>
              <h4 className="op__t">{o.t}</h4>
              <p className="op__r" data-k={`op-r-${o.id}`}><b className="op__p">+</b>{o.pros}</p>
              <p className="op__r" data-k={`op-r-${o.id}`}><b className="op__c">−</b>{o.cons}</p>
            </article>
          ))}
        </div>
        <p className="vw__f label">{options.foot}</p>
        <GateBar g={Dc.gate} done={Dc.gate.done} />
      </section>
      <Cur id="pm" name="Your PM" tone="person" />
      <Cur id="ag" name={Dc.agent.name} tone="agent" />
    </Scene>
  )
}

/* ───────────────────────── Release ───────────────────────── */
const fixedAt = qa.items.findIndex((i) => i.s === 'failed')
const finalStatus = qa.items.map((it, i) => (i === fixedAt ? 'passed' : it.s))
const count = (list, s) => list.filter((x) => x === s).length
const sum = (list) => `${count(list, 'passed')} passed · ${count(list, 'failed')} failed · ${count(list, 'untested')} not tested`
const QA_ICON = { passed: 'check', failed: 'x', untested: 'clock' }
const QA_TONE = { passed: 'ok', failed: 'warn', untested: 'grey' }
const QA_WORD = { passed: 'Passed', failed: 'Failed', untested: 'Not tested' }

export function buildRelease(d) {
  const pm = d.cur('pm'), ag = d.cur('ag')
  const $ = d.$
  const rows = qa.items.map((_, i) => $(`qa-${i}`))
  d.hide(['m1', 'm2', 'm3', 'm4', 'm5'].map($), { y: 10 })
  d.hide(rows, { y: 8 })
  d.hide(d.$$('qs'), { scale: 0.6 })
  d.hide([`qs-p${fixedAt}`, 'bn-b', 'bn-c', 'cn-a', 'cn-b', 'gate', 'gs-ok', 'ver-r', 'ver-d'].map($)); d.hide([$('rb')], { y: 8 })

  let t = pmAsk(d, pm, 0, 0.5, 'm1')
  pm.hide(t - 0.1)
  d.show($('m2'), t + 0.1)
  d.scroll('tcol', 'm2', t + 0.1, { align: 'bottom', margin: 12 })
  t = d.steps('st1', t + 0.3, { each: 0.8 })
  // checks run one by one
  const r0 = t - 0.9
  ag.at('qa-0', r0, { fx: 0.9, fy: 0.5, dx: 60, dy: 10 })
  rows.forEach((row, i) => {
    const at = r0 + i * 0.55
    ag.to(row, at, { fx: 0.85, fy: 0.5, dur: 0.4 })
    d.show(row, at + 0.1, { dur: 0.3 })
    d.show(d.$$('qs').filter((_, j) => j === i), at + 0.35, { dur: 0.3, ease: 'eSpring' })
  })
  t = r0 + rows.length * 0.55 + 0.4
  d.show([$('cn-a'), $('bn-b')], t - 0.3, { dur: 0.3 })
  ag.hide(t)
  d.swap('ver-b', 'ver-r', t)
  d.show($('m3'), t + 0.1)
  d.scroll('tcol', 'm3', t + 0.1, { align: 'bottom', margin: 12 })
  t = d.stream('m3w', t + 0.2, { wps: 16 })
  // the engineer fixes it, QA re-runs the one failed check
  d.show($('m4'), t + 0.5)
  d.scroll('tcol', 'm4', t + 0.5, { align: 'bottom', margin: 12 })
  d.show($('m5'), t + 1.3)
  ag.at(`qa-${fixedAt}`, t + 1.4, { fx: 0.9, fy: 0.5, dx: 60, dy: 10 })
  let u = d.steps('st2', t + 1.5, { each: 0.8 })
  d.scroll('tcol', 'm5', t + 1.4, { align: 'bottom', margin: 12 })
  d.tl.to($(`qa-${fixedAt}`), { backgroundColor: 'color-mix(in srgb, var(--st-ok) 14%, transparent)', duration: 0.3 }, u)
  d.swap(`qs-f${fixedAt}`, `qs-p${fixedAt}`, u)
  d.swap('bn-b', 'bn-c', u, 0.3)
  d.swap('cn-a', 'cn-b', u, 0.3)
  d.tl.to($(`qa-${fixedAt}`), { backgroundColor: 'transparent', duration: 0.6 }, u + 0.8)
  ag.hide(u + 0.6)
  u = d.stream('m5w', u + 0.2, { wps: 16 })
  d.show($('rb'), u, { dur: 0.4 })
  d.swap('ver-r', 'ver-d', u)
  // a person signs one exact candidate
  d.show($('gate'), u + 0.5, { dur: 0.35 })
  let a = gatePressStart(d, pm, u + 0.9)
  pm.hide(a + 0.2)
}
function gatePressStart(d, pm, at) {
  pm.at('gbtn', at, { fx: 0.5, fy: 0.5, dx: 80, dy: -50 })
  return gatePress(d, pm, at + 0.3)
}

export function ReleaseScene(props) {
  return (
    <Scene id="release" title="Release" crumbs={R.crumbs} build={buildRelease} speed={1.3} phoneH={885} {...props}>
      <Thread agent={R.agent} composer={<Composer agent={R.agent.name} placeholder={R.placeholder} texts={[R.ask]} />}>
        <Msg who="you" name="Your PM" ini="PM" k="m1"><p>{R.ask}</p></Msg>
        <Msg who="ag" name={R.agent.name} icon={R.agent.icon} tone={R.agent.tone} k="m2"><Steps k="st1" items={R.steps} /></Msg>
        <Msg who="ag" name={R.agent.name} icon={R.agent.icon} tone={R.agent.tone} k="m3"><p><Words k="m3w" text={R.report} /></p></Msg>
        <Msg who="you" name={R.fix.who} ini={R.fix.ini} tone="design" k="m4"><p>{R.fix.text}</p></Msg>
        <Msg who="ag" name={R.agent.name} icon={R.agent.icon} tone={R.agent.tone} k="m5">
          <Steps k="st2" items={R.rerun.steps} />
          <p><Words k="m5w" text={R.rerun.done} /></p>
        </Msg>
      </Thread>
      <section className="art" aria-label="QA report">
        <div className="art__tabs">
          <span className="ftab"><Icon name="check" size={13} />{qa.title}</span>
          <Swap k="ver" items={[['b', 'sky', 'Running'], ['r', 'warn', 'Blocked'], ['d', 'ok', 'Checked']]} />
        </div>
        <div className="qa">
          <p className="qa__top">
            <span className="sw sw--t"><span className="tx" data-k="cn-a">{sum(qa.items.map((i) => i.s))}</span><span className="tx" data-k="cn-b">{sum(finalStatus)}</span></span>
            <Swap k="bn" items={[['b', 'warn', R.blocked, 'x'], ['c', 'ok', R.clear, 'check']]} />
          </p>
          <ul className="qa__ls">
            {qa.items.map((it, i) => (
              <li key={it.t} className="qa__i" data-k={`qa-${i}`}>
                <span className="qa__t">{it.t}{it.why && <small>{it.why}</small>}</span>
                <span className="qa__s" data-k="qs">
                  {i === fixedAt
                    ? <span className="sw"><Pill tone="warn" icon="x" k={`qs-f${i}`}>Failed</Pill><Pill tone="ok" icon="check" k={`qs-p${i}`}>Passed</Pill></span>
                    : <Pill tone={QA_TONE[it.s]} icon={QA_ICON[it.s]}>{QA_WORD[it.s]}</Pill>}
                </span>
              </li>
            ))}
          </ul>
          <p className="qa__rb" data-k="rb"><Icon name="rollback" size={14} /><span>{qa.rollback}</span></p>
        </div>
        <p className="vw__f label">{qa.foot}</p>
        <GateBar g={R.gate} done={R.gate.done} />
      </section>
      <Cur id="pm" name="Your PM" tone="person" />
      <Cur id="ag" name={R.agent.name} tone="agent" />
    </Scene>
  )
}

/* ───────────────────────── Measure ───────────────────────── */
export function buildMonitor(d) {
  const cm = d.cur('mo')
  const $ = d.$
  d.hide(['m1', 'm2'].map($), { y: 10 })
  d.hide(d.$$('ck-i'), { y: 8 }); d.hide(d.$$('ck-ok'), { scale: 0.4 }); d.hide(d.$$('ck-sp'))
  d.hide([$('mc-base'), $('mc-res')], { strokeDasharray: 1, strokeDashoffset: 1 })
  d.hide(['mc-rel', 'mc-bl', 'mc-rs'].map($), { y: 0 })
  d.hide(d.$$('vd-i'), { y: 8 }); d.hide([$('vd-sel'), $('vd-why'), $('gate'), $('gs-ok'), $('ver-v')])

  let t = 0.6
  d.show($('m1'), t)
  const s = d.steps('st1', t + 0.2, { each: 0.9, spin: 0.7 })
  d.scroll('tcol', 'm1', t, { align: 'bottom', margin: 12 })
  // each check on the artifact resolves with its step
  d.show(d.$$('ck-i'), t + 0.2, { dur: 0.35, stagger: 0.9 })
  d.show(d.$$('ck-sp'), t + 0.2, { dur: 0.2, stagger: 0.9 })
  d.tl.to(d.$$('ck-sp'), { autoAlpha: 0, duration: 0.15, stagger: 0.9 }, t + 0.2 + 0.7)
  d.tl.to(d.$$('ck-ok'), { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'eSpring', stagger: 0.9 }, t + 0.2 + 0.7)
  cm.at(d.$$('ck-i')[0], t + 0.2, { fx: 0.9, fy: 0.5, dx: 40, dy: 10 })
  ;[0, 1, 2].forEach((i) => cm.to(d.$$('ck-i')[i], t + 0.4 + i * 0.9, { fx: 0.85, fy: 0.5, dur: 0.5 }))
  // the chart draws: the frozen baseline, then the result against it
  let c = s + 0.4
  cm.to('mc-bl', c, { fx: 0.9, fy: 0.5, dur: 0.7 })
  d.show([$('mc-bl')], c, { dur: 0.2 })
  d.tl.to($('mc-base'), { autoAlpha: 1, strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' }, c + 0.1)
  d.show([$('mc-rel')], c + 0.7, { dur: 0.3 })
  d.show([$('mc-rs')], c + 1.4, { dur: 0.2 })
  cm.to('mc-rs', c + 1.4, { fx: 0.95, fy: 0.3, dur: 1.2 })
  d.tl.to($('mc-res'), { autoAlpha: 1, strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' }, c + 1.5)
  c += 3.2
  d.swap('ver-m', 'ver-v', c)
  d.show($('m2'), c); d.scroll('tcol', 'm2', c, { align: 'bottom', margin: 12 })
  // the verdict
  cm.to(d.$$('vd-i')[0], c + 0.2, { fx: 0.6, fy: 0.5, dur: 0.7 })
  d.show(d.$$('vd-i'), c + 0.3, { dur: 0.35, stagger: 0.12 })
  d.show($('vd-sel'), c + 1.1, { dur: 0.4 })
  d.show($('vd-why'), c + 1.3, { dur: 0.4 })
  const u = d.stream('m2w', c + 0.3, { wps: 15 })
  cm.hide(c + 1.8)
  d.show($('gate'), Math.max(u, c + 1.8) + 0.2, { dur: 0.35 })
  d.swap('gs-wait', 'gs-ok', Math.max(u, c + 1.8) + 0.6)
}

export function MonitorScene(props) {
  const v = monitor.verdicts.find((x) => x.id === M.verdict)
  return (
    <Scene id="monitor" title="Measure" crumbs={M.crumbs} build={buildMonitor} speed={1.3} phoneH={860} {...props}>
      <Thread agent={M.agent}>
        <Msg who="ag" name={M.agent.name} icon={M.agent.icon} tone={M.agent.tone} k="m1"><Steps k="st1" items={M.steps} /></Msg>
        <Msg who="ag" name={M.agent.name} icon={M.agent.icon} tone={M.agent.tone} k="m2"><p><Words k="m2w" text={M.done} /></p></Msg>
      </Thread>
      <section className="art" aria-label="Outcome">
        <div className="art__tabs">
          <span className="ftab"><Icon name="chart" size={13} />{monitor.title}</span>
          <Swap k="ver" items={[['m', 'sky', 'Measuring'], ['v', 'ok', `Verdict · ${v.t}`]]} />
        </div>
        <div className="mon">
          <ul className="cks">
            {monitor.checks.map((c, i) => (
              <li key={c.t} className="ck" data-k="ck-i">
                <span className="ck__s"><i className="stp__spin" data-k="ck-sp" /><Icon name="check" size={12} className="stp__ok" data-k="ck-ok" /></span>
                <span>{c.t}</span><Pill tone="ok">Code</Pill>
              </li>
            ))}
          </ul>
          <figure className="mc" aria-label="Baseline against result. Shape only, no values.">
            <svg viewBox="0 0 400 150" role="img" aria-hidden="true">
              {[30, 75, 120].map((y) => <line key={y} x1="10" x2="390" y1={y} y2={y} className="mc__g" />)}
              <g data-k="mc-rel"><line x1="150" x2="150" y1="10" y2="140" className="mc__rel" /><text x="156" y="22" className="mc__t">Release</text></g>
              <path data-k="mc-base" className="mc__base mc" pathLength="1" d="M10 96 C50 92 90 100 150 96 S 270 98 390 96" />
              <path data-k="mc-res" className="mc__res mc" pathLength="1" d="M10 96 C50 92 90 100 150 96 C 200 92 230 76 270 64 S 350 50 390 44" />
            </svg>
            <figcaption className="mc__l"><span data-k="mc-bl"><i className="mc__k mc__k--b" />Baseline, frozen</span><span data-k="mc-rs"><i className="mc__k mc__k--r" />Result</span><em>{monitor.axis}</em></figcaption>
          </figure>
          <div className="vds" data-k="vds">
            {monitor.verdicts.map((x) => (
              <div key={x.id} className={`vd${x.id === M.verdict ? ' is-sel' : ''}`} data-k="vd-i">
                {x.id === M.verdict && <i className="vd__sel" data-k="vd-sel" aria-hidden="true" />}
                <b>{x.t}</b><small>{x.d}</small>
              </div>
            ))}
          </div>
          <p className="vw__f label" data-k="vd-why">{monitor.foot}</p>
        </div>
        <GateBar g={M.gate} wait="Not sent" done="Waiting for review" doneTone="amber" />
      </section>
      <Cur id="mo" name="Monitor" tone="code" />
    </Scene>
  )
}

/* ───────────────────────── Brain log ───────────────────────── */
const TONE_PILL = { ok: 'ok', back: 'amber', pending: 'grey' }

export function buildBrain(d) {
  const pm = d.cur('pm'), ag = d.cur('ag')
  const $ = d.$
  const rows = d.$$('bl-i')
  d.hide(['m1', 'm2', 'm3'].map($), { y: 10 })
  d.hide(rows, { y: 8 })
  d.hide([$('hl')], { x: 0, y: 0, width: 0, height: 0 })
  d.hide([$('ver-r')])
  d.show(rows, 0.5, { dur: 0.35, stagger: 0.18 })
  let t = 0.5 + rows.length * 0.18 + 0.7
  t = pmAsk(d, pm, 0, t, 'm1')
  pm.hide(t - 0.1)
  d.show($('m2'), t + 0.1)
  d.scroll('tcol', 'm2', t + 0.1, { align: 'bottom', margin: 12 })
  ag.at(rows[0], t + 0.2, { fx: 0.9, fy: 0.4, dx: 40, dy: 10 })
  t = d.steps('st1', t + 0.3, { each: 0.8 })
  const back = brainLog.entries.findIndex((e) => e.tone === 'back')
  d.focus('hl', rows[back], t - 0.3, { within: 'bll', pad: 4, dur: 0.5 })
  ag.to(rows[back], t - 0.3, { fx: 0.9, fy: 0.5, dur: 0.6 })
  d.focus('hl', rows[back + 1], t + 0.5, { within: 'bll', pad: 4, dur: 0.5 })
  ag.to(rows[back + 1], t + 0.5, { fx: 0.9, fy: 0.5, dur: 0.6 })
  d.show($('m3'), t)
  d.scroll('tcol', 'm3', t, { align: 'bottom', margin: 12 })
  t = d.stream('m3w', t + 0.1, { wps: 15 })
  d.swap('ver-l', 'ver-r', t)
  ag.hide(t + 0.2)
}

export function BrainScene(props) {
  return (
    <Scene id="brain" title="Brain log" crumbs={B.crumbs} build={buildBrain} speed={1.3} phoneH={930} {...props}>
      <Thread agent={B.agent} composer={<Composer agent={B.agent.name} placeholder={B.placeholder} texts={[B.ask]} />}>
        <Msg who="you" name="Your PM" ini="PM" k="m1"><p>{B.ask}</p></Msg>
        <Msg who="ag" name={B.agent.name} icon={B.agent.icon} tone={B.agent.tone} k="m2"><Steps k="st1" items={B.steps} /></Msg>
        <Msg who="ag" name={B.agent.name} icon={B.agent.icon} tone={B.agent.tone} k="m3"><p><Words k="m3w" text={B.answer} /></p></Msg>
      </Thread>
      <section className="art" aria-label="Decision log">
        <div className="art__tabs">
          <span className="ftab"><Icon name="brain" size={13} />{brainLog.title}</span>
          <Swap k="ver" items={[['l', 'grey', 'Log'], ['r', 'sky', 'Replayed']]} />
        </div>
        <ol className="bll" data-k="bll">
          <i className="hl" data-k="hl" aria-hidden="true" />
          {brainLog.entries.map((e) => (
            <li key={e.g + e.what} className={`bl bl--${e.tone}`} data-k="bl-i">
              <i className="bl__dot" aria-hidden="true" />
              <p className="bl__h"><b>{e.g}</b><span>{e.who}</span><Pill tone={TONE_PILL[e.tone]}>{e.what}</Pill></p>
              <p className="bl__w">{e.why}</p>
            </li>
          ))}
        </ol>
        <p className="vw__f label">{brainLog.foot}</p>
      </section>
      <Cur id="pm" name="Your PM" tone="person" />
      <Cur id="ag" name={B.agent.name} tone="agent" />
    </Scene>
  )
}

/* ───────────────────────── Research ───────────────────────── */
const MODE_TONE = { 'Internal recall': 'sky', 'External scan': 'amber' }

export function buildResearch(d) {
  const pm = d.cur('pm'), ag = d.cur('ag')
  const $ = d.$
  const rows = d.$$('br-i')
  d.hide(['m1', 'm2', 'm3'].map($), { y: 10 })
  d.hide(rows, { y: 8 }); d.hide(d.$$('br-bar'), { scaleX: 0, transformOrigin: '0 50%' }); d.hide(d.$$('br-ch'), { scale: 0.6 })
  d.hide([$('br-f'), $('ver-d')])
  let t = pmAsk(d, pm, 0, 0.5, 'm1')
  pm.hide(t - 0.1)
  d.show($('m2'), t + 0.1)
  d.scroll('tcol', 'm2', t + 0.1, { align: 'bottom', margin: 12 })
  t = d.steps('st1', t + 0.3, { each: 1.0, spin: 0.8 })
  const r0 = t - 1.4
  ag.at(rows[0], r0, { fx: 0.9, fy: 0.5, dx: 60, dy: 20 })
  rows.forEach((row, i) => {
    const at = r0 + i * 0.95
    ag.to(row, at, { fx: 0.85, fy: 0.5, dur: 0.45 })
    d.show(row, at + 0.1, { dur: 0.3 })
    d.tl.to(d.$$('br-bar')[i], { scaleX: 1, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, at + 0.25)
    d.show(d.$$(`br-ch-${i}`), at + 0.7, { dur: 0.3, stagger: 0.12, ease: 'eSpring' })
  })
  t = r0 + rows.length * 0.95 + 0.4
  ag.hide(t)
  d.show($('br-f'), t, { dur: 0.3 })
  d.swap('ver-w', 'ver-d', t)
  d.show($('m3'), t + 0.1)
  d.scroll('tcol', 'm3', t + 0.1, { align: 'bottom', margin: 12 })
  d.stream('m3w', t + 0.2, { wps: 16 })
}

export function ResearchScene(props) {
  return (
    <Scene id="research" title="Research" crumbs={Rs.crumbs} build={buildResearch} speed={1.3} {...props}>
      <Thread agent={Rs.agent} composer={<Composer agent={Rs.agent.name} placeholder={Rs.placeholder} texts={[Rs.ask]} />}>
        <Msg who="you" name="Your PM" ini="PM" k="m1"><p>{Rs.ask}</p></Msg>
        <Msg who="ag" name={Rs.agent.name} icon={Rs.agent.icon} tone={Rs.agent.tone} k="m2"><Steps k="st1" items={Rs.steps} /></Msg>
        <Msg who="ag" name={Rs.agent.name} icon={Rs.agent.icon} tone={Rs.agent.tone} k="m3"><p><Words k="m3w" text={Rs.done} /></p></Msg>
      </Thread>
      <section className="art" aria-label="Dated brief">
        <div className="art__tabs">
          <span className="ftab"><Icon name="search" size={13} />{brief.title}</span>
          <Swap k="ver" items={[['w', 'sky', 'Researching'], ['d', 'ok', 'Brief drafted']]} />
        </div>
        <ul className="br">
          {brief.rows.map((r, i) => (
            <li key={i} className="br__i" data-k="br-i">
              <Pill tone={MODE_TONE[r.mode]}>{r.mode}</Pill>
              <span className="br__bar"><i data-k="br-bar" style={{ width: `${r.w}%` }} /></span>
              <span className="br__chips">{Rs.chips.map((c) => <span key={c} data-k={`br-ch-${i}`}><Pill tone="grey" icon="check">{c}</Pill></span>)}</span>
            </li>
          ))}
        </ul>
        <p className="vw__f label" data-k="br-f">{brief.foot}</p>
      </section>
      <Cur id="pm" name="Your PM" tone="person" />
      <Cur id="ag" name={Rs.agent.name} tone="agent" />
    </Scene>
  )
}

/* ───────────────────────── Architect ───────────────────────── */
export function buildArchitect(d) {
  const pm = d.cur('pm'), ag = d.cur('ag')
  const $ = d.$
  const nodes = d.$$('sy-n')
  const links = d.$$('sy-l')
  d.hide(['m1', 'm2', 'm3'].map($), { y: 10 })
  d.hide(nodes, { y: 10 }); d.hide(d.$$('sy-tag'), { scale: 0.6 }); d.hide(links, { scaleX: 0, transformOrigin: '0 50%' })
  d.hide([$('sy-clash'), $('sy-cl')], { y: 10 }); d.hide([$('sy-cl-line')], { scaleY: 0, transformOrigin: '50% 0' })
  d.hide([$('sy-warn'), $('ver-d')])
  let t = pmAsk(d, pm, 0, 0.5, 'm1')
  pm.hide(t - 0.1)
  d.show($('m2'), t + 0.1)
  d.scroll('tcol', 'm2', t + 0.1, { align: 'bottom', margin: 12 })
  t = d.steps('st1', t + 0.3, { each: 0.9, spin: 0.7 })
  const n0 = t - 1.9
  ag.at(nodes[0], n0, { fx: 0.9, fy: 0.5, dx: 60, dy: -20 })
  nodes.forEach((n, i) => {
    const at = n0 + 0.9 + i * 0.7
    ag.to(n, at, { fx: 0.8, fy: 0.4, dur: 0.45 })
    d.show(n, at + 0.1, { dur: 0.35 })
    d.show(d.$$('sy-tag')[i], at + 0.4, { dur: 0.3, ease: 'eSpring' })
    if (links[i - 1]) d.tl.to(links[i - 1], { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, at - 0.2)
  })
  // the check for clashes
  let c = n0 + 0.9 + nodes.length * 0.7 + 0.3
  ag.to($('sy-clash'), c, { fx: 0.8, fy: 0.4, dur: 0.6 })
  d.show($('sy-clash'), c + 0.2, { dur: 0.4 })
  d.tl.to($('sy-cl-line'), { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, c + 0.3)
  d.show($('sy-warn'), c + 0.9, { dur: 0.4 })
  t = c + 1.5
  ag.hide(t)
  d.swap('ver-b', 'ver-d', t)
  d.show($('m3'), t + 0.1)
  d.scroll('tcol', 'm3', t + 0.1, { align: 'bottom', margin: 12 })
  d.stream('m3w', t + 0.2, { wps: 16 })
}

export function ArchitectScene(props) {
  const n = systemDesign.nodes.length
  const done = `Mapped ${n} changes. One clash found, and it is flagged for the pack before Gate 3.`
  return (
    <Scene id="architect" title="System design" crumbs={Ar.crumbs} build={buildArchitect} speed={1.3} phoneH={790} {...props}>
      <Thread agent={Ar.agent} composer={<Composer agent={Ar.agent.name} placeholder={Ar.placeholder} texts={[Ar.ask]} />}>
        <Msg who="you" name="Your PM" ini="PM" k="m1"><p>{Ar.ask}</p></Msg>
        <Msg who="ag" name={Ar.agent.name} icon={Ar.agent.icon} tone={Ar.agent.tone} k="m2"><Steps k="st1" items={Ar.steps} /></Msg>
        <Msg who="ag" name={Ar.agent.name} icon={Ar.agent.icon} tone={Ar.agent.tone} k="m3"><p><Words k="m3w" text={done} /></p></Msg>
      </Thread>
      <section className="art" aria-label="System design">
        <div className="art__tabs">
          <span className="ftab"><Icon name="branch" size={13} />{systemDesign.title}</span>
          <Swap k="ver" items={[['b', 'sky', 'Mapping'], ['d', 'ok', `${n} changes`]]} />
        </div>
        <div className="sy">
          <div className="sy__row">
            {systemDesign.nodes.map((nd, i) => (
              <div key={nd.id} className="sy__c">
                <article className="sy__n" data-k="sy-n">
                  <p className="sy__k"><Icon name={['database', 'branch', 'chart'][i] || 'grid'} size={13} />{nd.k}<span data-k="sy-tag"><Pill tone={nd.tag === 'New' ? 'ok' : 'sky'}>{nd.tag}</Pill></span></p>
                  <p className="sy__t">{nd.t}</p>
                </article>
                {i < n - 1 && <i className="sy__a" data-k="sy-l" aria-hidden="true" />}
              </div>
            ))}
          </div>
          <div className="sy__cl">
            <i className="sy__line" data-k="sy-cl-line" aria-hidden="true" />
            <article className="sy__n sy__n--clash" data-k="sy-clash"><p className="sy__k"><Icon name="mail" size={13} />{Ar.clashNode}<Pill tone="amber">Clash</Pill></p><p className="sy__t">Also messages on failed orders.</p></article>
          </div>
          <p className="sy__warn" data-k="sy-warn"><Icon name="flag" size={14} />{systemDesign.clash}</p>
        </div>
      </section>
      <Cur id="pm" name="Your PM" tone="person" />
      <Cur id="ag" name={Ar.agent.name} tone="agent" />
    </Scene>
  )
}
