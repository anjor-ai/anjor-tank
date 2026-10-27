import { useState } from 'react'
import { Arrow, Button, LinkArrow } from './ui'
import { AsciiSignal } from './Wireframe'
import { ProductStudio, MethodCards } from './ProductStudio'
import { AsciiArt } from '../art/AsciiArt'

const cases = [
 {name:'Checkout',slug:'price-lock-checkout',title:'A price you can trust.',question:'What happens when an order changes after payment?',decision:'Keep the promise made at checkout.',result:'+12.5pp',metric:'prepaid conversion',input:'Order modified',rule:'Committed price preserved',output:'Customer confidence',symbol:'↗'},
 {name:'Discovery',slug:'search-discovery',title:'Intent, understood.',question:'Should a typo ever become a lost order?',decision:'Understand the query before ranking the results.',result:'+9%',metric:'search-to-order conversion',input:'Imperfect query',rule:'Intent matched & results ranked',output:'The right product',symbol:'⌕'},
 {name:'Retention',slug:'retention-reminders',title:'The right moment.',question:'When does a reminder become genuinely useful?',decision:'Match the reminder to the reorder window.',result:'~1,100',metric:'additional repeat orders / day',input:'Previous purchase',rule:'Reorder cadence identified',output:'A timely reminder',symbol:'↻'}
]

export function HomeWorkbench(){
 const [active,setActive]=useState(0)
 return <div className="atelier-workbench"><div className="atelier-switch" role="group" aria-label="Explore product decisions">{cases.map((x,i)=><button key={x.slug} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}>{x.name}</button>)}</div><ProductStudio item={cases[active]} active={active}/></div>
}
export function ProductThinking(){
 const [active,setActive]=useState(0),item=cases[active]
 return <div className="atelier-thinking"><header className="atelier-heading" data-reveal><h2>A great interface is just<br/><span>the visible part.</span></h2><p>The product is the decision beneath it. I connect customer experience with the systems that deliver it—and the metrics that prove it worked.</p></header><div className="atelier-thinking__layout"><div className="atelier-thinking__questions" role="group" aria-label="Explore product thinking">{cases.map((c,i)=><button type="button" key={c.slug} aria-pressed={active===i} onClick={()=>setActive(i)}><span>0{i+1}</span><div><h3>{c.question}</h3><p>{c.decision}</p></div><Arrow/></button>)}</div><div className="atelier-blueprint" key={item.slug}><div className="atelier-blueprint__top"><span>{item.name}</span><small>From friction to outcome</small></div><ol>{[['Customer',item.input],['System',item.rule],['Experience',item.output]].map(([label,value],i)=><li key={label}><span className="atelier-blueprint__dot">{i===2?'✓':'0'+(i+1)}</span><div><small>{label}</small><strong>{value}</strong></div></li>)}</ol><a href={'/work/'+item.slug}><b>{item.result}</b><span>{item.metric}</span><Arrow/></a></div></div><MethodCards/></div>
}
export function CareerFeature(){
 return <div className="atelier-career"><figure><img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" loading="lazy"/><figcaption>Anjor Tank <span>Curiosity is the through line.</span></figcaption></figure><div className="atelier-career__copy"><h2>From understanding demand<br/><span>to building what delivers it.</span></h2><p>Different roles. One growing curiosity about how products and businesses really work.</p><ol>{[['2022–23','Understand demand.','Eggfirst · Neil Patel Digital'],['2023–26','Build what delivers it.','Truemeds · Product & operations'],['Now','Own the whole loop.','GNC India · Founding ROQIVA']].map(([date,title,org])=><li key={date}><small>{date}</small><div><h3>{title}</h3><p>{org}</p></div></li>)}</ol><LinkArrow to="/journey">The story so far</LinkArrow></div></div>
}
export function GrowthMap(){
 return <div className="atelier-growth" aria-label="Signals connect through GTM engineering and RevOps to measured outcomes, with ROQIVA in development"><div className="atelier-growth__sources">{['Product','CRM','Analytics'].map((s,i)=><span key={s}><i>{['◈','▤','⌁'][i]}</i>{s}</span>)}</div><div className="atelier-growth__connector" aria-hidden="true"><i/><i/><i/></div><div className="growth-sculpture"><AsciiArt kind="brain"/><span>CONNECTED INTELLIGENCE</span></div><div className="atelier-growth__core"><AsciiSignal/><div><strong>One operating loop.</strong><small>Signal → decision → execution</small></div></div><div className="atelier-growth__branches"><div><span>01</span><b>GTM engineering</b><small>Find the leak.</small></div><div><span>02</span><b>RevOps</b><small>Connect the handoffs.</small></div></div><div className="atelier-growth__product"><span>ROQIVA</span><small>Intelligence layer · in development</small><Arrow/></div></div>
}
export function ConsultingFeature(){
 return <div className="atelier-consult"><div className="atelier-consult__copy"><h2>Growth often breaks<br/><span>between tools.</span></h2><p>My consulting work combines GTM engineering and RevOps: find where the commercial journey leaks, engineer the missing operating loop, and prove the lift.</p><div className="atelier-actions"><Button to="/hire">Explore consulting <Arrow/></Button><LinkArrow to="/contact?intent=consult#brief">Discuss a project</LinkArrow></div></div><GrowthMap/></div>
}
