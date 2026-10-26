import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ALT, beyond as P } from '../content'
import { Cta, PageHero, Section } from '../components/ui'
import { BeyondStage, LiveScene, ORDERED, Radar, SCENES, SpeedScene, WanderScene, photosOf } from '../components/Story'
import { PageMotion } from '../lib/PageMotion'

/* Beyond work: an expedition in three stops. Each stop has its own landscape and its own way of showing the photos. */

function Lightbox({ list, i, setI, onClose }) {
  const ref = useRef(null)
  const ph = list[i]
  useEffect(() => {
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((i + 1) % list.length)
      if (e.key === 'ArrowLeft') setI((i - 1 + list.length) % list.length)
    }
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.() }
  }, [i, list.length, onClose, setI])
  return createPortal(
    <div className="lbx" role="dialog" aria-modal="true" aria-label={`${ph.cap}: photo ${i + 1} of ${list.length}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <figure className="lbx__f">
        <img src={`/img/adventure/${ph.src}.webp`} alt={ALT[ph.src]} />
        <figcaption><span className="label">{ph.g}</span>{ph.cap}</figcaption>
      </figure>
      <div className="lbx__bar">
        <button type="button" className="kbd" onClick={() => setI((i - 1 + list.length) % list.length)} aria-label="Previous photo">←</button>
        <span className="label">{i + 1} / {list.length}</span>
        <button type="button" className="kbd" onClick={() => setI((i + 1) % list.length)} aria-label="Next photo">→</button>
        <button type="button" ref={ref} className="kbd" onClick={onClose} aria-label="Close">Esc</button>
      </div>
    </div>,
    document.body
  )
}

const SCENE_VIEW = { Wander: WanderScene, Speed: SpeedScene, Live: LiveScene }

export default function Beyond() {
  const [open, setOpen] = useState(-1)
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
              <Scene open={setOpen} />
            </div>
          </section>
        )
      })}

      <Section id="radar" tone="alt"><Radar /></Section>
      {open >= 0 && <Lightbox list={ORDERED} i={open} setI={setOpen} onClose={() => setOpen(-1)} />}

      <Cta title="Say hello *about anything.*" lead="A kart track, a gig, a watch, a product problem. All fair game." primary={{ label: 'Say hello', to: '/contact#brief' }} secondary={{ label: 'See where I fit', to: '/hire' }} />
    </PageMotion>
  )
}
