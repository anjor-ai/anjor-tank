import { useEffect, useState } from 'react'
import { ALT } from '../content'
import { Arrow, Cta, Section } from '../components/ui'
import { Radar, SCENES, photosOf } from '../components/Story'
import { PageMotion } from '../lib/PageMotion'

const COVERS = { Wander: 'rainier', Speed: 'kart-pov', Live: 'lights-red' }

export default function Beyond() {
  const [opening, setOpening] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    try {
      if (sessionStorage.getItem('beyond-opening-seen')) return
      sessionStorage.setItem('beyond-opening-seen', '1')
    } catch { /* The page still works when storage is unavailable. */ }
    setOpening(true)
    const timer = setTimeout(() => setOpening(false), 2600)
    return () => clearTimeout(timer)
  }, [])

  return <PageMotion routeKey="/beyond">
    <header className={`field-hero${opening ? ' is-opening' : ''}`}>
      <div className="field-hero__photo"><img src="/img/adventure/rainier.webp" alt={ALT.rainier} fetchpriority="high" /></div>
      <div className="field-hero__copy">
        <span className="field-label">Anjor, beyond work / field notes</span>
        <h1>Take the<br/><em>long way.</em></h1>
        <p>Out of office. Into the moment.<br/>Mountains, back roads, a better lap—and the next live set.</p>
        <a className="field-explore" href="#route" onClick={() => setOpening(false)}>Explore the other side <Arrow/></a>
        <span className="field-hero__note">01 / Mount Rainier <span>A mountain worth the drive.</span></span>
      </div>
      {opening && <div className="field-opening"><span aria-hidden="true">Less screen time.<br/><em>More stories.</em></span><button type="button" onClick={() => setOpening(false)}>Skip intro ↗</button></div>}
    </header>

    <Section id="route" className="field-route" rule={false}>
      <header className="field-section-head" data-reveal><div><span className="field-label">A few things that keep me curious</span><h2>Life doesn’t follow a roadmap.</h2></div><p>Some things are better experienced than described.<br/>Pick a direction. See where it goes.</p></header>
      <nav className="field-stops" aria-label="Explore beyond work">{SCENES.map(s => <a href={`#scene-${s.g.toLowerCase()}`} key={s.g}>
        <img src={`/img/adventure/${COVERS[s.g]}.webp`} alt="" loading="lazy"/>
        <span className="field-stops__number">0{s.k.slice(-1)} / {String(photosOf(s.g).length).padStart(2,'0')} frames</span>
        <div><h3>{s.g}</h3><p>{s.lede}</p></div><Arrow/>
      </a>)}</nav>
    </Section>

    {SCENES.map(s => <section id={`scene-${s.g.toLowerCase()}`} className={`field-chapter field-chapter--${s.g.toLowerCase()}`} key={s.g} aria-labelledby={`field-${s.g}`}>
      <div className="container"><header className="field-section-head" data-reveal><div><span className="field-label">Chapter {s.k}</span><h2 id={`field-${s.g}`}>{s.g}<span> / {s.lede}</span></h2></div><p>{s.sub}</p></header>
        <div className="field-photos">{photosOf(s.g).map((p,i) => <figure key={p.src} className={i===0?'field-photo--lead':''}>
          <img src={`/img/adventure/${p.src}.webp`} width={p.w} height="998" alt={ALT[p.src]} loading="lazy" decoding="async"/>
          <figcaption><span>{String(i+1).padStart(2,'0')}</span>{p.cap}</figcaption>
        </figure>)}</div>
      </div>
    </section>)}
    <Section id="radar" className="field-radar"><header className="field-section-head"><h2>Also on my radar.</h2><span className="field-label">Always curious</span></header><Radar/></Section>
    <Cta title="Say hello *about anything.*" lead="A kart track, a gig, a watch, a product problem. All fair game." primary={{label:'Say hello',to:'/contact#brief'}} secondary={{label:'See where I fit',to:'/hire'}}/>
  </PageMotion>
}
