import React from 'react';

export default function ReviewSimulationBar({ simState, onSetSimState }) {
  const states = [
    { id: 'awaiting', label: 'Awaiting Review (Active)' },
    { id: 'inforeq', label: 'Request Info Pending' },
    { id: 'forwarded', label: 'Forwarded to Dept' },
    { id: 'resolved', label: 'Resolved State' },
    { id: 'skeleton', label: 'Loading Skeleton' },
  ];

  return (
    <div className="w-full bg-surface-container-low px-space-lg py-2.5 rounded-lg mb-space-lg flex flex-wrap items-center justify-between gap-space-sm shadow-sm border border-outline-variant/30">
      <div className="flex items-center gap-space-xs">
        <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
        <span className="font-label-md text-label-md text-on-surface font-semibold">
          Simulation Mode:
        </span>
        <span className="font-label-sm text-label-sm text-outline hidden sm:inline">
          Simulate Case Workflow State
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {states.map((st) => {
          const isActive = simState === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSetSimState(st.id)}
              className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-colors cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container'
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
