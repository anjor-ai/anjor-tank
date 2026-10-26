import { CASES, GLANCE, bridge } from '../content'
import { Arrow, Button, Cta, DataTable, LinkArrow, Rich, Section } from '../components/ui'
import { Icon } from '../components/icons'
import { SectionNav } from '../components/SectionNav'
import { PageMotion } from '../lib/PageMotion'
import { useRoute } from '../lib/router'

/* One case study. The same eight-step shape every time, a side column with the facts, and at the end the line back to ROQIVA. */

function Block({ b }) {
  return (
    <section id={b.id} className="cs__sec" data-reveal>
      <h2 className="h-2"><Rich text={b.h} /></h2>
      {b.p && b.p.map((t) => <p key={t} className="cs__p">{t}</p>)}
      {b.call && (
        <div className="cs__call">
          <p className="label">The call</p>
          <p className="cs__callt">{b.call}</p>
          {b.bullets && <ul className="bl">{b.bullets.map((t) => <li key={t}>{t}</li>)}</ul>}
          {b.skipped && <p className="cs__sk"><b>What I did not do.</b> {b.skipped}</p>}
          {b.validation && <p className="cs__sk"><b>How I checked it.</b> {b.validation}</p>}
        </div>
      )}
      {!b.call && b.bullets && <ul className="bl">{b.bullets.map((t) => <li key={t}>{t}</li>)}</ul>}
      {b.table && <DataTable className="cs__tbl" cols={b.table.head} rows={b.table.rows} caption={b.h} />}
      {b.items && (
        <ul className="cs__items">{b.items.map((it) => <li key={it.t}><h3 className="h-4">{it.t}</h3><p className="muted">{it.d}</p></li>)}</ul>
      )}
      {b.after && <p className="cs__p">{b.after}</p>}
    </section>
  )
}

export default function Case() {
  const { route } = useRoute()
  const i = CASES.findIndex((c) => route.path === `/work/${c.slug}`)
  const c = CASES[i]
  if (!c) return null
  const g = GLANCE[c.slug]
  const br = bridge[c.slug]
  const prev = CASES[(i - 1 + CASES.length) % CASES.length], next = CASES[(i + 1) % CASES.length]
  const nav = [...c.body.map((b) => ({ id: b.id, label: b.h })), { id: 'roqiva', label: 'In ROQIVA' }]
  return (
    <PageMotion routeKey={route.path}>
      <header className="phero cs__hero">
        <div className="container phero__in">
          <div className="phero__copy">
            <p className="label eyebrow hero__a" style={{ '--i': 0 }}>Case {c.n} · {c.cat} · {c.year}</p>
            <h1 className="h-hero hero__a" style={{ '--i': 1 }}>{c.title}</h1>
            <p className="lead hero__a" style={{ '--i': 2 }}>{c.hook}</p>
            <ul className="cs__m hero__a" style={{ '--i': 3 }}>{c.metrics.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}</ul>
          </div>
        </div>
      </header>

      <SectionNav items={nav} label="In this case" />

      <Section id="short" rule={false}>
        <div className="cs__quick">
          {[['The problem', c.quick.problem], ['The call', c.quick.call], ['The result', c.quick.result]].map(([k, v]) => (
            <div key={k} className="cs__q" data-reveal><p className="label">{k}</p><p>{v}</p></div>
          ))}
        </div>
      </Section>

      <Section rule={false}>
        <div className="cs">
          <aside className="cs__side" data-reveal>
            <p className="label">At a glance</p>
            <dl>
              <div><dt className="label">My role</dt><dd>{g.role}</dd></div>
              <div><dt className="label">Worked with</dt><dd>{g.team}</dd></div>
              <div><dt className="label">Built on</dt><dd>{g.stack.join(' · ')}</dd></div>
              <div><dt className="label">Read</dt><dd>{g.read}</dd></div>
            </dl>
          </aside>
          <div className="cs__main">
            {c.table && (
              <section className="cs__sec" data-reveal>
                <h2 className="h-2">The numbers</h2>
                <DataTable className="cs__tbl" cols={['Measure', 'Before', 'After', 'Change']} rows={c.table} caption="Results" />
              </section>
            )}
            {c.body.map((b) => <Block key={b.id} b={b} />)}
            <section id="roqiva" className="cs__rq" data-reveal>
              <p className="label"><Icon name="branch" size={13} />What it became in ROQIVA</p>
              <h2 className="h-2">{br.became}</h2>
              <p className="cs__p">{br.d}</p>
              <dl className="cs__rqd">
                <div><dt className="label">Lane</dt><dd>{br.lane}</dd></div>
                <div><dt className="label">Who in ROQIVA</dt><dd>{br.agent}</dd></div>
              </dl>
              <p className="muted cs__note">The case is real. The check is the design intent of ROQIVA, a system still in development.</p>
              <LinkArrow to="/roqiva#origin">See where ROQIVA comes from</LinkArrow>
            </section>
          </div>
        </div>
      </Section>

      <Section tone="alt" rule={false}>
        <nav className="cs__pn" aria-label="More cases">
          <a href={`/work/${prev.slug}`}><span className="label">Previous · {prev.n}</span><b>{prev.title}</b></a>
          <a href={`/work/${next.slug}`}><span className="label">Next · {next.n}</span><b>{next.title}</b></a>
        </nav>
      </Section>

      <Cta title="Want this *done on your system?*" lead="Tell me the number that will not move. I will reply with where I would look first." primary={{ label: 'Send a brief', to: '/contact?intent=consult#brief' }} secondary={{ label: 'See all cases', to: '/work' }} />
    </PageMotion>
  )
}
