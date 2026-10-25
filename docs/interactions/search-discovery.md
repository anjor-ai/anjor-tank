# Treat the query as intent worth understanding.

## Purpose
Explain the search-discovery decision logic using illustrative scenarios, independently of reported project outcomes.

## Features and interaction
Three scenario buttons update one result panel immediately. Reset restores the first scenario. Controls expose aria-pressed; results use aria-live. All controls work with keyboard and touch.

## Inputs, decision logic and outputs
- Known product term → Rank / Use mapped intent / Use the tagged query and relevant catalogue matches to improve discovery.
- Ambiguous query → Clarify / Help narrow the intent / Offer useful suggestions instead of presenting an unrelated result as certain.
- No matching catalogue item → Recover / Make the empty state useful / Keep the query visible, offer a way to refine it and log the unmet demand.

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
