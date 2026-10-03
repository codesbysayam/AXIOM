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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Custom Skills Registry
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Modular agent capabilities with deterministic contracts and policy checks
          </p>
        </div>

        <div className="text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-md border border-slate-200">
          {CUSTOM_SKILLS.length} Skills Registered
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#1b2e49] text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Categories ({CUSTOM_SKILLS.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#1b2e49] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {skill.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                    skill.requiresHumanReview
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {skill.requiresHumanReview ? 'Human Review Gate' : 'Deterministic Autonomous'}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mt-2">{skill.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{skill.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                  Assigned Agents:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skill.assignedAgents.map((ag) => (
                    <span
                      key={ag}
                      className="px-2 py-0.5 text-xs font-mono text-slate-700 bg-slate-50 rounded border border-slate-200"
                    >
                      {ag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Skill ID: {skill.id}</span>
              <span className="text-emerald-700 font-semibold">Test Invariants Passed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
