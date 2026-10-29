import { forwardRef } from 'react'
import { Kin } from './kin'
import { Icon } from './icons'
import { Shader } from '../system/Shader'
import { DotCanvas } from '../art/ArtCanvas'
import { SCENES, STILL } from '../art/cards'
import { routes } from '../content'
import { useRoute } from '../lib/router'

/* ═══════════════════════════════════════════════════════════════════════════
   The board. Every page is a set of boards: tiles fitted edge to edge with narrow gaps, each tile one thing
   (a statement, a number, a picture, a working window, a list). A board fits on one screen.
   Products are shown as raised windows set on a backdrop: a painting, a shader or a dark dot screen.
   Styles: styles/site.css (the b- prefix). Motion: lib/PageMotion.jsx (data-board, data-kin).
   ═══════════════════════════════════════════════════════════════════════════ */

export const cx = (...a) => a.filter(Boolean).join(' ')

/** A heading: words rise in (Kin). `sub` is the second voice in a quieter ink. `*x*` and `==x==` work as in the content. */
export function H({ as: Tag = 'h2', text, sub, className, hero = false, hlEm = false, id }) {
  return (
    <Tag className={cx('b-h', className)} id={id} data-kin data-kin-hero={hero || undefined}>
      <Kin text={text} hlEm={hlEm} />{sub && <> <span className="b-h__sub"><Kin text={sub} /></span></>}
    </Tag>
  )
}

/** A section: its heading and lead on one line across the top, then its board. */
export function Sec({ id, title, sub, lead, aside, tone, className, children, labelledBy, label, tag }) {
  const hid = id ? `${id}-h` : undefined
  return (
    <section id={id} className={cx('b-sec', tone && `b-sec--${tone}`, className)} aria-labelledby={title ? hid : labelledBy}>
      <div className="b-wrap">
        {title && (
          <header className="b-head">
            <div className="b-head__t">{label && <Label label={label} tag={tag} />}<H text={title} sub={sub} id={hid} /></div>
            {(lead || aside) && <div className="b-head__s">{lead && <p className="b-lead">{lead}</p>}{aside}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}

/** The small line over a heading: the section's name, and a note beside it. */
export function Label({ label, tag, className }) {
  return <p className={cx('b-label', className)}><span>{label}</span>{tag && <em>{tag}</em>}</p>
}

/** A board: a grid whose tiles enter together. The layout is set per board in CSS (grid areas). */
export const Board = forwardRef(function Board({ className, as: Tag = 'div', children, ...rest }, ref) {
  return <Tag ref={ref} className={cx('b-board', className)} data-board {...rest}>{children}</Tag>
})

/** A tile. `tone`: '' (paper), 'soft', 'ink' (dark), 'accent'. */
export function Tile({ as: Tag = 'div', tone, className, children, ...rest }) {
  return <Tag className={cx('b-tile', tone && `b-tile--${tone}`, className)} {...rest}>{children}</Tag>
}

/** A product window: traffic lights, a title, and an optional tag. */
export function Win({ title, tag, className, children, dark = false }) {
  return (
    <div className={cx('b-win', dark && 'b-win--dark', className)}>
      <div className="b-win__bar">
        <span className="b-win__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="b-win__t">{title}</span>
        {tag && <span className="b-win__tag">{tag}</span>}
      </div>
      <div className="b-win__body">{children}</div>
    </div>
  )
}

/** The ground a window stands on: a painting, a shader gradient, or a plain field. */
export function Stage({ kind = 'paint', name = 'dawn', className, children, align = 'center' }) {
  return (
    <div className={cx('b-stage', `b-stage--${kind}`, `b-stage--${align}`, className)}>
      {kind === 'paint' && <img className="b-stage__bg" src={`/img/paint/${name}.webp`} alt="" width="1600" height="1000" loading="lazy" decoding="async" />}
      {kind === 'shader' && <Shader preset={name} className="b-stage__bg" />}
      <div className="b-stage__in">{children}</div>
    </div>
  )
}

/** A dark screen running one of the dot-matrix scenes (art/cards.js), the drawing language of the ROQIVA page. */
export function Screen({ scene, className, label, cell = 5 }) {
  const fn = SCENES[scene]
  return (
    <div className={cx('b-screen', className)}>
      {fn && <span className="b-screen__cv" aria-hidden="true"><DotCanvas draw={(D, t) => fn(D, t)} cell={cell} k={4} gap={1} fps={16} still={STILL[scene] ?? 5} /></span>}
      {label && <span className="b-screen__l">{label}</span>}
    </div>
  )
}

/** A small run of chips. */
export function Chips({ items, tone, className }) {
  return <ul className={cx('b-chips', tone && `b-chips--${tone}`, className)}>{items.map((x) => <li key={x}>{x}</li>)}</ul>
}

/** A link with a round arrow that turns on hover. */
export function Go({ to, children, className, ...rest }) {
  return <a className={cx('b-go', className)} href={to} {...rest}>{children}<i aria-hidden="true"><Icon name="arrow" size={14} /></i></a>
}

/** The small grey title a tile opens with: an icon disc and a name. */
export function Kicker({ icon, children, className }) {
  return <p className={cx('b-k', className)}>{icon && <span className="b-k__ic" aria-hidden="true">{typeof icon === 'string' ? <Icon name={icon} size={14} /> : icon}</span>}{children}</p>
}

/** The trail at the top of every page but the home page. The same trail ships as BreadcrumbList JSON-LD (site.mjs). */
export function Crumbs() {
  const { route } = useRoute()
  if (route.path === '/') return null
  const r = routes.find((x) => x.path === route.path)
  const parent = r && r.parent ? routes.find((x) => x.path === r.parent) : null
  return (
    <nav className="b-crumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        {parent && <li><a href={parent.path}>{parent.label}</a></li>}
        <li><span aria-current="page">{r ? r.label : 'Page not found'}</span></li>
      </ol>
    </nav>
  )
}

/** The first board of every page below the home page: the trail, the title and its lead on one tile, the page's
    own picture on the tile beside it. Fits the first screen. */
export function PageHead({ title, sub, lead, children, visual, className, visualClass, label, tag }) {
  return (
    <header className={cx('b-sec b-sec--first b-ph', className)}>
      <div className="b-wrap">
        <Board className={cx('b-ph__board', !visual && 'is-solo')}>
          <Tile className="b-ph__copy">
            <Crumbs />
            {label && <Label label={label} tag={tag} />}
            <H as="h1" text={title} sub={sub} hero />
            {lead && <p className="b-lead b-ph__lead">{lead}</p>}
            {children}
          </Tile>
          {visual && <div className={cx('b-ph__vis', visualClass)}>{visual}</div>}
        </Board>
      </div>
    </header>
  )
}
