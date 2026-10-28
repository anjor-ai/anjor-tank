import { useState } from 'react'
import { home as content } from '../content'
import { Arrow, Button, Cta, Kin, LinkArrow, Section } from '../components/ui'
import { CaseModal, RoqivaFounder } from '../components/folio'
import { KHead, KSection } from '../components/kit'
import { CareerSection, ConsultSection, ThinkingSection } from '../components/sections'
import { BeyondBand, CaseShowcase, HeroTrace } from '../components/v4'
import { Stat } from '../components/kinetic'
import { Hello } from '../components/hello'
import { PageMotion } from '../lib/PageMotion'

export default function Home() {
 const [open,setOpen]=useState('')
 return <PageMotion routeKey="/">
  <header className="atelier-hero"><div className="container v-hero">
   <div className="atelier-hero__intro">
    <div className="atelier-identity"><span>AT</span><p>Anjor Tank<small>Product manager. Systems thinker. Builder.</small></p></div>
    <Hello items={content.hello.hellos}/>
    <h1 data-kin data-kin-hero><Kin text={content.hello.title} hlEm/></h1>
    <p>I design consumer experiences, build the systems behind them, and measure what moves. Currently at GNC India, founding ROQIVA, and open to selective consulting.</p>
    <div className="atelier-actions"><Button to="/contact?intent=consult#brief" track="cta_consult_home">Discuss a project <Arrow/></Button><LinkArrow to="#work">Explore the work</LinkArrow></div><button className="replay-film" type="button" onClick={()=>window.dispatchEvent(new Event('replay-site-film'))}>▷ Replay the opening film</button>
    <ul className="v-proof" aria-label="Selected results">{content.hello.proof.map(([v,l])=><li key={l}><b><Stat v={v}/></b><span>{l}</span></li>)}</ul>
   </div>
   <HeroTrace/>
   <div className="atelier-experience"><span>Experience across</span><b>Truemeds</b><b>GNC India</b><b>Neil Patel Digital</b><span>Commerce · Growth · Operations</span></div>
  </div></header>

  <KSection id="work">
   <KHead n="01" label="Selected work" tag="Six systems" title="Not just features." sub="Products that ==changed the outcome==." lead="Six detailed stories behind measurable results. Open a quick view, or dive into the system design." />
   <CaseShowcase onOpen={setOpen} />
   <p className="k-more" data-reveal><LinkArrow to="/work">Explore all six case studies</LinkArrow></p>
   {open && <CaseModal slug={open} setSlug={setOpen} onClose={()=>setOpen('')}/>}
  </KSection>

  <ThinkingSection/>
  <CareerSection/>
  <ConsultSection/>
  <Section id="roqiva" tone="band"><RoqivaFounder/></Section>
  <BeyondBand/>

  <Cta title="Bring a ==difficult problem==. *Let's work out what moves it.*" lead="Consulting is the main door in. And if you are building a great product team, I am always open to the right conversation." primary={{label:'Discuss consulting',to:'/contact?intent=consult#brief'}} secondary={{label:'Talk about a product role',to:'/contact?intent=job#brief'}}/>
 </PageMotion>
}