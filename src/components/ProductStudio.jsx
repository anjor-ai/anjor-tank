import { AsciiArt } from '../art/AsciiArt'
import { CaseMock } from './mocks'
import { Arrow } from './ui'

export function ProductStudio({ item, active }) {
  return <div className={`product-studio product-studio--${active}`}>
    <svg className="studio-grid" viewBox="0 0 1100 460" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({length:13},(_,i)=><path key={i} d={`M${550+(i-6)*28} 80 L${550+(i-6)*180} 460`}/>)}
      {Array.from({length:8},(_,i)=><ellipse key={i} cx="550" cy="200" rx={90+i*85} ry={30+i*30}/>)}
    </svg>
    <div className="studio-label"><span>PRODUCT SYSTEMS / EXPLORER</span><span>0{active+1} — 03</span></div>
    <div className="studio-signal"><span className="studio-kicker">01 / Find the friction</span><div className="studio-ascii"><AsciiArt kind={['find','signals','pulse'][active]}/></div><h3>{item.input}</h3><p>{item.question}</p><span className="studio-signal__tag">Customer signal <i/></span></div>
    <div className="studio-window" key={item.slug}><div className="studio-window__bar"><span><i/><i/><i/></span><b>{item.name} / product study</b><span>↗</span></div><div className="studio-window__body"><div className="studio-window__heading"><small>02 / Design the decision</small><h3>{item.title}</h3></div><CaseMock slug={item.slug}/></div><div className="studio-window__foot"><span>✓ {item.rule}</span><small>Illustration · sample data</small></div></div>
    <a className="studio-outcome" href={'/work/'+item.slug}><span className="studio-kicker">03 / Prove the lift <Arrow/></span><svg viewBox="0 0 200 90" aria-hidden="true"><path className="studio-chart-grid" d="M0 20H200M0 45H200M0 70H200"/><path className="studio-chart-line" d="M4 76C30 76 32 64 54 66S80 61 100 44 130 57 150 29 178 31 196 8"/><circle cx="196" cy="8" r="3"/></svg><b>{item.result}</b><p>{item.metric}</p><span className="studio-outcome__link">Read the case <Arrow/></span></a>
    <div className="studio-bottom"><span>Customer experience</span><i/><span>System design</span><i/><span>Measurable impact</span></div>
  </div>
}

export function MethodCards() {
 const items=[['find','Find the real problem.','Follow the friction across the journey, not just the screen.'],['decide','Make the difficult call.','Turn the evidence into a decision with clear guardrails.'],['prove','Close the loop.','Ship, measure the outcome, and use it to shape the next move.']]
 return <div className="method-cards">{items.map(([art,title,copy],i)=><article key={art}><div className="method-cards__art"><AsciiArt kind={art}/><span>0{i+1}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
}
