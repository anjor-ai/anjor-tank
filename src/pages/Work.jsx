import { useRef, useState } from 'react'
import { CASES, TAGS, work as P } from '../content'
import { Cta } from '../components/ui'
import { Board, Go, PageHead, Sec } from '../components/board'
import { Icon } from '../components/icons'
import { useStep } from '../components/consult'
import { Wire } from '../components/wires'
import { CaseCard } from '../components/cards'
import { PageMotion } from '../lib/PageMotion'

/* Work: the six systems. The head plays them as a reel: one case at a time on its own field (the screen as a
   wireframe, the number it moved, a way in), with all six on a rail underneath. It steps on its own while on screen
   until someone picks a case. Below, a filter and the six as cards. */

const REEL_MS = 4200

function Reel() {
  const ref = useRef(null)
  const [i, pick] = useStep(CASES.length, REEL_MS, ref)
  const [held, setHeld] = useState(false)
  const c = CASES[i]
  const [v, l] = c.metrics[0]
  const choose = (k) => { setHeld(true); pick(k) }
  return (
    <div className={`wr${held ? ' is-held' : ''}`} ref={ref} style={{ '--ms': `${REEL_MS}ms` }}>
      <div className={`wr__stage cc__media--${c.slug}`}>
        <p className="wr__top"><span>Case {c.n}</span><span>{c.tag}</span><span>{c.year}</span></p>
        <div className="wr__wire" key={c.slug} aria-hidden="true"><Wire c={c} kind="screen" /></div>
        <a className="wr__card" href={`/work/${c.slug}`} key={`n${c.slug}`} data-cursor="Read">
          <b>{v}</b><span>{l}</span>
          <strong>{c.title}</strong>
          <em>Read the case<Icon name="ne" size={13} /></em>
        </a>
      </div>
      <ol className="wr__rail" aria-label="The six systems">
        {CASES.map((x, k) => (
          <li key={x.slug}>
            <button type="button" className={k === i ? 'is-on' : ''} aria-pressed={k === i} onClick={() => choose(k)}>
              <small>{x.tag}</small>
              <b>{x.metrics[0][0]}</b>
              <i aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Work() {
  const [tag, setTag] = useState('All')
  const list = CASES.filter((c) => tag === 'All' || c.tag === tag)
  return (
    <PageMotion routeKey="/work">
      <PageHead label={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} visual={<Reel />} visualClass="b-ph__vis--reel">
        <ul className="b-ph__facts">{P.hero.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      </PageHead>

      <Sec id="cases" label="All six systems" tag="Product thinking to business outcome" title="Explore the ==decisions==" sub="behind the results." lead="Six real systems across conversion, growth, search, platform and operations. Each case maps the problem, trade-offs, requirements and measurable outcomes."
        aside={<Go to="/hire">How I apply this in consulting</Go>}>
        <div className="b-filter" role="group" aria-label="Filter cases">
          {TAGS.map((t) => <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)}>{t}<small>{t === 'All' ? CASES.length : CASES.filter((c) => c.tag === t).length}</small></button>)}
        </div>
        <Board className="b-workgrid" aria-live="polite" key={tag}>
          {list.map((c, k) => <CaseCard key={c.slug} c={c} flip={k % 2 === 1} />)}
        </Board>
      </Sec>

      <Cta topic="work" title="Want this *done on ==your system==?*" lead="Tell me the number that will not move." primary={{ label: 'Send a brief', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Hire me', to: '/hire' }} />
    </PageMotion>
  )
}
