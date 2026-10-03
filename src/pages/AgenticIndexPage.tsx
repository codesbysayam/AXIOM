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

function findAgent(
  name: string,
): AgentInfo | undefined {
  return AGENT_WORKFORCE.find(
    (agent) => agent.name === name,
  );
}

export const AgenticIndexPage: React.FC<
  AgenticIndexPageProps
> = ({
  workflows,
  onOpenConsole,
}) => {
  const [
    openCategory,
    setOpenCategory,
  ] = useState<number | null>(null);

  const activeAgents = useMemo(
    () =>
      AGENT_WORKFORCE.filter(
        (agent) => agent.status === 'active',
      ).length,
    [],
  );

  const toggle = (
    index: number,
  ) => {
    setOpenCategory(
      (current) =>
        current === index
          ? null
          : index,
    );
  };

  return (
    <div
      className="
        agentic-index
        min-h-screen
        bg-[#f3f0e8]
        text-[#1d304b]
        selection:bg-[#ef233c]
        selection:text-white
      "
    >
      <div
        className="agentic-index__grid"
        aria-hidden="true"
      />

      <header
        className="agentic-index__topbar"
      >
        <div
          className="agentic-index__wordmark"
        >
          AGENTIC AI
        </div>

        <button
          className="
            agentic-index__console-link
          "
          onClick={onOpenConsole}
          type="button"
        >
          <span>
            Operations console
          </span>

          <ArrowUpRight
            aria-hidden="true"
            size={15}
            strokeWidth={1.6}
          />
        </button>
      </header>

      <main
        className="
          agentic-index__container
        "
      >
        <section
          className="
            agentic-index__intro
          "
          aria-labelledby="agentic-title"
        >
          <div
            className="
              agentic-index__number
            "
          >
            01
          </div>

          <h1 id="agentic-title">
            Agentic AI
          </h1>

          <p>
            Systems where AI agents reason,
            plan, use tools and finish useful
            work with proper human oversight.
            Judged on how useful the agent is,
            how well it is orchestrated, how
            reliably it runs, and how clearly
            a human stays in control.
          </p>
        </section>

        <section
          className="
            agentic-index__catalog
          "
          aria-label="
            Agentic AI core categories
          "
        >
          <div
            className="
              agentic-index__catalog-head
            "
          >
            <span>
              Index: 08 Core Categories
            </span>

            <span
              className="
                agentic-index__catalog-meta
              "
            >
              <span>
                {activeAgents} agents online
                {' · '}
                {workflows.length} workflows
              </span>

              <button
                type="button"
                onClick={() =>
                  setOpenCategory(
                    openCategory === null
                      ? 0
                      : null,
                  )
                }
              >
                {openCategory === null
                  ? 'Expand first'
                  : 'Collapse'}
              </button>
            </span>
          </div>

          <div
            className="
              agentic-index__rows
            "
          >
            {CATEGORIES.map(
              (
                category,
                index,
              ) => {
                const isOpen =
                  openCategory === index;

                const panelId =
                  `agentic-category-${index}`;

                return (
                  <article
                    className={`
                      agentic-index__row
                      ${
                        isOpen
                          ? 'is-open'
                          : ''
                      }
                    `}
                    key={
                      category.title
                    }
                  >
                    <button
                      type="button"
                      className="
                        agentic-index__row-trigger
                      "
                      aria-expanded={
                        isOpen
                      }
                      aria-controls={
                        panelId
                      }
                      onClick={() =>
                        toggle(index)
                      }
                    >
                      <span>
                        {
                          category.title
                        }
                      </span>

                      <span
                        className="
                          agentic-index__plus
                        "
                        aria-hidden="true"
                      >
                        {isOpen
                          ? '−'
                          : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        className="
                          agentic-index__detail
                        "
                        id={panelId}
                      >
                        <div
                          className="
                            agentic-index__detail-copy
                          "
                        >
                          <p>
                            {
                              category.description
                            }
                          </p>

                          <div
                            className="
                              agentic-index__detail-links
                            "
                          >
                            <button
                              type="button"
                              onClick={
                                onOpenConsole
                              }
                            >
                              Open operations
                              console

                              <ArrowUpRight
                                size={14}
                              />
                            </button>

                            <span>
                              <Command
                                size={13}
                              />

                              Human oversight
                              remains explicit
                            </span>
                          </div>
                        </div>

                        <div
                          className="
                            agentic-index__agents
                          "
                        >
                          <div
                            className="
                              agentic-index__mini-label
                            "
                          >
                            Underlying
                            capabilities
                          </div>

                          {category.agentNames.map(
                            (name) => {
                              const agent =
                                findAgent(
                                  name,
                                );

                              return agent ? (
                                <div
                                  className="
                                    agentic-index__agent
                                  "
                                  key={name}
                                >
                                  <span
                                    className="
                                      agentic-index__agent-status
                                    "
                                    aria-hidden="true"
                                  />

                                  <span>
                                    {
                                      agent.name
                                    }
                                  </span>

                                  <span
                                    className="
                                      agentic-index__agent-role
                                    "
                                  >
                                    {
                                      agent.domain
                                    }
                                  </span>
                                </div>
                              ) : null;
                            },
                          )}

                          <div
                            className="
                              agentic-index__skills
                            "
                          >
                            {category.skillNames.map(
                              (name) => {
                                const skill =
                                  CUSTOM_SKILLS.find(
                                    (item) =>
                                      item.name ===
                                      name,
                                  );

                                return skill ? (
                                  <span
                                    key={name}
                                  >
                                    {
                                      skill.name
                                    }
                                  </span>
                                ) : null;
                              },
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              },
            )}
          </div>
        </section>

        <footer
          className="
            agentic-index__footer
          "
        >
          <span>
            AGENTIC AI /
            HUMAN-CONTROLLED
            ORCHESTRATION
          </span>

          <button
            type="button"
            onClick={onOpenConsole}
          >
            Enter system

            <ExternalLink
              size={13}
            />
          </button>
        </footer>
      </main>
    </div>
  );
};
