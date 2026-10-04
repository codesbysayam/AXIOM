import React, { useState } from 'react';
import { Activity, Compass, Filter, Radio, Shield, Zap } from 'lucide-react';
import { AxiomEvent, useAxiomEventBus } from '../../orchestrator/axiomEventBus';

export const EventStreamRadar: React.FC<{ onSelectEvent?: (event: AxiomEvent) => void }> = ({
  onSelectEvent,
}) => {
  const { events, inspectEvent } = useAxiomEventBus();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredEvents =
    selectedCategory === 'all'
      ? events.slice(0, 8)
      : events.filter((e) => e.category === selectedCategory).slice(0, 8);

  const categories = [
    { id: 'all', label: 'All Vectors' },
    { id: 'policy', label: 'Policy' },
    { id: 'agent', label: 'Agent' },
    { id: 'human', label: 'Human' },
    { id: 'incident', label: 'Incident' },
  ];

  const handleEventClick = (evt: AxiomEvent) => {
    inspectEvent(evt);
    if (onSelectEvent) onSelectEvent(evt);
  };

  return (
    <div className="axiom-panel overflow-hidden bg-[#FFFDF8] flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-[#D5D5CE] bg-[#F7F5EE]">
        <div className="flex items-center gap-2.5">
          <Radio size={15} className="text-[#08795F] animate-pulse" />
          <div>
            <span className="eyebrow block">Omni-Directional Telemetry</span>
            <h3 className="text-sm font-serif font-semibold text-[#182536] -mt-0.5">
              Event Stream Radar
            </h3>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded-[2px] border transition-colors ${
                selectedCategory === c.id
                  ? 'bg-[#182536] text-white border-[#182536]'
                  : 'bg-white text-[#40516A] border-[#D5D5CE] hover:bg-[#F0EEE6]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Circular Radar SVG Canvas */}
        <div className="md:col-span-6 flex justify-center py-2">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg viewBox="0 0 260 260" className="w-full h-full select-none">
              {/* Concentric Rings */}
              <circle cx="130" cy="130" r="120" fill="none" stroke="#D5D5CE" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="130" cy="130" r="85" fill="none" stroke="#D5D5CE" strokeWidth="1" />
              <circle cx="130" cy="130" r="50" fill="none" stroke="#D5D5CE" strokeWidth="1" />
              <circle cx="130" cy="130" r="18" fill="#F0FAF6" stroke="#08795F" strokeWidth="1.5" />

              {/* Crosshair lines */}
              <line x1="130" y1="10" x2="130" y2="250" stroke="#E5E3DB" strokeWidth="1" />
              <line x1="10" y1="130" x2="250" y2="130" stroke="#E5E3DB" strokeWidth="1" />

              {/* Radar Sweep Line */}
              <line
                x1="130"
                y1="130"
                x2="130"
                y2="10"
                stroke="#08795F"
                strokeWidth="1.5"
                opacity="0.7"
                className="origin-center animate-[spin_6s_linear_infinite]"
              />

              {/* Center Core */}
              <text
                x="130"
                y="130"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[8px] font-mono font-bold fill-[#08795F]"
              >
                AXIOM
              </text>

              {/* Plotted Events along concentric radii */}
              {filteredEvents.map((evt, idx) => {
                const angle = (idx / filteredEvents.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 40 + (idx % 3) * 35;
                const cx = 130 + radius * Math.cos(angle);
                const cy = 130 + radius * Math.sin(angle);
                const isIncident = evt.category === 'incident';
                const isHuman = evt.category === 'human';

                return (
                  <g
                    key={evt.id}
                    className="cursor-pointer group"
                    onClick={() => handleEventClick(evt)}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isIncident ? 6 : 4}
                      fill={
                        isIncident
                          ? '#D72F40'
                          : isHuman
                          ? '#8A5900'
                          : evt.category === 'policy'
                          ? '#08795F'
                          : '#3569A8'
                      }
                      className="transition-transform group-hover:scale-150"
                    />
                    <text
                      x={cx + 8}
                      y={cy + 3}
                      className="text-[8px] font-mono fill-[#182536] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {evt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Radar Targets List */}
        <div className="md:col-span-6 space-y-2 overflow-y-auto max-h-[260px]">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => handleEventClick(evt)}
              className="p-2 bg-[#FAF9F5] border border-[#E5E3DB] hover:border-[#182536] rounded-[3px] text-xs font-mono flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="truncate pr-2">
                <span className="text-[10px] text-[#5E6975] uppercase block">{evt.timestamp}</span>
                <span className="text-[#182536] font-semibold truncate block">{evt.label}</span>
              </div>
              <span className="text-[9px] uppercase font-bold text-[#3569A8] px-1.5 py-0.5 rounded-[2px] bg-white border border-[#D5D5CE]">
                {evt.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
