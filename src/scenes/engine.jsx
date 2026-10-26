import { useCallback, useRef, useState } from 'react'
import { Icon } from '../components/icons'
import { MQ, ScrollTrigger, afterOpener, gsap, useGSAP } from '../lib/motion'

/* ═══════════════════════════════════════════════════════════════════════════
   Scene engine.
   A Scene is an app window (title bar, body, controls) whose contents are scripted by a GSAP timeline.

   · Every scene renders complete: all text is in the DOM and every state is visible. With no script, or under reduced motion,
     that is what the reader gets. Nothing here is hidden by CSS.
   · With motion allowed, `build(d)` receives a Director. The Director hides what the script will reveal (in JS only) and adds
     tweens at absolute times. Each helper returns the time it finishes, so a script reads top to bottom.
   · Only transforms, opacity and discrete display are animated. Layout never moves: hidden parts keep their space.
   · The timeline plays while the scene is on screen, pauses off screen, and loops after a hold. A visible control pauses it.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Text that is typed one character at a time. Complete in the markup; the Director shows the characters in turn. */
export function Type({ text, k }) {
  return (
    <span className="ty" data-k={k}>
      <span className="ty__c">{Array.from(text).map((c, i) => <i key={i} className="ch">{c}</i>)}</span>
      <b className="ty__caret" aria-hidden="true" />
    </span>
  )
}

/** Text that is streamed one word at a time, like an agent writing. Layout is reserved, so nothing reflows. */
export function Words({ text, k, as: Tag = 'span', className = '' }) {
  return (
    <Tag className={`wd ${className}`.trim()} data-k={k}>
      {text.split(' ').map((w, i, a) => <i key={i} className="w">{w}{i < a.length - 1 ? ' ' : ''}</i>)}
    </Tag>
  )
}

/** A named cursor. Decorative: hidden from assistive tech, and only visible while a scene is playing. */
export function Cur({ id, name, tone = 'person' }) {
  return (
    <span className={`cur cur--${tone}`} data-k={`cur-${id}`} aria-hidden="true">
      <i className="cur__r" />
      <svg className="cur__a" width="18" height="18" viewBox="0 0 24 24"><path d="M4 2l16 8-7 2.5L10 20z" fill="currentColor" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
      <em className="cur__n">{name}</em>
    </span>
  )
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

/** Position of `el` inside `container`, from offsets, so it does not depend on any transform in between. */
function within(el, container) {
  let x = 0, y = 0, n = el
  while (n && n !== container) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

/* ───────── The Director ───────── */
function makeDirector(root, tl) {
  const d = { root, tl, end: 0 }
  const frame = root.querySelector('.app__body') || root
  const $ = (k) => root.querySelector(`[data-k="${k}"]`)
  const $$ = (k, within_ = root) => gsap.utils.toArray(`[data-k="${k}"]`, within_)
  const el = (t) => (typeof t === 'string' ? $(t) : t)
  const els = (t) => (typeof t === 'string' ? $$(t) : Array.isArray(t) ? t : [t])
  const done = (t) => { d.end = Math.max(d.end, t); return t }
  d.$ = $; d.$$ = $$; d.el = el
  /** Where `target` sits inside `scope` (a data-k or element), from offsets: unaffected by transforms. */
  d.pos = (target, scope) => within(el(target), scope ? el(scope) : frame)

  /** Set a start state now and again at time 0, so a loop restarts from the same state. */
  d.hide = (t, vars = {}) => {
    const targets = els(t).filter(Boolean)
    if (!targets.length) return
    const v = { autoAlpha: 0, ...vars }
    gsap.set(targets, v)
    tl.set(targets, v, 0)
  }
  d.show = (t, at, o = {}) => {
    const targets = els(t).filter(Boolean)
    if (!targets.length) return at
    const { dur = 0.45, stagger = 0, ease, ...vars } = o
    tl.to(targets, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: dur, stagger, ease, ...vars }, at)
    return done(at + dur + stagger * (targets.length - 1))
  }
  /** Hide first, then show: the common case for a part that arrives. */
  d.in = (t, at, o = {}) => {
    const { from = { y: 8 }, ...rest } = o
    d.hide(t, from)
    return d.show(t, at, rest)
  }
  d.out = (t, at, o = {}) => {
    const targets = els(t).filter(Boolean)
    if (!targets.length) return at
    const { dur = 0.3, ...vars } = o
    tl.to(targets, { autoAlpha: 0, duration: dur, ...vars }, at)
    return done(at + dur)
  }
  d.at = (fn, t) => { tl.call(fn, null, t); return done(t) }
  d.set = (t, vars, at) => { tl.set(els(t), vars, at); return done(at) }
  /** A start state that is not a hide: applied now and again at time 0. */
  d.init = (t, vars) => { const targets = els(t).filter(Boolean); if (!targets.length) return; gsap.set(targets, vars); tl.set(targets, vars, 0) }

  /** Type a `Type` element, one character at a time. Leaves the caret blinking at the end until `clear` is called. */
  d.type = (k, at, { cps = 30 } = {}) => {
    const host = el(k)
    if (!host) return at
    const chars = gsap.utils.toArray('.ch', host)
    const caret = host.querySelector('.ty__caret')
    gsap.set(chars, { display: 'none' })
    tl.set(chars, { display: 'none' }, 0)
    gsap.set(caret, { autoAlpha: 0 })
    tl.set(caret, { autoAlpha: 0 }, 0)
    tl.set(caret, { autoAlpha: 1 }, at)
    tl.to(chars, { display: 'inline', duration: 0, stagger: 1 / cps }, at)
    return done(at + chars.length / cps)
  }
  d.clearType = (k, at) => {
    const host = el(k)
    if (!host) return at
    tl.set(gsap.utils.toArray('.ch', host), { display: 'none' }, at)
    tl.set(host.querySelector('.ty__caret'), { autoAlpha: 0 }, at)
    return done(at)
  }

  /** Stream a `Words` element word by word. */
  d.stream = (k, at, { wps = 16, hl } = {}) => {
    const host = el(k)
    if (!host) return at
    const words = gsap.utils.toArray('.w', host)
    gsap.set(words, { opacity: 0 })
    tl.set(words, { opacity: 0 }, 0)
    tl.to(words, { opacity: 1, duration: 0.2, ease: 'none', stagger: 1 / wps }, at)
    return done(at + words.length / wps + 0.2)
  }

  /** The part of a document the agent is writing: a soft highlight that glides from block to block. */
  d.focus = (hlK, target, at, { pad = 6, dur = 0.5, within: scope } = {}) => {
    const h = el(hlK)
    const t = el(target)
    if (!h || !t) return at
    const box = () => { const s = scope ? el(scope) : h.offsetParent; return within(t, s) }
    tl.to(h, {
      autoAlpha: 1, duration: dur, ease: 'eInOut',
      x: () => box().x - pad, y: () => box().y - pad, width: () => box().w + pad * 2, height: () => box().h + pad * 2,
    }, at)
    return done(at + dur)
  }

  /** Slide a scroller (a column of content inside a clipped viewport) so `target` sits in view. */
  d.scroll = (scrollerK, target, at, { dur = 0.7, margin = 48, align = 'top' } = {}) => {
    const sc = el(scrollerK)
    const t = el(target)
    if (!sc || !t) return at
    const y = () => {
      const view = sc.parentElement.clientHeight
      const full = sc.offsetHeight
      const r = within(t, sc)
      const want = align === 'bottom' ? view - (r.y + r.h) - margin : margin - r.y
      return clamp(want, Math.min(0, view - full), 0)
    }
    tl.to(sc, { y, duration: dur, ease: 'eInOut' }, at)
    return done(at + dur)
  }

  /** A list of agent steps (data-k `${k}-${i}`): each appears with a spinner, then resolves to a tick. The last one can stay running. */
  d.steps = (k, at, { each = 0.8, spin = 0.55, hold = false } = {}) => {
    const rows = gsap.utils.toArray(`[data-k^="${k}-"]`, root).filter((n) => /-\d+$/.test(n.getAttribute('data-k')))
    let t = at
    rows.forEach((row, i) => {
      const n = row.getAttribute('data-k').split('-').pop()
      const sp = $(`${k}-sp${n}`), ok = $(`${k}-ok${n}`)
      d.hide(row, { y: 6 })
      d.hide(sp); d.hide(ok, { scale: 0.4 })
      tl.to(row, { autoAlpha: 1, y: 0, duration: 0.35 }, t)
      tl.to(sp, { autoAlpha: 1, duration: 0.2 }, t)
      const last = i === rows.length - 1
      if (!(last && hold)) {
        tl.to(sp, { autoAlpha: 0, duration: 0.15 }, t + spin)
        tl.to(ok, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'eSpring' }, t + spin)
      }
      t += each
    })
    return done(t - each + spin)
  }
  /** Resolve a step list that was left running (`hold`). */
  d.resolve = (k, i, at) => {
    const sp = $(`${k}-sp${i}`), ok = $(`${k}-ok${i}`)
    tl.to(sp, { autoAlpha: 0, duration: 0.15 }, at).to(ok, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'eSpring' }, at)
    return done(at + 0.35)
  }

  /** A press: the target dips and springs back. */
  d.press = (target, at) => {
    const t = el(target)
    if (!t) return at
    tl.to(t, { scale: 0.94, duration: 0.09, ease: 'power2.out' }, at).to(t, { scale: 1, duration: 0.35, ease: 'eSpring' }, at + 0.09)
    return done(at + 0.44)
  }

  /** Swap one element for another in the same place. */
  d.swap = (outT, inT, at, dur = 0.3) => {
    const o = els(outT).filter(Boolean)
    const i = els(inT).filter(Boolean)
    tl.to(o, { autoAlpha: 0, duration: dur }, at).to(i, { autoAlpha: 1, duration: dur }, at)
    return done(at + dur)
  }

  /** A named cursor. Positions are measured when the move starts, so they follow the layout. */
  d.cur = (id) => {
    const c = $(`cur-${id}`)
    const arrow = c && c.querySelector('.cur__a')
    const ring = c && c.querySelector('.cur__r')
    const place = (target, fx = 0.5, fy = 0.5, dx = 0, dy = 0) => () => {
      const r = el(target).getBoundingClientRect()
      const R = frame.getBoundingClientRect()
      // Measured on screen, applied in the frame's own units: a parent may scale the frame (FitPin, a tilted hero window).
      const k = (frame.offsetWidth && R.width / frame.offsetWidth) || 1
      const w = R.width / k, h = R.height / k
      // Keep the name tag inside the window.
      return { x: Math.min((r.left - R.left + r.width * fx) / k + dx, w - 112), y: Math.min((r.top - R.top + r.height * fy) / k + dy, h - 30) }
    }
    if (c) { gsap.set(c, { autoAlpha: 0, x: 0, y: 0 }); tl.set(c, { autoAlpha: 0 }, 0) }
    const rig = {
      /** Appear at a spot, instantly. */
      at(target, at, { fx, fy, dx, dy } = {}) {
        if (!c) return at
        const p = place(target, fx, fy, dx, dy)
        tl.set(c, { x: () => p().x, y: () => p().y }, at).to(c, { autoAlpha: 1, duration: 0.25 }, at)
        return done(at + 0.25)
      },
      /** Glide to a spot. The path bows slightly: x and y ease differently. */
      to(target, at, { fx, fy, dx, dy, dur = 0.9 } = {}) {
        if (!c) return at
        const p = place(target, fx, fy, dx, dy)
        tl.to(c, { x: () => p().x, duration: dur, ease: 'power2.inOut' }, at)
          .to(c, { y: () => p().y, duration: dur, ease: 'power3.inOut' }, at + 0.04)
        return done(at + dur + 0.04)
      },
      click(at) {
        if (!c) return at
        tl.to(arrow, { scale: 0.78, duration: 0.07, ease: 'power2.out' }, at)
          .to(arrow, { scale: 1, duration: 0.3, ease: 'eSpring' }, at + 0.07)
          .fromTo(ring, { scale: 0.3, autoAlpha: 0.65 }, { scale: 1.7, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, at)
        return done(at + 0.22)
      },
      show(at) { if (c) tl.to(c, { autoAlpha: 1, duration: 0.25 }, at); return done(at + 0.25) },
      hide(at) { if (c) tl.to(c, { autoAlpha: 0, duration: 0.3 }, at); return done(at + 0.3) },
    }
    return rig
  }
  return d
}

/**
 * The window. `build(d)` scripts it. `mode`:
 *   'view'   plays while on screen, loops after `hold` seconds, pauses off screen (default)
 *   'active' plays once as soon as it mounts, then calls `onDone` after `hold` (the hero player)
 */
export function Scene({ id, title, crumbs, live = 'Live', badge = null, build, speed = 1, mode = 'view', hold = 3, onDone, className = '', label, children, foot, phoneH }) {
  const root = useRef(null)
  const api = useRef({ tl: null, want: true, mode })
  const [paused, setPaused] = useState(false)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useGSAP(() => {
    const el = root.current
    if (!el || !build) return
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      let ctx
      let started = false
      const make = (at = 0) => {
        ctx && ctx.revert()
        ctx = gsap.context(() => {
          const tl = gsap.timeline({ paused: true, defaults: { ease: 'eOut' } })
          const d = makeDirector(el, tl)
          const body = el.querySelector('.app__body')
          el.setAttribute('data-live', 'true')
          build(d)
          // A loop closes with a short fade, then starts clean. A one-shot scene holds its final state.
          const end = d.end + hold
          if (mode === 'view') {
            tl.to(body, { autoAlpha: 0, duration: 0.4 }, end)
            tl.set(body, { autoAlpha: 1 }, end + 0.55)
            tl.repeat(-1)
            tl.eventCallback('onRepeat', () => {})
          } else {
            tl.call(() => doneRef.current && doneRef.current(), null, end)
          }
          tl.timeScale(speed)
          api.current.tl = tl
          if (typeof window !== 'undefined' && window.__OI_TEST__) { (window.__scenes = window.__scenes || {})[id] = tl }
          if (at) tl.time(at, true)
          if (started && api.current.want) tl.play()
        }, el)
      }
      make()

      let stopOpener = () => {}
      const go = () => {
        stopOpener()
        stopOpener = afterOpener(() => {
          started = true
          api.current.want = true
          if (mode === 'active' && st && !st.isActive) return   // off screen: the trigger below starts it when it is seen
          api.current.tl && api.current.tl.play()
        })
      }
      let st
      if (mode === 'active') {
        go()
        // A one-shot scene still stops while it is off screen, and carries on when it is seen again.
        st = ScrollTrigger.create({
          trigger: el, start: 'top 98%', end: 'bottom 2%',
          onToggle: (self) => { const tl = api.current.tl; if (!tl || !started) return; if (self.isActive) { if (api.current.want) tl.play() } else tl.pause() },
        })
      } else {
        st = ScrollTrigger.create({
          trigger: el, start: 'top 88%', end: 'bottom 12%',
          onToggle: (self) => {
            const tl = api.current.tl
            if (self.isActive) { if (!started) go(); else if (api.current.want && tl) tl.play() }
            else if (tl) tl.pause()
          },
          onRefresh: (self) => { if (self.isActive && !started) go() },
        })
      }

      // A different width means different positions: rebuild the script at the same moment instead of drifting.
      let w = el.offsetWidth, rt = 0
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
        if (Math.abs(el.offsetWidth - w) < 6) return
        w = el.offsetWidth
        clearTimeout(rt)
        rt = setTimeout(() => { const tl = api.current.tl; make(tl ? tl.time() : 0) }, 180)
      }) : null
      ro && ro.observe(el)

      return () => { clearTimeout(rt); ro && ro.disconnect(); st && st.kill(); stopOpener(); ctx && ctx.revert(); api.current.tl = null; el.removeAttribute('data-live') }
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [id] })

  const toggle = useCallback(() => {
    const tl = api.current.tl
    if (!tl) return
    const next = !tl.paused()
    tl.paused(next)
    api.current.want = !next
    setPaused(next)
  }, [])
  const replay = useCallback(() => {
    const tl = api.current.tl
    if (!tl) return
    api.current.want = true
    setPaused(false)
    tl.restart()
  }, [])

  return (
    <figure className={`app ${className}`.trim()} ref={root} aria-label={label || title} data-scene={id} style={phoneH ? { '--app-h-s': `${phoneH}px` } : undefined}>
      <div className="app__bar">
        <span className="app__dots" aria-hidden="true"><i /><i /><i /></span>
        <p className="app__crumbs">
          {(crumbs || [title]).map((c, i) => <span key={c} className={i === (crumbs || [title]).length - 1 ? 'is-last' : ''}>{i > 0 && <Icon name="chev" size={11} />}{c}</span>)}
        </p>
        {badge && <span className="status status--amber app__badge">{badge}</span>}
        <span className="app__ctl">
          <button type="button" className="app__btn" onClick={toggle} aria-pressed={paused} aria-label={paused ? 'Play the animation' : 'Pause the animation'}><Icon name={paused ? 'play' : 'pause'} size={12} /></button>
          <button type="button" className="app__btn" onClick={replay} aria-label="Replay the animation"><Icon name="replay" size={12} /></button>
        </span>
      </div>
      <div className="app__body">{children}</div>
      {foot && <p className="app__foot label">{foot}</p>}
    </figure>
  )
}
