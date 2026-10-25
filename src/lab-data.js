// Illustrative interactions, independent of measured outcomes. No production data.
export const LABS = {
  "price-lock-checkout": {
    title: "What happens when the warehouse price changes?",
    choices: [
      "Price rises to ₹1,080",
      "Price falls to ₹940",
      "Price stays at ₹1,000",
    ],
    results: [
      [
        "₹1,000",
        "Customer pays",
        "₹80 absorbed as a discount. The checkout promise survives the warehouse change.",
      ],
      [
        "₹940",
        "Final customer cost",
        "₹60 refunded. A lower fulfilment price should benefit the customer.",
      ],
      [
        "₹1,000",
        "Customer pays",
        "No adjustment. The original payment and invoice stay aligned.",
      ],
    ],
    flow: [
      "Order · ₹1,000",
      "Warehouse change",
      "Reconcile",
      "Invoice + refund",
    ],
  },
  "coupons-cashback": {
    title: "Give the campaign a rule, not an engineering ticket.",
    choices: [
      "Eligible returning customer",
      "Minimum basket not met",
      "Offer has expired",
    ],
    results: [
      [
        "Eligible",
        "Apply promotion",
        "The customer matches the cohort and basket rules. Show the available savings before checkout.",
      ],
      [
        "Explain",
        "Show the threshold",
        "Keep the offer visible, but explain why it cannot apply to this basket.",
      ],
      [
        "Block",
        "Protect the promise",
        "Do not apply an expired campaign. Surface a valid alternative if one exists.",
      ],
    ],
    flow: [
      "Customer cohort",
      "Basket rules",
      "Validity check",
      "Offer + cashback",
    ],
  },
  "sku-substitution-engine": {
    title: "Follow a stockout through the operations queue.",
    choices: [
      "Verified match in stock",
      "No available match",
      "Missing catalogue mapping",
    ],
    results: [
      [
        "Review",
        "Route to warehouse lead",
        "Surface an available, pre-mapped alternative for operator review. Preserve the original order relationship and reason code.",
      ],
      [
        "Hold",
        "Escalate the shortage",
        "Do not suggest an unavailable alternative. Keep the order visible for the operations team.",
      ],
      [
        "Resolve",
        "Repair the mapping first",
        "Do not infer eligibility from a similar name. Catalogue eligibility and approval are prerequisites.",
      ],
    ],
    flow: [
      "Stockout detected",
      "Check mapping",
      "Live inventory",
      "Operator review",
    ],
  },
  "growth-loops": {
    title: "Should the next message actually be sent?",
    choices: [
      "Reorder window reached",
      "Already ordered today",
      "Unresolved service issue",
    ],
    results: [
      [
        "Remind",
        "Relevant timing",
        "An eligible customer enters the reminder journey. Measure incremental repeat orders against a holdout.",
      ],
      [
        "Suppress",
        "Avoid the duplicate nudge",
        "The fresh order takes precedence over the scheduled campaign.",
      ],
      [
        "Resolve",
        "Service before promotion",
        "Route the open issue to its owner before starting a win-back journey.",
      ],
    ],
    flow: [
      "Customer event",
      "Current state",
      "Eligibility",
      "Remind or suppress",
    ],
  },
  "search-discovery": {
    title: "Treat the query as intent worth understanding.",
    choices: [
      "Known product term",
      "Ambiguous query",
      "No matching catalogue item",
    ],
    results: [
      [
        "Rank",
        "Use mapped intent",
        "Use the tagged query and relevant catalogue matches to improve discovery.",
      ],
      [
        "Clarify",
        "Help narrow the intent",
        "Offer useful suggestions instead of presenting an unrelated result as certain.",
      ],
      [
        "Recover",
        "Make the empty state useful",
        "Keep the query visible, offer a way to refine it and log the unmet demand.",
      ],
    ],
    flow: ["Query", "Tagged intent", "Relevant results", "Order funnel"],
  },
  "ai-automation": {
    title: "Decide where automation should stop.",
    choices: [
      "Routine order tracking",
      "Unresolved delivery issue",
      "Low-confidence answer",
    ],
    results: [
      [
        "Automate",
        "A bounded answer",
        "Use the known order state for a simple informational query.",
      ],
      [
        "Escalate",
        "A person owns the exception",
        "Hand off the context and order state so the customer does not need to start again.",
      ],
      [
        "Hand off",
        "Do not guess",
        "A confidence gap should trigger review, not a confident-sounding answer.",
      ],
    ],
    flow: [
      "Support query",
      "Complexity + state",
      "Routing decision",
      "Answer or handoff",
    ],
  },
  "internal-ops-cx": {
    title: "Give the customer issue one accountable owner.",
    choices: [
      "Refund status query",
      "Return pickup delayed",
      "Resolution SLA breached",
    ],
    results: [
      [
        "Payments",
        "Assign a clear owner",
        "Keep the refund state and next action together in the support workspace.",
      ],
      [
        "Logistics",
        "Route with order context",
        "Send the pickup exception to the team able to act, with the support record linked.",
      ],
      [
        "Escalate",
        "Make delay visible",
        "Raise the overdue issue to its accountable lead. Preserve the history and original SLA.",
      ],
    ],
    flow: ["Issue received", "Classify", "Owner + SLA", "Resolution"],
  },
};
