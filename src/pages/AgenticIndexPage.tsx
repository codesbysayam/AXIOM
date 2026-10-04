import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Command,
  ExternalLink,
} from 'lucide-react';

import {
  AGENT_WORKFORCE,
  CUSTOM_SKILLS,
} from '../data/agentsAndSkills';

import {
  AgentInfo,
  WorkflowDefinition,
} from '../types';

export interface AgenticIndexPageProps {
  workflows: WorkflowDefinition[];
  onOpenConsole: () => void;
}

type Category = {
  title: string;
  description: string;
  agentNames: string[];
  skillNames: string[];
};

const CATEGORIES: Category[] = [
  {
    title: 'Research and knowledge agents',
    description:
      'Agents that retrieve context, synthesize evidence, preserve working memory, and turn fragmented information into an actionable brief.',
    agentNames: [
      'Context Memory Agent',
      'Intent Analyst',
      'Quality Reviewer',
    ],
    skillNames: [
      'Requirement Analysis',
    ],
  },
  {
    title: 'Customer-support agents',
    description:
      'Support workflows that classify requests, retrieve account context, evaluate policy, and route decisions through a human gate when required.',
    agentNames: [
      'Intent Analyst',
      'Context Memory Agent',
      'Workflow Planner',
    ],
    skillNames: [
      'Requirement Analysis',
      'Policy Verification',
    ],
  },
  {
    title: 'Personal productivity assistants',
    description:
      'Task-oriented orchestration for planning work, routing actions, tracking execution, and keeping a human operator in control.',
    agentNames: [
      'Workflow Planner',
      'Task Executor',
      'Validation Tester',
    ],
    skillNames: [
      'Requirement Analysis',
    ],
  },
  {
    title: 'Multi-agent collaboration',
    description:
      'Specialized agents working as a coordinated system, with explicit handoffs, policy boundaries, validation, and provenance.',
    agentNames: [
      'Workflow Planner',
      'Task Executor',
      'Quality Reviewer',
    ],
    skillNames: [
      'Hard Boundary Enforcement',
    ],
  },
  {
    title: 'Business-process automation',
    description:
      'Repeatable operational workflows that combine planning, verification, execution, approvals, and auditability.',
    agentNames: [
      'Workflow Planner',
      'Release Guardian',
      'Task Executor',
    ],
    skillNames: [
      'Policy Verification',
      'Invoice Auditing & PO Match',
    ],
  },
  {
    title: 'Developer and coding agents',
    description:
      'Structured agent workflows for technical tasks, where planning, validation, permissions, and review remain observable rather than opaque.',
    agentNames: [
      'Workflow Planner',
      'Validation Tester',
      'Quality Reviewer',
    ],
    skillNames: [
      'Requirement Analysis',
      'Hard Boundary Enforcement',
    ],
  },
  {
    title: 'Responsible autonomous workflows',
    description:
      'Autonomy bounded by explicit invariants, human approval gates, policy checks, rollback-aware validation, and durable audit trails.',
    agentNames: [
      'Release Guardian',
      'Validation Tester',
      'Quality Reviewer',
    ],
    skillNames: [
      'Hard Boundary Enforcement',
      'Policy Verification',
    ],
  },
  {
    title: 'Industry-specific copilots',
    description:
      'Domain-aware systems assembled from specialized agents, capabilities, policies, and workflow templates rather than one generic assistant.',
    agentNames: [
      'Context Memory Agent',
      'Fraud & Anomaly Sentinel',
      'Quality Reviewer',
    ],
    skillNames: [
      'Access Grant Control',
      'Invoice Auditing & PO Match',
    ],
  },
];

function findAgent(name: string): AgentInfo | undefined {
  return AGENT_WORKFORCE.find((agent) => agent.name === name);
}

export const AgenticIndexPage: React.FC<AgenticIndexPageProps> = ({
  workflows,
  onOpenConsole,
}) => {
  const [openCategories, setOpenCategories] = useState<number[]>([0]);

  const activeAgents = useMemo(
    () => AGENT_WORKFORCE.filter((agent) => agent.status === 'active').length,
    [],
  );

  const toggle = (index: number) => {
    setOpenCategories((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const allExpanded = openCategories.length === CATEGORIES.length;

  const toggleAll = () => {
    if (allExpanded) {
      setOpenCategories([]);
    } else {
      setOpenCategories(CATEGORIES.map((_, i) => i));
    }
  };

  return (
    <div className="axiom-index axiom-index-page selection:bg-[#e63946] selection:text-white">
      <div className="axiom-index__grid" aria-hidden="true" />

      <header className="axiom-index__topbar editorial-header">
        <div className="axiom-index__wordmark">
          AXIOM <span className="text-[#a0aec0] font-normal">/ AUTONOMOUS OPERATIONS</span>
        </div>

        <button
          className="axiom-index__console-btn"
          onClick={onOpenConsole}
          type="button"
        >
          <span>Operations console</span>
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.8} />
        </button>
      </header>

      <main className="axiom-index__container axiom-index-content">
        <section className="axiom-index__intro hero" aria-labelledby="axiom-title">
          <div className="axiom-index__number" aria-hidden="true">
            01
          </div>

          <h1 id="axiom-title" className="axiom-fade-in">
            AXIOM
          </h1>

          <p className="axiom-fade-in-delayed">
            Autonomous intelligence, under human control. Systems where AI
            agents reason, plan, use tools and finish useful work with proper
            human oversight. Judged on how useful the agent is, how well it is
            orchestrated, how reliably it runs, and how clearly a human stays in
            control.
          </p>
        </section>

        <section
          className="axiom-index__catalog category-index"
          aria-label="AXIOM core operational categories"
        >
          <div className="axiom-index__catalog-head">
            <span>Index: 08 Core Categories</span>

            <div className="axiom-index__catalog-meta">
              <span>
                {activeAgents} agents online · {workflows.length} workflows
              </span>

              <button
                type="button"
                onClick={toggleAll}
                className="underline decoration-dotted hover:text-[#182536]"
              >
                {allExpanded ? 'Collapse all' : 'Expand all (08)'}
              </button>
            </div>
          </div>

          <div className="axiom-index__rows category-list">
            {CATEGORIES.map((category, index) => {
              const isOpen = openCategories.includes(index);
              const panelId = `axiom-category-${index}`;

              return (
                <article
                  className={`axiom-index__row category-section ${isOpen ? 'is-open' : ''}`}
                  data-expanded={isOpen ? 'true' : 'false'}
                  key={category.title}
                >
                  <button
                    type="button"
                    className="axiom-index__row-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                  >
                    <span>{category.title}</span>

                    <span className="axiom-index__plus" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="axiom-index__detail category-section-content" id={panelId}>
                      <div className="axiom-index__detail-copy">
                        <p>{category.description}</p>

                        <div className="axiom-index__detail-links">
                          <button type="button" onClick={onOpenConsole}>
                            <span>Open operations console</span>
                            <ArrowUpRight size={13} />
                          </button>

                          <span>
                            <Command size={12} />
                            Human oversight remains explicit
                          </span>
                        </div>
                      </div>

                      <div className="axiom-index__agents">
                        <div className="axiom-index__mini-label">
                          Underlying capabilities
                        </div>

                        {category.agentNames.map((name) => {
                          const agent = findAgent(name);

                          return agent ? (
                            <div className="axiom-index__agent" key={name}>
                              <span
                                className="axiom-index__agent-status"
                                aria-hidden="true"
                              />
                              <span>{agent.name}</span>
                              <span className="axiom-index__agent-role">
                                {agent.domain}
                              </span>
                            </div>
                          ) : null;
                        })}

                        <div className="axiom-index__skills">
                          {category.skillNames.map((name) => {
                            const skill = CUSTOM_SKILLS.find(
                              (item) => item.name === name,
                            );

                            return skill ? (
                              <span key={name}>{skill.name}</span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <footer className="axiom-index__footer">
          <span>AXIOM / AUTONOMOUS OPERATIONS</span>

          <button type="button" onClick={onOpenConsole}>
            <span>Enter system</span>
            <ExternalLink size={12} />
          </button>
        </footer>
      </main>
    </div>
  );
};

export { AgenticIndexPage as AxiomIndexPage };
