import { designScene as P, wireframe } from '../content'
import { Icon } from '../components/icons'
import { Cur, Scene, Type, Words } from './engine'
import { Avatar, Composer, Msg, Pill, Steps, Swap, Thread } from './kit'

/* The Design agent, working. It reads the PRD and the design system, then builds the prototype on a canvas: it drags out a frame,
   places the parts, duplicates the frame for each state, links them, and tags each with the requirement it serves.
   A designer comments on the Error frame and the agent adds the missing action. Content: content/showcase.js → designScene. */

const F = wireframe.frames
const N = F.length
const L = P.labels
const TOOLS = [['cursor', 'cur'], ['frame', 'frame'], ['text', 'text'], ['rect', 'rect'], ['comment', 'cmt']]
const ICON = (f, i) => (f.warn ? 'bell' : f.ok ? 'check' : i === 2 ? 'spin' : null)

function Phone({ f, i }) {
  const ic = ICON(f, i)
  return (
    <div className={`pf${f.warn ? ' is-warn' : ''}${f.ok ? ' is-ok' : ''}`} data-k={`pf-${i}`}>
      <span className="pf__notch" />
      {ic && <span className="pf__ic" data-k={`ic-${i}`}>{ic === 'spin' ? <i className="pf__spin" /> : <Icon name={ic} size={14} />}</span>}
      <p className="pf__h" data-k={`h-${i}`}><Words k={`hw-${i}`} text={f.head} /></p>
      <p className="pf__p" data-k={`p-${i}`}>{f.body}</p>
      {i === 0 && <span className="pf__sum" data-k="sum-0"><i /><i /><i /></span>}
      <span className="pf__foot">
        {f.cta ? <span className="pf__btn" data-k={`b-${i}`}>{f.cta}</span> : <span className="pf__bar" data-k={`b-${i}`}><i /></span>}
        {f.warn && <span className="pf__alt" data-k={`a-${i}`}>{P.alt}</span>}
      </span>
    </div>
  )
}

export function buildDesign(d, { beats = ['build', 'review'] } = {}) {
  const pm = d.cur('pm'), ag = d.cur('ag'), ds = d.cur('ds')
  const $ = d.$
  const each = (fn) => Array.from({ length: N }, (_, i) => fn(i))
  const parts = (i, keys) => keys.map((k) => $(`${k}-${i}`)).filter(Boolean)
  const labelKeys = Object.keys(L)
  const toolKeys = TOOLS.map(([, k]) => k)

  // ── Start states ──
  d.hide(['m1', 'm2', 'm3', 'm4', 'm5'].map($), { y: 10 })
  d.hide(each((i) => $(`pf-${i}`)), { y: 0 })
  each((i) => d.hide(parts(i, ['ic', 'h', 'p', 'b', 'a', 'sum']), { y: 5 }))
  d.hide(each((i) => $(`fl-${i}`)), { y: 4 })
  d.hide(each((i) => $(`ly-${i}`)), { x: -6 })
  d.hide(each((i) => $(`rq-${i}`)), { scale: 0.6 })
  d.hide(each((i) => $(`lnk-${i}`)), { scaleX: 0, transformOrigin: '0 50%' })
  d.hide([$('sb')], { x: 0, y: 0, width: 0, height: 0 })
  d.hide(labelKeys.map((k) => $(`lb-${k}`)))
  d.hide([$('kb'), $('cv-cm'), $('gate')])
  d.hide([$('pin')], { scale: 0.4 })
  d.hide(['ver-b', 'ver-r', 'ver-d', 'gs-sent', 'cm-done'].map($))
  d.hide(toolKeys.filter((k) => k !== 'cur').map((k) => $(`tool-on-${k}`)))

  // ── Helpers ──
  const label = (k, at) => {
    d.tl.to(labelKeys.map((x) => $(`lb-${x}`)), { autoAlpha: 0, duration: 0.1 }, at)
    d.tl.to($(`lb-${k}`), { autoAlpha: 1, duration: 0.18 }, at + 0.06)
  }
  const tool = (name, at) => {
    d.tl.to(toolKeys.map((k) => $(`tool-on-${k}`)), { autoAlpha: 0, duration: 0.12 }, at)
    d.tl.to($(`tool-on-${name}`), { autoAlpha: 1, duration: 0.15 }, at)
  }
  // The selection box lands on a part, a label chip names it, the agent cursor follows.
  const pick = (target, name, at, { pad = 3, dur = 0.32, fx = 1, fy = 1 } = {}) => {
    d.focus('sb', target, at, { within: 'cvst', pad, dur })
    label(name, at + 0.08)
    ag.to(target, at + 0.03, { fx, fy, dx: 5, dy: 7, dur: dur + 0.05 })
    return at + dur
  }
  const name = (k, i) => (k === 'b' && !F[i].cta ? 'bar' : k)

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
  d.swap('ver-e', 'ver-b', t + 0.3)

  // ── 2 · The agent reads, then builds ──
  const tw = d.steps('st1', t + 0.2, { each: 0.8, hold: true })
  let b = tw - 0.5
  tool('frame', b)

  // Frame 1: dragged out as a marquee from its corner, then the parts are placed one by one.
  ag.at('pf-0', b + 0.05, { fx: 0, fy: 0, dx: -34, dy: -30 })
  ag.to('pf-0', b + 0.35, { fx: 0, fy: 0, dx: 0, dy: 0, dur: 0.4 })
  d.tl.set($('sb'), { x: () => d.pos('pf-0', 'cvst').x - 2, y: () => d.pos('pf-0', 'cvst').y - 2, width: 0, height: 0 }, b + 0.75)
  d.tl.to($('sb'), { autoAlpha: 1, duration: 0.1 }, b + 0.75)
  d.focus('sb', 'pf-0', b + 0.8, { within: 'cvst', pad: 2, dur: 0.75 })
  ag.to('pf-0', b + 0.8, { fx: 1, fy: 1, dx: 4, dy: 6, dur: 0.75 })
  label('frame', b + 1.2)
  d.show($('pf-0'), b + 1.4, { dur: 0.35 })
  d.show($('fl-0'), b + 1.5, { dur: 0.3 })
  d.show($('ly-0'), b + 1.5, { dur: 0.3 })
  b += 2.0
  ;['h', 'p', 'sum', 'b'].forEach((k) => {
    const el = $(`${k}-0`)
    if (!el) return
    tool(k === 'h' || k === 'p' ? 'text' : 'rect', b - 0.05)
    pick(el, name(k, 0), b)
    d.show(el, b + 0.14, { dur: 0.3 })
    if (k === 'h') d.stream('hw-0', b + 0.2, { wps: 12 })
    b += k === 'h' ? 0.7 : 0.5
  })

  // Frames 2 to 4: duplicate the previous frame, then change what differs.
  for (let i = 1; i < N; i++) {
    tool('cur', b - 0.05)
    pick(`pf-${i - 1}`, 'frame', b, { pad: 2, dur: 0.35, fx: 0.7, fy: 0.5 })
    d.show($('kb'), b + 0.3, { dur: 0.2 })
    d.tl.to($('kb'), { scale: 0.9, duration: 0.08 }, b + 0.55).to($('kb'), { scale: 1, duration: 0.25, ease: 'eSpring' }, b + 0.63)
    d.out($('kb'), b + 0.95, { dur: 0.2 })
    // the copy lands on the original and slides into its own place
    d.tl.fromTo($(`pf-${i}`),
      { x: () => -(d.pos(`pf-${i}`, 'cvst').x - d.pos(`pf-${i - 1}`, 'cvst').x), autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.55, ease: 'eInOut' }, b + 0.6)
    d.show($(`fl-${i}`), b + 1.0, { dur: 0.25 })
    d.show($(`ly-${i}`), b + 1.0, { dur: 0.25 })
    b += 1.3
    tool('text', b - 0.05)
    parts(i, ['ic', 'h', 'p', 'b']).forEach((el) => {
      const k = el.getAttribute('data-k').split('-')[0]
      pick(el, name(k, i), b, { dur: 0.26 })
      d.show(el, b + 0.1, { dur: 0.26 })
      if (k === 'h') d.stream(`hw-${i}`, b + 0.14, { wps: 12 })
      b += k === 'h' ? 0.6 : 0.34
    })
    b += 0.1
  }

  // Links: the agent drags a connector from each action to the next frame.
  d.out($('sb'), b, { dur: 0.2 })
  tool('cur', b)
  for (let i = 0; i < N - 1; i++) {
    ag.to(`b-${i}`, b + 0.1, { fx: 0.92, fy: 0.5, dur: 0.45 })
    d.press(`b-${i}`, b + 0.6)
    d.tl.to($(`lnk-${i}`), { autoAlpha: 1, scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, b + 0.65)
    ag.to(`pf-${i + 1}`, b + 0.65, { fx: 0.02, fy: 0.8, dur: 0.45 })
    b += 1.15
  }
  // Requirement tags
  d.show(each((i) => $(`rq-${i}`)), b, { dur: 0.35, stagger: 0.12, ease: 'eSpring' })
  b += 0.9
  ag.hide(b)
  d.resolve('st1', 2, b)
  d.swap('ver-b', 'ver-d', b)
  let u = d.show($('m3'), b + 0.2)
  d.scroll('tcol', 'm3', b + 0.2, { align: 'bottom', margin: 12 })
  u = d.stream('m3w', u - 0.1, { wps: 15 })

  // ── 3 · A designer comments, the agent edits ──
  if (beats.includes('review')) {
    let c = u + 0.5
    tool('cmt', c)
    ds.at('pf-1', c, { fx: 1, fy: 0.9, dx: 100, dy: 50 })
    c = ds.to('pf-1', c + 0.3, { fx: 1, fy: 0.06, dx: 0, dy: 0, dur: 0.9 })
    ds.click(c + 0.05)
    d.show($('pin'), c + 0.1, { dur: 0.35, ease: 'eSpring' })
    c += 0.5
    d.show($('cv-cm'), c, { dur: 0.35 })
    c = ds.to('cv-cm', c + 0.2, { fx: 0.5, fy: 0.7, dur: 0.5 })
    c = d.type('cv-type', c + 0.1, { cps: 32 })
    c = ds.to('cv-post', c + 0.25, { fx: 0.5, fy: 0.5, dur: 0.45 })
    ds.click(c + 0.05); d.press('cv-post', c + 0.05)
    d.swap('cm-live', 'cm-done', c + 0.2, 0.2)
    c = d.show($('m4'), c + 0.3)
    d.scroll('tcol', 'm4', c - 0.4, { align: 'bottom', margin: 12 })
    ds.hide(c)
    tool('cur', c)
    d.swap('ver-d', 'ver-r', c + 0.1)
    d.show($('m5'), c + 0.3)
    ag.at('pf-1', c + 0.3, { fx: 1, fy: 0.5, dx: 70, dy: 30 })
    let e = d.steps('st2', c + 0.5, { each: 0.8, hold: true })
    d.scroll('tcol', 'm5', c + 0.4, { align: 'bottom', margin: 12 })
    e += 0.1
    tool('text', e - 0.05)
    pick('a-1', 'a', e)
    d.show($('a-1'), e + 0.3, { dur: 0.35 })
    e += 0.85
    d.resolve('st2', 1, e)
    d.swap('ver-r', 'ver-d', e + 0.1)
    d.out($('pin'), e + 0.3); d.out($('cv-cm'), e + 0.3); d.out($('sb'), e + 0.3)
    tool('cur', e + 0.3)
    ag.hide(e + 0.3)
    u = d.stream('m5w', e + 0.2, { wps: 15 })
    d.scroll('tcol', 'm5', e + 0.2, { align: 'bottom', margin: 12 })
  }

  const g = d.show($('gate'), u + 0.2, { dur: 0.4 })
  d.swap('gs-wait', 'gs-sent', g + 0.3)
}

export function DesignScene({ beats, ...rest }) {
  const r = P.review
  return (
    <Scene id="design" title="Wireframe" crumbs={P.crumbs} build={(d) => buildDesign(d, { beats })} speed={1.3} {...rest}>
      <Thread agent={P.agent} composer={<Composer agent={P.agent.name} placeholder={P.placeholder} texts={[P.ask]} />}>
        <Msg who="you" name="Your PM" ini="PM" k="m1"><p>{P.ask}</p></Msg>
        <Msg who="ag" name={P.agent.name} icon="layers" tone="peach" k="m2"><Steps k="st1" items={P.reads} /></Msg>
        <Msg who="ag" name={P.agent.name} icon="layers" tone="peach" k="m3"><p><Words k="m3w" text={P.built} /></p></Msg>
        <Msg who="you" name={r.who} ini={r.ini} tone="design" k="m4"><p className="msg__ctx"><Icon name="comment" size={11} />Comment on {r.on}</p><p>{r.text}</p></Msg>
        <Msg who="ag" name={P.agent.name} icon="layers" tone="peach" k="m5">
          <Steps k="st2" items={P.update.steps} />
          <p><Words k="m5w" text={P.update.done} /></p>
        </Msg>
      </Thread>

      <section className="art" aria-label="Wireframe canvas">
        <div className="art__tabs">
          <span className="ftab"><Icon name="layers" size={13} />failed-payment.fig</span>
          <Swap k="ver" items={[['e', 'grey', 'Empty'], ['b', 'sky', 'Building'], ['r', 'sky', 'Editing'], ['d', 'ok', '4 frames']]} />
        </div>
        <div className="cv">
          <ul className="lay" aria-label="Layers">
            <li className="lay__h">Layers</li>
            {F.map((f, i) => <li key={f.state} className="lay__i" data-k={`ly-${i}`}><Icon name="frame" size={11} />Frame {String(i + 1).padStart(2, '0')} · {f.state}</li>)}
          </ul>
          <div className="cv__st" data-k="cvst">
            <ol className="cv__row">
              {F.map((f, i) => (
                <li key={f.state} className="cvf">
                  <p className="cvf__l" data-k={`fl-${i}`}><span>{String(i + 1).padStart(2, '0')}</span>{f.state}<b className="rq" data-k={`rq-${i}`}>{P.reqs[i]}</b></p>
                  <div className="cvf__ph">
                    <Phone f={f} i={i} />
                    {i < N - 1 && <i className="lnk" data-k={`lnk-${i}`} aria-hidden="true" />}
                    {i === 1 && (
                      <>
                        <span className="pin" data-k="pin" aria-hidden="true"><Icon name="comment" size={12} /></span>
                        <div className="cm cm--cv" data-k="cv-cm">
                          <p className="cm__h"><Avatar ini={r.ini} tone="design" /><b>{r.who}</b><span className="sw cm__st"><Pill tone="grey" k="cm-live">Comment</Pill><Pill tone="ok" k="cm-done" icon="check">Resolved</Pill></span></p>
                          <p className="cm__b"><span className="cm__ph">{r.text}</span><span className="cm__ty" aria-hidden="true"><Type k="cv-type" text={r.text} /></span></p>
                          <p className="cm__f"><span className="cm__post" data-k="cv-post">Comment</span></p>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <i className="sb" data-k="sb" aria-hidden="true">
              <b className="sb__h sb__h--a" /><b className="sb__h sb__h--b" /><b className="sb__h sb__h--c" /><b className="sb__h sb__h--d" />
              <span className="sb__ls">{Object.entries(L).map(([k, v]) => <em key={k} className="sb__l" data-k={`lb-${k}`}>{v}</em>)}</span>
            </i>
          </div>
          <div className="cv__tools" role="presentation" aria-hidden="true">
            {TOOLS.map(([ic, k]) => (
              <span key={k} className="tool"><i className="tool__on" data-k={`tool-on-${k}`} /><Icon name={ic} size={14} /></span>
            ))}
            <span className="kb" data-k="kb">⌘ D</span>
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
      <Cur id="ds" name={r.who} tone="design" />
      <Cur id="ag" name={P.agent.name} tone="agent" />
    </Scene>
  )
}
