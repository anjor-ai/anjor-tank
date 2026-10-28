import { CASES, GLANCE, bridge } from '../content'
import { Cta, LinkArrow } from '../components/ui'
import { ArchWire, CaseDock, DashWire, Storyboard } from '../components/v5'
import { CaseMock } from '../components/mocks'
import { Stat } from '../components/kinetic'
import { Architecture, Chevrons, Findings, Impact, Leakage, Lenses, Measure, Part, Playbook, Shift, Stairs, Summary } from '../components/casekit'
import { Icon } from '../components/icons'
import { Chip, Easel, KSection, TINTS, Tile } from '../components/kit'
import { PAINTS, Paint } from '../components/paint'
import { PageMotion } from '../lib/PageMotion'
import { useRoute } from '../lib/router'

/* One case study, in the same eleven parts every time, each drawn as a small product window or a bento. Then the line back to ROQIVA. */

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
  const tint = TINTS[i % TINTS.length]
  const prev = CASES[(i - 1 + CASES.length) % CASES.length], next = CASES[(i + 1) % CASES.length]
  return (
    <PageMotion routeKey={route.path}>
      <header className="p-hero p-hero--case">
        <div className="p-hero__in">
          <div className="p-hero__copy">
            <p className="s-label"><b>{c.n}</b><span>{c.cat}</span><em>Case study</em></p>
            <h1 className="p-hero__t">{c.title}</h1>
            <p className="p-hero__lead">{c.hook}</p>
            <ul className="p-hero__nums">{c.metrics.map(([v, l]) => <li key={l}><b><Stat v={v} /></b><span>{l}</span></li>)}</ul>
            <ul className="k-chips">{c.chips.map((t) => <li key={t}><Chip>{t}</Chip></li>)}</ul>
          </div>
          <div className="p-hero__stage">
            <Paint name={PAINTS[(parseInt(c.n, 10) - 1) % PAINTS.length]} fit="bleed" className="p-hero__paint p-hero__paint--case">
              <div className="p-hero__mock"><CaseMock slug={c.slug} /></div>
            </Paint>
          </div>
        </div>
      </header>

      <CaseDock items={NAV} />

      <KSection id="summary"><Part n={1} name="Executive summary" head={S.head}><Summary S={S} g={g} tint={tint} /></Part></KSection>
      <KSection id="problem" tone="soft"><Part n={2} name="The problem" head={c.problem.head} lead={c.problem.lead}><Easel paint="dawn" fit="bleed" className="cs-ea"><Leakage items={c.problem.items} /></Easel></Part></KSection>
      <KSection id="diagnosis"><Part n={3} name="Diagnosis" head={c.diagnosis.head} lead={c.diagnosis.lead}><Easel paint="noon" fit="bleed" className="cs-ea"><Findings steps={c.diagnosis.steps} /></Easel></Part></KSection>
      <KSection id="shift" tone="soft"><Part n={4} name="The strategic shift" head={c.shift.head} lead={c.shift.lead}><Shift s={c.shift} /></Part></KSection>
      <KSection id="architecture"><Part n={5} name="Solution architecture" head={c.arch.head} lead={c.arch.lead}><Easel paint="night" fit="center" className="cs-ea cs-ea--wide"><ArchWire parts={c.arch.parts} /></Easel><Architecture a={c.arch} /></Part></KSection>
      <KSection id="workflow" tone="soft"><Part n={6} name="Workflow logic" head={c.flow.head} lead={c.flow.lead}><Easel paint="meadow" fit="center" className="cs-ea cs-ea--wide"><Storyboard steps={c.flow.steps} /></Easel><Chevrons steps={c.flow.steps} /></Part></KSection>
      <KSection id="requirements"><Part n={7} name="Product requirements" head={c.reqs.head}><Lenses items={c.reqs.items} /></Part></KSection>
      <KSection id="measurement" tone="soft"><Part n={8} name="Measurement design" head={c.measure.head} lead={c.measure.lead}><div className="cs-measure"><Measure m={c.measure} /><Easel paint="dusk" fit="center" className="cs-ea"><DashWire m={c.measure} /></Easel></div></Part></KSection>
      <KSection id="rollout"><Part n={9} name="Rollout and governance" head={c.rollout.head} lead={c.rollout.lead}><Stairs steps={c.rollout.steps} /></Part></KSection>
      <KSection id="impact" tone="soft"><Part n={10} name="Impact" head={c.impact.head} lead={c.impact.lead}><Impact i={c.impact} /></Part></KSection>
      <KSection id="playbook"><Part n={11} name="Reusable playbook" head={c.playbook.head} lead={c.playbook.lead}><Playbook p={c.playbook} /></Part></KSection>

      <KSection id="roqiva" tone="soft">
        <Tile tint="ink" className="cs-bridge">
          <p className="s-k"><Icon name="branch" size={14} /><span>What it became in ROQIVA</span></p>
          <h2>{br.became}</h2>
          <p>{br.d}</p>
          <dl>
            <div><dt>Lane</dt><dd>{br.lane}</dd></div>
            <div><dt>Who in ROQIVA</dt><dd>{br.agent}</dd></div>
          </dl>
          <LinkArrow to="/roqiva#origin">See where ROQIVA comes from</LinkArrow>
        </Tile>
        <nav className="cs-pn" aria-label="More cases">
          {[[prev, 'Previous'], [next, 'Next']].map(([x, w]) => (
            <a key={w} href={`/work/${x.slug}`} data-reveal><span>{w} · {x.n}</span><b>{x.title}</b><Icon name="arrow" size={16} /></a>
          ))}
        </nav>
      </KSection>

      <Cta topic="work" title="Want this *done on ==your system==?*" lead="Tell me the number that will not move." primary={{ label: 'Send a brief', to: '/contact?intent=consult#brief' }} secondary={{ label: 'See all cases', to: '/work' }} />
    </PageMotion>
  )
}
