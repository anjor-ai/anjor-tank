import { beyond as P } from '../content'
import { Cta, PageHero, Section } from '../components/ui'
import { BeyondStage, LiveScene, Radar, SCENES, SpeedScene, WanderScene, photosOf } from '../components/Story'
import { PageMotion } from '../lib/PageMotion'

/* Beyond work: an expedition in three stops. Each stop has its own landscape and its own way of showing the photos. */

const SCENE_VIEW = { Wander: WanderScene, Speed: SpeedScene, Live: LiveScene }

export default function Beyond() {
  return (
    <PageMotion routeKey="/beyond">
      <PageHero variant="beyond" eyebrow={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} visual={<BeyondStage />} visualLive />

      <Section id="route" rule={false}>
        <div className="v3-beyond-intro"><div><h2 className="h-2">Outside the roadmap.</h2><p className="lead">Some things are better experienced than described. These are the moments that keep me curious.</p></div><span>THREE STOPS ↓</span></div>
        <ol className="stops" data-reveal>
          {SCENES.map((s) => {
            const L = photosOf(s.g)
            return (
              <li key={s.g}>
                <a href={`#scene-${s.g.toLowerCase()}`} className="stop">
                  <img src={`/img/adventure/${L[0].src}.webp`} alt="" loading="lazy" decoding="async" />
                  <span className="stop__k">STOP {s.k}</span>
                  <b>{s.g}</b>
                  <small>{s.lede}</small>
                  <em>{String(L.length).padStart(2, '0')} photos</em>
                </a>
              </li>
            )
          })}
        </ol>
      </Section>

      {SCENES.map((s) => {
        const Scene = SCENE_VIEW[s.g]
        return (
          <section key={s.g} id={`scene-${s.g.toLowerCase()}`} className={`bsc bsc--${s.g.toLowerCase()}`} aria-labelledby={`bsc-${s.g}`}>
            <div className="container">
              <header className="bsc__head" data-reveal>
                <span className="bsc__k">STOP {s.k}</span>
                <h2 className="h-2" id={`bsc-${s.g}`}>{s.g}<span> · {s.lede}</span></h2>
                <p className="lead">{s.sub}</p>
              </header>
              <Scene />
            </div>
          </section>
        )
      })}

      <Section id="radar" tone="alt"><Radar /></Section>

      <Cta title="Say hello *about anything.*" lead="A kart track, a gig, a watch, a product problem. All fair game." primary={{ label: 'Say hello', to: '/contact#brief' }} secondary={{ label: 'See where I fit', to: '/hire' }} />
    </PageMotion>
  )
}
