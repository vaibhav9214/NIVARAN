import React from 'react';

export default function SimulationHarness({ simState, onSelectState }) {
  const states = [
    { id: 'active', label: 'Active (12 Records)' },
    { id: 'filter-empty', label: 'Filter Empty State' },
    { id: 'scholar-zero', label: 'New Scholar Zero' },
    { id: 'loading', label: 'Loading Skeleton' },
  ];

  return (
    <div className="px-4 sm:px-8 py-3 bg-surface-container-high/60 flex flex-wrap items-center justify-between gap-3 text-on-surface-variant font-label-sm text-label-sm border-b border-outline-variant/30">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shrink-0"></span>
        <span className="font-bold tracking-wider uppercase text-primary shrink-0">Simulation Harness:</span>
        <span className="hidden sm:inline text-on-surface-variant/80">
          Toggle state presentations to review layout adaptability
        </span>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/30 overflow-x-auto max-w-full">
        {states.map((s) => {
          const isActive = simState === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectState(s.id)}
              className={`px-2.5 py-1 rounded font-semibold text-xs whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'text-on-primary bg-primary-container shadow-xs'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
