export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  difficulty: 'Standard' | 'Advanced' | 'Stress Test';
  summary: string;
  expectedOutcome: string;
  stepsCount: number;
  initialInput: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-wire-transfer',
    title: 'High-Risk Wire Transfer Evaluation',
    category: 'Finance & Payments',
    difficulty: 'Standard',
    summary: 'A 28,450 USD invoice arrives from a newly registered supplier. The system cross-verifies delivery notes, runs anomaly detection, detects the threshold breach, and halts execution for human sign-off.',
    expectedOutcome: 'Execution pauses at Step 3; Human operator approves or rejects with full audit trail.',
    stepsCount: 4,
    initialInput: 'Vendor Invoice #INV-2026-881 (Apex Datacenter Systems, 28,450.00 USD)',
  },
  {
    id: 'demo-refund-triage',
    title: 'Customer Refund Policy Exception',
    category: 'Customer Support',
    difficulty: 'Standard',
    summary: 'A long-time customer requests a 38 USD refund for late delivery. The Intent Analyst parses the ticket, Context Memory confirms VIP status, and Task Executor safely auto-issues merchant credit.',
    expectedOutcome: 'Full autonomous resolution completed in 850ms with zero human intervention required.',
    stepsCount: 3,
    initialInput: 'Support Ticket #4819: "Package arrived 3 days late, requesting refund."',
  },
  {
    id: 'demo-cve-patch',
    title: 'Autonomous Security Patch Gate',
    category: 'Developer & Security',
    difficulty: 'Advanced',
    summary: 'A critical cryptographic vulnerability is reported. The agents parse the AST, prepare an atomic patch, execute 480 regression tests in a sandbox, and hold the merge until a human security lead approves.',
    expectedOutcome: 'Zero code reaches production without human authorization; all test logs cryptographically signed.',
    stepsCount: 3,
    initialInput: 'CVE-2026-3810 Advisory targeting src/crypto/bundle.ts',
  },
  {
    id: 'demo-invariant-breach',
    title: 'Multi-Agent Security Invariant Breach',
    category: 'Governance & Safety',
    difficulty: 'Stress Test',
    summary: 'An external API response attempts prompt injection aimed at escalating IAM privileges. The Hard Boundary Enforcement policy immediately catches the invariant violation, shuts down the execution token, and opens an urgent Incident case.',
    expectedOutcome: 'Instant safety containment, incident created, system invariants remain intact.',
    stepsCount: 3,
    initialInput: 'Simulated adversarial payload targeting IAM policy evaluation',
  },
];
