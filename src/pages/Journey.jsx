import { BELIEFS, EDU, journeyPage, roqiva } from '../content'
import { Cta, Kin, LinkArrow } from '../components/ui'
import { Icon } from '../components/icons'
import { AsciiCanvas } from '../components/ascii'
import { Chip, Dot, Easel, KHead, KSection, Tile, Win } from '../components/kit'
import { CareerGraph } from '../components/v5'
import { PageMotion } from '../lib/PageMotion'

/* Journey: where I started, what each role added, and what the work taught me. One roadmap, three chapters, the principles, the foundations. */

/* Now first: the founder chapter leads, each chapter lists its latest role first. Ids keep the original order so links stay stable. */
const CHAPTERS = journeyPage.chapters.map((c, i) => ({ ...c, i, roles: [...c.roles].reverse() })).reverse()

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

const CH_PAINT = ['dawn', 'noon', 'night']

function Chapter({ c, i }) {
  const tags = c.roles.flatMap((r) => r.tags || []).slice(0, 4)
  return (
    <article className={`jc${i === 2 ? ' jc--founder' : ''}`} id={`chapter-${i}`}>
      <Tile tint={i === 2 ? 'ink' : undefined} className="jc__card">
        <p className="s-k"><b>{c.k}</b>{c.span}{i === 2 && <span className="jc__now"><Dot tone="accent" />Now · founder</span>}</p>
        <h2>{c.t}</h2>
        <p className="jc__d">{c.d}</p>
        <ul className="jc__roles">
          {c.roles.map((r) => (
            <li key={r.role + r.when}>
              <span className="jc__mono" aria-hidden="true">{r.mono}</span>
              <div>
                <small>{r.org} · {r.when}{r.now && <Dot tone="ok" />}</small>
                <b>{r.role}</b>
                <p>{r.text}</p>
                <dl className="jc__stats">{r.stats.map(([v, l]) => <div key={l}><dt>{v}</dt><dd>{l}</dd></div>)}</dl>
                {r.to && <LinkArrow to={r.to}>{r.to === '/roqiva' ? 'Explore ROQIVA' : 'Explore the work'}</LinkArrow>}
              </div>
            </li>
          ))}
        </ul>
        <blockquote>{c.lesson}</blockquote>
      </Tile>
      <Easel paint={CH_PAINT[i]} fit="center" className="jc__vis">{i === 0 ? <Wireframes /> : i === 1 ? <Pods tags={tags} /> : <RoqivaSteps />}</Easel>
    </article>
  )
}

export default function Journey() {
  return (
    <PageMotion routeKey="/journey">
      <header className="p-hero p-hero--journey">
        <div className="p-hero__in">
          <div className="p-hero__copy">
            <p className="s-label"><b>00</b><span>The story so far</span><em>Path</em></p>
            <h1 className="p-hero__t" data-kin data-kin-hero><Kin text="Three chapters." /><br /><em><Kin text="One ==widening perspective==." /></em></h1>
            <p className="p-hero__lead">From understanding how demand is made, to building the systems underneath it, to founding a product that connects the two.</p>
            <a className="j-now" href="/roqiva"><span className="j-now__k"><Dot tone="accent" />Right now</span><b>Founder, ROQIVA</b><em>In development · alongside Product Manager, GNC India</em><Icon name="arrow" size={15} /></a>
            <nav className="j-nav" aria-label="Career chapters">{CHAPTERS.map((c) => <a key={c.k} href={`#chapter-${c.i}`}><b>{c.k}</b>{c.t}<Icon name="arrow" size={14} /></a>)}</nav>
          </div>
          <figure className="p-hero__stage j-photo">
            <img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" fetchpriority="high" />
            <figcaption><b>Always curious.</b><span>Always building.</span></figcaption>
          </figure>
        </div>
      </header>

      <KSection id="timeline" tone="soft">
        <KHead n="01" label="A widening field of view" tag="Now, back to 2018" title="Each role adds" sub="another ==dimension==." lead="Demand. Product. Systems. Founding. Learning and work on one timeline." />
        <Easel paint="meadow" fit="center" className="j-road"><CareerGraph withLearning /></Easel>
      </KSection>

      <KSection id="chapters">
        <KHead n="02" label="Three chapters" tag="Latest first" title="The loop I am ==building now==," sub="and what each role before it added." />
        <div className="jcs">{CHAPTERS.map((c) => <Chapter key={c.k} c={c} i={c.i} />)}</div>
      </KSection>

      <KSection id="beliefs" tone="soft">
        <KHead n="03" label="Principles" tag="What stayed constant" title="What the work" sub="==taught me==." lead="The principles that stayed with me while the systems and responsibilities changed." />
        <ul className="mt">
          {BELIEFS.map((b, i) => (
            <li key={b.t} className="mt__c" data-reveal>
              <div className="mt__art">
                <img src={`/img/paint/${['dusk', 'dawn', 'meadow'][i % 3]}.webp`} alt="" width="1600" height="1000" loading="lazy" decoding="async" />
                <div className="mt__win">
                  <span className="mt__bar" aria-hidden="true"><i /><i /><i /><b>{String(i + 1).padStart(2, '0')}</b></span>
                  <AsciiCanvas scene={['layers', 'compound', 'tools'][i % 3]} className="mt__cv" label={`Animated drawing: ${b.t}`} />
                </div>
              </div>
              <div className="mt__b">
                <h3>{b.t}</h3><p>{b.d}</p>
                <ul className="mt__chips">{b.chips.map((x) => <li key={x}>{x}.</li>)}</ul>
              </div>
            </li>
          ))}
        </ul>
      </KSection>

      <KSection id="learning">
        <KHead n="04" label="Education" tag="NMIMS, Mumbai" title="The ==foundations==" sub="behind the work." lead="A continuous education in customers, commerce and how complex products scale." />
        <div className="k-bento">
          {EDU.map(([a, b], i) => {
            const [deg, ...field] = a.split(' · ')
            const [school, yrs] = b.split(' · ')
            return (
              <Tile key={a} tint={i ? undefined : 'ink'} className="k-c6 j-edu">
                <p className="s-k"><b>0{i + 1}</b>{yrs}</p>
                <h3>{deg}</h3>
                <p>{field.join(' · ')}</p>
                <p className="j-edu__s"><Icon name="pin" size={14} />{school}</p>
              </Tile>
            )
          })}
        </div>
      </KSection>

      <Cta title="Ask me *about ==any of it==.*" lead="Pick a chapter, a case or a role." primary={{ label: 'Start a conversation', to: '/contact#brief' }} secondary={{ label: 'Hire me', to: '/hire' }} />
    </PageMotion>
  )
}
