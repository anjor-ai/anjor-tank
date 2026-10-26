import { examples, rankedFindings, score } from '../content'

const fmt = (n) => n.toFixed(1)
const MAX = 9 // 3 × 3 ÷ 1: the highest possible score on a 1–3 scale

/** Two lanes, each ordered by value × confidence ÷ effort. The score is computed here, from the ratings, never typed in. */
export function Ranking() {
  const lanes = ['Incident', 'Opportunity'].map((lane) => ({
    lane,
    note: lane === 'Incident' ? 'A live break. Fix first.' : 'Upside. Plan next.',
    items: rankedFindings.filter((f) => f.lane === lane).map((f) => ({ ...f, s: score(f) })).sort((a, b) => b.s - a.s),
  }))
  return (
    <div className="rank">
      {lanes.map((l) => (
        <section key={l.lane} className="rank__lane" data-reveal aria-label={`${l.lane} lane`}>
          <header><h3 className="h-3">{l.lane === 'Incident' ? 'Incidents' : 'Opportunities'}</h3><p className="muted">{l.note}</p></header>
          <ol>
            {l.items.map((f, i) => (
              <li key={f.id} className="rank__item">
                <span className="rank__pos label">{i + 1}</span>
                <div className="rank__body">
                  <p className="rank__t"><span className="label">{f.id}</span> {f.t}</p>
                  <p className="rank__path muted">{f.path}</p>
                  <p className="rank__calc label tnum">{examples.rank.cols[2]} {f.v} × {examples.rank.cols[3]} {f.c} ÷ {examples.rank.cols[4]} {f.e}</p>
                  <span className="rank__bar" aria-hidden><i style={{ width: `${(f.s / MAX) * 100}%` }} /></span>
                </div>
                <span className="rank__score tnum" aria-label={`Score ${fmt(f.s)}`}>{fmt(f.s)}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
