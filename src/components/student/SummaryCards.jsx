import React from 'react';

export default function SummaryCards({ onCardClick }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      
      {/* Card 1: Total Grievances (Primary Hero Dark Green) */}
      <div
        onClick={() => onCardClick && onCardClick('all')}
        className="relative overflow-hidden rounded-xl bg-primary-container text-on-primary p-space-lg shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow group"
      >
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-on-primary/5 pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-primary/80 font-bold">
            Total Grievances
          </span>
          <span className="p-1.5 rounded-lg bg-on-primary/10 text-on-primary">
            <span className="material-symbols-outlined text-[20px]">folder_special</span>
          </span>
        </div>
        <div className="my-space-sm">
          <div className="font-display-lg text-display-lg font-bold leading-none tracking-tight">12</div>
          <p className="font-body-sm text-body-sm text-on-primary/75 mt-1">All career submissions</p>
        </div>
        <div className="pt-space-xs border-t border-on-primary/15 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-on-primary/90 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[14px]">school</span> 3 Academic
          </span>
          <span className="inline-flex items-center gap-1.5 text-on-primary/90 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[14px]">apartment</span> 9 Campus
          </span>
        </div>
      </div>

      {/* Card 2: Under Review */}
      <div
        onClick={() => onCardClick && onCardClick('active')}
        className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-space-lg shadow-xs flex flex-col justify-between hover:border-outline-variant hover:shadow-sm transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
            Under Review
          </span>
          <span className="p-1.5 rounded-lg bg-surface-container text-secondary">
            <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          </span>
        </div>
        <div className="my-space-sm">
          <div className="font-display-lg text-display-lg font-bold leading-none text-on-surface">4</div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Active investigations</p>
        </div>
        <div className="pt-space-xs border-t border-outline-variant/20 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[12px] text-secondary">schedule</span> 2 Dean • 2 Proctorial
          </span>
        </div>
      </div>

      {/* Card 3: Resolved */}
      <div
        onClick={() => onCardClick && onCardClick('resolved')}
        className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-space-lg shadow-xs flex flex-col justify-between hover:border-outline-variant hover:shadow-sm transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
            Resolved
          </span>
          <span className="p-1.5 rounded-lg bg-secondary-container/60 text-secondary">
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
          </span>
        </div>
        <div className="my-space-sm">
          <div className="font-display-lg text-display-lg font-bold leading-none text-on-surface">6</div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Concluded with signed orders</p>
        </div>
        <div className="pt-space-xs border-t border-outline-variant/20 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[13px]">check_circle</span> 100% SLA Compliance
          </span>
        </div>
      </div>

      {/* Card 4: Action Required */}
      <div
        onClick={() => onCardClick && onCardClick('action')}
        className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 p-space-lg shadow-xs flex flex-col justify-between hover:border-outline-variant hover:shadow-sm transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-bold">
            Action Required
          </span>
          <span className="p-1.5 rounded-lg bg-error-container text-error">
            <span className="material-symbols-outlined text-[20px]">notification_important</span>
          </span>
        </div>
        <div className="my-space-sm">
          <div className="font-display-lg text-display-lg font-bold leading-none text-error">2</div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Updates or evidence needed</p>
        </div>
        <div className="pt-space-xs border-t border-outline-variant/20 flex items-center gap-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-label-sm text-label-sm font-semibold truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Clarification #NIV-1023
          </span>
        </div>
      </div>

    </section>
  );
}
