import { actors, status as statusMap, site } from '../content'
import { Icon } from './icons'
import { BriefThread } from './v5'
import { Kin } from './kin'
import { Shader } from '../system/Shader'
import { useTheme } from '../lib/theme'
export { Kin }

/** The site logo: the name in the display face, in the text colour of the theme. */
export function Wordmark() {
  return <span className="wordmark" aria-label={`${site.name} home`}>{site.name}</span>
}

export function Button({ to, href, onClick, variant = 'primary', size, className = '', track: ev, children, ...rest }) {
  if (ev) rest = { ...rest, 'data-track': ev }
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ''} ${className}`.trim()
  if (to) return <a className={cls} href={to} {...rest}>{children}</a>
  if (href) {
    const ext = /^https?:/.test(href)
    return <a className={cls} href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>{children}</a>
  }
  return <button type="button" className={cls} onClick={onClick} {...rest}>{children}</button>
}

export const Arrow = () => <Icon name="arrow" size={16} className="arrow" />

export function LinkArrow({ to, children }) {
  return <a className="link-arrow" href={to}>{children}<Icon name="arrow" size={15} /></a>
}

/** A page section on the shared grid. `tone="alt"` sits on the second background. */
/** `tone`: 'alt' (a quiet tint), or 'band' / 'sky' (an edge-to-edge grain-gradient background, for the sections a page leans on). */
export function Section({ id, tone, rule = true, className = '', children }) {
  return (
    <section id={id} className={`sec${tone ? ` sec--${tone}` : ''}${rule ? '' : ' sec--bare'} ${className}`.trim()}>
      <div className="container">{children}</div>
    </section>
  )
}

/** Section header: mono eyebrow, verb-first title, short lead. Left aligned, always. */
/** Headings mark their highlighted words with *asterisks* in the content. */
export function Rich({ text }) {
  if (typeof text !== 'string' || !/[*=]/.test(text)) return text
  return text.split(/(==[^=]+==)/).map((seg, j) => seg.startsWith('==') && seg.endsWith('==') && seg.length > 4
    ? <mark key={`h${j}`} className="kin-hl">{seg.slice(2, -2)}</mark>
    : seg.split('*').map((p, i) => (i % 2 ? <span key={`${j}-${i}`} className="em">{p}</span> : p)))
}

/** The same heading split into words for the scroll-lit statement, keeping the highlighted words. */
function scrubWords(text) {
  const out = []
  text.split('*').forEach((seg, si) => seg.split(/(\s+)/).forEach((w, wi) => {
    if (!w) return
    if (/^\s+$/.test(w)) { out.push(w); return }
    out.push(<span key={`${si}-${wi}`} className={`sw-w${si % 2 ? ' em' : ''}`}>{w}</span>)
  }))
  return out
}

export function Head({ eyebrow, title, lead, as: Tag = 'h2', id, scrub = false, children }) {
  return (
    <header className="head" data-reveal>
      {eyebrow && <p className="label eyebrow">{eyebrow}</p>}
      <Tag className={Tag === 'h1' ? 'h-hero' : 'h-2'} id={id} data-scrub={scrub || undefined}>
        {scrub && typeof title === 'string' ? scrubWords(title) : <Rich text={title} />}
      </Tag>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </header>
  )
}

/** The page hero for every page below the home page: a rounded shader stage (dawn in light, violet in dark),
    the title and its lead at the left, the page's own picture or window floating at the right. */
export function PageHero({ eyebrow, label, title, lead, children, visual, visualLive = false, variant = '', shader }) {
  const { theme } = useTheme()
  const preset = shader || (theme === 'dark' ? 'violet' : 'dawn')
  const dark = preset === 'violet'
  return (
    <header className={`ph2 ph2--${dark ? 'dark' : 'light'} ph2--${preset}${visual ? '' : ' ph2--solo'}${variant ? ' ph2--' + variant : ''}`}>
      <div className="ph2__card">
        <Shader preset={preset} className="ph2__bg" />
        <div className="ph2__copy">
          {(label || eyebrow) && <p className="s-label ph2__label">{label || <span>{eyebrow}</span>}</p>}
          <h1 className="ph2__t" data-kin data-kin-hero><Kin text={title} /></h1>
          {lead && <p className="ph2__lead">{lead}</p>}
          {children}
        </div>
        {visual && <div className="ph2__vis" aria-hidden={visualLive ? undefined : 'true'}>{visual}</div>}
      </div>
    </header>
  )
}

/** One status vocabulary for the whole site. */
export function Status({ id }) {
  const s = statusMap[id]
  if (!s) return null
  return <span className={`status status--${s.tone}`}>{s.label}</span>
}

/** Who acts: code, an agent or a person. */
export function Actor({ kind, label }) {
  const a = actors[kind]
  if (!a) return null
  return <span className={`actor actor--${kind}`} title={a.d}><i aria-hidden="true" />{label || a.label}</span>
}

/* ───────────── The closing panel: an ember shader edge to edge, the words on a white card, the brief thread beside it ───────────── */
export function Cta({ title, lead, primary, secondary, badges, topic }) {
  return (
    <section className="cl">
      <div className="cl__in" data-clip>
        <Shader preset="ember" className="cl__bg" />
        <div className="cl__copy" data-reveal>
          <h2 className="cl__h" data-kin><Kin text={title} /></h2>
          {lead && <p>{lead}</p>}
          <div className="cl__btns">
            <Button to={primary.to} track={`cta_${primary.to.replace(/\W+/g, '_')}`}>{primary.label}<Arrow /></Button>
            {secondary && <Button to={secondary.to} variant="ghost">{secondary.label}</Button>}
          </div>
          {badges && <ul className="cl__badges">{badges.map((b) => <li key={b}>{b}</li>)}</ul>}
        </div>
        <div className="cl__win" data-reveal><BriefThread topic={topic} /></div>
      </div>
    </section>
  )
}
