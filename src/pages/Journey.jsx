import { BELIEFS, EDU, journeyPage, roqiva } from '../content'
import { Cta, LinkArrow } from '../components/ui'
import { Icon } from '../components/icons'
import { AsciiArt } from '../art/AsciiArt'
import { Chip, Dot, Gantt, KHead, KSection, TINTS, Tile, Win } from '../components/kit'
import { CAREER_ROWS, NOW } from '../components/sections'
import { AppWin, Paint } from '../components/paint'
import { PageMotion } from '../lib/PageMotion'

/* Journey: where I started, what each role added, and what the work taught me. One roadmap, three chapters, the principles, the foundations. */

const ROWS = [
  { group: 'Learning' },
  { label: 'BTech', sub: 'Electronics and Telecom', a: 2018.5, b: 2022.5, tone: 'sky' },
  { label: 'MBA', sub: 'Marketing, Operations, SCM', a: 2021.5, b: 2023.5, tone: 'lilac' },
  { group: 'Work' },
  ...CAREER_ROWS,
]

/** Right-hand windows of the three chapters. Each is an illustration, labelled as one. */
function Wireframes() {
  return (
    <Win title="Dealer landing pages" tag="Illustration" className="k-chap__win">
      <div className="k-wf">
        {['Dealer page', 'Campaign page', 'Lead form'].map((t, k) => (
          <div key={t} className="k-wf__p">
            <i className="k-wf__bar" /><i className="k-wf__hero" /><i className="k-wf__line" /><i className="k-wf__line k-wf__line--s" />
            <span className="k-wf__cta">{k === 2 ? 'Submit' : 'Call'}</span>
            <small>{t}</small>
          </div>
        ))}
      </div>
    </Win>
  )
}
function Pods({ tags }) {
  return (
    <Win title="Two product pods" tag="Illustration" className="k-chap__win">
      <div className="k-pods">
        <p className="k-pods__row"><span>Payments</span><span>Portals</span></p>
        <p className="k-pods__eng" aria-label="12 engineers">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</p>
        <small>12 engineers across two pods</small>
        <ul className="k-chips">{tags.map((t) => <li key={t}><Chip>{t}</Chip></li>)}</ul>
      </div>
    </Win>
  )
}
function RoqivaSteps() {
  const steps = roqiva.flow.titles.map((t) => t.replace(/\*/g, ''))
  return (
    <Win title="ROQIVA · one work item" tag="In development" className="k-chap__win">
      <ol className="k-steplist">{steps.map((t, k) => <li key={t}><b>{k + 1}</b><span>{t}</span></li>)}</ol>
      <p className="k-steplist__f"><Chip tone="accent">4 human gates</Chip><Chip>6 steps</Chip></p>
    </Win>
  )
}

function Chapter({ c, i }) {
  const tint = TINTS[i % TINTS.length]
  const tags = c.roles.flatMap((r) => r.tags || []).slice(0, 4)
  return (
    <Tile tint={tint} className="k-chap" id={`chapter-${i}`}>
      <div className="k-chap__card">
        <p className="k-tile__k"><b>{c.k}</b>{c.span}</p>
        <h2>{c.t}</h2>
        <p className="k-chap__d">{c.d}</p>
        <ul className="k-roles">
          {c.roles.map((r) => (
            <li key={r.role + r.when}>
              <span className="k-mono" aria-hidden="true">{r.mono}</span>
              <div>
                <small>{r.org} · {r.when}{r.now && <Dot tone="ok" />}</small>
                <b>{r.role}</b>
                <p>{r.text}</p>
                <dl className="k-stats">{r.stats.map(([v, l]) => <div key={l}><dt>{v}</dt><dd>{l}</dd></div>)}</dl>
                {r.to && <LinkArrow to={r.to}>{r.to === '/roqiva' ? 'Explore ROQIVA' : 'Explore the work'}</LinkArrow>}
              </div>
            </li>
          ))}
        </ul>
        <blockquote>{c.lesson}</blockquote>
      </div>
      <div className="k-chap__vis">{i === 0 ? <Wireframes /> : i === 1 ? <Pods tags={tags} /> : <RoqivaSteps />}</div>
    </Tile>
  )
}

export default function Journey() {
  return (
    <PageMotion routeKey="/journey">
      <header className="k-jhero">
        <div className="container k-jhero__in">
          <div className="k-jhero__copy">
            <p className="k-rule"><b>[00]</b><span>The story so far</span><i /><small>/ Path</small></p>
            <h1>Three chapters.<br /><em>One widening perspective.</em></h1>
            <p className="k-lead">From understanding how demand is made, to building the systems underneath it, to founding a product that connects the two.</p>
            <nav className="k-jhero__nav" aria-label="Career chapters">{journeyPage.chapters.map((c, i) => <a key={c.k} href={`#chapter-${i}`}><b>{c.k}</b>{c.t}<Icon name="arrow" size={14} /></a>)}</nav>
          </div>
          <figure className="k-jhero__ph">
            <img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" fetchpriority="high" />
            <figcaption><b>Always curious.</b><span>Always building.</span></figcaption>
          </figure>
        </div>
      </header>

      <KSection id="timeline" tone="soft">
        <KHead n="01" label="A widening field of view" tag="2018 to now" title="Each role adds" sub="another dimension." lead="Demand. Product. Systems. Founding. Learning and work on one timeline." />
        <div data-reveal>
          <Paint name="meadow" className="v-road v-road--wide">
            <AppWin title="Learning and work · one timeline" tag="2018 to now">
              <Gantt rows={ROWS} from={2018} to={2027} ticks={[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027]} now={NOW} labelW={190} caption="Learning and work on one timeline, 2018 to now" />
            </AppWin>
          </Paint>
        </div>
      </KSection>

      <KSection id="chapters">
        <KHead n="02" label="Three chapters" tag="What each role added" title="How demand is made," sub="then the systems, then the loop." />
        <div className="k-chaps">{journeyPage.chapters.map((c, i) => <Chapter key={c.k} c={c} i={i} />)}</div>
      </KSection>

      <KSection id="beliefs" tone="soft">
        <KHead n="03" label="Principles" tag="What stayed constant" title="What the work" sub="taught me." lead="The principles that stayed with me while the systems and responsibilities changed." />
        <ul className="k-dm">
          {BELIEFS.map((b, i) => (
            <li key={b.t} className="k-dm__c" data-reveal>
              <div className="k-dm__art" aria-hidden="true"><AsciiArt kind={['find', 'decide', 'prove'][i % 3]} /></div>
              <div className="k-dm__b">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h3>{b.t}</h3><p>{b.d}</p>
                <ul>{b.chips.map((x) => <li key={x}>{x}.</li>)}</ul>
              </div>
            </li>
          ))}
        </ul>
      </KSection>

      <KSection id="learning">
        <KHead n="04" label="Education" tag="NMIMS, Mumbai" title="The foundations" sub="behind the work." lead="A continuous education in customers, commerce and how complex products scale." />
        <div className="k-bento">
          {EDU.map(([a, b], i) => {
            const [deg, ...field] = a.split(' · ')
            const [school, yrs] = b.split(' · ')
            return (
              <Tile key={a} tint={i ? 'sky' : 'butter'} className="k-c6 k-edu">
                <p className="k-tile__k"><b>0{i + 1}</b>{yrs}</p>
                <h3>{deg}</h3>
                <p>{field.join(' · ')}</p>
                <p className="k-edu__s"><Icon name="pin" size={14} />{school}</p>
              </Tile>
            )
          })}
        </div>
      </KSection>

      <Cta title="Ask me *about any of it.*" lead="Pick a chapter, a case or a role." primary={{ label: 'Start a conversation', to: '/contact#brief' }} secondary={{ label: 'Hire me', to: '/hire' }} />
    </PageMotion>
  )
}
