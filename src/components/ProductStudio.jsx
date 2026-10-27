import { EngineeringArt } from './EngineeringArt'
import { CaseMock } from './mocks'
import { Arrow } from './ui'

export function ProductStudio({ item, active }) {
  return <div className={`product-studio product-studio--${active}`}>
    <div className="studio-editorial"><span className="studio-kicker">SELECTED PRODUCT DECISION / 0{active+1}</span><h2>{item.title}</h2><p>{item.question}</p><div className="studio-editorial__rule"><span>THE DECISION</span><strong>{item.decision}</strong></div><a className="studio-proof" href={'/work/'+item.slug}><b>{item.result}</b><span>{item.metric}<small>Read the case study <Arrow/></small></span></a></div>
    <div className="studio-canvas"><div className="studio-canvas__grid" aria-hidden="true"/><div className="studio-window" key={item.slug}><div className="studio-window__bar"><span><i/><i/><i/></span><b>{item.name} / product study</b><span>↗</span></div><div className="studio-window__body"><CaseMock slug={item.slug}/></div><div className="studio-window__foot"><span>✓ {item.rule}</span><small>Illustration · sample data</small></div></div><div className="studio-annotation"><span>↳</span><div><small>DESIGNED AROUND THE CUSTOMER</small><strong>{item.output}</strong></div></div></div>
  </div>
}

export function MethodCards() {
 const items=[['find','Find the real problem.','Follow the friction across the journey, not just the screen.'],['decide','Make the difficult call.','Turn the evidence into a decision with clear guardrails.'],['prove','Close the loop.','Ship, measure the outcome, and use it to shape the next move.']]
 return <div className="method-cards">{items.map(([art,title,copy],i)=><article key={art}><div className="method-cards__art"><EngineeringArt variant={i}/><span>0{i+1}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
}
