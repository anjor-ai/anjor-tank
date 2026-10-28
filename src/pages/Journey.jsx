import { BELIEFS, EDU, journeyPage, roqiva } from '../content'
import { Cta } from '../components/ui'
import { Icon } from '../components/icons'
import { Board, Chips, Go, Kicker, PageHead, Screen, Sec, Stage, Tile, Win } from '../components/board'
import { CareerLog } from '../components/frags'
import { PageMotion } from '../lib/PageMotion'

/* Journey: where I started, what each role added, and what the work taught me.
   The head (the line, where I am now, the three chapters), the whole log, the chapters (latest first), the beliefs, the schooling. */

/* Now first: the founder chapter leads, each chapter lists its latest role first. Ids keep the original order so links stay stable. */
const CHAPTERS = journeyPage.chapters.map((c, i) => ({ ...c, i, roles: [...c.roles].reverse() })).reverse()

function Wireframes() {
  return (
    <Win title="Dealer landing pages">
      <div className="u-wf">
        {['Dealer page', 'Campaign page', 'Lead form'].map((t, k) => (
          <div key={t} className="u-wf__p"><i /><i className="is-hero" /><i /><i className="is-s" /><span>{k === 2 ? 'Submit' : 'Call'}</span><small>{t}</small></div>
        ))}
      </div>
    </Win>
  )
}
function Pods({ tags }) {
  return (
    <Win title="Two product pods">
      <div className="u-pods">
        <p className="u-pods__row"><span>Payments</span><span>Portals</span></p>
        <p className="u-pods__eng" aria-label="12 engineers">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</p>
        <small>12 engineers across two pods</small>
        <Chips items={tags} />
      </div>
    </Win>
  )
}
function RoqivaSteps() {
  const steps = roqiva.flow.titles.map((t) => t.replace(/\*/g, ''))
  return (
    <Win title="ROQIVA · one work item" tag="In development" dark>
      <ol className="u-steps">{steps.map((t, k) => <li key={t}><b>{k + 1}</b><span>{t}</span></li>)}</ol>
      <Chips items={['4 human gates', '6 steps']} className="u-steps__chips" />
    </Win>
  )
}
const CH_PAINT = ['dawn', 'noon', 'night']

function Chapter({ c, i }) {
  const tags = c.roles.flatMap((r) => r.tags || []).slice(0, 4)
  const founder = i === 2
  return (
    <Board className="b-chap" id={`chapter-${i}`}>
      <Tile tone={founder ? 'ink' : undefined} className="b-chap__c">
        <Kicker icon={founder ? <i className="b-live" /> : 'clock'}>{c.k} · {c.span}{founder && ' · Now · founder'}</Kicker>
        <h3>{c.t}</h3>
        <p className="b-chap__d">{c.d}</p>
        <ul className="b-chap__roles">
          {c.roles.map((r) => (
            <li key={r.role + r.when}>
              <span className="b-chap__mono" aria-hidden="true">{r.mono}</span>
              <div>
                <small>{r.org} · {r.when}{r.now && <i className="b-live" aria-label="Now" />}</small>
                <b>{r.role}</b>
                <p>{r.text}</p>
                <dl className="b-chap__stats">{r.stats.map(([v, l]) => <div key={l}><dt>{v}</dt><dd>{l}</dd></div>)}</dl>
                {r.to && <Go to={r.to}>{r.to === '/roqiva' ? 'Explore ROQIVA' : 'Explore the work'}</Go>}
              </div>
            </li>
          ))}
        </ul>
        <blockquote>{c.lesson}</blockquote>
      </Tile>
      <Stage kind="paint" name={CH_PAINT[i]} className="b-chap__vis">{i === 0 ? <Wireframes /> : i === 1 ? <Pods tags={tags} /> : <RoqivaSteps />}</Stage>
    </Board>
  )
}

export default function Journey() {
  return (
    <PageMotion routeKey="/journey">
      <PageHead label="The story so far" tag="Path" title="Three chapters. *One ==widening perspective==.*" lead="From understanding how demand is made, to building the systems underneath it, to founding a product that connects the two."
        visual={<figure className="b-photo"><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" fetchpriority="high" /><figcaption><b>Always curious.</b><small>Always building.</small></figcaption></figure>}>
        <a className="b-jnow" href="/roqiva"><i className="b-live" /><b>Right now · Founder, ROQIVA</b><em>In development · alongside Product Manager, GNC India</em><Icon name="arrow" size={16} /></a>
        <nav className="b-jnav" aria-label="Career chapters">{CHAPTERS.map((c) => <a key={c.k} href={`#chapter-${c.i}`}><b>{c.k}</b>{c.t}<Icon name="arrow" size={14} /></a>)}</nav>
      </PageHead>

      <Sec id="timeline" label="A widening field of view" tag="Now, back to 2018" title="Each role adds" sub="another ==dimension==." lead="Demand. Product. Systems. Founding. Learning and work on one timeline.">
        <Board className="b-road">
          <Stage kind="paint" name="meadow"><CareerLog withLearning /></Stage>
        </Board>
      </Sec>

      <Sec id="chapters" label="Three chapters" tag="Latest first" title="The loop I am ==building now==," sub="and what each role before it added.">
        {CHAPTERS.map((c) => <Chapter key={c.k} c={c} i={c.i} />)}
      </Sec>

      <Sec id="beliefs" label="Principles" tag="What stayed constant" title="What the work" sub="==taught me==." lead="The principles that stayed with me while the systems and responsibilities changed.">
        <Board className="b-beliefs">
          {BELIEFS.map((b, i) => (
            <Tile key={b.t} tone="ink" className="b-m">
              <Screen scene={['blocks', 'brain', 'agents'][i % 3]} className="b-m__screen" />
              <h3>{b.t}</h3>
              <p>{b.d}</p>
              <p className="b-m__n">{b.chips.map((x) => `${x}.`).join(' ')}</p>
            </Tile>
          ))}
        </Board>
      </Sec>

      <Sec id="learning" label="Education" tag="NMIMS, Mumbai" title="The ==foundations==" sub="behind the work." lead="A continuous education in customers, commerce and how complex products scale.">
        <Board className="b-edu">
          {EDU.map(([a, b], i) => {
            const [deg, ...field] = a.split(' · ')
            const [school, yrs] = b.split(' · ')
            return (
              <Tile key={a} tone={i ? undefined : 'ink'}>
                <Kicker icon="doc">{yrs}</Kicker>
                <h3>{deg}</h3>
                <p>{field.join(' · ')}</p>
                <p className="b-edu__s"><Icon name="pin" size={14} />{school}</p>
              </Tile>
            )
          })}
        </Board>
      </Sec>

      <Cta title="Ask me *about ==any of it==.*" lead="Pick a chapter, a case or a role." primary={{ label: 'Start a conversation', to: '/contact#brief' }} secondary={{ label: 'Hire me', to: '/hire' }} />
    </PageMotion>
  )
}
