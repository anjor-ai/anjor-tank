import { useState } from 'react'
import { CASES, home as content } from '../content'
import { Arrow, Button, Cta, Head, LinkArrow, Rich, Section } from '../components/ui'
import { CaseCard, CaseModal, RoqivaFounder } from '../components/folio'
import { WorkRing } from '../components/kinetic'
import { HomeWorkbench, ProductThinking, CareerFeature, ConsultingFeature } from '../components/NextHome'
import { BeyondTeaser } from '../components/NextLife'
import { PageMotion } from '../lib/PageMotion'

export default function Home() {
 const [open,setOpen]=useState('')
 return <PageMotion routeKey="/">
  <header className="atelier-hero"><div className="container">
   <div className="atelier-hero__intro">
    <div className="atelier-identity"><span>AT</span><p>Anjor Tank<small>Product manager. Systems thinker. Builder.</small></p></div>
    <h1><Rich text={content.hello.title}/></h1>
    <p>I design consumer experiences, build the systems behind them, and measure what moves. Currently at GNC India, founding ROQIVA, and open to selective consulting.</p>
    <div className="atelier-actions"><Button to="/contact?intent=consult#brief" track="cta_consult_home">Discuss a project <Arrow/></Button><LinkArrow to="#work">Explore the work</LinkArrow></div><button className="replay-film" type="button" onClick={()=>window.dispatchEvent(new Event('replay-site-film'))}>▷ Replay the opening film</button>
   </div>
   <HomeWorkbench/>
   <div className="atelier-experience"><span>Experience across</span><b>Truemeds</b><b>GNC India</b><b>Neil Patel Digital</b><span>Commerce · Growth · Operations</span></div>
  </div></header>

  <Section id="work" className="ed-work">
   <Head title="Not just features. *Products that changed the outcome.*" lead="Six detailed stories behind measurable results. Explore the illustrated cards, open a quick view, or dive into the system design." />
   <WorkRing label="Selected work" items={CASES} render={(c)=><CaseCard as="article" c={c} onOpen={setOpen}/>} />
   <p className="more" data-reveal><LinkArrow to="/work">Explore all six case studies</LinkArrow></p>
   {open && <CaseModal slug={open} setSlug={setOpen} onClose={()=>setOpen('')}/>}
  </Section>

  <Section id="method" className="atelier-section"><ProductThinking/></Section>
  <Section id="journey" className="atelier-section"><CareerFeature/></Section>
  <Section id="consulting" className="atelier-section atelier-section--tint"><ConsultingFeature/></Section>
  <Section id="roqiva" tone="band"><RoqivaFounder/></Section>
  <Section id="beyond"><BeyondTeaser/></Section>

  <Cta title="Bring a difficult problem. *Let's work out what moves it.*" lead="Consulting is the main door in. And if you are building a great product team, I am always open to the right conversation." primary={{label:'Discuss consulting',to:'/contact?intent=consult#brief'}} secondary={{label:'Talk about a product role',to:'/contact?intent=job#brief'}}/>
 </PageMotion>
}