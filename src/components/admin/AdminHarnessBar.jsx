import React from 'react';

export default function AdminHarnessBar({ harnessState, onSetHarnessState }) {
  const states = [
    { id: 'default', label: 'Default Executive View' },
    { id: 'sla-risk', label: 'Filter: Overdue SLA Risk' },
    { id: 'empty', label: 'Empty Reporting Period' },
    { id: 'skeleton', label: 'Loading Telemetry Skeletons' },
  ];

  return (
    <div className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm border border-outline-variant/30">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
        <span className="font-label-md text-label-md text-tertiary uppercase tracking-wider font-bold">
          Harness State
        </span>
        <span className="text-outline text-xs">•</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
          Institutional Telemetry Environment (Simulated)
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
        {states.map((st) => {
          const isActive = harnessState === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSetHarnessState(st.id)}
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              {st.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
