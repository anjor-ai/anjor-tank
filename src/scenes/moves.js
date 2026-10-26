/* Shared moves for the scene scripts: the things every scene does the same way. */

/** A person types a prompt in the composer and sends it. `i` picks which typed line (comp-type{i}); `msgK` is the message that lands.
 *  `first` makes the cursor appear; otherwise it must already be on screen. Returns the time the message has landed. */
export function pmAsk(d, pm, i, at, msgK, { first = true } = {}) {
  const $ = d.$
  let t = at
  if (first) { pm.at('comp-ph', t, { fx: 0.85, fy: 0.5, dx: 60, dy: 70 }); t += 0.25 }
  t = pm.to('comp-ph', t, { fx: 0.18, fy: 0.5, dur: first ? 0.9 : 0.8 })
  t = pm.click(t + 0.05)
  d.out($('comp-ph'), t, { dur: 0.15 })
  t = d.type(`comp-type${i}`, t + 0.15, { cps: 34 })
  t = pm.to('comp-send', t + 0.3, { fx: 0.5, fy: 0.5, dur: 0.55 })
  pm.click(t + 0.05); d.press('comp-send', t + 0.05)
  d.clearType(`comp-type${i}`, t + 0.25)
  d.show($('comp-ph'), t + 0.5)
  t = d.show($(msgK), t + 0.25)
  d.scroll('tcol', msgK, t - 0.4, { align: 'bottom', margin: 12 })
  return t
}

/** A person presses the button on a gate strip. The button goes, the state pill changes. */
export function gatePress(d, cursor, at, { from = 'gs-wait', to = 'gs-ok' } = {}) {
  const $ = d.$
  let t = cursor.to('gbtn', at, { fx: 0.5, fy: 0.5, dur: 0.7 })
  cursor.click(t + 0.05); d.press('gbtn', t + 0.05)
  d.out($('gbtn'), t + 0.3, { dur: 0.2 })
  t = d.swap(from, to, t + 0.3)
  return t
}
