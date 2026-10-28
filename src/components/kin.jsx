import { cloneElement, isValidElement } from 'react'

/** Put punctuation inside the last word of an element (a word, or a highlight of several words), so no line can break before it. */
function tack(el, p) {
  if (!isValidElement(el)) return el
  const kids = el.props.children
  if (el.props.className === 'kw__i') return cloneElement(el, {}, kids, <span className="kin-p">{p}</span>)
  if (Array.isArray(kids)) {
    const i = kids.map((c) => isValidElement(c)).lastIndexOf(true)
    if (i < 0) return el
    const next = [...kids]; next[i] = tack(kids[i], p)
    return cloneElement(el, {}, ...next)
  }
  return cloneElement(el, {}, tack(kids, p))
}

/** A heading set word by word for the kinetic entry (each word rises out of its own mask).
    `*x*` is the quieter second voice; `==x==` marks the key words that take the accent highlight.
    `hlEm` treats the *asterisk* words as highlights instead (the home hero). Plain text without JS. */
export function Kin({ text, hlEm = false }) {
  if (typeof text !== 'string') return text
  const out = []
  let k = 0, n = 0
  const words = (str, hl) => str.split(/(\s+)/).forEach((w) => {
    if (!w) return
    if (/^\s+$/.test(w)) { out.push(w); return }
    out.push(<span key={k++} className={`kw${hl ? ' kw--hl' : ''}`} style={{ '--w': n++ }}><span className="kw__i">{w}</span></span>)
  })
  // Punctuation straight after a word (often after a highlight: "==decisions out==,") stays on that word's line.
  const glue = (seg) => {
    const m = /^([,.;:!?…)’”]+)/.exec(seg)
    if (!m || !out.length || typeof out[out.length - 1] === 'string') return seg
    // (only the last item moves; the punctuation follows it with no break opportunity)
    const prev = out.pop()
    out.push(tack(prev, m[1]))
    return seg.slice(m[1].length)
  }
  const run = (str, hl) => str.split(/(==[^=]+==)/).forEach((seg0) => {
    const seg = glue(seg0)
    if (!seg) return
    if (seg.startsWith('==') && seg.endsWith('==') && seg.length > 4) {
      const start = out.length
      words(seg.slice(2, -2), true)
      const inner = out.splice(start)
      out.push(<mark key={k++} className="kin-hl">{inner}</mark>)
    } else words(seg, hl)
  })
  text.split('*').forEach((seg, i) => {
    if (!seg) return
    if (i % 2 === 0) { run(seg, false); return }
    const start = out.length
    run(seg, hlEm)
    const inner = out.splice(start)
    out.push(hlEm ? <mark key={k++} className="kin-hl">{inner}</mark> : <span key={k++} className="em">{inner}</span>)
  })
  return out
}
