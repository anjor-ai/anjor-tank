import { useState } from 'react'
import { Icon } from './icons'
import { Stat } from './kinetic'
import { cx } from './board'
import { WIRE_KINDS, Wire } from './wires'

/* ═══════════════════════════════════════════════════════════════════════════
   Case cards. Two shapes, one language: white panels on the app canvas, a soft field holding the wireframe,
   the title and one line in readable type, the number that moved, and one action.
   · CaseCard: the Work page. The words on a white panel, the pictures in a framed field you page through
     (the screen, the workflow, the outcome), chips and the second number laid over it. Alternate cards flip.
   · CaseTile: the home board. The picture on top (or beside it, on the wide tiles), then the words.
   ═══════════════════════════════════════════════════════════════════════════ */

export function CaseCard({ c, flip = false }) {
  const [i, setI] = useState(0)
  const [v, l] = c.metrics[0]
  const second = c.metrics[1]
  const go = `/work/${c.slug}`
  return (
    <article className={cx('cc', flip && 'cc--flip')} data-cursor="Read">
      <div className="cc__body">
        <header className="cc__top">
          <h3><a href={go}>{c.title}</a></h3>
        </header>
        <p className="cc__meta"><span>Case {c.n}</span><i aria-hidden="true" /><span>{c.year}</span></p>
        <p className="cc__d">{c.line}</p>
        <footer className="cc__foot">
          <p className="cc__num"><b><Stat v={v} /></b><span>{l}</span></p>
          <a className="cc__btn" href={go} aria-label={`Read the case: ${c.title}`}>Read the case<i><Icon name="ne" size={13} /></i></a>
        </footer>
      </div>
      <div className={`cc__media cc__media--${c.slug}`}>
        <Tags c={c} n={2} />
        <div className="cc__track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {WIRE_KINDS.map(([k], j) => <div key={k} className="cc__slide" aria-hidden={j !== i}><Wire c={c} kind={k} /></div>)}
        </div>
        <div className="cc__dots" role="tablist" aria-label={`Pictures of ${c.title}`}>
          {WIRE_KINDS.map(([k, name], j) => <button key={k} type="button" role="tab" aria-selected={j === i} aria-label={name} onClick={() => setI(j)} />)}
        </div>
        {second && <p className="cc__rate" title={second[1]}><Icon name="chart" size={13} /><b>{second[0]}</b><span>{second[1]}</span></p>}
      </div>
    </article>
  )
}

/** The case's category and tags, as chips over the top-left of its picture. */
function Tags({ c, n }) {
  const tags = [c.tag, ...c.chips.filter((t) => t !== c.tag)].slice(0, n + 1)
  return <ul className="c-tags" aria-label="Tags">{tags.map((t, k) => <li key={t} className={k === 0 ? 'is-k' : undefined}>{t}</li>)}</ul>
}

/** The home board's tile: the picture, then what it is and what moved. The whole tile opens the case. */
export function CaseTile({ c, onOpen, wide = false }) {
  const [v, l] = c.metrics[0]
  return (
    <article className={cx('ct2', wide && 'ct2--wide')} data-cursor="Read">
      <a className="ct2__a" href={`/work/${c.slug}`} aria-label={`${c.title}: read the case`} />
      <div className={`ct2__art cc__media--${c.slug}`}><Wire c={c} kind={wide ? 'flow' : 'screen'} /><Tags c={c} n={1} /></div>
      {onOpen && <button type="button" className="ct2__q" onClick={() => onOpen(c.slug)} aria-label={`Quick view: ${c.title}`}><Icon name="eye" size={14} /><span>Quick view</span></button>}
      <div className="ct2__b">
        <h3>{c.title}</h3>
        <p className="ct2__l">{c.line}</p>
        <div className="ct2__f">
          <p className="ct2__m"><b><Stat v={v} /></b><span>{l}</span></p>
          <span className="ct2__go">Read the case<Icon name="arrow" size={14} /></span>
        </div>
      </div>
    </article>
  )
}
