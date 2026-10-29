import { consult as C } from '../content'
import { Arrow, Button, Cta } from '../components/ui'
import { Board, Go, H, Kicker, PageHead, Sec, Tile } from '../components/board'
import { Compare, Connect, Discipline, FlowHero, Steps } from '../components/consult'
import { PartsRail } from '../components/RoqivaParts'
import { WordReel } from '../art/Reel'
import { PageMotion } from '../lib/PageMotion'

/* Hire: consulting, as the brief lays it out (content/consult.js).
   01 Hero: from complex problems to systems that work, with challenge → direction → blueprint.
   02 Two disciplines: Strategy (what + why) and Architecture (how), side by side, then compared.
   03 How they connect: two entry points, one path.
   04 ROQIVA: the product in development, kept apart from the services (the home page's ROQIVA band).
   05 Working approach and the close. No packages, rates, timelines or client results anywhere on this page. */

export default function Hire() {
  const H0 = C.hero
  const R = C.roqiva
  return (
    <PageMotion routeKey="/hire">
      <PageHead label={H0.eyebrow} tag={H0.tag} title={H0.title} lead={H0.lead} visual={<div className="hr-head"><FlowHero /></div>}>
        <div className="b-acts"><Button to={H0.primary.to} track="cta_consult_hire">{H0.primary.label} <Arrow /></Button><Go to={H0.secondary.to}>{H0.secondary.label}</Go></div>
        <p className="hr-role"><i className="b-live" /><span>Open to the right product role, too.</span><a href="/contact?intent=job#brief">Let’s talk ↗</a></p>
      </PageHead>

      <Sec id="disciplines" label="Two disciplines" tag="Strategy and architecture" title="Start with ==what to fix==," sub="or with how to build it." center>
        <div className="cs-pair">
          {C.disciplines.map((d) => <div key={d.id} id={d.id}><Discipline d={d} /></div>)}
        </div>
        <p className="cs-boundary"><span>Boundary</span>{C.boundary}</p>
        <Compare />
      </Sec>

      <Sec id="connect" label={C.connect.label} tag={C.connect.tag} title={C.connect.title} lead={C.connect.lead} center>
        <Connect />
      </Sec>

      <section id="roqiva" className="b-sec b-sec--ink" aria-labelledby="hire-rq-h">
        <div className="b-wrap">
          <Board className="b-rq">
            <Tile className="b-rq__id" tone="ink">
              <Kicker icon={<i className="b-live" />}>{R.eyebrow}</Kicker>
              <div className="b-rq__name"><WordReel word="roq" size="foot" label="ROQIVA" /></div>
              <H text={R.title} id="hire-rq-h" />
              <p className="b-lead">{R.copy}</p>
              <div className="b-rq__flow"><Steps steps={R.flow} tone="r" /></div>
              <p className="b-rq__micro">{R.micro}</p>
              <div className="b-acts"><Button to={R.cta.to}>{R.cta.label}<Arrow /></Button></div>
            </Tile>
            <div className="b-rq__sys"><PartsRail /></div>
          </Board>
        </div>
      </section>

      <Sec id="approach" label={C.approach.label} tag={C.approach.tag} title={C.approach.title} lead={C.approach.copy} center />

      <Cta title={C.close.title} lead={C.close.lead} primary={C.close.primary} />
    </PageMotion>
  )
}
