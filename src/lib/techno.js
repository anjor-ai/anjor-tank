/* ═══════════════════════════════════════════════════════════════════════════
   A techno loop made in the browser with the Web Audio API: nothing is downloaded and nothing is sampled.
   128 BPM, sixteen steps a bar: a kick on every beat, a clap on two and four, open hats on the off-beats,
   closed hats between, and a filtered saw bass. Only ever started by a press; stops when the page leaves.
   ═══════════════════════════════════════════════════════════════════════════ */

export const BPM = 128
export const PATTERN = {
  Kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  Clap: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  Hat: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  Bass: [0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1],
}
const BASS = [0, 0, 55, 55, 0, 0, 55, 0, 0, 65.41, 55, 0, 0, 0, 49, 55]

export function createTechno({ onStep } = {}) {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  const ctx = new AC()
  const out = ctx.createGain()
  out.gain.value = 0.32
  const comp = ctx.createDynamicsCompressor()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 128
  out.connect(comp).connect(analyser).connect(ctx.destination)

  const noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
  const nd = noise.getChannelData(0)
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1

  const kick = (t) => {
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.frequency.setValueAtTime(150, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14)
    g.gain.setValueAtTime(1, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.34)
    o.connect(g).connect(out); o.start(t); o.stop(t + 0.36)
  }
  const hiss = (t, { f = 8000, type = 'highpass', q = 0.7, level = 0.2, len = 0.05 }) => {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain()
    s.buffer = noise; fl.type = type; fl.frequency.value = f; fl.Q.value = q
    g.gain.setValueAtTime(level, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + len)
    s.connect(fl).connect(g).connect(out); s.start(t); s.stop(t + len + 0.02)
  }
  const bass = (t, hz, dur) => {
    const o = ctx.createOscillator(), fl = ctx.createBiquadFilter(), g = ctx.createGain()
    o.type = 'sawtooth'; o.frequency.value = hz
    fl.type = 'lowpass'; fl.Q.value = 8
    fl.frequency.setValueAtTime(900, t)
    fl.frequency.exponentialRampToValueAtTime(140, t + dur)
    g.gain.setValueAtTime(0.22, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + dur)
    o.connect(fl).connect(g).connect(out); o.start(t); o.stop(t + dur + 0.02)
  }

  const step = 60 / BPM / 4
  let next = 0, i = 0, timer = 0, on = false
  const ui = []
  const tick = () => {
    while (next < ctx.currentTime + 0.12) {
      const s = i % 16, t = next
      if (PATTERN.Kick[s]) kick(t)
      if (PATTERN.Clap[s]) hiss(t, { f: 1500, type: 'bandpass', q: 1.2, level: 0.35, len: 0.12 })
      if (PATTERN.Hat[s]) hiss(t, { level: 0.22, len: 0.09 })
      else hiss(t, { level: 0.06, len: 0.025 })
      if (PATTERN.Bass[s]) bass(t, BASS[s], step * 0.9)
      if (onStep) ui.push(setTimeout(() => on && onStep(s), Math.max(0, (t - ctx.currentTime) * 1000)))
      next += step; i += 1
    }
    if (ui.length > 64) ui.splice(0, ui.length - 64)
  }
  return {
    analyser,
    get playing() { return on },
    async start() {
      if (on) return
      await ctx.resume()
      on = true; i = 0; next = ctx.currentTime + 0.06
      tick(); timer = setInterval(tick, 25)
    },
    stop() {
      on = false
      clearInterval(timer); ui.forEach(clearTimeout); ui.length = 0
      ctx.suspend()
    },
    close() { this.stop(); ctx.close() },
  }
}
