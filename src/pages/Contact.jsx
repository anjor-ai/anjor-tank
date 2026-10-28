import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { contactPage as P, site } from '../content'
import { Icon } from '../components/icons'
import { Arrow, Button, Head, Rich, Section } from '../components/ui'
import { ArtCard } from '../components/Art'
import { PageMotion } from '../lib/PageMotion'
import { track } from '../lib/track'
import { useTheme } from '../lib/theme'
import { useRoute } from '../lib/router'
import { useToast } from '../lib/toast'

// ── Brief ────────────────────────────────────────────────────────────────────
// A short form posts to Web3Forms using the key in content/site.js.
// The key's verified recipient (anjort2000@gmail.com) is configured in Web3Forms, not in form fields.
// Email and Copy are alternatives. Nothing is stored on this site.

// A complete address: name@domain.tld. No spaces, no double dots, a real-looking TLD (2+ letters).
const EMAIL_RE = /^(?![.])(?!.*\.\.)(?!.*\.@)[A-Za-z0-9._%+'-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/
export const isEmail = (v) => EMAIL_RE.test(v.trim())
const scrollToBook = () => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function QuickBrief() {
  const B = P.brief
  const toast = useToast()
  const { route } = useRoute()
  const [intent, setIntent] = useState(() => {
    const k = route.params && route.params.intent
    return { job: B.intents[0], consult: B.intents[1], roqiva: B.intents[2] }[k] || ''
  })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ name: false, email: false })
  const [sentTo, setSentTo] = useState('')
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const nameOk = name.trim().length >= 2
  const emailOk = isEmail(email)
  const brief = useMemo(() => {
    const L = ['Hi Anjor,', '']
    if (intent) L.push(`What would help most: ${intent}.`)
    L.push(note.trim() || "I'd like to talk about a number that will not move.")
    L.push('', `— ${name.trim() || '[your name]'}${email.trim() ? ` · ${email.trim()}` : ''}`)
    return L.join('\n')
  }, [intent, note, name, email])

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (!nameOk || !emailOk) { setTouched({ name: true, email: true }); (!nameOk ? nameRef : emailRef).current?.focus(); return }
    const form = e.currentTarget
    setStatus('sending'); setError('')
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) })
      const data = await response.json()
      if (response.ok && data.success !== false) {
        track('brief_sent', { intent: intent || 'none' })
        setSentTo(email.trim()); form.reset(); setIntent(''); setName(''); setEmail(''); setNote(''); setTouched({ name: false, email: false }); setStatus('sent')
      } else { setStatus('error'); setError(data.message || 'The message could not be sent.') }
    } catch (err) { setStatus('error'); setError('Something went wrong. Please try again, or email me directly.') }
  }
  const copy = async () => { try { await navigator.clipboard.writeText(brief); toast('Message copied') } catch (e) { toast('Copy failed. Select the text instead.') } }

  if (status === 'sent') {
    return (
      <div className="qb qb--done" id="brief" role="status">
        <span className="qb__ok" aria-hidden="true"><Icon name="check" size={20} /></span>
        <p className="qb__h">Thanks. Your message is in.</p>
        <p className="qb__p">I will reply to {sentTo}, usually within two working days. Want to lock a time now?</p>
        <div className="qb__acts"><Button onClick={scrollToBook}>Pick a time<Arrow /></Button><Button variant="ghost" onClick={() => setStatus('idle')}>Send another</Button></div>
      </div>
    )
  }
  return (
    <form id="brief" className="qb" action="https://api.web3forms.com/submit" method="POST" onSubmit={submit} noValidate>
      <input type="hidden" name="access_key" value={site.web3formsKey} />
      <input type="hidden" name="subject" value={`Portfolio enquiry${intent ? `: ${intent}` : ''}`} />
      <textarea name="message" value={brief} readOnly className="sr-only" tabIndex={-1} aria-hidden="true" />
      <p className="qb__k"><span>Write to me</span><em>Takes a minute</em></p>
      <fieldset className="qb__intent">
        <legend className="sr-only">What is this about?</legend>
        {B.intents.map((c) => <button key={c} type="button" className="qb__chip" aria-pressed={intent === c} onClick={() => setIntent((p) => (p === c ? '' : c))}>{c.replace(': follow along or help shape it', '')}</button>)}
      </fieldset>
      <div className="qb__row">
        <label className="qb__f"><span>Name</span>
          <input ref={nameRef} name="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} placeholder="Your name" autoComplete="name" maxLength={100} required aria-invalid={touched.name && !nameOk} aria-describedby={touched.name && !nameOk ? 'qb-name' : undefined} />
          {touched.name && !nameOk && <em className="qb__err" id="qb-name">Please add your name.</em>}
        </label>
        <label className="qb__f"><span>Work email</span>
          <input ref={emailRef} name="email" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))} onBlur={() => setTouched((t) => ({ ...t, email: true }))} placeholder="you@company.com" autoComplete="email" maxLength={254} required aria-invalid={touched.email && !emailOk} aria-describedby={touched.email && !emailOk ? 'qb-email' : undefined} />
          {touched.email && !emailOk && <em className="qb__err" id="qb-email">{email.trim() ? 'Enter a complete email, like name@company.com.' : 'Please add your email.'}</em>}
        </label>
      </div>
      <label className="qb__f"><span>What is stuck? <small>(optional)</small></span>
        <textarea rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="One line is enough. The number that will not move, and the tools involved." />
      </label>
      <div className="qb__send">
        <button type="submit" className="btn btn--primary qb__btn" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}<Arrow /></button>
        <p className="qb__fine"><Icon name="shield" size={13} />I reply myself. Nothing is stored on this site.</p>
      </div>
      {status === 'error' && <p className="qb__error" role="alert">{error}</p>}
      <p className="qb__alt">Rather use email? <a href={`mailto:${site.email}?subject=${encodeURIComponent('Enquiry from the portfolio')}&body=${encodeURIComponent(brief)}`}>Open your email app</a> · <button type="button" onClick={copy}>copy the message</button></p>
    </form>
  )
}

// ── Book a time: pick a day, then see Calendly's times for it in a dialog ─────────────
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function calendlyUrl(day, theme, embed) {
  const u = new URL(site.booking)
  if (day) { u.searchParams.set('month', ymd(day).slice(0, 7)); u.searchParams.set('date', ymd(day)) }
  if (embed) {
    u.searchParams.set('embed_domain', window.location.host)
    u.searchParams.set('embed_type', 'Inline')
    u.searchParams.set('hide_gdpr_banner', '1')
    u.searchParams.set('primary_color', '0070e0')
    u.searchParams.set('background_color', theme === 'light' ? 'ffffff' : '1f1e1d')
    u.searchParams.set('text_color', theme === 'light' ? '0b0b0a' : 'faf9f5')
  }
  return u.toString()
}

function BookCalendar() {
  const { theme } = useTheme()
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() })
  const [sel, setSel] = useState(null)
  const [dlg, setDlg] = useState(false)
  const closeDlg = useMemo(() => () => setDlg(false), [])
  const offset = (view.y - today.getFullYear()) * 12 + (view.m - today.getMonth())
  const move = (d) => setView((v) => { const dt = new Date(v.y, v.m + d, 1); return { y: dt.getFullYear(), m: dt.getMonth() } })
  const first = new Date(view.y, view.m, 1)
  const lead = (first.getDay() + 6) % 7 // Monday-first
  const days = new Date(view.y, view.m + 1, 0).getDate()
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(view.y, view.m, i + 1))]
  return (
    <div className="bwin" id="book">
      <div className="bwin__bar"><span className="app__dots" aria-hidden="true"><i /><i /><i /></span><span className="bwin__t">A first call · {site.name}</span><span className="bwin__live"><i />Check times in Calendly</span></div>
      <div className="bwin__body">
        <div className="bwin__who">
          <span className="bwin__avs" aria-hidden="true"><i>AT</i></span>
          <span><b>With Anjor</b><small>Free · video call · scheduled by Calendly</small></span>
        </div>
        <div className="bcal" role="group" aria-label="Choose a day to book">
          <div className="bcal__head">
            <button type="button" className="bcal__nav" onClick={() => move(-1)} disabled={offset <= 0} aria-label="Previous month">‹</button>
            <b className="bcal__title" aria-live="polite">{MONTHS[view.m]} {view.y}</b>
            <button type="button" className="bcal__nav" onClick={() => move(1)} disabled={offset >= 2} aria-label="Next month">›</button>
          </div>
          <div className="bcal__week" aria-hidden>{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d}>{d}</span>)}</div>
          <div className="bcal__grid">
            {cells.map((d, i) => {
              if (!d) return <span key={'b' + i} />
              const past = d < today
              const isSel = sel && ymd(sel) === ymd(d)
              return (
                <button key={ymd(d)} type="button" disabled={past} aria-pressed={!!isSel}
                  className={`bcal__day${isSel ? ' is-sel' : ''}${ymd(d) === ymd(today) ? ' is-today' : ''}`}
                  onClick={() => setSel(d)} aria-label={d.toDateString()}>{d.getDate()}</button>
              )
            })}
          </div>
          <p className="bcal__sum" aria-live="polite">{sel ? sel.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Choose a day to check availability, or open Calendly.'}</p>
          <button type="button" className="btn btn--primary bcal__go" onClick={() => { setDlg(true); track('book_times_opened') }}>{sel ? 'See times' : 'See all times'}<Arrow /></button>
          <p className="bcal__note">Scheduling by Calendly · <a href={calendlyUrl(sel, theme, false)} target="_blank" rel="noopener noreferrer">Open it in a new tab ↗</a></p>
        </div>
      </div>
      {dlg && <BookDialog url={calendlyUrl(sel, theme, true)} tabUrl={calendlyUrl(sel, theme, false)} onClose={closeDlg} />}
    </div>
  )
}

function Session() {
  const B = P.book
  return (
    <Section id="session" tone="alt">
      <Head eyebrow={B.label} title={B.h} lead={B.p} />
      <ul className="acards acards--3">
        {B.plan.map(([t, d], i) => <ArtCard key={t} art={['find', 'scan', 'decide'][i]} label={`0${i + 1}`} t={t} d={d} />)}
      </ul>
      <p className="book__bring" data-reveal><b>Bring:</b> {B.bring}</p>
    </Section>
  )
}

function BookDialog({ url, tabUrl, onClose }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const key = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      // Keep Tab inside the dialog: close button, new-tab link and the calendar frame.
      const f = [...(panelRef.current?.querySelectorAll('a[href], button, iframe') || [])]
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      else if (!panelRef.current?.contains(document.activeElement)) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.() }
  }, [onClose])
  return createPortal(
    <div className="bdlg" role="dialog" aria-modal="true" aria-label="Book a time" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bdlg__panel" ref={panelRef}>
        <div className="bdlg__bar">
          <span className="label">Book a time · Calendly</span>
          <div className="bdlg__acts">
            <a className="bdlg__tab" href={tabUrl} target="_blank" rel="noopener noreferrer">New tab ↗</a>
            <button type="button" ref={closeRef} className="kbd bdlg__x" onClick={onClose} aria-label="Close">Esc</button>
          </div>
        </div>
        <iframe className="bdlg__frame" src={url} title={`Book a time with ${site.name} on Calendly`} loading="lazy" />
      </div>
    </div>,
    document.body
  )
}


export default function Contact() {
  const h = P.hero
  return (
    <PageMotion routeKey="/contact">
      <header className="ct">
        <div className="container">
          <div className="ct__head">
            <p className="k-rule"><b>[00]</b><span>Talk</span><i /><small>/ Two ways in</small></p>
            <h1 className="ct__h"><Rich text={h.title} /></h1>
            <p className="k-lead">{h.lead}</p>
          </div>
          <div className="ct__grid">
            <QuickBrief />
            <div className="ct__book">
              <p className="qb__k"><span>Or pick a time</span><em>Opens Calendly</em></p>
              <BookCalendar />
              <ul className="ct__direct">
                <li><span>Email</span><a href={`mailto:${site.email}`}>{site.email}</a></li>
                <li><span>LinkedIn</span><a href={site.linkedin} target="_blank" rel="noopener noreferrer">anjor-tank ↗</a></li>
              </ul>
            </div>
          </div>
          <p className="ctrust"><Icon name="shield" size={15} />{P.trust}</p>
        </div>
      </header>
      <Session />
    </PageMotion>
  )
}
