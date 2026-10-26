import { brainLog, evidence, rankedFindings, score, signalLog } from '../content'
import { Icon } from './icons'
import { AsciiArt, hasScene } from '../art/AsciiArt'

/* Small product illustrations that sit on top of a card, one per idea. Built from the same illustrative work item as the rest of
   the site, drawn in CSS, decorative (the card's own text says the same thing). Keyed by a short name. */

const f = [...rankedFindings].sort((a, b) => score(b) - score(a))[0]
const gap = signalLog.lines.find((l) => l.state === 'gap')
const P = ({ tone, children }) => <i className={`art__pill art__pill--${tone}`}>{children}</i>

function Label({ id }) {
  const fs = rankedFindings.filter((x) => x.label === id)
  const tone = { confirmed: 'ok', supported: 'sky', hypothesis: 'grey' }[id]
  return <ul className="art__files">{fs.slice(0, 2).map((x) => <li key={x.id}><code>{x.id}</code><span className="art__t">{x.t}</span><P tone={tone}>{id}</P></li>)}</ul>
}

const ART = {
  find: () => (
    <div className="art__line">
      <span className="art__node"><small>Captures</small>{gap.from}</span>
      <span className="art__dash"><P tone="amber">Gap</P></span>
      <span className="art__node art__node--blind"><small>Decides</small>{gap.to}</span>
    </div>
  ),
  decide: () => (
    <div className="art__stack">
      <span className="art__sheet art__sheet--back" />
      <span className="art__sheet"><b>{f.id}</b><span>{f.t}</span><span className="art__btns"><i className="art__btn">Send back</i><i className="art__btn art__btn--go"><Icon name="check" size={10} />Approve</i></span></span>
    </div>
  ),
  prove: () => (
    <div className="art__chart">
      <svg viewBox="0 0 200 70" aria-hidden="true"><path className="art__base" d="M4 46H196" /><path className="art__res" d="M4 47C50 47 80 48 104 40S160 18 196 14" /><circle className="art__pt" cx="196" cy="14" r="4" /></svg>
      <span className="art__verd"><P tone="ok">Keep</P><P tone="grey">Tune</P><P tone="grey">Roll back</P></span>
    </div>
  ),
  code: () => (
    <pre className="art__code"><span><i>1</i><b>score</b> = value × confidence ÷ effort</span><span><i>2</i>{f.id}: {f.v} × {f.c} ÷ {f.e} = <b>{score(f)}</b></span><span><i>3</i><em># reproducible, no agent computes it</em></span></pre>
  ),
  agent: () => (
    <div className="art__doc"><p><Icon name="doc" size={12} />PRD.md<P tone="sky">Draft</P></p><span /><span /><span className="is-s" /><p className="art__muted"><Icon name="lock" size={11} />Writes to the workspace only</p></div>
  ),
  person: () => (
    <div className="art__gate"><span className="art__av">PM</span><span><b>Gate 1 · Brand PM</b><small>Confirm the problem is real</small></span><P tone="ok">Approved</P></div>
  ),
  lock: () => (
    <ul className="art__perm"><li><Icon name="eye" size={12} />Read exports<P tone="ok">On</P></li><li><Icon name="pencil" size={12} />Write to live systems<P tone="warn">Never</P></li><li><Icon name="send" size={12} />Deploy<P tone="grey">Your engineers</P></li></ul>
  ),
  eye: () => (
    <ul className="art__secs">{['Systems', 'Journeys', 'Data', 'Logic', 'People', 'Finance'].map((s, i) => <li key={s} className={i > 3 ? 'is-off' : ''}>{i > 3 ? <Icon name="lock" size={10} /> : <Icon name="check" size={10} />}{s}</li>)}</ul>
  ),
  gate: () => (
    <ol className="art__gates">{['1', '2', '3', '4', '↻'].map((g, i) => <li key={g} className={i < 3 ? 'is-done' : i === 3 ? 'is-now' : ''}><span><b>{g === '↻' ? <Icon name="replay" size={10} /> : g}</b></span></li>)}</ol>
  ),
  check: () => (
    <ul className="art__labels">{evidence.map((e) => <li key={e.id}><P tone={{ confirmed: 'ok', supported: 'sky', hypothesis: 'grey' }[e.id]}>{e.label}</P><span>{e.d.split('.')[0]}</span></li>)}</ul>
  ),
  ship: () => (
    <div className="art__ship"><span className="art__pr"><Icon name="branch" size={12} />release/RC-1</span><span className="art__track"><i /><i /><i className="is-on" /></span><P tone="ok">Signed at Gate 4</P></div>
  ),
  brain: () => (
    <ul className="art__log">{brainLog.entries.slice(1, 4).map((e, i) => <li key={i}><i className={`art__dot art__dot--${e.tone}`} /><b>{e.g}</b><span>{e.what}</span></li>)}</ul>
  ),
  database: () => (
    <ul className="art__files">{['payments_export.csv', 'crm_rules.json', 'orders_events.csv'].map((n) => <li key={n}><Icon name="doc" size={11} /><code>{n}</code><Icon name="check" size={11} /></li>)}</ul>
  ),
  shield: () => (
    <div className="art__shield"><span className="art__ring"><Icon name="shield" size={20} /></span><span className="art__chips"><i>Drafts</i><i>Workspace</i><i className="is-x">Production</i></span></div>
  ),
  chart: () => ART.prove(),
  scan: () => (
    <ul className="art__files">{signalLog.lines.slice(0, 3).map((l) => <li key={l.sig}><code>{l.sig}</code><P tone={l.state === 'ok' ? 'ok' : 'amber'}>{l.state === 'ok' ? 'Read' : 'Gap'}</P></li>)}</ul>
  ),
  confirmed: () => <Label id="confirmed" />,
  supported: () => <Label id="supported" />,
  hypothesis: () => <Label id="hypothesis" />,
}

/** A card with an illustration on top. `art` picks the illustration; unknown names show the icon large. */
/** `ascii` swaps the drawn illustration for a dot-matrix scene of the card's idea (art/cards.js). Used on the ROQIVA page only. */
export function ArtCard({ art, icon, label, t, d, children, ascii = false }) {
  const A = ART[art]
  const scene = ascii && (hasScene(art) ? art : hasScene(icon) ? icon : null)
  return (
    <li className="acard" data-reveal>
      <div className={`acard__art${scene ? ' acard__art--asc' : ''}`} aria-hidden="true">{scene ? <AsciiArt kind={scene} /> : A ? <A /> : <span className="art__big"><Icon name={icon || 'spark'} size={26} /></span>}</div>
      <div className="acard__txt">
        {label && <p className="label">{label}</p>}
        <h3 className="h-4">{t}</h3>
        {d && <p className="muted">{d}</p>}
        {children}
      </div>
    </li>
  )
}

export const hasArt = (k) => Boolean(ART[k])

/** The illustration on its own, without the card. */
export function Art({ art }) {
  const A = ART[art]
  return A ? <A /> : null
}
