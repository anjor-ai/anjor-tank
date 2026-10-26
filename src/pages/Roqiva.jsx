import { RoqivaStage } from '../components/Story'
import { useEffect, useRef, useState } from 'react'
import { SplitText } from 'gsap/SplitText'
import { CASES, parts, roqiva as R, tracks, workflow } from '../content'
import { Icon } from '../components/icons'
import { Arrow, Button, Rich, Status } from '../components/ui'
import { Art, ArtCard } from '../components/Art'
import { FitPin } from '../components/Sticky'
import { MQ, ScrollTrigger, gsap, useGSAP } from '../lib/motion'
import { useCycle } from '../lib/useCycle'
import { useForcedTheme } from '../lib/theme'
import { PageMotion } from '../lib/PageMotion'
import { Stage, useWide } from '../showcase/primitives'
import { HeroApp } from '../scenes/HeroApp'
import { AuditScene, DecideScene, MonitorScene, ReleaseScene } from '../scenes/FlowScenes'
import { BuildStage } from '../scenes/BuildStage'
import { RoqivaFilm, RoqivaReel } from '../scenes/RoqivaIntro'
import { AsciiCanvas, DotCanvas } from '../art/ArtCanvas'
import { asciiLaunch, blueprint, COL, deploy, dust, stars } from '../art/space'

gsap.registerPlugin(SplitText)

/* ROQIVA, laid out as the tool it describes: one app window over the
   ROQIVA terrain: a sidebar with the sections as its menu, and the page as the window's content. Always dark.
   Without JavaScript, and under reduced motion, it is a complete, plain document: nothing hidden. */

const T = R.tool
const navH = () => document.querySelector('.nav')?.offsetHeight || 64
/** Where pinned things sit, in screen pixels: under the site nav and the window's own top bar. */
const pinTop = () => navH() + (document.querySelector('.rqtop')?.getBoundingClientRect().height || 0)
/** Desktops share one layout: the window is laid out at DESIGN px and scaled to the screen, so it looks the same at every size. */
const DESIGN = 1320
const DESK = 1180
const zoomFor = (w) => (w >= DESK ? Math.min(1.3, Math.max(0.8, (w * 0.92) / DESIGN)) : 1)

/* ───────── The horizon behind the window: it stays where it is while the page scrolls over it ───────── */
// Grainy dark hills with the ASCII launch and the ROQIVA wordmark on them. No text in the art.
const bdLaunch = (A, t) => asciiLaunch(A, t % 16, { x: 0.5, scale: 0.6, ground: 0.985 })
function Backdrop() {
  return (
    <div className="rqbd" aria-hidden="true">
      <div className="rqbd__pin">
        <i className="rqbd__hills" />
        <i className="rqbd__word" />
        <div className="rqbd__launch"><AsciiCanvas draw={bdLaunch} colors={LAUNCH_INK} font={8} fps={20} still={3.4} fromView /></div>
        <i className="rqbd__shade" />
      </div>
    </div>
  )
}

/* ───────── Sidebar: the sections are the menu ───────── */
function useSpy(ids) {
  const [cur, setCur] = useState(ids[0])
  const key = ids.join()
  useEffect(() => {
    const els = key.split(',').map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setCur(e.target.id) })
    }, { rootMargin: '-35% 0px -60% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  return cur
}
function go(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia(MQ.reduce).matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

function Sidebar({ cur, rail, onToggle }) {
  const [q, setQ] = useState('')
  const input = useRef(null)
  const list = T.menu.filter((m) => m.label.toLowerCase().includes(q.trim().toLowerCase()))
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (rail) onToggle(); setTimeout(() => input.current?.focus(), 30) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [rail, onToggle])
  return (
    <aside className="rqsb" aria-label="ROQIVA sections">
      <div className="rqsb__head">
        <span className="rqsb__name"><b>{R.name}</b><small>{T.sub}</small></span>
        <button type="button" className="rqsb__collapse" onClick={onToggle} aria-expanded={!rail} aria-label={rail ? 'Expand the sidebar' : 'Collapse the sidebar'}><Icon name="frame" size={16} /></button>
      </div>
      <label className="rqsb__search" onClick={() => { if (rail) { onToggle(); setTimeout(() => input.current?.focus(), 30) } }}>
        <Icon name="search" size={15} />
        <input ref={input} type="search" placeholder={T.search} value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && list[0]) { go(list[0].id); setQ(''); e.currentTarget.blur() } }} aria-label={T.search} />
        <kbd>⌘K</kbd>
      </label>
      <p className="rqsb__label">{T.menuLabel}</p>
      <ul className="rqsb__menu">
        {list.map((m) => (
          <li key={m.id}>
            <a href={`#${m.id}`} className="rqsb__item" title={rail ? m.label : undefined} aria-current={cur === m.id ? 'true' : undefined} onClick={(e) => { e.preventDefault(); go(m.id) }}>
              <Icon name={m.icon} size={16} /><span>{m.label}</span>
            </a>
          </li>
        ))}
        {!list.length && <li className="rqsb__none">No section matches.</li>}
      </ul>
      <p className="rqsb__label">{T.pinnedLabel}</p>
      <ul className="rqsb__pins">
        {T.pinned.map((p) => (
          <li key={p.label}><a href={`#${p.to}`} title={rail ? p.label : undefined} onClick={(e) => { e.preventDefault(); go(p.to) }}><i className={`rqsb__chip rqsb__chip--${p.tone}`}>{p.label[0]}</i><span>{p.label}</span><Icon name="pin" size={13} /></a></li>
        ))}
      </ul>
      <div className="rqsb__foot">
        <p className="label">{T.foot.label}</p>
        <p className="rqsb__ft"><i className="rqsb__live" />{T.foot.title}</p>
        <p className="rqsb__fd">{T.foot.d}</p>
        <Button to={T.foot.cta.to} size="sm">{T.foot.cta.label}<Arrow /></Button>
      </div>
    </aside>
  )
}
/** On a narrow screen the menu becomes a row of tabs across the top of the window. */
function Tabs({ cur }) {
  return (
    <nav className="rqtabs" aria-label="ROQIVA sections, as tabs">
      {T.menu.map((m) => (
        <a key={m.id} href={`#${m.id}`} aria-current={cur === m.id ? 'true' : undefined} onClick={(e) => { e.preventDefault(); go(m.id) }}><Icon name={m.icon} size={14} />{m.label}</a>
      ))}
    </nav>
  )
}

/* ───────── The window's top bar: it stays put; only its title follows the section in view ───────── */
function TopBar({ cur }) {
  const m = T.menu.find((x) => x.id === cur) || T.menu[0]
  return (
    <div className="rqtop">
      <p className="rqtop__crumb">{R.name}<i>/</i><b key={m.id} className="rqtop__t"><Icon name={m.icon} size={13} />{m.label}</b></p>
      <Status id="development" />
      <span className="rqtop__sp" />
      <span className="rqtop__step" aria-hidden="true">{T.menu.findIndex((x) => x.id === m.id) + 1} / {T.menu.length}</span>
      <Button to={T.foot.cta.to} size="sm" variant="ghost">{T.foot.cta.label}</Button>
    </div>
  )
}

/* ───────── One page of the tool ───────── */
function Page({ id, eyebrow, title, lead, children, className = '' }) {
  return (
    <section id={id} className={`rqpg ${className}`.trim()} aria-labelledby={`${id}-h`}>
      <div className="rqpg__body">
        {title && (
          <header className="rqpg__head" data-reveal>
            {eyebrow && <p className="label eyebrow">{eyebrow}</p>}
            <h2 className="h-2" id={`${id}-h`}><Rich text={title} /></h2>
            {lead && <p className="lead">{lead}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}

/* ───────── Overview: a dashboard, like the first screen of the tool ───────── */
const PART_TONE = { brain: 'v', detectors: 'o', orchestrator: 'b', drafting: 'p', monitor: 'g' }
const GATE_STEPS = workflow.steps.filter((s) => s.gate)
function Overview({ ready }) {
  const ref = useRef(null)
  const h = R.hero
  useGSAP(() => {
    if (!ready) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(ref)
      const split = SplitText.create(q('.rqov__t'), { type: 'words,chars', mask: 'words' })
      const tl = gsap.timeline({ defaults: { ease: 'eOut' }, delay: 0.25 })
      tl.from(q('.rqov__eyebrow'), { y: 10, autoAlpha: 0, duration: 0.45 })
        .from(split.chars, { yPercent: 110, duration: 0.7, stagger: 0.011 }, '-=0.2')
        .from(q('.rqov__lead, .rqov__btns, .rqov__facts'), { y: 14, autoAlpha: 0, stagger: 0.07, duration: 0.55 }, '-=0.4')
        .from(q('.rqov__num, .rqov__card'), { y: 24, autoAlpha: 0, stagger: 0.07, duration: 0.6 }, '-=0.35')
      q('.rqov__n').forEach((el) => {
        if (Number(el.dataset.n) > 0) tl.from(el, { textContent: 0, duration: 0.8, snap: { textContent: 1 }, ease: 'power2.out' }, 0.9)
      })
      return () => split.revert()
    })
    return () => mm.revert()
  }, { scope: ref, dependencies: [ready] })
  return (
    <section id="overview" className="rqpg rqov" ref={ref} aria-labelledby="overview-h">
      <div className="rqpg__body">
        <div className="rqov__hero">
          <p className="label eyebrow rqov__eyebrow">{h.eyebrow}</p>
          <p className="rqov__full"><b>{R.name}</b> · {R.fullName}</p>
          <h1 className="h-hero rqov__t" id="overview-h"><Rich text={h.title} /></h1>
          <p className="lead rqov__lead">{h.lead}</p>
          <div className="rqov__btns">
            <Button to={h.primary.to} track="cta_roqiva_hero">{h.primary.label}<Arrow /></Button>
            <Button to={h.secondary.to} variant="ghost">{h.secondary.label}</Button>
          </div>
          <ul className="rqov__facts">{h.facts.map((f) => <li key={f}><Icon name="lock" size={12} />{f}</li>)}</ul>
          <RoqivaStage />
        </div>
        <div className="rqov__grid">
          <div className="rqov__nums">
            <p className="rqov__cap label">{R.numbers.label}</p>
            {R.numbers.items.map((x) => (
              <div key={x.t} className="rqov__num">
                <span className="rqov__ico"><Icon name={x.icon} size={18} /></span>
                <span className="rqov__nt"><b className="rqov__n" data-n={x.n}>{x.n}</b><span>{x.t}</span><small>{x.d}</small></span>
              </div>
            ))}
          </div>
          <div className="rqov__card rqov__parts">
            <p className="rqov__ch">{R.partsCard.title}<Icon name="eye" size={14} /></p>
            <ul>
              {parts.items.filter((p) => PART_TONE[p.id]).map((p) => (
                <li key={p.id}><i className={`rqsb__chip rqsb__chip--${PART_TONE[p.id]}`}>{p.name[0]}</i><b>{p.name}</b><span>{p.kind}</span></li>
              ))}
            </ul>
            <a href="#parts" className="rqov__more" onClick={(e) => { e.preventDefault(); go('parts') }}><Icon name="arrow" size={13} />{R.partsCard.more}</a>
          </div>
          <div className="rqov__card rqov__gates">
            <p className="rqov__ch">{R.gatesCard.title}<Icon name="gate" size={14} /></p>
            <div className="rqov__tbl" role="table" aria-label={R.gatesCard.title}>
              <div role="row" className="rqov__tr rqov__th"><span role="columnheader">Gate</span><span role="columnheader">After</span><span role="columnheader">Who decides</span><span role="columnheader">What they do</span></div>
              {GATE_STEPS.map((s) => (
                <div role="row" key={s.n} className="rqov__tr">
                  <span role="cell"><code>{s.gate.n === '↻' ? 'Review' : `Gate ${s.gate.n}`}</code></span>
                  <span role="cell">{s.name}</span>
                  <span role="cell">{s.gate.who}</span>
                  <span role="cell" className="rqov__muted">{s.gate.does}</span>
                </div>
              ))}
            </div>
            <p className="rqov__note">{R.gatesCard.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────── Parts: an expanding horizontal carousel ───────── */
const PART_ART = { brain: 'brain', detectors: 'scan', orchestrator: 'gate', drafting: 'agent', monitor: 'prove', people: 'person', tools: 'lock' }
const PART_ICON = { brain: 'brain', detectors: 'radar', orchestrator: 'branch', drafting: 'agent', monitor: 'chart', people: 'person', tools: 'layers' }
function Parts() {
  const ref = useRef(null)
  const list = parts.items
  const [i, pick] = useCycle(list.length, 3800, ref)
  const ssr = typeof window === 'undefined'
  return (
    <div className="rqp" ref={ref} data-reveal>
      {list.map((p, k) => (
        <button key={p.id} type="button" className="rqp__panel" aria-expanded={ssr || i === k} onClick={() => pick(k)} onMouseEnter={() => pick(k)}>
          <span className="rqp__rail"><Icon name={PART_ICON[p.id]} size={16} /><span>{p.name}</span><em>0{k + 1}</em></span>
          <span className="rqp__open">
            <span className="rqp__art acard__art" aria-hidden="true"><Art art={PART_ART[p.id]} /></span>
            <span className="label">{p.kind}</span>
            <b className="h-3">{p.name}</b>
            <span className="rqp__d">{p.d}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

/* ───────── One work item: a step list that lights up as you scroll, beside one screen that changes ───────── */
const SCENES = [
  ['Detect', () => <AuditScene part="detect" />], ['Audit', () => <AuditScene part="audit" />], ['Decide', () => <DecideScene />],
  ['Build', () => <BuildStage />], ['Release', () => <ReleaseScene />], ['Measure', () => <MonitorScene />],
]
const STEPS = workflow.steps.map((s, k) => ({
  ...s,
  title: R.flow.titles[k],
  gateText: s.gate ? (s.gate.n === '↻' ? `Outcome review · ${s.gate.who}` : `Gate ${s.gate.n} · ${s.gate.who} ${s.gate.does}`) : 'No gate. The signal is logged.',
  visual: () => <Stage tone="soft" label={SCENES[k][0]}>{SCENES[k][1]()}</Stage>,
}))
function StepFlow() {
  const wide = useWide(DESK)
  const [i, setI] = useState(0)
  const ref = useRef(null)
  useGSAP(() => {
    if (!wide) return
    ScrollTrigger.create({
      trigger: ref.current, start: () => `top ${pinTop() + 4}px`, end: 'bottom bottom',
      onUpdate: (s) => setI(Math.min(STEPS.length - 1, Math.floor(s.progress * STEPS.length))),
    })
  }, { scope: ref, dependencies: [wide], revertOnUpdate: true })
  const jump = (k) => {
    const r = ref.current, pin = r.querySelector('.rqfl__pin')
    const box = r.getBoundingClientRect() // screen pixels, so the window's scale is included
    const span = box.height - pin.getBoundingClientRect().height
    const top = box.top + window.scrollY - pinTop() - 4
    window.scrollTo({ top: top + (span * (k + 0.5)) / STEPS.length, behavior: window.matchMedia(MQ.reduce).matches ? 'auto' : 'smooth' })
  }
  if (!wide) {
    return (
      <ol className="rqfl rqfl--stack">
        {STEPS.map((s) => (
          <li key={s.n} className="rqfl__row" data-reveal>
            <p className="label eyebrow">Step {s.n} · {s.who}</p>
            <h3 className="h-3"><Rich text={s.title} /></h3>
            <p className="rqfl__does">{s.does}</p>
            <p className="rqfl__gate"><Icon name="gate" size={13} />{s.gateText}</p>
            <div className="rqfl__inline">{s.visual()}</div>
          </li>
        ))}
      </ol>
    )
  }
  const s = STEPS[i]
  return (
    <div className="rqfl rqfl--wide" ref={ref} style={{ '--n': STEPS.length }}>
      <div className="rqfl__pin">
        <ol className="rqfl__list" aria-label="The six steps">
          {STEPS.map((x, k) => (
            <li key={x.n} data-on={k === i ? 'true' : undefined}>
              <button type="button" onClick={() => jump(k)} aria-current={k === i ? 'step' : undefined}>
                <i className="rqfl__dot" /><span className="rqfl__name">{x.name}</span><span className="rqfl__n">{x.n}</span>
              </button>
              {k === i && (
                <div className="rqfl__detail">
                  <h3 className="rqfl__t"><Rich text={x.title} /></h3>
                  <p className="rqfl__who">{x.who}</p>
                  <p className="rqfl__does">{x.does}</p>
                  <p className="rqfl__gate"><Icon name="gate" size={13} />{x.gateText}</p>
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className="rqfl__vis">
          <FitPin design={1000} cap={112}><div className="rqfl__frame" key={s.n}>{s.visual()}</div></FitPin>
          <span className="rqfl__prog" aria-hidden="true">{STEPS.map((x, k) => <i key={x.n} className={k <= i ? 'is-on' : ''} />)}</span>
        </div>
      </div>
    </div>
  )
}

// The banner: a launch, for every decision that ships
const LAUNCH_INK = [null, '#faf9f5', '#ffd3a8', '#b9b3a7', '#6f6a62']
const banLaunch = (A, t) => asciiLaunch(A, t % 14, { x: 0.5, scale: 0.6, ground: 0.99 })
const banStars = (D, t) => { const R = { x0: 0, y0: 0, w: D.cols, h: D.rows }; stars(D, t, R, { density: 0.01, drift: 0.2 }); dust(D, t, R, { amt: 0.3, c: COL.dim, vx: 0.8 }) }

/* ───────── The principle: one banner, three lines, the terrain moving behind them ───────── */
function Principle() {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(ref)
      q('.rqban__l').forEach((el, k) => {
        gsap.fromTo(el, { xPercent: k % 2 ? 8 : -8, opacity: 0.2 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'center 55%', scrub: 0.5 } })
      })
    })
    return () => mm.revert()
  }, { scope: ref })
  return (
    <div className="rqban" ref={ref}>
      <div className="rqban__bg" aria-hidden="true">
        <DotCanvas draw={banStars} cell={4} fps={16} still={2} />
        <div className="rqban__launch"><AsciiCanvas draw={banLaunch} colors={LAUNCH_INK} font={8} fps={24} still={3.6} fromView /></div>
      </div>
      <div className="rqban__in">
        {R.rule.map((t, k) => <p key={t} className={`rqban__l rqban__l--${k}`}><span className="rqban__k">{['code', 'agent', 'person'][k]}</span>{t}</p>)}
      </div>
    </div>
  )
}

/* ───────── Your accounts: who sits where, in three zones, then what that means in four short cards ───────── */
function Accounts() {
  const A = R.accounts
  return (
    <div className="rqacc">
      <div className="rqacc__map" data-reveal>
        <div className="rqacc__zone rqacc__zone--out">
          <p className="rqacc__lab">{A.out.label}</p>
          <p className="rqacc__name">{A.out.name}</p>
          <ul className="rqacc__does">{A.out.does.map((d) => <li key={d}><Icon name="check" size={13} />{d}</li>)}</ul>
        </div>
        <span className="rqacc__arrow" aria-hidden="true"><i /><Icon name="arrow" size={16} /></span>
        <div className="rqacc__zone rqacc__zone--in">
          <p className="rqacc__lab"><Icon name="lock" size={12} />{A.in.label}</p>
          <p className="rqacc__name">{R.name}</p>
          <ul className="rqacc__mods">{A.in.parts.map((m) => <li key={m}>{m}</li>)}</ul>
          <div className="rqacc__reads">
            <span className="rqacc__rl"><Icon name="eye" size={13} />{A.in.reads}</span>
            <ul>{A.in.tools.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
        <span className="rqacc__arrow rqacc__arrow--own" aria-hidden="true"><i /></span>
        <div className="rqacc__zone rqacc__zone--own">
          <p className="rqacc__lab">{A.own.label}</p>
          <ul className="rqacc__keeps">{A.own.items.map((x) => <li key={x.t}><Icon name={x.icon} size={16} /><span><b>{x.t}</b>{x.d}</span></li>)}</ul>
        </div>
      </div>
      <ul className="rqacc__cards">
        {A.cards.map((c, k) => (
          <li key={c.t} className="rqacc__card" data-reveal>
            <span className="rqacc__n">0{k + 1}</span>
            <h3 className="h-4">{c.t}</h3>
            <p>{tracks.c.differs[k]}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ───────── Ways in: two cards with the terrain, after the reading-app references ───────── */
const WAY_STATUS = ['development', 'planned']
// C1: a blueprint drawn, then built on the brand's own stack. C2: one package dropped into the brand's cloud, unpacked and running.
const wayC1 = (D, t) => blueprint(D, t, { x0: 0, y0: 0, w: D.cols, h: D.rows })
const wayC2 = (D, t) => deploy(D, t, { x0: 0, y0: 0, w: D.cols, h: D.rows })
function Ways() {
  const C = tracks.c.ways
  const row = (label) => C.rows.find((r) => r[0].toLowerCase().startsWith(label))
  const stats = ['who builds', 'needs from the brand', 'ready'].map(row).filter(Boolean)
  return (
    <div className="rqw">
      {[1, 2].map((k) => {
        const [code, name] = C.cols[k].split(' · ')
        return (
          <article key={k} className="rqw__card rqw__card--2" data-reveal>
            <div className="rqw__img" aria-hidden="true"><DotCanvas draw={k === 1 ? wayC1 : wayC2} cell={3} fps={18} still={k === 1 ? 7.3 : 5} /></div>
            <div className="rqw__top"><span className="rqw__code">{code}</span><Status id={WAY_STATUS[k - 1]} /></div>
            <div className="rqw__body">
              <h3 className="h-3">{name}</h3>
              <p className="rqw__what">{C.rows[0][k]}</p>
              <dl className="rqw__stats">{stats.map((r) => <div key={r[0]}><dt>{r[0]}</dt><dd>{r[k]}</dd></div>)}</dl>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/* ───────── Origin: why I am building it. Four of the cases it comes from, and who is building it ───────── */
function Origin() {
  const O = R.origin
  return (
    <div className="rqor">
      <ul className="rqor__cards">
        {O.cards.map((c, k) => {
          const cs = CASES.find((x) => x.slug === c.slug)
          return (
            <li key={c.slug} className="rqor__card" data-reveal>
              <span className="rqor__n">0{k + 1}</span>
              <p className="label">{c.lane}</p>
              <h3 className="h-4">{c.t}</h3>
              <p>{c.d}</p>
              <a className="rqor__a" href={`/work/${c.slug}`}>From the case: {cs.title}<Icon name="arrow" size={13} /></a>
            </li>
          )
        })}
      </ul>
      <aside className="rqor__who" data-reveal>
        <span className="rqor__av" aria-hidden="true">AT</span>
        <div>
          <p className="label">{O.founder.role} · {O.founder.who}</p>
          <p>{O.founder.d}</p>
          <Button to={O.founder.cta.to} variant="ghost" size="sm">{O.founder.cta.label}<Arrow /></Button>
        </div>
      </aside>
    </div>
  )
}

const RULE_ART = ['agent', 'check', 'shield', 'ship', 'brain']

export default function Roqiva() {
  useForcedTheme('dark')
  // How the page opens: the film on a direct visit or a reload, the word reel when arriving from another page of the site,
  // nothing under reduced motion. The window opens when the intro hands over.
  const [intro, setIntro] = useState(() => {
    try {
      if (!window.matchMedia(MQ.motion).matches) return null
      if (window.__OI_TEST__ && sessionStorage.getItem('rq-film') === '1') return null // test runs skip it
      return window.__oiNav ? 'reel' : 'film'
    } catch (e) { return null }
  })
  const [ready, setReady] = useState(() => !intro)
  const reveal = () => setReady(true)
  const finish = () => { setReady(true); setIntro(null); requestAnimationFrame(() => ScrollTrigger.refresh()) }
  useEffect(() => { const id = requestAnimationFrame(() => ScrollTrigger.refresh()); return () => cancelAnimationFrame(id) }, [])

  const shell = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(shell)
      if (!ready) { gsap.set(q('.rqt'), { autoAlpha: 0 }); return }
      gsap.fromTo(q('.rqt'), { y: 70, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 1.1, ease: 'expo.out', clearProps: 'transform' })
      gsap.fromTo(q('.rqbd__hills'), { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'expo.out' })
      // the wordmark and the launch come up as the window scrolls off the horizon
      gsap.fromTo(q('.rqbd__word, .rqbd__launch'), { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: q('.rqt')[0], start: 'bottom 98%', end: 'bottom 45%', scrub: true } })
    })
    return () => mm.revert()
  }, { scope: shell, dependencies: [ready] })

  const cur = useSpy(T.menu.map((m) => m.id))
  // The sidebar is open on every desktop, so every desktop shows the same layout. Its button folds it to an icon rail.
  const [rail, setRail] = useState(false)
  const toggleRail = () => { setRail((r) => !r); setTimeout(() => ScrollTrigger.refresh(), 450) }
  // One layout for every desktop: scale the window to the screen.
  const [z, setZ] = useState(1)
  useEffect(() => {
    const fit = () => setZ(zoomFor(window.innerWidth))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  useEffect(() => { const id = setTimeout(() => ScrollTrigger.refresh(), 120); return () => clearTimeout(id) }, [z])
  const C = tracks.c
  return (
    <PageMotion routeKey="/roqiva">
      <div className="roq" ref={shell} data-z={z !== 1 ? '' : undefined} style={{ '--z': z }}>
        {intro === 'film' && <RoqivaFilm onReveal={reveal} onDone={finish} />}
        {intro === 'reel' && <RoqivaReel onReveal={reveal} onDone={finish} />}
        <Backdrop />
        <div className="rqt" data-rail={rail ? 'true' : undefined}>
          <Sidebar cur={cur} rail={rail} onToggle={toggleRail} />
          <div className="rqt__main">
            <TopBar cur={cur} />
            <Tabs cur={cur} />
            <Overview ready={ready} />

            <Page id="origin" eyebrow={R.origin.eyebrow} title={R.origin.title} lead={R.origin.lead}>
              <Origin />
            </Page>

            <Page id="workspace" eyebrow={R.open.eyebrow} title={R.open.title} lead={R.open.lead}>
              <div className="rqws" data-reveal><HeroApp brand="ROQIVA" /></div>
            </Page>

            <Page id="parts" eyebrow={R.parts.eyebrow} title={R.parts.title} lead={R.parts.lead}>
              <Parts />
            </Page>

            <Page id="flow" eyebrow={R.flow.eyebrow} title={R.flow.title} lead={workflow.note}>
              <StepFlow />
            </Page>

            <Page id="principle" eyebrow={R.principle.eyebrow} title={R.principle.title} lead={R.principle.lead}>
              <Principle />
            </Page>

            <Page id="stack" eyebrow={R.inside.eyebrow} title={R.inside.title} lead={R.inside.lead}>
              <Accounts />
            </Page>

            <Page id="ways" eyebrow={R.ways.eyebrow} title={R.ways.title} lead={C.ways.note}>
              <Ways />
            </Page>

            <Page id="rules" eyebrow={R.promises.eyebrow} title={R.promises.title}>
              <ul className="acards acards--3">
                {C.rules.map((r, k) => <ArtCard key={r} ascii art={RULE_ART[k]} label={`0${k + 1}`} t={r} />)}
              </ul>
            </Page>

            <section className="rqpg rqcta" aria-labelledby="rq-cta-h">
              <div className="rqcta__in" data-reveal>
                <p className="rqcta__name">{R.name}</p>
                <h2 className="h-2" id="rq-cta-h"><Rich text={R.cta.title} /></h2>
                <p className="lead">{R.cta.lead}</p>
                <div className="rqov__btns">
                  <Button to={R.cta.primary.to} track="cta_roqiva_end">{R.cta.primary.label}<Arrow /></Button>
                  <Button to={R.cta.secondary.to} variant="ghost">{R.cta.secondary.label}</Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageMotion>
  )
}
