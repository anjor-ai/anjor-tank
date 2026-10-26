import { prdScene as P } from '../content'
import { Icon } from '../components/icons'
import { Cur, Scene, Type, Words } from './engine'
import { Avatar, Composer, Msg, Pill, Src, Steps, Swap, Thread } from './kit'

/* The Product agent, working. A person asks, the agent reads the Brain and writes the PRD, the person asks why, comments on a
   requirement, and the agent revises it in place. Everything on screen is drawn from content/showcase.js → prdScene. */

const D = P.doc

function Sec({ n, title, k, children }) {
  return (
    <section className="ds" data-k={k}>
      <h4 className="ds__h"><span>{n}</span>{title}</h4>
      {children}
    </section>
  )
}

export function buildPrd(d, { beats = ['write', 'ask', 'revise'] } = {}) {
  const pm = d.cur('pm'), ag = d.cur('ag')
  const has = (b) => beats.includes(b)
  const $ = d.$

  // ── Start states: everything the script will bring in ──
  d.hide(['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'].map($), { y: 10 })
  d.hide(['meta', 's1', 's2', 's3', 's4', 's5', 's6', 's7'].map($), { y: 6 })
  d.hide([$('hl')], { width: 0, height: 0, x: 0, y: 0 })
  d.hide(['cm-rev'].map($), { y: 6, scale: 0.98 })
  d.hide(['gate'].map($), { y: 6 })
  d.hide(['new-R3'].map($), { y: 0 })
  d.hide([$('chg')], { scale: 0.6 })
  d.hide(d.$$('acc-i'), { scale: 0.5 })
  d.hide(['sel-R2', 'sel-R3'].map($), { scaleX: 0, transformOrigin: '0 50%' })
  d.hide([$('comp-ctx')], { scale: 0.8 })
  ;['ver-w', 'ver-v1', 'ver-rev', 'ver-v2', 'gs-sent'].forEach((k) => d.hide([$(k)]))
  d.init($('old-R3'), { '--x': '0%', opacity: 1 })
  d.init($('new-R3'), { height: 0, marginTop: 0 })
  d.hide([$('cm-done')])

  // ── 1 · The person asks ──
  let t = 0.5
  pm.at('comp-ph', t, { fx: 0.85, fy: 0.5, dx: 60, dy: 70 })
  t = pm.to('comp-ph', t + 0.25, { fx: 0.18, fy: 0.5, dur: 0.9 })
  t = pm.click(t + 0.05)
  d.out($('comp-ph'), t, { dur: 0.15 })
  t = d.type('comp-type0', t + 0.15, { cps: 34 })
  t = pm.to('comp-send', t + 0.3, { fx: 0.5, fy: 0.5, dur: 0.55 })
  pm.click(t + 0.05); d.press('comp-send', t + 0.05)
  d.clearType('comp-type0', t + 0.25)
  d.show($('comp-ph'), t + 0.5)
  t = d.show($('m1'), t + 0.25)
  t = d.show($('m2'), t + 0.1)
  d.scroll('tcol', 'm2', t - 0.4, { align: 'bottom', margin: 12 })
  pm.hide(t - 0.2)

  // ── 2 · The agent reads, then writes ──
  d.swap('ver-e', 'ver-w', t + 0.4)
  const tw = d.steps('st1', t + 0.2, { each: 0.85, hold: true })

  const block = (secK, textK, hlTarget, at, { wps = 18, scroll = true } = {}) => {
    if (scroll) d.scroll('dsc', secK, at - 0.5, { dur: 0.6 })
    let e = d.show($(secK), at, { dur: 0.3 })
    d.focus('hl', hlTarget, at)
    ag.to(hlTarget, at + 0.05, { fx: 1, fy: 1, dx: 4, dy: 6, dur: 0.55 })
    return d.stream(textK, at + 0.3, { wps })
  }

  let w = tw - 0.5
  ag.at('title', w, { fx: 0.05, fy: 0.5, dx: -24, dy: 30 })
  d.focus('hl', 'title', w + 0.1)
  ag.to('title', w + 0.15, { fx: 1, fy: 1, dx: 4, dy: 6, dur: 0.5 })
  w = d.stream('tw', w + 0.35, { wps: 10 })
  w = d.show($('meta'), w - 0.1, { dur: 0.35 })
  w = block('s1', 'p1w', 'p1', w + 0.05)
  w = block('s2', 'p2w', 'p2', w + 0.15)
  // requirements
  d.show($('s3'), w + 0.15, { dur: 0.3 })
  d.scroll('dsc', 's3', w - 0.1, { dur: 0.6 })
  let r = w + 0.45
  D.reqs.forEach((q) => {
    d.focus('hl', `req-${q.id}`, r, { dur: 0.4 })
    ag.to(`req-${q.id}`, r + 0.05, { fx: 1, fy: 1, dx: 4, dy: 4, dur: 0.45 })
    r = d.stream(`rw-${q.id}`, r + 0.2, { wps: 20 }) + 0.12
  })
  // metrics, events, acceptance, open question
  const tab = (secK, rowsK, at) => {
    d.scroll('dsc', secK, at - 0.4, { dur: 0.6 })
    d.focus('hl', secK, at, { dur: 0.4 })
    ag.to(secK, at + 0.05, { fx: 1, fy: 0.5, dx: -10, dy: 0, dur: 0.45 })
    d.show($(secK), at + 0.1, { dur: 0.25 })
    d.hide(d.$$(rowsK), { y: 6 })
    return d.show(d.$$(rowsK), at + 0.3, { dur: 0.35, stagger: 0.12 })
  }
  r = tab('s4', 'met-i', r + 0.1) + 0.15
  r = tab('s5', 'evt-i', r) + 0.15
  const ra = tab('s6', 'acc-r', r)
  d.show(d.$$('acc-i'), ra - 0.3, { dur: 0.3, stagger: 0.18, ease: 'eSpring' })
  r = d.show($('s7'), ra + 0.5, { dur: 0.35 })
  d.focus('hl', 's7', ra + 0.5, { dur: 0.4 })
  d.out($('hl'), r + 0.3)
  ag.hide(r + 0.2)
  // the step that was running resolves; the document is a draft
  d.resolve('st1', 3, r + 0.2)
  d.swap('ver-w', 'ver-v1', r + 0.2)
  d.scroll('dsc', 'title', r + 0.5, { dur: 0.8, margin: 0 })
  t = d.show($('m3'), r + 0.35)
  d.scroll('tcol', 'm3', r + 0.3, { align: 'bottom', margin: 12 })
  t = d.stream('m3w', t - 0.1, { wps: 15 })
  t = d.show(d.$$('m3-src'), t, { dur: 0.3, stagger: 0.1 })

  // ── 3 · The person asks why ──
  if (has('ask')) {
    let a = t + 0.5
    d.scroll('dsc', 's3', a - 0.4, { dur: 0.6, margin: 20 })
    pm.at('req-R2', a, { fx: 0.9, fy: 0.5, dx: 90, dy: -10 })
    a = pm.to('req-R2', a + 0.3, { fx: 0.18, fy: 0.55, dur: 0.8 })
    pm.click(a + 0.05)
    d.show($('sel-R2'), a + 0.05, { dur: 0.5, ease: 'power2.out' })
    a += 0.7
    a = pm.to('comp-ph', a, { fx: 0.25, fy: 0.5, dur: 0.9 })
    pm.click(a + 0.05)
    d.show($('comp-ctx'), a + 0.05, { dur: 0.35, ease: 'eSpring' })
    d.out($('comp-ph'), a + 0.1, { dur: 0.15 })
    a = d.type('comp-type1', a + 0.25, { cps: 34 })
    a = pm.to('comp-send', a + 0.25, { fx: 0.5, fy: 0.5, dur: 0.5 })
    pm.click(a + 0.05); d.press('comp-send', a + 0.05)
    d.clearType('comp-type1', a + 0.25)
    d.out($('comp-ctx'), a + 0.25, { dur: 0.2 })
    d.show($('comp-ph'), a + 0.5)
    a = d.show($('m4'), a + 0.25)
    d.scroll('tcol', 'm4', a - 0.4, { align: 'bottom', margin: 12 })
    pm.hide(a - 0.1)
    // the agent reads the sources behind the requirement
    ag.at('req-R2', a + 0.2, { fx: 0.85, fy: 0.5, dx: 70, dy: 20 })
    d.focus('hl', 'req-R2', a + 0.2, { dur: 0.45 })
    ag.to('req-R2', a + 0.3, { fx: 1, fy: 1, dx: 4, dy: 4, dur: 0.5 })
    d.show($('m5'), a + 0.3)
    a = d.steps('st2', a + 0.5, { each: 0.8 })
    d.scroll('tcol', 'm5', a - 0.5, { align: 'bottom', margin: 12 })
    a = d.stream('m5w', a + 0.1, { wps: 17 })
    a = d.show(d.$$('m5-x'), a, { dur: 0.3, stagger: 0.12 })
    d.out($('hl'), a + 0.2)
    d.out($('sel-R2'), a + 0.2)
    ag.hide(a + 0.2)
    t = a + 0.6
  }

  // ── 4 · The person comments, the agent revises ──
  if (has('revise')) {
    let c = t + 0.3
    d.scroll('dsc', 's3', c - 0.4, { dur: 0.6, margin: 20 })
    pm.at('req-R3', c, { fx: 0.9, fy: 0.5, dx: 90, dy: 10 })
    c = pm.to('req-R3', c + 0.3, { fx: 0.18, fy: 0.45, dur: 0.8 })
    pm.click(c + 0.05)
    d.show($('sel-R3'), c + 0.05, { dur: 0.5, ease: 'power2.out' })
    c += 0.65
    d.show($('cm-rev'), c, { dur: 0.35 })
    c = pm.to('cm-rev', c + 0.2, { fx: 0.5, fy: 0.7, dur: 0.6 })
    c = d.type('cm-type', c + 0.1, { cps: 32 })
    c = pm.to('cm-post', c + 0.25, { fx: 0.5, fy: 0.5, dur: 0.5 })
    pm.click(c + 0.05); d.press('cm-post', c + 0.05)
    d.swap('cm-live', 'cm-done', c + 0.2, 0.2)
    c = d.show($('m6'), c + 0.3)
    d.scroll('tcol', 'm6', c - 0.4, { align: 'bottom', margin: 12 })
    pm.hide(c)
    // the agent picks it up
    d.swap('ver-v1', 'ver-rev', c + 0.1)
    d.show($('m7'), c + 0.3)
    ag.at('req-R3', c + 0.3, { fx: 0.85, fy: 0.5, dx: 70, dy: 24 })
    let u = d.steps('st3', c + 0.5, { each: 0.8, hold: true })
    d.scroll('tcol', 'm7', c + 0.4, { align: 'bottom', margin: 12 })
    d.focus('hl', 'req-R3', u - 0.5, { dur: 0.4 })
    ag.to('req-R3', u - 0.45, { fx: 0.7, fy: 0.5, dx: 0, dy: 0, dur: 0.5 })
    // strike the old line, write the new one in place
    const sr = u + 0.1
    d.tl.to($('old-R3'), { '--x': '100%', duration: 0.5, ease: 'power2.inOut' }, sr)
    d.tl.to($('old-R3'), { opacity: 0.55, duration: 0.3 }, sr + 0.4)
    d.tl.to($('new-R3'), { autoAlpha: 1, height: 'auto', marginTop: 6, duration: 0.45, ease: 'eInOut' }, sr + 0.3)
    d.focus('hl', 'req-R3', sr + 0.75, { dur: 0.45 })
    const nw = d.stream('rn-R3', sr + 0.8, { wps: 16 })
    d.show($('chg'), nw, { dur: 0.4, ease: 'eSpring' })
    d.resolve('st3', 1, nw + 0.1)
    d.swap('ver-rev', 'ver-v2', nw + 0.15)
    d.out($('sel-R3'), nw + 0.3)
    d.out($('cm-rev'), nw + 0.3)
    d.out($('hl'), nw + 0.4)
    ag.hide(nw + 0.3)
    u = d.stream('m7w', nw + 0.2, { wps: 15 })
    d.scroll('tcol', 'm7', nw + 0.2, { align: 'bottom', margin: 12 })
    t = u
  }

  // ── 5 · Sent on ──
  const g = d.show($('gate'), t + 0.2, { dur: 0.4 })
  d.swap('gs-wait', 'gs-sent', g + 0.3)
}

export function PrdScene({ beats, ...rest }) {
  const q = P.question
  return (
    <Scene id="prd" title="PRD" crumbs={P.crumbs} build={(d) => buildPrd(d, { beats })} speed={1.3} {...rest}>
      <Thread
        agent={P.agent}
        composer={<Composer agent={P.agent.name} placeholder={P.placeholder} texts={[P.ask, q.q]} ctx="R2" />}
      >
        <Msg who="you" name="Your PM" ini="PM" k="m1"><p>{P.ask}</p></Msg>
        <Msg who="ag" name={P.agent.name} icon="pencil" k="m2"><Steps k="st1" items={P.reads} /></Msg>
        <Msg who="ag" name={P.agent.name} icon="pencil" k="m3">
          <p><Words k="m3w" text={P.wrote} /></p>
          <p className="msg__x"><span data-k="m3-src"><Src>Finding F-001</Src></span><span data-k="m3-src"><Src>Gate 2 decision</Src></span></p>
        </Msg>
        <Msg who="you" name="Your PM" ini="PM" k="m4"><p className="msg__ctx"><Icon name="pin" size={11} />R2</p><p>{q.q}</p></Msg>
        <Msg who="ag" name={P.agent.name} icon="pencil" k="m5">
          <Steps k="st2" items={q.steps} />
          <p><Words k="m5w" text={q.a} /></p>
          <p className="msg__x" data-k="m5-x"><Pill tone="sky">Supported</Pill>{q.sources.map((s) => <Src key={s}>{s}</Src>)}</p>
          <p className="msg__note" data-k="m5-x"><b>Unseen</b>{q.unseen}</p>
        </Msg>
        <Msg who="you" name="Your PM" ini="PM" k="m6"><p className="msg__ctx"><Icon name="comment" size={11} />Comment on {P.review.on}</p><p>{P.review.text}</p></Msg>
        <Msg who="ag" name={P.agent.name} icon="pencil" k="m7">
          <Steps k="st3" items={P.update.steps} />
          <p><Words k="m7w" text={P.update.done} /></p>
        </Msg>
      </Thread>

      <section className="art" aria-label="PRD.md">
        <div className="art__tabs">
          <span className="ftab"><Icon name="doc" size={13} />PRD.md</span>
          <Swap k="ver" items={[['e', 'grey', 'Empty'], ['w', 'sky', 'Writing'], ['v1', 'grey', 'Draft v1'], ['rev', 'sky', 'Revising'], ['v2', 'ok', 'Draft v2']]} />
        </div>
        <div className="doc" tabIndex={0} role="region" aria-label="PRD document">
          <div className="doc__sc" data-k="dsc">
            <i className="hl" data-k="hl" aria-hidden="true" />
            <h3 className="doc__t" data-k="title"><Words k="tw" text={D.title} /></h3>
            <p className="doc__meta" data-k="meta">{D.meta.map((m) => <span key={m} className="mchip">{m}</span>)}</p>

            <Sec n="01" title={D.sections[0]} k="s1"><p className="doc__p" data-k="p1"><Words k="p1w" text={D.problem} /></p></Sec>
            <Sec n="02" title={D.sections[1]} k="s2"><p className="doc__p" data-k="p2"><Words k="p2w" text={D.goal} /></p></Sec>
            <Sec n="03" title={D.sections[2]} k="s3">
              <ul className="reqs">
                {D.reqs.map((q2) => (
                  <li key={q2.id} className="req" data-k={`req-${q2.id}`}>
                    {(q2.id === 'R2' || q2.id === 'R3') && <i className="sel" data-k={`sel-${q2.id}`} aria-hidden="true" />}
                    <code className="req__id">{q2.id}</code>
                    <span className="req__t">
                      {q2.next ? (
                        <>
                          <span className="old" data-k={`old-${q2.id}`}><Words k={`rw-${q2.id}`} text={q2.t} /></span>
                          <span className="new" data-k={`new-${q2.id}`}><Words k={`rn-${q2.id}`} text={q2.next} /> <Pill tone="ok" k="chg">Changed</Pill></span>
                        </>
                      ) : <Words k={`rw-${q2.id}`} text={q2.t} />}
                    </span>
                    {q2.id === 'R3' && (
                      <div className="cm" data-k="cm-rev">
                        <p className="cm__h"><Avatar ini="PM" /><b>Your PM</b><span className="sw cm__st"><Pill tone="grey" k="cm-live">Comment</Pill><Pill tone="ok" k="cm-done" icon="check">Resolved</Pill></span></p>
                        <p className="cm__b"><span className="cm__ph">{P.review.text}</span><span className="cm__ty" aria-hidden="true"><Type k="cm-type" text={P.review.text} /></span></p>
                        <p className="cm__f"><span className="cm__post" data-k="cm-post">Comment</span></p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </Sec>
            <Sec n="04" title={D.sections[3]} k="s4">
              <dl className="kv">{D.metrics.map(([a, b]) => <div key={a} data-k="met-i"><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
            </Sec>
            <Sec n="05" title={D.sections[4]} k="s5">
              <ul className="evts">{D.events.map(([a, b]) => <li key={a} data-k="evt-i"><code>{a}</code><span>{b}</span></li>)}</ul>
            </Sec>
            <Sec n="06" title={D.sections[5]} k="s6">
              <ul className="accs">{D.accept.map((a) => <li key={a} data-k="acc-r"><i className="accs__b" data-k="acc-i"><Icon name="check" size={10} /></i>{a}</li>)}</ul>
            </Sec>
            <Sec n="07" title={D.sections[6]} k="s7"><p className="doc__p doc__p--open"><Pill tone="amber">Open</Pill> {D.open}</p></Sec>
          </div>
        </div>
        <div className="gate" data-k="gate">
          <Icon name="gate" size={14} />
          <b>{P.gate.text}</b>
          <span>{P.gate.who}</span>
          <Swap k="gs" items={[['wait', 'grey', 'Not sent'], ['sent', 'amber', 'Waiting for review']]} />
        </div>
      </section>

      <Cur id="pm" name="Your PM" tone="person" />
      <Cur id="ag" name={P.agent.name} tone="agent" />
    </Scene>
  )
}
