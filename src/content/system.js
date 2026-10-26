// The ROQIVA system, as designed: the rules, the six-step workflow, the five moving
// parts, the six agents, the finding card and how it could be put in place. Pages read from here; nothing is retyped in components.

// ═══════════ The three rules and the three actors ═══════════
export const actors = {
  code: { label: 'Code', d: 'Computes, matches, routes and measures. Deterministic and reproducible.' },
  agent: { label: 'Agent', d: 'Drafts one artifact from a scoped slice of the Brain. Writes to a workspace, never a live system.' },
  person: { label: 'Person', d: 'Decides at a gate. Every gate has a named approver.' },
}

export const rules = [
  { n: '01', actor: 'code', t: 'Code computes', d: 'Every count, join and ranking comes from code you can reproduce. No agent computes a number.' },
  { n: '02', actor: 'agent', t: 'Agents draft', d: 'Agents write drafts to a workspace. They never write to a live system, and never approve their own work.' },
  { n: '03', actor: 'person', t: 'People decide', d: 'Four gates and one outcome review, each with a named approver. Any gate can send the item back with a reason.' },
]

// "At a glance": the loop in three verbs.
export const glance = [
  { n: '01', verb: 'Find', d: 'Detectors match every captured signal to the decision that reads it, and flag the data that nothing uses.' },
  { n: '02', verb: 'Decide', d: 'Agents draft the options, the PRD and the checks. People choose at four gates, and any gate can send the work back.' },
  { n: '03', verb: 'Prove', d: 'Your engineers ship the fix. The Monitor measures it against a frozen baseline: keep, tune or roll back.' },
]

// ═══════════ Workflow: six steps, four gates, one outcome review ═══════════
// `who` names who works. `by` is the actor kinds, in order. `gate` is what follows the step (null = none, logged).
export const workflow = {
  note: 'Any gate can send the item back one step, with a reason the Brain keeps. Gates 2 and 3 may merge for a small change. Gates 1 and 4 are never skipped.',
  steps: [
    { n: '01', name: 'Detect', who: 'Detectors', by: ['code'], out: 'Signal: data captured that no decision reads',
      gate: null, gateNote: 'None, logged',
      does: 'Detectors match every captured signal to the decision that reads it and flag the gaps. Code does the matching. No agent is involved, and no one needs to approve a log entry.' },
    { n: '02', name: 'Audit', who: 'Analyst', by: ['agent'], out: 'Ranked finding cards',
      gate: { n: 1, name: 'Problem', who: 'Brand PM', does: 'confirms the problem is real and worth fixing' },
      does: 'The Analyst reads the flagged gap, writes what should happen and what does happen, checks the evidence, labels it Confirmed, Supported or Hypothesis, sizes the value as a range and ranks it. Gate 1 opens the work item.' },
    { n: '03', name: 'Decide', who: 'Research, Architect, Product', by: ['agent'], out: 'One chosen product solution, with evidence',
      gate: { n: 2, name: 'Direction', who: 'PM and leads', does: 'pick the solution' },
      does: 'Research brings outside evidence. Architect checks what can be reused and what could clash. Product drafts two or three solutions with trade-offs, including the cheapest one. They run in parallel, and people choose.' },
    { n: '04', name: 'Build', who: 'Product, Design, Architect, QA', by: ['agent'], out: 'Handoff pack',
      gate: { n: 3, name: 'Design and PRD', who: 'PM, designer and engineer', does: 'approve the pack' },
      does: 'Product writes the requirements and the PRD draft. Design turns them into a reviewable prototype. Architect draws the system design. QA drafts the checks. Gate 3 releases the handoff pack: PRD, wireframe, tickets, test checklist and sources.' },
    { n: '05', name: 'Release', who: 'Brand engineers, QA', by: ['person', 'agent'], out: 'Release pack: QA report, checks, rollback rule',
      gate: { n: 4, name: 'Release', who: 'Brand approver', does: 'signs one exact release candidate, and the brand ships' },
      does: 'The brand’s engineers build and deploy. The system never writes to their tools. QA reports passed, failed and not tested. The measurement plan is agreed before release.' },
    { n: '06', name: 'Measure', who: 'Monitor', by: ['code'], out: 'Outcome verdict: keep, tune or roll back',
      gate: { n: '↻', name: 'Outcome review', who: 'PM and analytics owner', does: 'review the verdict' },
      does: 'The Monitor checks the release against its spec, catches unplanned changes and measures the result against a baseline. The verdict and the reason go back to the Brain.' },
  ],
}

// ═══════════ Moving parts ═══════════
export const parts = {
  lead: 'Five parts, plus your people and your tools. Each part runs on its own.',
  items: [
    { id: 'brain', name: 'Brain', kind: 'Store', d: 'One versioned model of the brand: tools, rules, design system, decisions, outcomes. Holds context and decides nothing.' },
    { id: 'detectors', name: 'Detectors and Analyst', kind: 'Code and one agent', d: 'Detectors match every captured signal to the decision that reads it. The Analyst judges, labels and ranks what they find.' },
    { id: 'orchestrator', name: 'Orchestrator', kind: 'Code', d: 'Opens work items, runs agents in parallel, stops at gates and blocks two items touching the same page, event or segment.' },
    { id: 'drafting', name: 'Drafting agents', kind: 'Agents', d: 'Research, Architect, Product, Design and QA each draft one artifact.' },
    { id: 'monitor', name: 'Monitor', kind: 'Code', d: 'Checks releases against their spec, catches unplanned changes and measures results against a baseline.' },
    { id: 'people', name: 'People', kind: 'Humans', d: 'Four gates and one outcome review, each with a named approver.' },
    { id: 'tools', name: 'Brand tools and engineers', kind: 'External', d: 'The source of truth. Engineers build and deploy. The system never writes to them.' },
  ],
  supporting: [
    { t: 'Refresh the Brain only after a person confirms it', d: 'Agents never refresh the Brain. A person confirms what each part means before a new version is published.' },
    { t: 'Watch releases without deploying', d: 'The Monitor checks what shipped against what was approved. It never deploys, and it never rolls anything back on its own.' },
  ],
  orchestratorRules: 'Agents never talk to each other. The Orchestrator routes their work and is the only part that writes to the Brain.',
}

// ═══════════ Agents ═══════════
export const evidence = [
  { id: 'confirmed', label: 'Confirmed', d: 'Code reproduced the counts.' },
  { id: 'supported', label: 'Supported', d: 'The evidence is consistent, but the counts are not yet reproduced.' },
  { id: 'hypothesis', label: 'Hypothesis', d: 'Not yet confirmed. Dormant data stays a hypothesis until its owner confirms.' },
]

export const agents = {
  lead: 'Six roles, one job each. Every agent reads a scoped slice of the Brain, drafts one artifact and stops at a gate.',
  code: [
    { name: 'Detectors', d: 'Match every captured signal to the decision that reads it and flag the gaps. Code, not an agent.' },
    { name: 'Orchestrator', d: 'Opens work items, runs agents in parallel, stops at gates, and is the only writer to the Brain.' },
    { name: 'Monitor', d: 'Checks releases against their spec, catches unplanned changes and measures results against a baseline. It never deploys.' },
  ],
  everyAgent: {
    skills: ['citing-evidence', 'reading-brand-context', 'handing-off-artifacts'],
    note: 'Every agent also preloads three shared skills: citing evidence, reading brand context and handing off artifacts.',
  },
  items: [
    { id: 'analyst', name: 'Analyst', verb: 'Find gaps between signals and decisions',
      job: 'Turn detector hits and questions into finding cards a PM can decide on.',
      glance: 'Find gaps between signals and decisions. Write evidence-labelled finding cards.',
      modes: ['Triage', 'Card', 'Asked question', 'Regression'],
      reads: 'Systems, Journeys, Data and Logic sections. Signal aggregates.',
      writes: 'Finding card',
      after: 'Review, then Gate 1',
      starts: 'Detectors raise a gap, an audit cycle runs, or a person asks why a number moved.',
      how: [
        'Reads the flagged gap and the Brain slice: the brand’s tools, data model, rules and metrics.',
        'Writes the intended behaviour: what the brand’s own rule, campaign or flow is meant to do with this signal. A payment failure reason should decide how the failure is retried.',
        'Writes the observed behaviour: what the data shows actually happens. The retry rule treats every failure the same.',
        'Checks the evidence: finds the source for each claim and has code reproduce the counts. The gap between intended and observed is the finding.',
        'Labels it Confirmed, Supported or Hypothesis. Dormant data stays Hypothesis until its owner confirms.',
        'Sizes value as a range, sets effort and owner, and lists what it could not see.',
        'Ranks it in the incident or the opportunity lane.',
      ],
      hands: 'Finding card, to review, then the brand’s decision at Gate 1.',
      never: 'Approves its own finding, reports an unseen area as healthy, or computes counts. Code computes.',
      tools: ['brain_read', 'signals_query', 'artifact_write'],
      skills: ['diagnosing-signal-gaps', 'writing-finding-cards'],
      pattern: 'One loop and a clean-context verifier.' },
    { id: 'research', name: 'Research', verb: 'Bring outside evidence for one decision',
      job: 'Bring outside evidence on how others solve the problem.',
      glance: 'Bring outside evidence for one decision.',
      modes: ['Internal recall', 'External scan', 'Benchmark brief', 'Refresh'],
      reads: 'A confirmed finding. Internal recall reads Journeys, Logic, accepted learnings and problem memories. External scan reads the web.',
      writes: 'Notes and a dated brief',
      after: 'Requester accepts',
      starts: 'Gate 1 is approved, or a designer, PM or growth lead asks for a standalone benchmark.',
      how: [
        'Reads the confirmed finding and the decision it affects.',
        'Gathers how comparable brands and vendors solve it, with source and date on every claim.',
        'Keeps conflicting evidence visible.',
        'Writes a dated brief.',
      ],
      hands: 'Dated brief, to Product (and to Design when a designer asked).',
      never: 'Presents a benchmark as a measured result for this brand. It works from outside sources only and sees no customer data or credentials.',
      tools: ['web_search', 'web_fetch', 'artifact_write'],
      skills: ['researching-decision-briefs', 'weighing-sources'],
      pattern: 'Gather loop, then one writing call.',
      tracks: { A: 'Internal tool', B: 'Not sold', C: 'Included' },
      extra: { title: 'Two modes, so private data and the open web never meet in one run',
        body: 'Internal recall reads the Brain and has no network tools. External scan searches the web and sees only a sanitised question. A brief combines both, with every claim labelled, dated and sourced.' } },
    { id: 'architect', name: 'Architect', verb: 'Design how the fix fits the existing system',
      job: 'Design how the fix fits your existing tools, rules and data. Engineers then specify the APIs and code.',
      glance: 'Design the target system in plain terms.',
      modes: ['Reuse and clash', 'System design', 'Preflight', 'Revise'],
      reads: 'Finding, Systems, Data and Logic, Delivery sections. The dependency graph.',
      writes: 'Reuse note, system design, impact report',
      after: 'Gate 2, then engineer review',
      starts: 'Gate 1 is approved (reuse and clash check), Gate 2 is approved (system design), or an engineer or PM asks “will this break anything?” or “configure, integrate or build?”',
      how: [
        'Reads the finding and the Systems, Data and Logic sections.',
        'Finds what already exists and can be reused.',
        'Checks the dependency graph for rules, campaigns and tracking the change could clash with.',
        'After Gate 2, draws the target system design: which tools change, and what each must capture, read or pass on, in plain terms.',
        'Lists what must exist first and what the change touches.',
        'For configure, integrate or build, compares the paths at system level: fit, cost and what each replaces.',
      ],
      hands: 'Reuse note and clash list, to Product. System design and build brief, to Product, QA and the engineers who detail it.',
      never: 'Writes API contracts, payloads, schemas or code.',
      tools: ['brain_read', 'graph_query', 'artifact_write'],
      skills: ['mapping-system-dependencies', 'designing-target-systems', 'drawing-system-diagrams'],
      pattern: 'One loop.' },
    { id: 'product', name: 'Product', verb: 'Own the problem framing, the solutions and the PRD',
      job: 'Own the problem framing, the product solutions and the PRD.',
      glance: 'Own problem framing, solutions, requirements and the PRD.',
      modes: ['Solutions', 'Requirements', 'PRD revision', 'Patch', 'Tracking check'],
      reads: 'Finding, brief, reuse note, design, prototype summary.',
      writes: 'Solutions, requirements, PRD revisions, patches',
      after: 'Gate 2, then Gate 3',
      starts: 'Gate 1 is approved (solutions), Gate 2 is approved (requirements and PRD draft), the prototype or system design changes (PRD revision), or the PM edits the PRD or asks a question.',
      how: [
        'Frames the problem from the finding, the brief and the reuse note.',
        'Drafts two or three product solutions, including the cheapest one (configure, buy, build or run manually), with trade-offs, evidence and an agent pick.',
        'After Gate 2, writes the requirements, the user flow and every state (default, error, pending, success) as the brief for Design, and starts the PRD draft from the fixed template.',
        'Keeps the PRD current as the prototype and system design change, including what must be tracked. A missing fact becomes an open question, never a guess.',
        'Returns every PRD change as a reviewable patch against the revision the PM saw.',
        'Answers “does this event already exist?” against the tracking register.',
      ],
      hands: 'Solutions, to Gate 2. Requirements, to Design. PRD and tracking gap list, to Gate 3.',
      never: 'Overwrites text a person saved.',
      tools: ['brain_read', 'artifact_write', 'patch_propose', 'ask_human'],
      skills: ['proposing-product-solutions', 'writing-requirements', 'coauthoring-prds', 'proposing-prd-patches'],
      pattern: 'One loop. The sole writer of the PRD.',
      tracks: { A: 'Internal tool for PRD drafts', B: 'Not sold', C: 'Included' },
      extra: { title: 'Product metrics are proposed, never invented',
        body: 'Product proposes a north star, input metrics and guardrails, each tied to a definition and the data that would verify it. The PM confirms. A metric the data can’t compute becomes an open question.' } },
    { id: 'design', name: 'Design', verb: 'Turn requirements into a reviewable prototype',
      job: 'Turn requirements into a reviewable HTML prototype in the brand’s design system.',
      glance: 'Turn requirements into a reviewable prototype.',
      modes: ['From Product', 'From a designer', 'Revise'],
      reads: 'Requirements, the Design section, the current prototype.',
      writes: 'Prototype HTML, requirement-to-screen map',
      after: 'Gate 3',
      starts: 'Gate 2 is approved (from Product), a designer asks for a screen, variation or extra state, or the PRD changes or someone comments (revise).',
      how: [
        'Resolves brand context from the design system in the Brain. With none on file, it infers one from the live site and labels it inferred.',
        'Drafts screens covering every state and maps each requirement to a screen.',
        'Checks the draft against the design system.',
        'Publishes a new revision in the workspace, interactive and shareable. A synced copy goes to the design tool when one is connected.',
        'On a revision, updates only the affected screens and keeps the old revision.',
      ],
      hands: 'Prototype and requirement-to-screen map, to Product (for the PRD) and Gate 3.',
      never: 'Sees customer personal data, or shows behaviour that does not exist yet without labelling it simulated.',
      tools: ['brain_read', 'artifact_write', 'html_check'],
      skills: ['building-html-prototypes', 'applying-design-systems', 'designing-states-and-flows'],
      pattern: 'Draft, check, revise.' },
    { id: 'qa', name: 'QA', verb: 'Define and report the checks that prove the change works',
      job: 'Define and report the checks that decide whether a release is safe.',
      glance: 'Define and report the checks that prove the change works.',
      modes: ['Plan', 'Report', 'Browser checks'],
      reads: 'PRD, prototype summary, test results.',
      writes: 'Checklist, QA report',
      after: 'Gate 3 for the checklist, Gate 4 for the report',
      starts: 'A prototype and PRD are in draft (checklist), a candidate is on staging (run), or a fix arrives (re-check).',
      how: [
        'Maps every acceptance criterion to a check and proposes edge cases.',
        'Runs what staging supports: tracked events fire, the flow completes including failure paths, the screen matches the wireframe.',
        'Hands the rest to people: customer fit, tone of copy, live payment or courier behaviour without test access.',
        'Reports passed, failed and not tested. A re-check runs only the affected checks.',
      ],
      hands: 'Checklist, to Gate 3. QA report, to the Gate 4 approver.',
      never: 'Certifies an environment it did not test. A failure blocks release.',
      tools: ['brain_read', 'artifact_write', 'run_check'],
      skills: ['deriving-test-checklists', 'reporting-qa-results'],
      pattern: 'One loop. Code runs the checks.' },
  ],
  // Handoffs between agents (the doc's "Agents and handoffs" table).
  handoffs: {
    note: 'Read top to bottom. Agents on the same row run in parallel.',
    cols: ['Agent', 'Starts when', 'Reads', 'Produces', 'Hands to'],
    rows: [
      ['Analyst', 'A detector raises a gap, or a person asks why a number moved', 'Detector hits; Systems, Journeys, Data and Logic sections', 'Finding card', 'Review, then a decision at Gate 1'],
      ['Research', 'Gate 1 approved, or a person asks for a benchmark', 'Confirmed finding', 'Dated brief: sourced benchmarks, conflicts kept visible', 'Product'],
      ['Architect', 'Gate 1 approved, then Gate 2 approved', 'Finding; Systems, Data and Logic sections; chosen option', 'Reuse note and clash list. After Gate 2: system design (what changes, what depends on it)', 'Product, QA'],
      ['Product', 'Gate 1 approved', 'Finding, brief, reuse note', 'Two or three product solutions with trade-offs and an agent pick (Gate 2). Requirements and every state. PRD draft, kept current as design evolves', 'Design, then Gate 3'],
      ['Design', 'Gate 2 approved', 'Requirements; Design section', 'Prototype and requirement-to-screen map', 'Product, then Gate 3'],
      ['QA', 'Prototype and PRD in draft', 'Acceptance criteria, design states, tracking requirements', 'Test checklist (Build step). QA report: passed, failed, not tested (Release step)', 'Gate 3, then Gate 4'],
    ],
    after: 'Gate 3 releases the handoff pack: PRD, wireframe, tickets, test checklist and sources.',
    mvp: 'These are the reference roles in ROQIVA’s developing architecture. Design and QA drafts are inputs to the brand’s own team, who build and test.',
  },
  // Rules that hold for every agent.
  commonRules: [
    { t: 'Draft only', d: 'Write to a workspace, a design draft or a branch, never to a live system.' },
    { t: 'Evidence on everything', d: 'Each output cites its source and carries Confirmed, Supported or Hypothesis. A missing fact becomes an open question.' },
    { t: 'Versioned and linked', d: 'Each output links to its finding. A new direction supersedes older artifacts explicitly.' },
    { t: 'Minimum context', d: 'Each agent sees only the slice its task needs.' },
    { t: 'Source authority', d: 'A live order record outranks a stale spreadsheet. Conflicts are shown, not silently resolved.' },
    { t: 'Feedback stays local', d: 'A comment or edit changes that task. Only the owner of a Brain section or a skill can turn it into a standing rule.' },
    { t: 'A visible profile', d: 'Every agent shows its purpose, version, skills, tools, caps, kill switch and latest eval result. Its runs appear in the case timeline under its name.' },
    { t: 'A run sees only what its requester may see', d: 'Restricted Brain sections and sources are left out of its slice, and what it writes carries the same restriction.' },
  ],
  absence: 'Absence is not evidence of non-use. Without the decision’s configuration or the owner’s word, a signal is “usage unknown”, a coverage gap rather than a finding.',
}

// ═══════════ The finding card ═══════════
export const findingCard = {
  lead: 'One concise view of the problem, its evidence, potential value, ownership and what remains unknown—so a decision-maker can choose the next action without restarting the investigation.',
  fields: [
    { id: 'expected', k: 'Expected', q: 'What should happen', ex: 'A payment failure reason changes how the failure is retried.' },
    { id: 'observed', k: 'Observed', q: 'What actually happens', ex: 'Gateway failure codes are captured on every attempt, but the CRM retry rule treats hard, transient and bank-side failures the same.' },
    { id: 'sources', k: 'Sources', q: 'Where the evidence comes from', ex: 'Payments export. CRM retry-rule configuration.' },
    { id: 'label', k: 'Evidence label', q: 'How proven it is', ex: 'Supported' },
    { id: 'value', k: 'Value range', q: 'What fixing it could be worth', ex: 'Not sized in this illustration. A real card gives a range from the brand’s own numbers, labelled by proof level. Never a single promise.' },
    { id: 'effort', k: 'Effort and owner', q: 'What it costs and who must act', ex: 'An engineering estimate, and the team that owns the retry rule.' },
    { id: 'unseen', k: 'Not seen', q: 'What the Analyst could not inspect', ex: 'Card-network decline reasons were not in the export. Unseen is never reported as healthy.' },
  ],
  lanes: 'Two lanes: incidents (a live break) and opportunities (upside). Priority = value × confidence ÷ effort.',
  note: 'This example is illustrative. It is not a finding for any brand.',
}

// Illustrative ranked findings. Value, confidence and effort are on a 1–3 scale. Score = value × confidence ÷ effort, computed in code.
export const rankedFindings = [
  { id: 'F-001', t: 'Failed payments get one retry', path: 'Payments → CRM retry rule', lane: 'Incident', v: 3, c: 3, e: 1, label: 'supported' },
  { id: 'F-002', t: 'Zero-result searches never reviewed', path: 'Search log → range planning', lane: 'Opportunity', v: 3, c: 2, e: 2, label: 'supported' },
  { id: 'F-003', t: 'Notify-me sign-ups never read', path: 'Storefront → restock messages', lane: 'Opportunity', v: 2, c: 1, e: 1, label: 'hypothesis' },
  { id: 'F-004', t: 'Courier delay events unused', path: 'Orders → customer messages', lane: 'Incident', v: 2, c: 3, e: 2, label: 'confirmed' },
  { id: 'F-005', t: 'COD rule with no refusal history', path: 'Orders → COD eligibility', lane: 'Opportunity', v: 1, c: 2, e: 2, label: 'supported' },
  { id: 'F-006', t: 'City stock shown as one national total', path: 'Inventory → product page', lane: 'Incident', v: 1, c: 3, e: 2, label: 'supported' },
]
/** Priority score: value × confidence ÷ effort. */
export const score = (f) => (f.v * f.c) / f.e

// ═══════════ Detector lanes (what the Detectors look at) ═══════════
export const detectors = {
  lead: 'ROQIVA looks for gaps across nine commercial areas. The packs below show the planned detector coverage and where each one stands in development.',
  packs: { 1: { label: 'Pack 1', status: 'available' }, 2: { label: 'Pack 2', status: 'planned' }, 3: { label: 'Pack 3', status: 'planned' } },
  lanes: [
    { id: 'A', name: 'Acquisition and discovery', flows: 'Ads, catalogue feeds, landing pages, search, attribution tags', check: 'Ad price and region match the landing page. Campaign tags reach analytics.', pack: 2 },
    { id: 'B', name: 'Account and identity', flows: 'Sign-up, login, guest-to-user merge, consent', check: 'One customer key joins app, CRM and orders. Consent flags reach the CRM.', pack: 1 },
    { id: 'C', name: 'Shopping and conversion', flows: 'Search, product page, cart, checkout, payment', check: 'Payment failure reasons are captured. Coupon rules match cart logic.', pack: 1 },
    { id: 'D', name: 'Fulfilment', flows: 'Order routing, delivery promise, RTO', check: 'The delivery promise shown matches the delivery data customers are sent.', pack: 2 },
    { id: 'E', name: 'Post-purchase service', flows: 'Tickets, refunds, returns, grievance rules', check: 'Support status reaches the CRM. Customer scores drive grievance and return rules.', pack: 2 },
    { id: 'F', name: 'Retention and lifecycle', flows: 'Reorder, win-back, loyalty, notifications', check: 'User properties feed audiences. Journeys do not conflict or double-send.', pack: 1 },
    { id: 'G', name: 'Channel and partner management', flows: 'Marketplaces, quick commerce, offline, affiliates', check: 'Affiliate payouts match delivered orders. Price and stock agree across channels.', pack: 3 },
    { id: 'H', name: 'Supply, planning and back-office', flows: 'Inventory, demand, catalogue operations, pricing', check: 'New SKUs reach marketing. Demand signals reach stock decisions.', pack: 3 },
    { id: 'I', name: 'Compliance and trust', flows: 'Consent, regulatory checks, fraud controls', check: 'Consent is honoured in every sending tool. Gates cannot be bypassed by a flow.', pack: 3 },
  ],
}

// ═══════════ How ROQIVA is meant to be put in place (in development) ═══════════
// Only the ROQIVA half is kept here: the two prospective ways it could be deployed, what stays with the brand, and the rules it keeps.
export const tracks = {
  c: {
    ways: {
      cols: ['', 'Blueprint and governed build', 'Packaged deployment'],
      rows: [
        ['What it is', 'A custom build on the brand’s own stack, following an agreed blueprint and the brand’s engineering plan', 'A packaged ROQIVA, installed inside the brand’s own cloud'],
        ['Who builds', 'The brand’s engineers, to a specification and acceptance tests I write', 'A portable deployment profile, still to be built'],
        ['Needs from the brand', 'An engineering owner and an architecture review', 'Infrastructure, identity, security and integration approvals'],
        ['Needs from ROQIVA', 'Design, requirements and governance', 'The package, an upgrade path and second-line support'],
        ['Ready', 'In development', 'Planned; not production-ready'],
      ],
      note: 'Two prospective ways to adopt ROQIVA. Neither is available for production use yet, and the final shape depends on product development and security review.',
    },
    differs: [
      'Data and prompts stay in the brand’s accounts, so residency and inference consent are the brand’s own decisions.',
      'The brand pins releases. An upgrade passes the eval gate before the brand takes it.',
      'The brand’s team runs it day to day. ROQIVA is second-line support.',
      'The brand’s security review applies, not a hosted-service agreement.',
    ],
    rules: [
      'ROQIVA does not write directly to a live production system. A person releases every change through the brand’s own process.',
      'The acceptance tests are the contract. A slice is done when it passes them.',
      'No brand data leaves the brand’s accounts.',
      'The brand pins every release. Skills and prompts change only through the eval gate.',
      'Brain first: nothing later is built until the Brain is confirmed by its owners.',
    ],
  },
}

// ═══════════ Outcome ═══════════
export const outcome = {
  items: [
    { t: 'A fix the brand’s engineers shipped', d: 'From an approved handoff pack. ROQIVA writes nothing to production.' },
    { t: 'A measured result against a baseline', d: 'One verdict: keep, tune or roll back.' },
    { t: 'The reason for every decision, stored in the Brain', d: 'Approvals, send-backs and the reasons behind them.' },
  ],
  close: 'The next audit starts from what worked, so the system never starts from zero.',
}
