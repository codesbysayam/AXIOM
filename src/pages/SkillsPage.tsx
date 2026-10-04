import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, Wrench } from 'lucide-react';
import { CUSTOM_SKILLS } from '../data/agentsAndSkills';

export const SkillsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(CUSTOM_SKILLS.map((s) => s.category)));

  const filtered = CUSTOM_SKILLS.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#dce1e7] pb-4">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold block">
            Capabilities Matrix
          </span>
          <h1 className="text-2xl font-serif font-medium text-[#17263d] mt-1">
            Custom Skills Registry
          </h1>
          <p className="text-xs text-[#40516a] font-sans mt-0.5">
            Modular agent capabilities with deterministic contracts, sandbox testing, and policy checks
          </p>
        </div>

        <div className="text-xs font-sans font-medium text-[#17263d] bg-white px-3 py-1.5 rounded-[2px] border border-[#dce1e7]">
          <span className="font-semibold">{CUSTOM_SKILLS.length}</span> Skills Registered
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-sans">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-[2px] text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#17263d] text-white shadow-2xs'
              : 'bg-white border border-[#dce1e7] text-[#40516a] hover:bg-[#f6f5f0]'
          }`}
        >
          All Categories ({CUSTOM_SKILLS.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-[2px] text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#17263d] text-white shadow-2xs'
                : 'bg-white border border-[#dce1e7] text-[#40516a] hover:bg-[#f6f5f0]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((skill) => (
          <div
            key={skill.id}
            className="axiom-panel p-4 flex flex-col justify-between shadow-2xs bg-white"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-[#f0eee6] pb-2.5">
                <span className="text-[10px] font-sans uppercase font-semibold tracking-wider px-1.5 py-0.5 bg-[#fbfaf7] text-[#5E6975] rounded-[2px] border border-[#dce1e7]">
                  {skill.category}
                </span>
                <span
                  className={`text-[10px] font-sans font-semibold uppercase px-1.5 py-0.5 rounded-[2px] border ${
                    skill.requiresHumanReview
                      ? 'bg-amber-50 text-[#945f00] border-amber-200'
                      : 'bg-emerald-50 text-[#0d6b4f] border-emerald-200'
                  }`}
                >
                  {skill.requiresHumanReview ? 'Human Gate Enforced' : 'Deterministic Autonomous'}
                </span>
              </div>

              <h3 className="text-sm font-sans font-semibold text-[#17263d] mt-2.5">{skill.name}</h3>
              <p className="text-xs text-[#40516a] font-sans mt-1 leading-relaxed">{skill.description}</p>

              <div className="mt-4 pt-3 border-t border-[#f0eee6]">
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#5E6975] font-semibold block mb-1.5">
                  Assigned Agents:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skill.assignedAgents.map((ag) => (
                    <span
                      key={ag}
                      className="px-2 py-0.5 text-xs font-sans font-medium text-[#17263d] bg-[#fbfaf7] rounded-[2px] border border-[#dce1e7]"
                    >
                      {ag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#dce1e7] flex items-center justify-between text-xs font-sans text-[#5E6975]">
              <span>Skill ID: <span className="font-mono text-[#17263d]">{skill.id}</span></span>
              <span className="text-[#0d6b4f] font-semibold">Invariants Passed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
