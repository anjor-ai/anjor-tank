import { useState } from 'react'
import { ALT } from '../content'
import { Arrow, Cta, Section } from '../components/ui'
import { BeyondStage, Radar, SCENES, WanderScene, SpeedScene, LiveScene, photosOf } from '../components/Story'
import { PageMotion } from '../lib/PageMotion'

const VIEWS = { Wander: WanderScene, Speed: SpeedScene, Live: LiveScene }
const COVERS = ['rainier','kart-pov','laser']
const LINES = [['Take the','long way.'],['Find the','next apex.'],['Stay for','one more set.']]

export default function Beyond() {
 const [active,setActive]=useState(0)
 return <PageMotion routeKey="/beyond">
  <header className={`expedition expedition--${active}`}>
   <img key={active} className="expedition__image" src={`/img/adventure/${COVERS[active]}.webp`} alt={ALT[COVERS[active]]} fetchpriority="high"/>
   <div className="expedition__shade"/>
   <svg className="expedition__contours" viewBox="0 0 800 600" fill="none" aria-hidden="true">{Array.from({length:9},(_,i)=><path key={i} d={`M${180+i*25} -40C${600+i*15} 90 ${180+i*20} 180 ${410+i*18} 300S${600+i*30} 510 ${250+i*25} 650`}/>)}</svg>
   <div className="expedition__content"><span className="field-label">Anjor / off the clock</span><h1>{LINES[active][0]}<br/><em>{LINES[active][1]}</em></h1><p>Some of the best stories<br/>happen outside the roadmap.</p><a href={`#scene-${SCENES[active].g.toLowerCase()}`} className="expedition__cta">Explore {SCENES[active].g.toLowerCase()} <Arrow/></a></div>
   <div className="expedition__compass" aria-hidden="true"><span>N</span><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="43"/><circle cx="50" cy="50" r="30"/><path d="M50 3V20M50 80V97M3 50H20M80 50H97M50 25 60 60 50 53 40 60Z"/></svg><small>FOLLOW YOUR CURIOSITY</small></div>
   <div className="expedition__switch" role="group" aria-label="Choose an adventure">{SCENES.map((s,i)=><button key={s.g} type="button" aria-pressed={active===i} onClick={()=>setActive(i)}><img src={`/img/adventure/${COVERS[i]}.webp`} alt=""/><span><small>0{i+1} / {s.g}</small><b>{s.lede}</b></span><Arrow/></button>)}</div>
   <span className="expedition__index">FIELD NOTES · 15 FRAMES · ALWAYS EXPLORING</span>
  </header>
  <Section id="route" className="expedition-intro" rule={false}><div className="expedition-intro__copy"><span className="field-label">The person behind the product</span><h2>A little less planned.<br/><span>A lot more alive.</span></h2><p>Water, mountains and back roads. Karts, a racing sim and the apex. Lights, lasers and a full room. These are the things that keep me curious.</p><nav aria-label="Jump to a chapter">{SCENES.map(s=><a key={s.g} href={`#scene-${s.g.toLowerCase()}`}><span>{s.k}</span>{s.g}<Arrow/></a>)}</nav></div><BeyondStage/></Section>
  {SCENES.map(s=>{const Scene=VIEWS[s.g];return <section key={s.g} id={`scene-${s.g.toLowerCase()}`} className={`bsc bsc--${s.g.toLowerCase()} expedition-chapter`} aria-labelledby={`bsc-${s.g}`}><div className="container"><header className="bsc__head" data-reveal><span className="bsc__k">CHAPTER {s.k} / {photosOf(s.g).length} FRAMES</span><h2 className="h-2" id={`bsc-${s.g}`}>{s.g}<span> · {s.lede}</span></h2><p className="lead">{s.sub}</p></header><Scene/>{s.g==='Speed'&&<p className="scene-note">Illustrated telemetry · for the love of racing.</p>}{s.g==='Live'&&<p className="scene-note">Visual rhythm study · no audio plays.</p>}</div></section>})}
  <Section id="radar"><header className="atelier-heading"><h2>Always something<br/><span>on the radar.</span></h2><p>Curiosity doesn’t switch off when the working day ends.</p></header><Radar/></Section>
  <Cta title="Say hello *about anything.*" lead="A kart track, a gig, a watch, a product problem. All fair game." primary={{label:'Say hello',to:'/contact#brief'}} secondary={{label:'See where I fit',to:'/hire'}}/>
 </PageMotion>
}
