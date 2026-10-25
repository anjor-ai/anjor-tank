# Decide where automation should stop.

## Purpose
Explain the ai-automation decision logic using illustrative scenarios, independently of reported project outcomes.

## Features and interaction
Three scenario buttons update one result panel immediately. Reset restores the first scenario. Controls expose aria-pressed; results use aria-live. All controls work with keyboard and touch.

## Inputs, decision logic and outputs
- Routine order tracking → Automate / A bounded answer / Use the known order state for a simple informational query.
- Unresolved delivery issue → Escalate / A person owns the exception / Hand off the context and order state so the customer does not need to start again.
- Low-confidence answer → Hand off / Do not guess / A confidence gap should trigger review, not a confident-sounding answer.

## Assumptions and boundaries
Sample data and simplified explanatory rules, not a production workflow, clinical recommendation or measured experiment. No backend, integrations or persistent data.

## States and edge cases
Default is scenario 1. Reselecting the active scenario is safe. Reset is idempotent. With JavaScript unavailable, the first result and all case-study text remain readable. Reduced motion disables transitions.

## Measurement
No analytics collected. Future optional events: scenario_selected (case, scenario), scenario_reset, contact_opened; require an explicit analytics decision first.

## Technical notes
Data: src/lab-data.js. Static renderer: src/render.js. Event handlers: src/main.js. Styles: src/studio-next.css.

## Changelog and backlog
- 2026-10-25: Created three-scenario workspace.
- Backlog: replace illustrative examples with owner-approved screenshots or anonymized records if supplied.
