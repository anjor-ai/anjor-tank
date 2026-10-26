import { useId, useState } from 'react'
import { actors, status as statusMap, site } from '../content'
import { Icon } from './icons'

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
  if (typeof text !== 'string' || !text.includes('*')) return text
  return text.split('*').map((p, i) => (i % 2 ? <span key={i} className="em">{p}</span> : p))
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

/** Hero for every page below the home page. The entrance is CSS (.hero__a), because the intro film pauses it until it closes. */
export function PageHero({ eyebrow, title, lead, children, visual, visualLive = false }) {
  return (
    <header className={`phero${visual ? ' phero--split' : ''}`}>
      <div className="container phero__in">
        <div className="phero__copy">
          {eyebrow && <p className="label eyebrow hero__a" style={{ '--i': 0 }}>{eyebrow}</p>}
          <h1 className="h-hero hero__a" style={{ '--i': 1 }}><Rich text={title} /></h1>
          {lead && <p className="lead hero__a" style={{ '--i': 2 }}>{lead}</p>}
          {children}
        </div>
        {visual && <div className="phero__vis hero__a" style={{ '--i': 3 }} aria-hidden={visualLive ? undefined : 'true'}>{visual}</div>}
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

/** Accessible accordion. `items` are { id, q, body }. One panel open at a time. */
export function Accordion({ items, first = -1, label }) {
  const [open, setOpen] = useState(first)
  const base = useId()
  return (
    <div className="acc" role="group" aria-label={label}>
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.id || it.q} className={`acc__item${on ? ' is-open' : ''}`}>
            <h3 className="acc__h">
              <button type="button" className="acc__btn" aria-expanded={on} aria-controls={`${base}-p${i}`} id={`${base}-b${i}`} onClick={() => setOpen(on ? -1 : i)}>
                <span className="acc__q">{it.q}</span>
                {it.tag && <span className="label acc__tag">{it.tag}</span>}
                <span className="acc__ico" aria-hidden />
              </button>
            </h3>
            <div className="acc__panel" id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`}>
              <div><div className="acc__body">{it.body ?? <p className="muted">{it.a}</p>}</div></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** A table that scrolls sideways on a small screen instead of breaking the page. First column is the row header. */
export function DataTable({ cols, rows, caption, className = '' }) {
  return (
    <div className={`tbl ${className}`.trim()} role="region" aria-label={caption} tabIndex={0}>
      <table>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead><tr>{cols.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j} data-label={typeof cols[j] === 'string' ? cols[j] : undefined}>{c}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** A short list with check marks. */
export function CheckList({ items }) {
  return (
    <ul className="checks">
      {items.map((t) => <li key={t}><Icon name="check" size={15} /><span>{t}</span></li>)}
    </ul>
  )
}

/** A native disclosure for secondary detail. Closed by default, keyboard accessible with no script. */
export function Disclosure({ summary, children, open = false }) {
  return (
    <details className="disc" open={open}>
      <summary><span>{summary}</span><span className="acc__ico" aria-hidden /></summary>
      <div className="disc__body">{children}</div>
    </details>
  )
}

/** Closing call to action used at the foot of every page. */
export function Cta({ title, lead, primary, secondary, badges }) {
  return (
    <Section tone="alt" className="cta">
      <div className="cta__in" data-reveal>
        <h2 className="h-2"><Rich text={title} /></h2>
        {lead && <p className="lead">{lead}</p>}
        <div className="cta__btns">
          <Button to={primary.to} track={`cta_${primary.to.replace(/\W+/g, '_')}`}>{primary.label}<Arrow /></Button>
          {secondary && <Button to={secondary.to} variant="ghost">{secondary.label}</Button>}
        </div>
        {badges && <ul className="cta__badges label">{badges.map((b) => <li key={b}>{b}</li>)}</ul>}
      </div>
    </Section>
  )
}
