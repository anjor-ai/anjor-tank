/* ═══════════════════════════════════════════════════════════════════════════
   Ambient sound. A soft generative pad, synthesised live with the Web Audio API: four slow chords
   (Cmaj9, Am9, Fmaj7, G6sus) on detuned sine and triangle voices through a low-pass filter and a
   generated reverb, with an occasional pentatonic bell. No audio file, nothing fetched, nothing licensed.
   Off until the visitor turns it on (browsers require a gesture anyway). The choice is remembered;
   when it was "on", sound resumes at the first click or key press of the next visit.
   ═══════════════════════════════════════════════════════════════════════════ */

const KEY = 'at-sound'
const CHORDS = [
  [48, 52, 55, 59, 62], // Cmaj9
  [45, 48, 52, 55, 59], // Am9
  [41, 45, 48, 52, 57], // Fmaj7
  [43, 50, 52, 55, 57], // G6sus
]
const BELLS = [72, 74, 76, 79, 81, 84]
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12)

let ctx = null, master = null, bus = null, timer = 0, bellTimer = 0, step = 0, on = false
const subs = new Set()
const emit = () => subs.forEach((f) => f(on))

function impulse(c, seconds = 4.5) {
  const len = Math.floor(c.sampleRate * seconds), buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3) }
  return buf
}

function build() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return false
  ctx = new AC()
  master = ctx.createGain(); master.gain.value = 0
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -24; comp.ratio.value = 3
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.Q.value = 0.4
  const lfo = ctx.createOscillator(), lfoAmt = ctx.createGain(); lfo.frequency.value = 0.05; lfoAmt.gain.value = 500; lfo.connect(lfoAmt).connect(lp.frequency); lfo.start()
  const verb = ctx.createConvolver(); verb.buffer = impulse(ctx)
  const wet = ctx.createGain(); wet.gain.value = 0.55
  const dry = ctx.createGain(); dry.gain.value = 0.5
  bus = ctx.createGain()
  bus.connect(lp); lp.connect(dry).connect(comp); lp.connect(verb).connect(wet).connect(comp)
  comp.connect(master).connect(ctx.destination)
  return true
}

function chord() {
  const t = ctx.currentTime, notes = CHORDS[step++ % CHORDS.length], dur = 9
  notes.forEach((m, i) => {
    ;[-6, 6].forEach((cents, k) => {
      const o = ctx.createOscillator(), g = ctx.createGain()
      o.type = k ? 'triangle' : 'sine'; o.frequency.value = hz(m); o.detune.value = cents
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.05 / (1 + i * 0.25), t + 3.2)
      g.gain.setValueAtTime(0.05 / (1 + i * 0.25), t + dur - 1)
      g.gain.linearRampToValueAtTime(0, t + dur + 3.5)
      o.connect(g).connect(bus); o.start(t); o.stop(t + dur + 4)
    })
  })
}

function bell() {
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain()
  o.type = 'sine'; o.frequency.value = hz(BELLS[Math.floor(Math.random() * BELLS.length)])
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.035, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
  o.connect(g).connect(bus); o.start(t); o.stop(t + 3.4)
  bellTimer = setTimeout(bell, 2400 + Math.random() * 4200)
}

export function soundOn() {
  if (on) return
  if (!ctx && !build()) return
  ctx.resume()
  on = true
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.setTargetAtTime(0.32, ctx.currentTime, 1.2)
  chord(); timer = setInterval(chord, 9000)
  bellTimer = setTimeout(bell, 3000)
  try { localStorage.setItem(KEY, 'on') } catch { /* optional */ }
  emit()
}

export function soundOff() {
  if (!on) return
  on = false
  clearInterval(timer); clearTimeout(bellTimer)
  if (ctx) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0, ctx.currentTime, 0.35); setTimeout(() => { if (!on) ctx.suspend() }, 1800) }
  try { localStorage.setItem(KEY, 'off') } catch { /* optional */ }
  emit()
}

export const toggleSound = () => (on ? soundOff() : soundOn())
export const isSoundOn = () => on
export function subscribe(f) { subs.add(f); return () => subs.delete(f) }
export function wantsSound() { try { return localStorage.getItem(KEY) === 'on' } catch { return false } }

/** If the visitor left sound on last time, resume it at their first gesture on this visit. */
export function resumeOnGesture() {
  if (typeof window === 'undefined' || !wantsSound()) return
  const go = () => { soundOn(); off() }
  const off = () => { window.removeEventListener('pointerdown', go); window.removeEventListener('keydown', go) }
  window.addEventListener('pointerdown', go, { once: true })
  window.addEventListener('keydown', go, { once: true })
}
