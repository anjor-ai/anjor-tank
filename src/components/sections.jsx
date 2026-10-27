import { useState } from 'react'
import { CASES, home } from '../content'
import { Icon } from './icons'
import { Arrow, Button, LinkArrow } from './ui'
import { CaseMock } from './mocks'
import { Stat } from './kinetic'
import { Chip, Dot, DotMap, Flow, Gantt, KHead, KSection, ListTabs, TINTS, Tile, cx, useClock } from './kit'

/* Sections shared by Home and Work, composed from the kit: the case tiles, how I think, the story so far, consulting and beyond. */


/** One case as a tile: the product illustration peeking in, the number, the two headline metrics.
    With `onOpen` the tile opens the quick view; without it the whole tile is the link to the full case. */
export function CaseTile({ c, onOpen, size = 'third', className }) {
  const tint = TINTS[(parseInt(c.n, 10) - 1) % TINTS.length]
  const full = `/work/${c.slug}`
  return (
    <article className={cx('k-tile k-case', `k-tile--${tint}`, `k-case--${size}`, className)} data-reveal>
      <div className="k-case__peek" aria-hidden="true"><div className="k-case__in"><CaseMock slug={c.slug} /></div><span className="k-case__tag">Illustration · sample data</span></div>
      <div className="k-case__body">
        <p className="k-tile__k"><b>{c.n}</b><span>{c.cat}</span></p>
        <h3>
          {onOpen
            ? <button type="button" className="k-case__stretch" onClick={() => onOpen(c.slug)}>{c.title}</button>
            : <a className="k-case__stretch" href={full}>{c.title}</a>}
        </h3>
        <ul className="k-case__m">{c.metrics.slice(0, size === 'lg' || size === 'half' ? 3 : 2).map(([v, l]) => <li key={l}><b><Stat v={v} /></b><span>{l}</span></li>)}</ul>
        {(size === 'lg' || size === 'half') && <ul className="k-chips">{c.chips.map((t) => <li key={t}><Chip>{t}</Chip></li>)}</ul>}
        <p className="k-case__acts">
          {onOpen && <span className="k-case__quick"><Icon name="eye" size={14} />Quick view</span>}
          {onOpen ? <a className="k-case__full" href={full}>Full case<Icon name="arrow" size={14} /></a> : <span className="k-case__full">Open the case<Icon name="arrow" size={14} /></span>}
        </p>
      </div>
    </article>
  )
}

/** Home: three rows of two, alternating wide and narrow, so the eye zig-zags down the six systems. */
export function WorkBento({ onOpen }) {
  const [a, b, c, d, e, f] = CASES
  return (
    <div className="k-bento k-bento--work">
      <CaseTile c={a} onOpen={onOpen} size="lg" className="k-c7" />
      <CaseTile c={b} onOpen={onOpen} size="md" className="k-c5" />
      <CaseTile c={c} onOpen={onOpen} size="md" className="k-c5" />
      <CaseTile c={d} onOpen={onOpen} size="lg" className="k-c7" />
      <CaseTile c={e} onOpen={onOpen} size="half" className="k-c6" />
      <CaseTile c={f} onOpen={onOpen} size="half" className="k-c6" />
    </div>
  )
}

/* ───────── How I think: the question, the real product illustration, the result ───────── */

const THINK = [
  { slug: 'price-lock-checkout', title: 'What happens when an order changes after payment?', sub: 'Keep the promise made at checkout.', tint: 'peach', result: '+12.5pp', metric: 'prepaid conversion', rule: 'Committed price preserved' },
  { slug: 'search-discovery', title: 'Should a typo ever become a lost order?', sub: 'Understand the query before ranking the results.', tint: 'sky', result: '+9%', metric: 'search-to-order conversion', rule: 'Intent matched and results ranked' },
  { slug: 'retention-reminders', title: 'When does a reminder become genuinely useful?', sub: 'Match the reminder to the reorder window.', tint: 'mint', result: '~1,100', metric: 'additional repeat orders a day', rule: 'Reorder cadence identified' },
]

/** Three dotted-grid cards with line art: find, decide, close the loop. One accent element each. */
function MethodArt({ kind }) {
  const cube = (x, y, s, on) => (
    <g key={`${x}-${y}`} className={on ? 'is-on' : ''}>
      <path d={`M${x} ${y - s} L${x + s * 0.87} ${y - s / 2} L${x} ${y} L${x - s * 0.87} ${y - s / 2}Z`} />
      <path d={`M${x - s * 0.87} ${y - s / 2} V${y + s / 2} L${x} ${y + s} V${y}`} />
      <path d={`M${x + s * 0.87} ${y - s / 2} V${y + s / 2} L${x} ${y + s}`} />
    </g>
  )
  if (kind === 'find') return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      {[104, 80, 56].map((y, i) => <path key={y} className={i === 1 ? 'is-fill' : ''} d={`M120 ${y - 24} L180 ${y} L120 ${y + 24} L60 ${y}Z`} />)}
      <path className="is-dash" d="M120 20 V122" /><circle className="is-dot" cx="120" cy="80" r="5.5" />
    </svg>
  )
  if (kind === 'decide') return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      <path className="is-dash" d="M120 72 L66 100 M120 72 L174 100 M120 72 V34" />
      {cube(120, 56, 20, true)}{cube(60, 112, 18, false)}{cube(180, 112, 18, false)}
    </svg>
  )
  return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      <circle className="is-dash" cx="120" cy="75" r="46" />
      {[[120, 29], [166, 75], [120, 121], [74, 75]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 7} y={y - 7} width="14" height="14" rx="4" />)}
      <g className="k-orbit"><circle className="is-dot" cx="166" cy="75" r="5.5" /></g>
    </svg>
  )
}

export function MethodTrio() {
  const items = [['find', 'Find the real problem.', 'Follow the friction across the journey, not just the screen.'], ['decide', 'Make the difficult call.', 'Turn the evidence into a decision with clear guardrails.'], ['loop', 'Close the loop.', 'Ship, measure the outcome, and use it to shape the next move.']]
  return (
    <ul className="k-trio">
      {items.map(([k, t, d], i) => (
        <li key={k} className="k-art" data-reveal>
          <span className="k-art__n">{String(i + 1).padStart(2, '0')}</span>
          <div className="k-art__fig"><MethodArt kind={k} /></div>
          <h3>{t}</h3><p>{d}</p>
        </li>
      ))}
    </ul>
  )
}

export function ThinkingSection() {
  return (
    <KSection id="method" tone="soft">
      <KHead n="02" label="How I think" tag="Product decisions" title="A great interface is just" sub="the visible part." lead="The product is the decision beneath it. I connect customer experience with the systems that deliver it, and the metrics that prove it worked." />
      <ListTabs items={THINK} label="Product decisions">
        {(s) => (
          <Tile tint={s.tint} className="k-think" reveal={false}>
            <div className="k-think__fig"><CaseMock slug={s.slug} /></div>
            <a className="k-think__res" href={`/work/${s.slug}`}>
              <b>{s.result}</b><span>{s.metric}</span><em>Read the case<Arrow /></em>
            </a>
          </Tile>
        )}
      </ListTabs>
      <MethodTrio />
    </KSection>
  )
}

/* ───────── The story so far: a roadmap, a photo, where I am now ───────── */

export const CAREER_ROWS = [
  { label: 'Eggfirst', sub: 'Client services · 2022', a: 2022.25, b: 2022.75, tone: 'butter' },
  { label: 'Neil Patel Digital', sub: 'Management trainee · 2023', a: 2023.67, b: 2023.95, tone: 'sky' },
  { label: 'Truemeds', sub: 'Associate PM · 2023 to 2026', a: 2023.92, b: 2026.5, tone: 'peach' },
  { label: 'GNC India', sub: 'Product Manager · Oct 2026', a: 2026.75, b: 2026.82, tone: 'mint', open: true },
  { label: 'ROQIVA', sub: 'Founder · in development', a: 2026.0, b: 2026.82, tone: 'accent', open: true },
]
export const NOW = 2026.82

export function CareerSection() {
  const t = useClock()
  return (
    <KSection id="journey">
      <KHead n="03" label="The story so far" tag="Three chapters" title="From understanding demand" sub="to building what delivers it." lead="Different roles. One growing curiosity about how products and businesses really work." />
      <div className="k-bento k-bento--career">
        <Tile className="k-c4 k-r2 k-photo" reveal>
          <img src="/img/anjor.webp" width="447" height="721" alt="Anjor Tank" loading="lazy" decoding="async" />
          <p className="k-photo__cap"><b>Anjor Tank</b><span>Curiosity is the through line.</span></p>
        </Tile>
        <Tile className="k-c8 k-career__road">
          <p className="k-tile__k"><span>Roles on one timeline</span></p>
          <Gantt rows={CAREER_ROWS} from={2022} to={2027} ticks={[2022, 2023, 2024, 2025, 2026, 2027]} now={NOW} caption="Roles on one timeline, 2022 to now" />
          <LinkArrow to="/journey">The story so far</LinkArrow>
        </Tile>
        <Tile tint="mint" className="k-c4 k-now">
          <p className="k-tile__k"><Dot />Right now</p>
          <h3>Product Manager, GNC India.</h3>
          <p>Founding ROQIVA, a system in development.</p>
        </Tile>
        <Tile tint="lilac" className="k-c4 k-where">
          <p className="k-tile__k"><span>Based in</span></p>
          <DotMap city="Mumbai" caption="Dotted map with a pin on Mumbai" />
          <p className="k-where__t"><b>Mumbai</b><span>{t || 'India'}</span></p>
        </Tile>
      </div>
    </KSection>
  )
}

/* ───────── Consulting: signals in, a decision layer, outputs ───────── */

export function ConsultSection() {
  return (
    <KSection id="consulting" tone="soft">
      <KHead n="04" label="Consulting" tag="GTM engineering and RevOps" title="Growth often breaks" sub="between tools." lead="My consulting work combines GTM engineering and RevOps: find where the commercial journey leaks, engineer the missing operating loop, and prove the lift." />
      <div className="k-bento k-bento--consult">
        <Tile tint="sky" className="k-c8 k-r2 k-flowtile">
          <p className="k-tile__k"><span>Signal, decision, execution</span></p>
          <Flow label="Product, CRM and analytics signals flow into one decision layer, then into finding the leak, fixing the loop and proving the lift"
            left={[{ icon: 'grid', label: 'Product' }, { icon: 'users', label: 'CRM' }, { icon: 'chart', label: 'Analytics' }]}
            hub={{ label: 'Decision layer', sub: 'GTM · RevOps' }}
            right={[{ icon: 'search', label: 'Find the leak' }, { icon: 'bolt', label: 'Fix the loop' }, { icon: 'check', label: 'Prove the lift' }]} />
        </Tile>
        <Tile className="k-c4"><p className="k-tile__k"><b>01</b>GTM engineering</p><h3>Find the leak.</h3><p>Instrument the journey, recover intent and connect acquisition with conversion.</p></Tile>
        <Tile className="k-c4"><p className="k-tile__k"><b>02</b>RevOps</p><h3>Connect the handoffs.</h3><p>Govern data, decision rules and the handoffs between the people and tools that deliver.</p></Tile>
        <Tile tint="ink" className="k-c12 k-bar">
          <div><p className="k-tile__k"><Dot tone="accent" />ROQIVA · Intelligence layer · in development</p><h3>The product I am founding to make the method repeatable.</h3></div>
          <div className="k-bar__btns"><Button to="/hire">Explore consulting <Arrow /></Button><Button to="/contact?intent=consult#brief" variant="ghost">Discuss a project</Button></div>
        </Tile>
      </div>
    </KSection>
  )
}

/* ───────── Beyond: three doors, one image that follows the pointer ───────── */

const DOORS = [
  { img: 'waterfall', k: 'Wander', cap: 'The long way round.', alt: 'Waterfall over rocks with green hills', to: '/beyond#scene-wander' },
  { img: 'kart-night', k: 'Speed', cap: 'Speed and focus.', alt: 'A go-kart cornering under floodlights at night', to: '/beyond#scene-speed' },
  { img: 'stage-unreal', k: 'Live', cap: 'The energy of a crowd.', alt: 'A crowd with phones raised in front of a stage screen', to: '/beyond#scene-live' },
]

export function BeyondDoors() {
  const [i, setI] = useState(0)
  return (
    <KSection id="beyond">
      <KHead n="05" label="Beyond work" tag="The person outside product" title="Away from the roadmap," sub="still curious." lead="Karting, music, travel and the occasional detour. I care about how things work, and about experiencing them for myself." />
      <div className="k-doors">
        <div className="k-doors__img" aria-hidden="true">
          {DOORS.map((d, k) => <img key={d.img} className={k === i ? 'is-on' : ''} src={`/img/adventure/${d.img}.webp`} alt="" loading="lazy" decoding="async" />)}
          <span className="k-doors__tag">0{i + 1} / {DOORS[i].k}</span>
        </div>
        <ul className="k-doors__list">
          {DOORS.map((d, k) => (
            <li key={d.k}>
              <a href={d.to} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} aria-label={`${d.k}: ${d.cap}`} className={k === i ? 'is-on' : ''}>
                <img src={`/img/adventure/${d.img}.webp`} alt={d.alt} loading="lazy" decoding="async" />
                <span><small>0{k + 1}</small><b>{d.k}</b><em>{d.cap}</em></span>
                <Icon name="arrow" size={16} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </KSection>
  )
}
