// The illustrative work item that every output window on the site draws from, so the whole site tells one story.
// Nothing here is a client result, a measurement or a metric.
// The item follows finding F-001 in `rankedFindings` (system.js): failed payments get one retry.

export const run = {
  id: 'WI-014',
  title: 'Failed payments get one retry',
  finding: 'F-001',
}

// Detect: what the Detectors log. `state` is computed by code; gap = no decision reads the signal.
export const signalLog = {
  title: 'Detectors · Pack 1 · run on exports',
  lines: [
    { sig: 'payments.failure_code', from: 'Payments', to: 'CRM retry rule', state: 'gap' },
    { sig: 'orders.status', from: 'Orders', to: 'Customer messages', state: 'ok' },
    { sig: 'search.zero_result_term', from: 'Search log', to: 'Range planning', state: 'gap' },
    { sig: 'customer.id', from: 'App', to: 'CRM audiences', state: 'ok' },
    { sig: 'storefront.notify_me', from: 'Storefront', to: 'Restock messages', state: 'gap' },
    { sig: 'orders.courier_delay', from: 'Orders', to: 'Customer messages', state: 'gap' },
  ],
  foot: 'Code matched every signal to the decision that reads it. No agent is involved.',
}

// Decide: the Product agent’s two or three solutions, including the cheapest.
export const options = {
  title: 'Solutions for WI-014',
  pick: 'a',
  items: [
    { id: 'a', k: 'Configure', t: 'Branch the existing retry rule on failure type', cheap: true,
      pros: 'Reuses the rule and the captured failure codes.', cons: 'Only as good as the codes the gateway sends.' },
    { id: 'b', k: 'Build', t: 'Build a dedicated retry service', cheap: false,
      pros: 'Full control over timing and channels.', cons: 'The longest path to ship.' },
    { id: 'c', k: 'Run manually', t: 'Have ops reprocess failed payments daily', cheap: false,
      pros: 'No engineering needed.', cons: 'Does not scale past a few cases.' },
  ],
  foot: 'Evidence: Supported. People choose at Gate 2.',
}

// Build: the handoff pack. Counts are computed from these lists.
export const prd = {
  title: 'PRD · Retry failed payments by failure type',
  rev: 'Draft v1',
  sections: [
    { h: 'Problem', p: 'The CRM retry rule treats hard, transient and bank-side failures the same. Gateway failure codes are captured and never read.' },
    { h: 'Goal', p: 'Retry each failure type the way it should be retried, and leave unrecoverable failures alone.' },
    { h: 'Metrics', tag: 'Proposed', rows: [['North star', 'Orders recovered from failed payments'], ['Input', 'Retry success by failure type'], ['Guardrail', 'Duplicate charges, complaint rate']] },
    { h: 'States', p: 'Default, error, pending, success. Each has copy and a next action.' },
    { h: 'Tracking', p: 'retry_attempted, retry_result, failure_class on the order event.' },
    { h: 'Open questions', tag: 'Open', p: 'Card-network decline reasons were not in the export. Who owns them?' },
  ],
}


// The PRD scene: the Product agent writes the spec, a person asks a question, a person comments and the agent revises it in place.
// Illustrative. The requirements follow the Gate 2 decision (configure the retry rule) and the Brain log (Gate 3 sends back the missing bank-side error state).
export const prdScene = {
  agent: { name: 'Product agent', sub: 'Drafts from the Brain', icon: 'pencil', tone: 'sky' },
  crumbs: ['WI-014', 'Product agent', 'PRD.md'],
  placeholder: 'Ask the Product agent',
  ask: 'Turn the Gate 2 decision into a spec our engineers can build.',
  reads: [['Read', 'Finding F-001'], ['Read', 'Gate 2 decision'], ['Read', 'Order events'], ['Write', 'PRD.md']],
  wrote: 'Wrote PRD v1: four requirements, three events and three acceptance checks. It is a draft until Gate 3.',
  question: {
    q: 'Why never retry a hard decline?',
    steps: [['Read', 'Payments export'], ['Read', 'CRM retry rule']],
    a: 'A hard decline is a final refusal from the bank, so a retry rarely changes the result and can look like a second charge attempt. This rests on the failure codes in the export, not on a measured retry result.',
    sources: ['Payments export', 'CRM retry rule'],
    label: 'supported',
    unseen: 'Card-network decline reasons were not in the export.',
  },
  review: { on: 'R3', text: 'Bank-side failures have no error state. Add one.' },
  update: {
    steps: [['Read', 'Comment on R3'], ['Edit', 'R3 and the Error state']],
    done: 'Added bank-side failures to R3 and to the Error state in the wireframe. Linked to the Gate 2 decision.',
  },
  gate: { n: 3, text: 'Gate 3', who: 'PM, designer and engineer review the pack.' },
  doc: {
    title: 'Retry failed payments by failure type',
    meta: ['Owner · Your PM', 'WI-014', 'Gate 3'],
    sections: ['Problem', 'Goal', 'Requirements', 'Metrics', 'Tracking', 'Acceptance', 'Open questions'],
    problem: 'The CRM retry rule treats hard, transient and bank-side failures the same. Gateway failure codes are captured and never read.',
    goal: 'Retry each failure type the way it should be retried, and leave unrecoverable failures alone.',
    reqs: [
      { id: 'R1', t: 'Capture the failure class on every failed payment attempt.' },
      { id: 'R2', t: 'Retry transient failures once, after a short delay. Never retry a hard decline.' },
      { id: 'R3', t: 'Show an error state with a next action for hard and transient failures.', next: 'Show an error state with a next action for hard, transient and bank-side failures.' },
      { id: 'R4', t: 'Send retry_attempted and retry_result with the failure class.' },
    ],
    metrics: [['North star', 'Orders recovered from failed payments'], ['Input', 'Retry success by failure type'], ['Guardrail', 'Duplicate charges, complaint rate']],
    events: [['retry_attempted', 'A retry starts'], ['retry_result', 'A retry ends'], ['failure_class', 'On the order event']],
    accept: ['Tracked events fire on retry', 'The failure path completes', 'The screen matches the wireframe'],
    open: 'Card-network decline reasons were not in the export. Who owns them?',
  },
}

// The design scene: the Design agent builds the prototype frame by frame from the PRD, and a designer comments on it.
// Illustrative. Frame copy comes from `wireframe`; each requirement maps to a screen.
export const designScene = {
  agent: { name: 'Design agent', sub: 'Prototypes from the PRD', icon: 'layers', tone: 'peach' },
  crumbs: ['WI-014', 'Design agent', 'failed-payment.fig'],
  placeholder: 'Ask the Design agent',
  ask: 'Turn the PRD into a prototype. Four states, one flow.',
  reads: [['Read', 'PRD v2 · R1 to R4'], ['Read', 'Design system tokens'], ['Build', '4 frames']],
  built: 'Built four frames from the PRD. Every requirement maps to a screen. Simulated behaviour is labelled.',
  review: { who: 'Your designer', ini: 'DS', on: 'Error', text: 'Offer “Keep my cart” as a second action.' },
  update: {
    steps: [['Read', 'Comment on Error'], ['Edit', 'Error · add link']],
    done: 'Added “Keep my cart” under the main action in the Error frame, with the Link / Secondary component.',
  },
  gate: { text: 'Gate 3', who: 'PM, designer and engineer review the pack.' },
  reqs: ['R1', 'R3', 'R2', 'R4'],
  alt: 'Keep my cart',
  labels: { frame: 'Frame · 390 × 780', h: 'Text / Heading', p: 'Text / Body', b: 'Button / Primary', a: 'Link / Secondary', bar: 'Progress / Indeterminate', ic: 'Icon', sum: 'Order summary' },
}

export const wireframe = {
  title: 'Wireframe · Payment recovery',
  frames: [
    { state: 'Default', head: 'Review order', body: 'Pay ₹ ——', cta: 'Pay now' },
    { state: 'Error', head: 'Payment didn’t go through', body: 'Your bank declined it. Try another method.', cta: 'Try another method', warn: true },
    { state: 'Pending', head: 'Retrying…', body: 'We’ll confirm in a moment.', cta: null },
    { state: 'Success', head: 'Order placed', body: 'We’ve sent the details.', cta: 'View order', ok: true },
  ],
  map: 'Each requirement maps to a screen. Simulated behaviour is labelled.',
}

export const pack = {
  title: 'Handoff pack · WI-014',
  files: [
    { k: 'PRD', v: 'Draft v1', icon: 'pencil' },
    { k: 'Wireframe', v: '4 states', icon: 'layers' },
    { k: 'Tickets', v: ['Capture the failure class', 'Branch the retry rule', 'Add the tracking events'], icon: 'branch' },
    { k: 'Test checklist', v: ['Tracked events fire', 'Failure path completes', 'Screen matches the wireframe', 'Live gateway behaviour', 'Copy tone'], icon: 'check' },
    { k: 'Sources', v: ['Payments export', 'CRM retry-rule configuration'], icon: 'database' },
  ],
  foot: 'Gate 3 releases the pack. The brand’s engineers build from it.',
}

export const systemDesign = {
  title: 'System design · what changes',
  nodes: [
    { id: 'pay', k: 'Payments', t: 'Capture the failure class', tag: 'Change' },
    { id: 'rule', k: 'CRM', t: 'Branch the retry rule', tag: 'Change' },
    { id: 'evt', k: 'Analytics', t: 'Add retry events', tag: 'New' },
  ],
  clash: 'Clash check: the win-back journey also messages on failed orders.',
}

export const qa = {
  title: 'QA report · RC-1',
  items: [
    { t: 'Tracked events fire on retry', s: 'passed' },
    { t: 'Failure path completes', s: 'passed' },
    { t: 'Screen matches the wireframe', s: 'failed' },
    { t: 'Live gateway behaviour', s: 'untested', why: 'No test access' },
    { t: 'Tone of the error copy', s: 'untested', why: 'Needs a person' },
  ],
  rollback: 'Rollback rule agreed before release: pause the branch if duplicate charges appear.',
  foot: 'A failure blocks release. Not tested is never reported as passed.',
}

export const monitor = {
  title: 'Monitor · WI-014',
  checks: [
    { t: 'Release matches the approved spec', s: 'code' },
    { t: 'Unplanned changes', s: 'code' },
    { t: 'Result against the frozen baseline', s: 'code' },
  ],
  verdicts: [
    { id: 'keep', t: 'Keep', d: 'The result holds against the baseline.' },
    { id: 'tune', t: 'Tune', d: 'It helps, but a threshold or a rule needs adjusting.' },
    { id: 'rollback', t: 'Roll back', d: 'It hurt a guardrail or changed something unplanned.' },
  ],
  axis: 'Shape only, not a measurement.',
  foot: 'The verdict and its reason go back to the Brain. An inconclusive result is reported as inconclusive.',
}

export const brainLog = {
  title: 'Brain · decision log · WI-014',
  entries: [
    { g: 'Gate 1', who: 'Brand PM', what: 'Approved', why: 'Real, and worth fixing.', tone: 'ok' },
    { g: 'Gate 2', who: 'PM and leads', what: 'Picked: configure the rule', why: 'The cheapest path that reuses what exists.', tone: 'ok' },
    { g: 'Gate 3', who: 'PM, designer, engineer', what: 'Sent back one step', why: 'The error state is missing for bank-side failures.', tone: 'back' },
    { g: 'Gate 3', who: 'PM, designer, engineer', what: 'Approved the pack', why: 'Error state added and re-checked.', tone: 'ok' },
    { g: 'Gate 4', who: 'Brand approver', what: 'Signed RC-1', why: 'One exact release candidate.', tone: 'ok' },
    { g: 'Outcome review', who: 'PM and analytics owner', what: 'Review the verdict', why: 'Pending the agreed outcome window.', tone: 'pending' },
  ],
  foot: 'Every approval, send-back and reason is stored. The next audit starts from what worked.',
}

export const brief = {
  title: 'Dated brief · how others solve it',
  modes: ['Internal recall', 'External scan'],
  rows: [
    { mode: 'Internal recall', w: 78 },
    { mode: 'External scan', w: 64 },
    { mode: 'External scan', w: 86 },
    { mode: 'Internal recall', w: 52 },
  ],
  foot: 'Every claim is labelled internal or external, dated and sourced. Conflicting evidence stays visible. This is a layout, not a brief.',
}

// Track visuals
export const lanesA = {
  lanes: [
    { id: 'f', name: 'Founders' },
    { id: 'c', name: 'You decide' },
    { id: 'b', name: 'Your team' },
  ],
  cells: [
    { lane: 'f', col: 0, t: 'Audit' },
    { lane: 'c', col: 1, t: 'Gate 1' },
    { lane: 'f', col: 2, t: 'Strategy' },
    { lane: 'c', col: 3, t: 'Gate 2' },
    { lane: 'f', col: 4, t: 'PRDs' },
    { lane: 'c', col: 5, t: 'Gate 3' },
    { lane: 'b', col: 6, t: 'Design, build, test' },
    { lane: 'b', col: 7, t: 'Release' },
    { lane: 'f', col: 8, t: 'Outcome review' },
  ],
  cols: 9,
  note: 'The founders write and govern. Your team designs, builds, tests and releases.',
}

export const stackB = {
  layers: [
    { id: 'monitor', name: 'Monitor', d: 'Alerts and release verification', needs: 'Needs the Brain' },
    { id: 'analyst', name: 'Analyst', d: 'Finding cards with an evidence label', needs: 'Needs the Brain' },
    { id: 'brain', name: 'Brain', d: 'Context, decision register, coverage', needs: 'The foundation' },
  ],
  out: ['Findings inbox', 'Sheets and Slack export', 'Alerts'],
  note: 'Hosted by ROQIVA, one tenant per brand. The output stops at a finding or an alert.',
}

export const boundaryC = {
  inside: ['Brain', 'Analyst', 'Monitor', 'Work items and gates', 'Drafting agents', 'Workspace'],
  outside: 'ROQIVA designs, configures and governs',
  label: 'The brand’s ecosystem',
  note: 'Data and model access stay inside the brand’s accounts. The brand’s teams operate it.',
}

// Headings and leads for the sections of the Example run that show each output of the workflow. Verb-first, like every heading on the site.
export const exampleRun = {
  signals: { eyebrow: 'Signal map', title: 'Trace the signals *no decision reads.*', lead: 'A solid line is read. A dashed line is a gap. Code does the matching, so the same exports always give the same map.' },
  decide: { eyebrow: 'Solutions', title: 'Compare three solutions, *including the cheapest.*', lead: 'Research, Architect and Product draft in parallel. Your people choose at Gate 2.' },
  build: { eyebrow: 'PRD and wireframe', title: 'Review the PRD and wireframe *before Gate 3.*', lead: 'Every requirement maps to a screen. Gate 3 releases the whole pack.' },
  release: { eyebrow: 'Release and result', title: 'Verify the release, then *judge the result.*', lead: 'A failed check blocks release. After release, the Monitor measures against a frozen baseline. The verdict: keep, tune or roll back.' },
  brain: { eyebrow: 'Brain log', title: 'Replay every decision from *the Brain log.*', lead: 'Every approval and send-back is stored with its reason and its approver.' },
}

// The audit scene: detectors match signals to decisions (code), the Analyst ranks findings, a person approves one at Gate 1.
// Illustrative. Rows come from `signalLog` and `rankedFindings`; the score is computed, never typed.
export const auditScene = {
  agent: { name: 'Analyst', sub: 'Audits the exports', icon: 'search', tone: 'violet' },
  detectors: { name: 'Detectors', icon: 'radar', tone: 'mint' },
  crumbs: ['WI-014', 'Analyst', 'Findings inbox'],
  crumbsDetect: ['WI-014', 'Detectors', 'Signals'],
  placeholder: 'Ask the Analyst',
  ask: 'Audit last quarter’s exports. What do we capture that no decision reads?',
  askRank: 'Rank the gaps the Detectors flagged.',
  noGate: 'Code matched every signal. No one needs to approve a log entry.',
  reads: [['Read', 'Payments export'], ['Read', 'CRM retry-rule configuration']],
  matched: 'Code matched every signal to the decision that reads it. No agent is involved.',
  rank: [['Check', 'Evidence for each gap'], ['Rank', 'Value × confidence ÷ effort']],
  ranked: 'Ranked the findings. F-001 comes first. Evidence is labelled, and nothing here is a measured result.',
  approve: 'Approve F-001. Open the work item.',
  gate: { text: 'Gate 1', who: 'Brand PM confirms the problem is real and worth fixing.', btn: 'Approve', done: 'Approved' },
}

// The decide scene: three agents run in parallel, Product drafts the solutions, people pick one at Gate 2.
export const decideScene = {
  agent: { name: 'Product agent', sub: 'Drafts the solutions', icon: 'pencil', tone: 'sky' },
  crumbs: ['WI-014', 'Product agent', 'Solutions'],
  placeholder: 'Ask the Product agent',
  ask: 'Draft solutions for F-001. Include the cheapest.',
  steps: [['Research', 'Outside evidence'], ['Architect', 'What to reuse, what could clash'], ['Product', 'Draft two or three solutions']],
  done: 'Three solutions with trade-offs. The cheapest is first. People choose at Gate 2.',
  pick: 'Go with the first one.',
  gate: { text: 'Gate 2', who: 'PM and leads pick the solution.', btn: 'Pick A', done: 'Picked A' },
}

// The release scene: QA reports passed, failed and not tested. A failure blocks release. A person signs one exact candidate.
export const releaseScene = {
  agent: { name: 'QA agent', sub: 'Checks the build', icon: 'check', tone: 'mint' },
  crumbs: ['WI-014', 'QA agent', 'RC-1'],
  placeholder: 'Ask the QA agent',
  ask: 'Run the checks on RC-1.',
  steps: [['Run', 'Checks from the pack'], ['Write', 'QA report']],
  report: 'One check failed, and a failure blocks release. Two were not tested, and they are not reported as passed.',
  fix: { who: 'Brand engineer', ini: 'EN', text: 'Fixed the error screen. Please re-check it.' },
  rerun: { steps: [['Re-run', 'Screen matches the wireframe']], done: 'Passed. The two untested checks still need a person or test access.' },
  gate: { text: 'Gate 4', who: 'Brand approver signs one exact release candidate.', btn: 'Sign RC-1', done: 'Signed' },
  blocked: 'Release blocked',
  clear: 'Ready to sign',
}

// The monitor scene: code checks the release, then judges the result against a frozen baseline. Shape only.
export const monitorScene = {
  agent: { name: 'Monitor', sub: 'Code. No agent.', icon: 'radar', tone: 'mint' },
  crumbs: ['WI-014', 'Monitor', 'Outcome'],
  steps: [['Check', 'Release matches the approved spec'], ['Check', 'Unplanned changes'], ['Compare', 'Result against the frozen baseline']],
  done: 'The result holds against the baseline, so the verdict is Keep. The verdict and its reason go to the Brain.',
  verdict: 'keep',
  gate: { text: 'Outcome review', who: 'PM and analytics owner review the verdict.' },
}

// The brain scene: someone asks why, and the Brain replays the decision log.
export const brainScene = {
  agent: { name: 'Brain', sub: 'Decision log', icon: 'brain', tone: 'violet' },
  crumbs: ['WI-014', 'Brain', 'Decision log'],
  placeholder: 'Ask the Brain',
  ask: 'Why was the pack sent back at Gate 3?',
  steps: [['Read', 'Decision log · WI-014']],
  answer: 'The error state was missing for bank-side failures. Gate 3 sent the pack back one step, the state was added and re-checked, and the pack was then approved.',
}

// The research scene: the Research agent brings internal and outside evidence into a dated brief. The rows are the layout of a brief, not findings.
export const researchScene = {
  agent: { name: 'Research agent', sub: 'Brings outside evidence', icon: 'search', tone: 'orange' },
  crumbs: ['WI-014', 'Research agent', 'Dated brief'],
  placeholder: 'Ask the Research agent',
  ask: 'How do others handle failed-payment retries? Label what is internal and what is external.',
  steps: [['Recall', 'Internal decision register'], ['Scan', 'Outside sources']],
  done: 'Brief drafted. Every claim is labelled internal or external, dated and sourced. It goes to Product with the evidence label.',
  chips: ['Sourced', 'Dated'],
}

// The architect scene: the Architect agent maps what changes and checks what could clash. Nodes come from `systemDesign`.
export const architectScene = {
  agent: { name: 'Architect agent', sub: 'Checks reuse and clashes', icon: 'branch', tone: 'amber' },
  crumbs: ['WI-014', 'Architect agent', 'System design'],
  placeholder: 'Ask the Architect agent',
  ask: 'What changes, and what could clash?',
  steps: [['Read', 'CRM retry-rule configuration'], ['Map', 'Systems that change'], ['Check', 'Journeys that message on failed orders']],
  clashNode: 'Win-back journey',
}
