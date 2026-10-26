import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { contactPage as P, site } from '../content'
import { Icon } from '../components/icons'
import { Arrow, Button, Head, PageHero, Section } from '../components/ui'
import { ArtCard } from '../components/Art'
import { PageMotion } from '../lib/PageMotion'
import { track } from '../lib/track'
import { useTheme } from '../lib/theme'
import { useRoute } from '../lib/router'
import { useToast } from '../lib/toast'

// ── Brief ────────────────────────────────────────────────────────────────────
// Chips build a short brief. "Send enquiry" posts to Web3Forms using the key in content/site.js.
// The key's verified recipient (anjort2000@gmail.com) is configured in Web3Forms, not in form fields.
// Email and Copy are alternatives. Nothing is stored on this site.

// A complete address: name@domain.tld. No spaces, no double dots, a real-looking TLD (2+ letters).
const EMAIL_RE = /^(?![.])(?!.*\.\.)(?!.*\.@)[A-Za-z0-9._%+'-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/
export const isEmail = (v) => EMAIL_RE.test(v.trim())
const scrollToBook = () => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const toggleIn = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

function Group({ n, title, done, children }) {
  return (
    <fieldset className={`bb__group${done ? ' is-done' : ''}`}>
      <legend className="bb__legend"><span className="bb__n">{done ? '✓' : n}</span><span className="h-3">{title}</span></legend>
      {children}
    </fieldset>
  )
}

function Chips({ items, value, onPick, multi = false }) {
  return (
    <div className="bb__chips">
      {items.map((c) => (
        <button key={c} type="button" className="chip" aria-pressed={multi ? value.includes(c) : value === c} onClick={() => onPick(c)}>{c}</button>
      ))}
    </div>
  )
}

function BriefBuilder() {
  const B = P.brief
  const toast = useToast()
  const { route } = useRoute()
  const [intent, setIntent] = useState(() => {
    const k = route.params && route.params.intent
    return { job: B.intents[0], consult: B.intents[1], roqiva: B.intents[2] }[k] || ''
  })
  useEffect(() => { const on = (e) => setIntent(e.detail || ''); window.addEventListener('brief:intent', on); return () => window.removeEventListener('brief:intent', on) }, [])
  const [topics, setTopics] = useState([])
  const [tools, setTools] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ name: false, email: false })
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const nameOk = name.trim().length >= 2
  const emailOk = isEmail(email)

  const brief = useMemo(() => {
    const L = ['Hi Anjor,', '']
    if (intent) L.push(`What would help most: ${intent}.`)
    L.push(topics.length ? `I'd like to talk about: ${topics.join(', ')}.` : "I'd like to talk about a number that will not move.")
    if (tools.length) L.push(`Tools in our stack: ${tools.join(', ')}.`)
    if (note.trim()) L.push('', note.trim())
    L.push('', `— ${name.trim() || '[your name]'}${email.trim() ? ` · ${email.trim()}` : ''}`)
    return L.join('\n')
  }, [intent, topics, tools, note, name, email])

  const filled = [topics.length > 0, tools.length > 0, nameOk && emailOk].filter(Boolean).length
  const copy = async () => {
    try { await navigator.clipboard.writeText(brief); toast('Brief copied') } catch (e) { toast('Copy failed. Select the text instead.') }
  }

  const [submittedEmail, setSubmittedEmail] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (!nameOk || !emailOk) {
      setTouched({ name: true, email: true })
      ;(!nameOk ? nameRef : emailRef).current?.focus()
      return
    }

    // Standard Web3Forms submission: submit the real form controls as FormData.
    // The access key identifies the destination mailbox in Web3Forms; this site
    // does not override or redirect email to any address.
    const form = e.currentTarget
    const formData = new FormData(form)
    setStatus('sending')
    setError('')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (response.ok && data.success !== false) {
        setSubmittedEmail(email.trim())
        form.reset()
        setIntent('')
        setTopics([])
        setTools([])
        setName('')
        setEmail('')
        setNote('')
        setTouched({ name: false, email: false })
        setStatus('sent')
      } else {
        setStatus('error')
        setError(data.message || 'The message could not be sent.')
      }
    } catch (error) {
      setStatus('error')
      setError('Something went wrong. Please try again, or use email below.')
    }
  }

  const reset = () => { setStatus('idle'); setError(''); setSubmittedEmail('') }

  return (
    <form id="form" className="bb" action="https://api.web3forms.com/submit" method="POST" onSubmit={submit} noValidate>
      <input type="hidden" name="access_key" value={site.web3formsKey} />
      <textarea name="message" value={brief} readOnly required className="sr-only" tabIndex={-1} aria-hidden="true" />
      <div className="bb__form">
        <Group n="1" title="What is this about?" done={!!intent}>
          <Chips items={B.intents} value={intent} onPick={(c) => setIntent((p) => (p === c ? '' : c))} />
        </Group>
        <Group n="2" title="What is stuck?" done={topics.length > 0}>
          <Chips items={B.topics} value={topics} onPick={(c) => setTopics((p) => toggleIn(p, c))} multi />
        </Group>
        <Group n="3" title="Which tools hold your data?" done={tools.length > 0}>
          <Chips items={B.tools} value={tools} onPick={(c) => setTools((p) => toggleIn(p, c))} multi />
        </Group>
        <Group n="4" title="Where do I reply?" done={nameOk && emailOk}>
          <div className="bb__inputs">
            <label className="bb__field">
              <span className="label">Name *</span>
              <input ref={nameRef} name="name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder="Your name" autoComplete="name" maxLength={100} required aria-invalid={touched.name && !nameOk} aria-describedby={touched.name && !nameOk ? 'name-err' : undefined} />
              {touched.name && !nameOk && <span className="bb__ferr" id="name-err">Please add your name.</span>}
            </label>
            <label className="bb__field">
              <span className="label">Email *</span>
              <input ref={emailRef} name="email" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))} onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@company.com" autoComplete="email" maxLength={254} required aria-invalid={touched.email && !emailOk} aria-describedby={touched.email && !emailOk ? 'email-err' : undefined} />
              {touched.email && !emailOk && <span className="bb__ferr" id="email-err">{email.trim() ? 'Enter a complete email, like name@company.com.' : 'Please add your email.'}</span>}
            </label>
            <label className="bb__field bb__field--wide"><span className="label">Anything else? (optional)</span><textarea rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="One line is enough." /></label>
          </div>
        </Group>
      </div>

      <aside className="bb__preview" aria-label="Your enquiry">
        <div className="bb__ring">
          <div className="bb__ringbar" aria-hidden><span style={{ width: `${(filled / 3) * 100}%` }} /></div>
          <span className="label">{filled} / 3 filled</span>
        </div>
        <div className="bb__card">
          <div className="bb__cardbar"><span className="bb__dot" aria-hidden /> enquiry.txt</div>
          <pre className="bb__text" aria-label="Preview of your enquiry">{brief}</pre>
        </div>

        {status === 'sent' ? (
          <div className="bb__done" role="status">
            <p className="h-3">Thanks. Your enquiry is in.</p>
            <p className="muted">I will reply to {submittedEmail}. Want to lock a time now?</p>
            <div className="bb__send">
              <Button onClick={scrollToBook}>Book a time<Arrow /></Button>
              <Button variant="ghost" onClick={reset}>Send another</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bb__send">
              <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send enquiry'}<Arrow />
              </button>
              <Button variant="ghost" onClick={scrollToBook}>Book a time</Button>
            </div>
            {status === 'error' && <p className="bb__error" role="alert">{error}</p>}
            <p className="label bb__fine">Or <button type="button" className="bb__alt" onClick={copy}>copy the brief</button> · <a className="bb__alt" href={`mailto:${site.email}?subject=${encodeURIComponent('Enquiry from the portfolio')}&body=${encodeURIComponent(brief)}`}>open in your email app</a>. Nothing is stored on this site.</p>
          </>
        )}
      </aside>
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
      <PageHero variant="contact" title={h.title} lead={h.lead} visual={<BookCalendar />} visualLive>
        <ul className="direct hero__a" style={{ '--i': 3 }}>
          <li><span className="label">Email</span><a href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><span className="label">LinkedIn</span><a href={site.linkedin} target="_blank" rel="noopener noreferrer">anjor-tank ↗</a></li>
          <li><span className="label">Brief</span><a href="#brief">Write to me first</a></li>
        </ul>
        <p className="ctrust hero__a" style={{ '--i': 4 }}><Icon name="shield" size={15} />{P.trust}</p>
      </PageHero>
      <Session />
      <Section id="brief" tone="alt">
        <Head eyebrow={P.brief.eyebrow} title={P.brief.h} />
        <div data-reveal><BriefBuilder /></div>
      </Section>
    </PageMotion>
  )
}
