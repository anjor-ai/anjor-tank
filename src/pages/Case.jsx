import { CASES, GLANCE, bridge } from '../content'
import { Cta, LinkArrow, Section } from '../components/ui'
import { SectionNav } from '../components/SectionNav'
import { CaseMock } from '../components/mocks'
import { Stat } from '../components/kinetic'
import { Architecture, Chevrons, Findings, Impact, Leakage, Lenses, Measure, Part, Playbook, Shift, Stairs } from '../components/casekit'
import { Icon } from '../components/icons'
import { PageMotion } from '../lib/PageMotion'
import { useRoute } from '../lib/router'

/* One case study, in the same eleven parts every time (problem, diagnosis, shift, architecture, workflow, requirements,
   measurement, rollout, impact, playbook), each drawn as a diagram. Then the line back to ROQIVA. */

const NAV = [
  ['summary', 'Summary'], ['problem', 'Problem'], ['diagnosis', 'Diagnosis'], ['shift', 'Shift'], ['architecture', 'System'], ['workflow', 'Workflow'],
  ['requirements', 'Requirements'], ['measurement', 'Measurement'], ['rollout', 'Rollout'], ['impact', 'Impact'], ['playbook', 'Playbook'],
].map(([id, label]) => ({ id, label }))

export default function Case() {
  const { route } = useRoute()
  const i = CASES.findIndex((c) => route.path === `/work/${c.slug}`)
  const c = CASES[i]
  if (!c) return null
  const g = GLANCE[c.slug]
  const br = bridge[c.slug]
  const S = c.summary
  const prev = CASES[(i - 1 + CASES.length) % CASES.length], next = CASES[(i + 1) % CASES.length]
  return (
    <PageMotion routeKey={route.path}>
      <header className="phero phero--split cs__hero">
        <div className="container phero__in">
          <div className="phero__copy">
            <p className="label eyebrow hero__a" style={{ '--i': 0 }}>Case {c.n} of 06 · {c.cat}</p>
            <h1 className="h-hero hero__a" style={{ '--i': 1 }}>{c.title}</h1>
            <p className="lead hero__a" style={{ '--i': 2 }}>{c.hook}</p>
            <ul className="cs__m hero__a" style={{ '--i': 3 }}>{c.metrics.map(([v, l]) => <li key={l}><Stat v={v} /><span>{l}</span></li>)}</ul>
            <ul className="ccd__tags hero__a" style={{ '--i': 4 }}>{c.chips.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="phero__vis cs__frame hero__a" style={{ '--i': 3 }}><div className="cs__stage"><CaseMock slug={c.slug} /></div></div>
        </div>
      </header>

      <SectionNav items={NAV} label="This case" />

      <Section id="summary" rule={false}>
        <Part n={1} name="Executive summary" head={S.head}>
          <div className="czx">
            <dl className="czx__f" data-reveal>
              {[['Primary business metric', S.metric], ['Product surface', S.surface], ['System built', S.system], ['Why it matters', S.why]].map(([k, v]) => <div key={k}><dt className="label">{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <aside className="cs__side czx__a" data-reveal>
              <p className="label">At a glance</p>
              <dl>
                <div><dt className="label">My role</dt><dd>{g.role}</dd></div>
                <div><dt className="label">Worked with</dt><dd>{g.team}</dd></div>
                <div><dt className="label">Built on</dt><dd>{g.stack.join(' · ')}</dd></div>
              </dl>
            </aside>
          </div>
        </Part>
      </Section>

      <Section id="problem" tone="alt"><Part n={2} name="The problem" head={c.problem.head} lead={c.problem.lead}><Leakage items={c.problem.items} /></Part></Section>
      <Section id="diagnosis"><Part n={3} name="Diagnosis" head={c.diagnosis.head} lead={c.diagnosis.lead}><Findings steps={c.diagnosis.steps} /></Part></Section>
      <Section id="shift" tone="alt"><Part n={4} name="The strategic shift" head={c.shift.head} lead={c.shift.lead}><Shift s={c.shift} /></Part></Section>
      <Section id="architecture"><Part n={5} name="Solution architecture" head={c.arch.head} lead={c.arch.lead}><Architecture a={c.arch} /></Part></Section>
      <Section id="workflow" tone="alt"><Part n={6} name="Workflow logic" head={c.flow.head} lead={c.flow.lead}><Chevrons steps={c.flow.steps} /></Part></Section>
      <Section id="requirements"><Part n={7} name="Product requirements" head={c.reqs.head}><Lenses items={c.reqs.items} /></Part></Section>
      <Section id="measurement" tone="alt"><Part n={8} name="Measurement design" head={c.measure.head} lead={c.measure.lead}><Measure m={c.measure} /></Part></Section>
      <Section id="rollout"><Part n={9} name="Rollout and governance" head={c.rollout.head} lead={c.rollout.lead}><Stairs steps={c.rollout.steps} /></Part></Section>
      <Section id="impact" tone="band"><Part n={10} name="Impact" head={c.impact.head} lead={c.impact.lead}><Impact i={c.impact} /></Part></Section>
      <Section id="playbook"><Part n={11} name="Reusable playbook" head={c.playbook.head} lead={c.playbook.lead}><Playbook p={c.playbook} /></Part></Section>

      <Section id="roqiva" tone="alt">
        <section className="cs__rq" data-reveal>
          <p className="label"><Icon name="branch" size={13} />What it became in ROQIVA</p>
          <h2 className="h-2">{br.became}</h2>
          <p className="cs__p">{br.d}</p>
          <dl className="cs__rqd">
            <div><dt className="label">Lane</dt><dd>{br.lane}</dd></div>
            <div><dt className="label">Who in ROQIVA</dt><dd>{br.agent}</dd></div>
          </dl>
          <LinkArrow to="/roqiva#origin">See where ROQIVA comes from</LinkArrow>
        </section>
        <nav className="cs__pn" aria-label="More cases">
          <a href={`/work/${prev.slug}`}><span className="label">Previous · {prev.n}</span><b>{prev.title}</b></a>
          <a href={`/work/${next.slug}`}><span className="label">Next · {next.n}</span><b>{next.title}</b></a>
        </nav>
      </Section>

      <Cta title="Want this *done on your system?*" lead="Tell me the number that will not move." primary={{ label: 'Send a brief', to: '/contact?intent=consult#brief' }} secondary={{ label: 'See all cases', to: '/work' }} />
    </PageMotion>
  )
}
