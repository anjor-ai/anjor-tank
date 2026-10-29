// Consulting: two disciplines and one product in development. Copy from Anjor's consulting brief (v1.0).
// Strategy is the what and why; Architecture is the how; ROQIVA is a product in development, not a third service.
// No case studies, client proof, metrics, packages, rates or delivery promises belong here.

export const consult = {
  hero: {
    eyebrow: 'Consulting',
    tag: 'Systems thinking',
    title: 'From complex problems *to ==systems that work==.*',
    lead: 'I work at the intersection of product, revenue strategy, and systems architecture—helping teams find what matters, design what comes next, and turn fragmented processes into connected systems.',
    primary: { label: 'Discuss a problem', to: '/contact?intent=consult#brief' },
    secondary: { label: 'Explore my work', to: '/work' },
    flow: [
      { k: 'Business challenge', d: 'Signals scattered across tools', icon: 'radar' },
      { k: 'Strategic direction', d: 'What to fix first, and why', icon: 'target' },
      { k: 'System blueprint', d: 'What to build, and how', icon: 'layers' },
    ],
  },
  disciplines: [
    {
      id: 'strategy',
      key: 'A',
      kind: 'What + why',
      name: 'GTM & Revenue Systems Strategy',
      title: 'Know what is holding growth back—and what to fix first.',
      copy: 'I examine customer journeys, GTM motions, revenue operations, lifecycle behavior, and commercial signals to uncover friction, align teams, and prioritize meaningful opportunities.',
      focus: ['GTM/RevOps', 'Customer journeys', 'Lifecycle strategy', 'Revenue leakage', 'Prioritization'],
      outputs: ['Opportunity map', 'Prioritized roadmap', 'Operating model', 'Success metrics'],
      flow: ['Discover', 'Diagnose', 'Prioritize', 'Define direction'],
      question: 'What should the business fix, and why?',
      area: 'Growth, revenue, GTM, RevOps, commercial opportunities',
      output: 'Strategic roadmap and prioritized initiatives',
      icon: 'target',
    },
    {
      id: 'architecture',
      key: 'B',
      kind: 'How',
      name: 'Systems & Solution Architecture',
      title: 'Turn the right strategy into a system that can actually be built.',
      copy: 'I translate business requirements into practical system designs—connecting product flows, data models, integrations, workflows, and AI agents with clear dependencies and controls.',
      focus: ['System design', 'Workflows', 'Data/integrations', 'AI agents', 'Technical requirements'],
      outputs: ['Architecture diagrams', 'Workflow specifications', 'PRDs', 'Integration requirements', 'Build-ready backlog'],
      flow: ['Understand requirements', 'Model the system', 'Design workflows', 'Specify & hand off'],
      question: 'How should we engineer the solution?',
      area: 'Product systems, technical architecture, workflows, integrations, AI',
      output: 'Solution blueprints and implementation-ready specifications',
      icon: 'layers',
    },
  ],
  boundary: 'Strategy owns the business diagnosis; Architecture owns the design of the solution.',
  connect: {
    label: 'How the services connect',
    tag: 'Two entry points',
    title: 'Different entry points. *==One connected way== of thinking.*',
    lead: 'Some teams need clarity on what to fix; others already know and need a buildable blueprint. I can work from either starting point—or connect both.',
    steps: ['Business question', 'Strategy: what / why', 'Architecture: how', 'Build-ready direction'],
  },
  roqiva: {
    eyebrow: 'In development · Product venture',
    title: 'ROQIVA — *Intelligence built for growth.*',
    copy: 'ROQIVA is an AI-powered revenue intelligence and orchestration product in development—connecting fragmented commercial signals to evidence-backed opportunities, better decisions and clearer system changes.',
    flow: ['Detect', 'Audit', 'Decide', 'Design', 'Monitor', 'Measure'],
    micro: 'Product vision in development; not a live client deployment.',
    cta: { label: 'Explore ROQIVA', to: '/roqiva' },
  },
  approach: {
    label: 'Working approach',
    tag: 'No preset playbook',
    title: 'Built around the problem, *not a ==preset playbook==.*',
    copy: 'Each engagement is shaped by the problem, existing systems and desired outcome—not a fixed template.',
  },
  close: {
    title: 'Bring me a ==difficult problem==.',
    lead: 'Whether you need commercial direction or a system blueprint, let’s find the right starting point.',
    primary: { label: 'Let’s talk', to: '/contact?intent=consult#brief' },
  },
}
