import { Icon } from './icons'
import { Win, cx } from './board'
import { CAREER, LEARNING } from './v5'

/* ═══════════════════════════════════════════════════════════════════════════
   The pictures of the site: fragments of the products the work was about, drawn in HTML with sample data and
   labelled as illustrations. No real screenshots exist, so none of these pretends to be one. A number appears only
   when it is a figure from the case (77.2% → 89.7%, +12.5pp and so on); everything else is sample.
   Every fragment is fluid: it reads at 280px and at 640px (container queries in site.css trim the extras).
   ═══════════════════════════════════════════════════════════════════════════ */

export function CareerLog({ withLearning = false, compact = false }) {
  const rows = withLearning ? [...CAREER, ...LEARNING] : CAREER
  return (
    <div className={cx('u-log', compact && 'u-log--c')}>
      <p className="u-log__top"><span><b>$</b> git log --graph --career</span><span className="u-log__legend"><i className="l1" />ROQIVA <i className="l0" />Career{withLearning && <><i className="lx" />Learning</>}</span></p>
      <ol className="u-log__rows" data-seq>
        {rows.map((r) => (
          <li key={r.id} className={cx('u-log__r', r.head && 'is-head', r.now && 'is-now', r.learn && 'is-learn', r.lane === 1 && 'is-branch')}>
            <span className="u-log__g" aria-hidden="true"><i /></span>
            <div className="u-log__c">
              <p className="u-log__m">
                {r.ref && <span className={cx('u-log__ref', r.head && 'is-head')}>{r.head ? 'HEAD → ' : ''}{r.ref}</span>}
                {r.now && !r.head && <span className="u-log__now"><i />Now</span>}
                <span>{r.when}</span>
              </p>
              <h3><b>{r.role}</b><span>{r.org}{r.sub && <em> · {r.sub}</em>}</span></h3>
              {(r.stats || r.to) && (
                <div className="u-log__f">
                  {r.stats && <dl>{r.stats.map(([v, l]) => <div key={l}><dt>{v}</dt><dd>{l}</dd></div>)}</dl>}
                  {r.to && <a href={r.to}>{r.cta}<Icon name="arrow" size={13} /></a>}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ───────────── Case pages ───────────── */

/** The system as boxes and wires, left to right, two rows. */
export function ArchMap({ parts }) {
  const half = Math.ceil(parts.length / 2)
  const rows = [parts.slice(0, half), parts.slice(half)]
  return (
    <Win title="System map" dark className="u-arch">
      <div role="img" aria-label={`System diagram: ${parts.map((p) => p.t).join(' → ')}`}>
        {rows.map((row, r) => (
          <div key={r} className="u-arch__row" data-seq>
            {row.map((p, k) => (
              <p key={p.t} className="u-arch__n"><small>{String(r * half + k + 1).padStart(2, '0')}</small><b>{p.t}</b></p>
            ))}
          </div>
        ))}
      </div>
    </Win>
  )
}

/** Low-fidelity phone screens, one per workflow step. */
export function Storyboard({ steps }) {
  const kinds = ['list', 'form', 'confirm', 'choice', 'chart', 'list']
  return (
    <div className="u-sb" role="img" aria-label={`Wireframe storyboard: ${steps.map((s) => s.t).join(', ')}`}>
      {steps.map((s, k) => {
        const kind = kinds[k % kinds.length]
        return (
          <figure key={s.t} className="u-sb__f">
            <div className="u-sb__ph">
              <p className="u-sb__hd"><i />{s.t}</p>
              {kind === 'list' && <div className="u-sb__ls">{[0, 1, 2].map((j) => <span key={j} className={j === 1 ? 'is-on' : ''}><i /><b /></span>)}</div>}
              {kind === 'form' && <div className="u-sb__fm"><b /><span /><b /><span className="is-on" /></div>}
              {kind === 'confirm' && <div className="u-sb__cf"><span><Icon name="lock" size={14} /></span><b /></div>}
              {kind === 'choice' && <div className="u-sb__ls">{[0, 1, 2].map((j) => <span key={j} className={j === 0 ? 'is-on' : ''}><i /><b /></span>)}</div>}
              {kind === 'chart' && <div className="u-sb__ct">{[40, 55, 48, 70, 82].map((h, j) => <i key={j} style={{ height: `${h}%` }} />)}</div>}
              <span className="u-sb__btn">{k === steps.length - 1 ? 'Done' : 'Continue'}</span>
            </div>
          </figure>
        )
      })}
    </div>
  )
}

/** A dashboard wireframe for the measurement plan. */
export function DashWire({ m }) {
  return (
    <Win title="Outcome dashboard" tag="Wireframe · no data" className="u-dash">
      <div role="img" aria-label={`Dashboard wireframe: ${m.primary[0]}, guarded by ${m.guard.join(', ')}`}>
        <p className="u-dash__f">{m.seg.slice(0, 4).map((s, k) => <span key={s} className={k === 0 ? 'is-on' : ''}>{s}</span>)}</p>
        <div className="u-dash__kpi">
          <small>Primary</small>
          <b>{m.primary[0]}</b>
          <svg viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50 C 40 47, 70 45, 100 39 S 160 29, 190 25 S 250 13, 300 8" data-draw /></svg>
        </div>
        <ul className="u-dash__g">{m.guard.slice(0, 4).map((g, k) => <li key={g}><span>{g}</span><i><b style={{ width: `${[38, 52, 30, 46][k]}%` }} /></i></li>)}</ul>
      </div>
    </Win>
  )
}
