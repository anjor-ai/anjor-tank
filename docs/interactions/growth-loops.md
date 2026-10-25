# Should the next message actually be sent?

## Purpose
Explain the growth-loops decision logic using illustrative scenarios, independently of reported project outcomes.

## Features and interaction
Three scenario buttons update one result panel immediately. Reset restores the first scenario. Controls expose aria-pressed; results use aria-live. All controls work with keyboard and touch.

## Inputs, decision logic and outputs
- Reorder window reached → Remind / Relevant timing / An eligible customer enters the reminder journey. Measure incremental repeat orders against a holdout.
- Already ordered today → Suppress / Avoid the duplicate nudge / The fresh order takes precedence over the scheduled campaign.
- Unresolved service issue → Resolve / Service before promotion / Route the open issue to its owner before starting a win-back journey.

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
