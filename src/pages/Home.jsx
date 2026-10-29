import { useState } from 'react'
import { CASES, home as content } from '../content'
import { Arrow, Button, Cta } from '../components/ui'
import { CaseModal } from '../components/folio'
import { Board, Go, H, Kicker, Sec, Stage, Tile } from '../components/board'
import { LedBoard } from '../components/led'
import { CareerLog, MapDots } from '../components/frags'
import { CaseTile } from '../components/cards'
import { RoqivaStage } from '../components/Story'
import { Stat } from '../components/kinetic'
import { Icon } from '../components/icons'
import { HeroApp } from '../scenes/HeroApp'
import { MethodRun } from '../components/method'
import { ConsultMapScene } from '../scenes/ConsultMap'
import { WordReel } from '../art/Reel'
import { useClock } from '../components/kit'
import { useTheme } from '../lib/theme'
import { PageMotion } from '../lib/PageMotion'

/* Home: one board per screen.
   The welcome (a dot-matrix board saying hello in fourteen languages, the line, the proof) beside the decision layer at work;
   the six systems; how I think; the story so far; consulting; ROQIVA; beyond work; then the close. */

function Hero() {
  const { theme } = useTheme()
  return (
    <header className="b-sec b-sec--first b-hero">
      <div className="b-wrap">
        <Board className="b-hero__board">
          <Tile className="b-hero__hi" tone="ink">
            <p className="b-hero__id"><span aria-hidden="true">AT</span><b>Anjor Tank</b><small>Product manager. Systems thinker. Builder.</small></p>
            <LedBoard items={content.hello.hellos} className="b-hero__led" />
          </Tile>
          <Tile className="b-hero__copy">
            <H as="h1" text={content.hello.title} hero hlEm className="b-hero__t" />
            <p className="b-lead">I design consumer experiences, build the systems behind them, and measure what moves. Currently at GNC India, founding ROQIVA, and open to selective consulting.</p>
            <div className="b-acts">
              <Button to="/contact?intent=consult#brief" track="cta_consult_home">Discuss a project <Arrow /></Button>
              <Go to="#work">Explore the work</Go>
            </div>
          </Tile>
          <ul className="b-hero__proof" aria-label="Selected results">
            {content.hello.proof.map(([v, l]) => <li key={l} className="b-tile"><b><Stat v={v} /></b><span>{l}</span></li>)}
          </ul>
          <Stage kind="shader" name={theme === 'dark' ? 'violet' : 'dawn'} className="b-hero__stage">
            <div className="b-hero__app mh"><HeroApp /></div>
          </Stage>
          <button className="b-hero__replay" type="button" onClick={() => window.dispatchEvent(new Event('replay-site-film'))}><Icon name="play" size={13} />Replay the opening film</button>
        </Board>
      </div>
    </header>
  )
}

/** Where the work was done: a dark band with its label fixed at the left and the names travelling behind a soft edge. */
function Marquee() {
  const set = <><b>Truemeds</b><i /><b>GNC India</b><i /><b>Neil Patel Digital</b><i /><em>Commerce · Growth · Operations</em><i /></>
  return (
    <section className="b-sec b-sec--band" aria-label="Experience across Truemeds, GNC India and Neil Patel Digital, in commerce, growth and operations">
      <div className="b-wrap">
        <div className="b-mq">
          <p className="b-mq__k" aria-hidden="true"><i className="b-live" />Experience across</p>
          <div className="b-mq__view" aria-hidden="true"><div className="b-mq__row"><span>{set}</span><span>{set}</span></div></div>
        </div>
      </div>
    </section>
  )
}

const REEL = [
  ['/img/adventure/rainier.webp', 'Wander', 'Water, mountains and back roads.'],
  ['/img/adventure/kart-pov.webp', 'Speed', 'Karts, a racing sim and the apex.'],
  ['/img/adventure/laser.webp', 'Music', 'Lights, lasers and a full room.'],
  ['book', 'Read', 'On the shelf.'],
  ['/img/manga/paddle.png', 'Watch', 'Mecha, strategy, one more episode.'],
]

export default function Home() {
  const [open, setOpen] = useState('')
  const t = useClock()
  return (
    <PageMotion routeKey="/">
      <Hero />
      <Marquee />

      <Sec id="work" label="Selected work" tag="Six systems" title="Not just features." sub="Products that ==changed the outcome==." lead="Six detailed stories behind measurable results. Open a quick view, or dive into the system design."
        aside={<Go to="/work">Explore all six case studies</Go>}>
        <Board className="b-cases">
          {CASES.map((c, k) => <CaseTile key={c.slug} c={c} onOpen={setOpen} wide={k === 0 || k === 5} />)}
        </Board>
      </Sec>
      {open && <CaseModal slug={open} setSlug={setOpen} onClose={() => setOpen('')} />}

      <Sec id="method" tone="soft" label="How I think" tag="Six steps, four gates" title="Connect signals" sub="to ==better decisions and outcomes==." lead="Code finds and ranks the gaps. People decide at every gate. Every release is measured against a frozen baseline.">
        <MethodRun />
      </Sec>

      <Sec id="journey" label="The story so far" tag="Three chapters" title="From understanding demand" sub="to ==building what delivers it==." lead="Different roles. One growing curiosity about how products and businesses really work.">
        <Board className="b-story">
          <figure className="b-tile b-story__photo">
            <img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" loading="lazy" decoding="async" />
            <figcaption><b>Anjor Tank</b><small>Curiosity is the through line.</small></figcaption>
          </figure>
          <Tile className="b-story__now">
            <Kicker icon={<i className="b-live" />}>Right now</Kicker>
            <h3>Founder of ROQIVA. Product Manager, GNC India.</h3>
            <Go to="/journey">The story so far</Go>
          </Tile>
          <Tile className="b-story__map" tone="soft">
            <Kicker icon="pin">Based in</Kicker>
            <MapDots />
            <p className="b-story__city"><b>Mumbai</b><span>{t || 'India'}</span></p>
          </Tile>
          <Stage kind="paint" name="noon" className="b-story__log" align="start"><CareerLog compact /></Stage>
        </Board>
      </Sec>

      <Sec id="consulting" tone="soft" label="Consulting" tag="GTM engineering and RevOps" title="Growth often breaks" sub="==between tools==." lead="My consulting work combines GTM engineering and RevOps: find where the commercial journey leaks, engineer the missing operating loop, and prove the lift.">
        <Board className="b-consult">
          <Stage kind="shader" name="violet" className="b-consult__map"><ConsultMapScene /></Stage>
          <Tile className="b-consult__c b-consult__c1"><Kicker icon="radar">GTM engineering</Kicker><h3>Find the leak.</h3><p>Instrument the journey, recover intent and connect acquisition with conversion.</p></Tile>
          <Tile className="b-consult__c b-consult__c2"><Kicker icon="link">RevOps</Kicker><h3>Connect the handoffs.</h3><p>Govern data, decision rules and the handoffs between the people and tools that deliver.</p></Tile>
          <Tile className="b-consult__c b-consult__c3 b-consult__c--ink" tone="ink">
            <Kicker icon={<i className="b-live" />}>ROQIVA · Intelligence layer · in development</Kicker>
            <h3>The product I am founding to make the method repeatable.</h3>
            <div className="b-acts"><Button to="/hire">Explore consulting <Arrow /></Button><Button to="/contact?intent=consult#brief" variant="ghost">Discuss a project</Button></div>
          </Tile>
        </Board>
      </Sec>

      <section id="roqiva" className="b-sec b-sec--ink" aria-labelledby="roqiva-h">
        <div className="b-wrap">
          <Board className="b-rq">
            <Tile className="b-rq__id" tone="ink">
              <Kicker icon={<i className="b-live" />}>{content.roqiva.eyebrow}</Kicker>
              <div className="b-rq__name"><WordReel word="roq" size="foot" label="ROQIVA" /></div>
              <H text={content.roqiva.title} id="roqiva-h" />
              <p className="b-lead">{content.roqiva.lead}</p>
              <ul className="b-rq__s">{content.roqiva.stats.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}</ul>
              <div className="b-acts">
                <Button to={content.roqiva.primary.to}>{content.roqiva.primary.label}<Arrow /></Button>
                <Button to={content.roqiva.secondary.to} variant="ghost">{content.roqiva.secondary.label}</Button>
              </div>
            </Tile>
            <Stage kind="shader" name="violet" className="b-rq__app"><RoqivaStage /></Stage>
          </Board>
        </div>
      </section>

      <Sec id="beyond" label="Beyond work" title="Away from the roadmap, still curious." lead="Karting, music, travel, a book and an anime queue. I care about how things work, and about experiencing them for myself."
        aside={<p className="b-beyond__go"><Button to="/beyond">Enter beyond work <Arrow /></Button><small>It opens with a short film.</small></p>}>
        <Board as="ul" className="b-beyond">
          {REEL.map(([src, g, cap]) => (
            <li key={g} className="b-pic" data-cursor="Enter">
              <a href={`/beyond#scene-${g.toLowerCase()}`} aria-label={`${g}: ${cap}`}>
                {src === 'book'
                  ? <span className="b-pic__book" aria-hidden="true"><b>AI<br />ENGINEERING</b><small>Chip Huyen</small></span>
                  : <img src={src} alt="" loading="lazy" decoding="async" />}
                <span className="b-pic__cap"><b>{g}</b><em>{cap}</em></span>
              </a>
            </li>
          ))}
        </Board>
      </Sec>

      <Cta title="Bring a ==difficult problem==. *Let's work out what moves it.*" lead="Consulting is the main door in. And if you are building a great product team, I am always open to the right conversation." primary={{ label: 'Discuss consulting', to: '/contact?intent=consult#brief' }} secondary={{ label: 'Talk about a product role', to: '/contact?intent=job#brief' }} />
    </PageMotion>
  )
}

