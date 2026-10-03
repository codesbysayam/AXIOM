# Decision Flow: Agentic AI

## Lifecycle of a Pipeline Request

1. Webhook or Payload Ingestion: Raw input captured and stamped with session ID.
2. Intent Analysis: Intent Analyst extracts goals and parameters.
3. Context Hydration: Context Memory Agent retrieves entity history and user tier.
4. DAG Generation: Workflow Planner constructs sequential and parallel step graph.
5. Invariant & Policy Check: Release Guardian tests policies against step inputs.
6. Gate Decision:
   - If Low Risk: Task Executor dispatches atomic API call.
   - If High Risk: Execution halts; Approval request enters operator queue.
7. Human Operator Decision: Lead operator approves or declines with note.
8. State Finalization: Result returned and audit log signed with SHA-256 digest.
