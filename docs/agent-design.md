# Agent Design Guidelines: Agentic AI

## Core Design Principles

1. Single Responsibility: Every agent owns a distinct semantic domain (Memory, Intent, Planning, Execution, Verification, Testing, Safety, Security).
2. Explicit Invariants: Each agent operates under hard programmatic invariants that cannot be overridden by prompt manipulation.
3. Transparent Delegation: Task handoffs between agents produce structured JSON artifacts with traceable provenance.
4. Human Circuit Breakers: Whenever confidence drops or risk exceeds thresholds, agents pause execution and route to human review.
