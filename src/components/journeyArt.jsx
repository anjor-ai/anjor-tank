import { CASES } from '../content'
import { Icon } from './icons'
import { STEPS } from './method'

/* ═══════════════════════════════════════════════════════════════════════════
   The Journey chapters, drawn as the software each chapter was about. Same language as the case wireframes
   (components/wires.jsx): white windows on a soft field, grey bars for content, only the words that carry the idea.
   I   How demand is made:   an audience becomes an ad, a landing page, a lead, a dealer's inbox; a lead travels it.
   II  The systems underneath: the board of the six systems shipped 0-to-1, each with the number it moved.
   III The system that runs them: one work item stepping through the six steps, stopping at each gate.
   Motion is CSS only and stops under reduced motion.
   ═══════════════════════════════════════════════════════════════════════════ */

const Bar = ({ w }) => <i className="ja-bar" style={{ width: `${w}%` }} />

function Demand() {
  const nodes = [
    ['users', 'Audience', 'Consumer-behaviour segment'],
    ['frame', 'Campaign', 'Ad set · targeting'],
    ['layers', 'Landing page', 'Dealer page'],
    ['doc', 'Lead form', 'Name · phone · city'],
    ['mail', 'Dealer inbox', 'New lead'],
  ]
  return (
    <div className="ja ja--demand" role="img" aria-label="Demand: an audience becomes a campaign, a landing page, a lead and a dealer's inbox">
      <div className="ja-win">
        <p className="ja-win__bar"><span className="ja-dots"><i /><i /><i /></span><b>Lead system</b><em>Dealer network</em></p>
        <ol className="ja-flow">
          {nodes.map(([ic, t, s], k) => (
            <li key={t} style={{ '--k': k }}>
              <span className="ja-flow__ic"><Icon name={ic} size={14} /></span>
              <span className="ja-flow__t"><b>{t}</b><small>{s}</small></span>
              {k === 2 && <span className="ja-page"><Bar w={70} /><i className="ja-page__hero" /><Bar w={52} /><span className="ja-page__btn">Call</span></span>}
            </li>
          ))}
          <i className="ja-flow__lead" aria-hidden="true" />
        </ol>
      </div>
    </div>
  )
}

function Systems() {
  return (
    <div className="ja ja--board" role="img" aria-label="The six systems shipped, each with the number it moved">
      <div className="ja-win">
        <p className="ja-win__bar"><span className="ja-dots"><i /><i /><i /></span><b>The six systems</b><em>Shipped 0-to-1</em></p>
        <ul className="ja-cards">
          {CASES.map((c, k) => (
            <li key={c.slug} style={{ '--k': k }}>
              <span className="ja-cards__tag">{c.tag}</span>
              <b>{c.title}</b>
              <span className="ja-cards__f"><em><Icon name="check" size={11} />Shipped</em><strong>{c.metrics[0][0]}</strong></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Run() {
  return (
    <div className="ja ja--run" role="img" aria-label="One work item stepping through six steps, stopping at each gate">
      <div className="ja-win ja-win--dark">
        <p className="ja-win__bar"><span className="ja-dots"><i /><i /><i /></span><b>ROQIVA · one work item</b><em>In development</em></p>
        <ol className="ja-run">
          {STEPS.map((s, k) => (
            <li key={s.k} style={{ '--k': k }}>
              <span className="ja-run__ic"><Icon name={s.icon} size={13} /></span>
              <b>{s.k}</b>
              <small>{s.who.join(', ')}</small>
              {s.gate && <em className="ja-run__gate"><Icon name="gate" size={10} />{s.gate.split(' · ')[0]}</em>}
            </li>
          ))}
          <i className="ja-run__item" aria-hidden="true">WI-014</i>
        </ol>
      </div>
    </div>
  )
}

export const CHAPTER_ART = [Demand, Systems, Run]
