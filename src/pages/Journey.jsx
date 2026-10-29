import { BELIEFS, EDU, journeyPage } from '../content'
import { Cta } from '../components/ui'
import { Icon } from '../components/icons'
import { Board, Go, Kicker, PageHead, Screen, Sec, Tile } from '../components/board'
import { CareerLog } from '../components/frags'
import { CHAPTER_ART } from '../components/journeyArt'
import { PageMotion } from '../lib/PageMotion'

/* Journey: where I started, what each role added, and what the work taught me.
   The head (the line, where I am now, the three chapters), the whole log, the chapters (latest first), the beliefs, the schooling. */

/* Now first: the founder chapter leads, each chapter lists its latest role first. Ids keep the original order so links stay stable. */
const CHAPTERS = journeyPage.chapters.map((c, i) => ({ ...c, i, roles: [...c.roles].reverse() })).reverse()

const CH_TONE = ['#ff7a2e', '#157a4f', '#7c5cff']

/** One chapter: a header strip (numeral, years, place in the story), the roles as cards with their numbers,
   what the chapter added, the lesson as a pull quote, and the chapter's software beside it. */
function Chapter({ c, i }) {
  const now = i === 2
  const added = [...new Set(c.roles.flatMap((r) => r.tags || []))].slice(0, 6)
  return (
    <Board className="b-chap" id={`chapter-${i}`} style={{ '--ch': CH_TONE[i] }}>
      <Tile tone={now ? 'ink' : undefined} className="b-chap__c">
        <header className="b-chap__hd">
          <span className="b-chap__num" aria-hidden="true">{c.k}</span>
          <span className="b-chap__meta"><small>Chapter {c.k} of III</small><b>{c.span}</b></span>
          {now && <span className="b-chap__now"><i className="b-live" />Now · building ROQIVA</span>}
          <span className="b-chap__bar" aria-hidden="true">{[0, 1, 2].map((k) => <i key={k} className={k <= i ? 'is-on' : ''} />)}</span>
        </header>
        <h3>{c.t}</h3>
        <p className="b-chap__d">{c.d}</p>
        <ul className="b-chap__roles">
          {c.roles.map((r) => (
            <li key={r.role + r.when}>
              <span className="b-chap__mono" aria-hidden="true">{r.mono}</span>
              <div>
                <p className="b-chap__rm"><b>{r.role}</b><span>{r.when}</span></p>
                <small>{r.org}{r.now && <i className="b-live" aria-label="Now" />}</small>
                <p>{r.text}</p>
                <ul className="b-chap__stats">{r.stats.map(([v, l]) => <li key={l}><b>{v}</b>{l}</li>)}</ul>
                {r.to && <Go to={r.to}>{r.to === '/roqiva' ? 'Explore ROQIVA' : 'Explore the work'}</Go>}
              </div>
            </li>
          ))}
        </ul>
        {added.length > 0 && <div className="b-chap__add"><small>What it added</small><ul>{added.map((t) => <li key={t}>{t}</li>)}</ul></div>}
        <blockquote><span aria-hidden="true">“</span>{c.lesson}</blockquote>
      </Tile>
      <div className={`b-chap__vis ja-field ja-field--${i}`}>{(() => { const A = CHAPTER_ART[i]; return <A /> })()}</div>
    </Board>
  )
}

export default function Journey() {
  return (
    <PageMotion routeKey="/journey">
      <PageHead label="The story so far" tag="Path" title="Three chapters. *One ==widening perspective==.*" lead="From understanding how demand is made, to building the systems underneath it, to building a product that connects the two."
        visual={<figure className="b-photo"><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" fetchpriority="high" /><figcaption><b>Always curious.</b><small>Always building.</small></figcaption></figure>}>
        <a className="b-jnow" href="/roqiva"><i className="b-live" /><b>Right now · Building ROQIVA</b><em>In development · alongside Product Manager, GNC India</em><Icon name="arrow" size={16} /></a>
        <nav className="b-jnav" aria-label="Career chapters">{CHAPTERS.map((c) => <a key={c.k} href={`#chapter-${c.i}`}><b>{c.k}</b>{c.t}<Icon name="arrow" size={14} /></a>)}</nav>
      </PageHead>

      <Sec id="timeline" label="A widening field of view" tag="Now, back to 2018" title="Each role adds" sub="another ==dimension==." center>
        <Board className="b-road">
          <div className="jt-field"><CareerLog withLearning /></div>
        </Board>
      </Sec>

      <Sec id="chapters" label="Three chapters" tag="Latest first" title="The loop I am ==building now==," sub="and what each role before it added.">
        {CHAPTERS.map((c) => <Chapter key={c.k} c={c} i={c.i} />)}
      </Sec>

      <Sec id="beliefs" label="Principles" tag="What stayed constant" title="What the work" sub="==taught me==.">
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

      <Sec id="learning" label="Education" tag="NMIMS, Mumbai" title="The ==foundations==" sub="behind the work.">
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
