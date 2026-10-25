import React from 'react';

export default function AssignedSimulationBar({ simMode, onSetSimMode }) {
  const modes = [
    { id: 'default', label: 'All Assigned (Default)', icon: 'check_circle' },
    { id: 'batch', label: 'Batch Selected (3 Rows)' },
    { id: 'overdue', label: 'Filter: Overdue SLA' },
    { id: 'skeleton', label: 'Loading Skeleton' },
    { id: 'empty', label: 'Zero Results Empty State' },
  ];

  return (
    <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-sm mb-space-lg flex flex-wrap items-center justify-between gap-space-sm border border-outline-variant/30">
      <div className="flex items-center gap-space-sm min-w-0">
        <div className="flex items-center gap-1.5 px-space-sm py-1 bg-surface-container rounded-lg text-on-surface-variant flex-shrink-0">
          <span className="material-symbols-outlined text-[16px] text-primary">tune</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
            Simulation Modes:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {modes.map((m) => {
            const isActive = simMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSetSimMode(m.id)}
                className={`sim-btn px-space-sm py-1 rounded-lg font-label-md text-label-md transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs font-bold'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {m.icon && <span className="material-symbols-outlined text-[14px]">{m.icon}</span>}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-space-sm text-outline font-label-sm text-label-sm">
        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
        <span>Live Sync: Active • 14:48:02 IST</span>
      </div>
    </div>
  );
}
