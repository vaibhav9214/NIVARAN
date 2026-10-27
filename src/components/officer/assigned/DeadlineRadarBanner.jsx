import React from 'react';

export default function DeadlineRadarBanner({ onFilterOverdue, onSearchDocket }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-md mb-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-outline-variant/30">
      <div className="flex items-center gap-space-sm">
        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-[20px]">timer</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-lg text-label-lg text-on-surface font-bold">
            Institutional Deadline Radar
          </span>
          <span className="font-label-sm text-label-sm text-outline">
            Real-time statutory SLA adherence monitors for current term
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-space-sm w-full md:w-auto">
        <button
          type="button"
          onClick={onFilterOverdue}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md hover:opacity-90 transition-opacity cursor-pointer border border-error/20"
        >
          <span className="material-symbols-outlined text-[16px] text-error">notification_important</span>
          <span className="font-bold">3 Overdue</span>
          <span className="text-[11px] text-error font-normal">(Escalates in 24h)</span>
        </button>

        <button
          type="button"
          onClick={() => onSearchDocket('GRV-2026-0138')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[16px] text-outline">hourglass_top</span>
          <span className="font-semibold">1 Due Today</span>
          <span className="text-outline text-label-sm">Physics Lab</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-label-md text-label-md border border-outline-variant/20">
          <span className="material-symbols-outlined text-[16px] text-secondary">hourglass_bottom</span>
          <span>4 Due in 48h</span>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-outline font-label-md text-label-md border border-outline-variant/20">
          <span>2 No Deadline</span>
        </div>
      </div>
    </div>
  );
}
