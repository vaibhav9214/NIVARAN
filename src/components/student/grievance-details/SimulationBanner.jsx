import React from 'react';

export default function SimulationBanner({ simState, onSelectState }) {
  const states = [
    { id: 'in-progress', label: 'In Progress (Active)' },
    { id: 'resolved', label: 'Resolved (Feedback & Appeal)' },
    { id: 'overdue', label: 'Overdue SLA Warning' },
    { id: 'skeleton', label: 'Loading Skeleton' },
  ];

  return (
    <aside
      aria-label="Interactive State Preview Harness"
      className="w-full bg-surface-container-high/60 backdrop-blur-sm px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-on-surface border-b border-outline-variant/30"
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-container text-lg">tune</span>
        <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface font-bold text-xs sm:text-sm">
          Interactive State Simulation:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5" id="state-harness-buttons">
        {states.map((s) => {
          const isActive = simState === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectState(s.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-outline-variant/30'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
