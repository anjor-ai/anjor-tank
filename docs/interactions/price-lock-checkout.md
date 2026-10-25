# What happens when the warehouse price changes?

## Purpose
Explain the price-lock-checkout decision logic using illustrative scenarios, independently of reported project outcomes.

## Features and interaction
Three scenario buttons update one result panel immediately. Reset restores the first scenario. Controls expose aria-pressed; results use aria-live. All controls work with keyboard and touch.

## Inputs, decision logic and outputs
- Price rises to ₹1,080 → ₹1,000 / Customer pays / ₹80 absorbed as a discount. The checkout promise survives the warehouse change.
- Price falls to ₹940 → ₹940 / Final customer cost / ₹60 refunded. A lower fulfilment price should benefit the customer.
- Price stays at ₹1,000 → ₹1,000 / Customer pays / No adjustment. The original payment and invoice stay aligned.

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
