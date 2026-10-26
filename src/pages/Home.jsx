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
  <header className="nx-homehero"><div className="container nx-homehero__inner">
   <div className="nx-homehero__copy">
    <div className="nx-homehero__identity"><i/> ANJOR TANK · PRODUCT MANAGER</div>
    <h1 className="h-hero"><Rich text={content.hello.title}/></h1>
    <p className="lead">I design consumer experiences, build the operational systems behind them, and measure what moves. Currently Product Manager at GNC India, founder of ROQIVA, and available for selective consulting.</p>
    <div className="hero__btns"><Button to="/contact?intent=consult#brief" track="cta_consult_home">Discuss a project <Arrow/></Button><Button to="#work" variant="ghost">Explore the work</Button></div>
    <div className="nx-homehero__proof"><span>Ecommerce & growth</span><span>Platforms & operations</span><span>AI & automation</span></div>
   </div>
   <div className="nx-homehero__view"><HomeWorkbench/></div>
  </div></header>

  <Section id="work" className="ed-work">
   <Head title="Not just features. *Products that changed the outcome.*" lead="Six detailed stories behind measurable results. Explore the illustrated cards, open a quick view, or dive into the system design." />
   <WorkRing label="Selected work" items={CASES} render={(c)=><CaseCard c={c} onOpen={setOpen}/>} />
   <p className="more" data-reveal><LinkArrow to="/work">Explore all six case studies</LinkArrow></p>
   {open && <CaseModal slug={open} setSlug={setOpen} onClose={()=>setOpen('')}/>}
  </Section>

  <Section id="method" tone="alt"><ProductThinking/></Section>
  <Section id="journey"><CareerFeature/></Section>
  <Section id="consulting" tone="alt"><ConsultingFeature/></Section>
  <Section id="roqiva" tone="band"><RoqivaFounder/></Section>
  <Section id="beyond"><BeyondTeaser/></Section>

  <Cta title="Bring a difficult problem. *Let's work out what moves it.*" lead="Consulting is the main door in. And if you are building a great product team, I am always open to the right conversation." primary={{label:'Discuss consulting',to:'/contact?intent=consult#brief'}} secondary={{label:'Talk about a product role',to:'/contact?intent=job#brief'}}/>
 </PageMotion>
}