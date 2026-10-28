import { legal } from '../content'
import { Board, Kicker, PageHead, Tile } from '../components/board'
import { PageMotion } from '../lib/PageMotion'

/** Privacy notice. Plain text in tiles: easy to read and easy to quote. */
export default function Legal() {
  return (
    <PageMotion routeKey="/privacy">
      <PageHead label={legal.hero.eyebrow} title={legal.hero.title} lead={legal.hero.lead} />
      <section className="b-sec" aria-label="The notice">
        <div className="b-wrap">
          <Board className="b-legal">
            <Kicker icon="clock">Last updated {legal.updated}</Kicker>
            {legal.sections.map((s) => (
              <Tile as="article" key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((t) => <p key={t}>{t}</p>)}
              </Tile>
            ))}
          </Board>
        </div>
      </section>
    </PageMotion>
  )
}
