import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ALT, LOVES, PHOTOS, beyond as P } from '../content'
import { Cta, Head, PageHero, Section } from '../components/ui'
import { PageMotion } from '../lib/PageMotion'

/* Beyond work: the person. Photos in three folders (filterable, each opens larger), then the things I love. */

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
    <div className="lbx" role="dialog" aria-modal="true" aria-label={`${ph.cap} — photo ${i + 1} of ${list.length}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
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

export default function Beyond() {
  const [g, setG] = useState('All')
  const [open, setOpen] = useState(-1)
  const list = PHOTOS.filter((p) => g === 'All' || p.g === g)
  return (
    <PageMotion routeKey="/beyond">
      <PageHero eyebrow={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} />

      <Section id="photos" rule={false}>
        <div className="chips-row" role="group" aria-label="Filter photos" data-reveal>
          {P.groups.map((x) => <button key={x} type="button" className="chip" aria-pressed={g === x} onClick={() => { setG(x); setOpen(-1) }}>{x}</button>)}
        </div>
        <ul className="pgrid" aria-live="polite">
          {list.map((p, k) => (
            <li key={p.src} data-reveal>
              <button type="button" className="pgrid__b" onClick={() => setOpen(k)} aria-label={`Open photo: ${p.cap}`}>
                <img src={`/img/adventure/${p.src}.webp`} width={p.w} height="998" alt={ALT[p.src]} loading="lazy" decoding="async" />
                <span className="pgrid__c"><span className="label">{p.g}</span>{p.cap}</span>
              </button>
            </li>
          ))}
        </ul>
        {open >= 0 && <Lightbox list={list} i={open} setI={setOpen} onClose={() => setOpen(-1)} />}
      </Section>

      <Section id="loves" tone="alt">
        <Head eyebrow={P.loves.eyebrow} title={P.loves.title} lead={P.loves.lead} />
        <ul className="loves">
          {LOVES.map(([t, d], i) => <li key={t} className="loves__c" data-reveal><span className="label">0{i + 1}</span><h3 className="h-4">{t}</h3><p className="muted">{d}</p></li>)}
        </ul>
      </Section>

      <Cta title="Say hello *about anything.*" lead="A kart track, a gig, a watch, a product problem. All fair game." primary={{ label: 'Say hello', to: '/contact#brief' }} secondary={{ label: 'See where I fit', to: '/hire' }} />
    </PageMotion>
  )
}
