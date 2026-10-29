import { useState } from 'react'
import { CASES, TAGS, work as P } from '../content'
import { Cta } from '../components/ui'
import { Board, Go, PageHead, Sec, Stage, Win } from '../components/board'
import { CaseCard } from '../components/cards'
import { PageMotion } from '../lib/PageMotion'

/* Work: the six systems. The head shows them as an index in a window; below, a filter and the six as tiles,
   each opening its case (or a quick view in place). */

function Index() {
  return (
    <Win title="Six systems · index" tag="Index" className="b-index">
      <ol>
        {CASES.map((c) => (
          <li key={c.slug}><a href={`/work/${c.slug}`} data-cursor="Read"><small>{c.n}</small><b>{c.title}</b><em>{c.metrics[0][0]}</em></a></li>
        ))}
      </ol>
    </Win>
  )
}

export default function Work() {
  const [tag, setTag] = useState('All')
  const list = CASES.filter((c) => tag === 'All' || c.tag === tag)
  return (
    <PageMotion routeKey="/work">
      <PageHead label={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} visual={<Stage kind="shader" name="ember"><Index /></Stage>}>
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
