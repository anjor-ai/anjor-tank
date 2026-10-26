import { workflow } from '../content'

/** The workflow as one ordered list of steps and gates. Built from content, never retyped.
    `merged` folds Gate 2 into Gate 3, as a brand may for small changes. Gates 1 and 4 are never skipped. */
export function buildSequence({ merged = false } = {}) {
  const out = []
  workflow.steps.forEach((s) => {
    out.push({ key: `s${s.n}`, type: 'step', n: s.n, name: s.name, by: s.by, who: s.who, text: s.out, does: s.does })
    if (!s.gate) return
    const g = s.gate
    if (merged && g.n === 2) return
    const isReview = g.n === '↻'
    const joined = merged && g.n === 3
    out.push({
      key: `g${g.n}`, type: 'gate', n: joined ? '2+3' : g.n, by: ['person'], who: g.who,
      name: isReview ? 'Outcome review' : joined ? 'Gates 2 and 3 · Direction, Design and PRD' : `Gate ${g.n} · ${g.name}`,
      text: joined ? 'PM and leads pick the solution, then the PM, designer and engineer approve the pack' : `${g.who} ${g.does}`, locked: g.n === 1 || g.n === 4, review: isReview,
    })
  })
  return out
}
