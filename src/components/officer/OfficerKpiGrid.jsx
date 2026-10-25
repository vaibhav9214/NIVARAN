import React from 'react';

export default function OfficerKpiGrid({ activeFilter, onSelectFilter }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg" id="kpi-grid">
      {/* Card 1: Assigned to Me */}
      <div
        onClick={() => onSelectFilter && onSelectFilter('all')}
        className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group border border-outline-variant/20 hover:-translate-y-0.5 ${
          activeFilter === 'all' ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-space-sm">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">assignment_ind</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-low font-label-sm text-label-sm text-primary font-bold">
            +3 today
          </span>
        </div>
        <div>
          <div className="font-display-lg text-display-lg text-on-surface leading-none mb-1 font-extrabold text-3xl">
            24
          </div>
          <div className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-0.5">
            Assigned to Me
          </div>
          <div className="font-body-sm text-body-sm text-outline">Cases currently assigned</div>
        </div>
      </div>

      {/* Card 2: Awaiting Review */}
      <div
        onClick={() => onSelectFilter && onSelectFilter('awaiting')}
        className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group border border-outline-variant/20 hover:-translate-y-0.5 ${
          activeFilter === 'awaiting' ? 'ring-2 ring-amber-600 ring-offset-2 ring-offset-surface' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-space-sm">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">schedule</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 font-label-sm text-label-sm text-amber-800 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            Requires Triage
          </span>
        </div>
        <div>
          <div className="font-display-lg text-display-lg text-amber-900 leading-none mb-1 font-extrabold text-3xl">
            8
          </div>
          <div className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-0.5">
            Awaiting Review
          </div>
          <div className="font-body-sm text-body-sm text-outline">Need initial assessment</div>
        </div>
      </div>

      {/* Card 3: In Progress */}
      <div
        onClick={() => onSelectFilter && onSelectFilter('inprogress')}
        className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group border border-outline-variant/20 hover:-translate-y-0.5 ${
          activeFilter === 'inprogress' ? 'ring-2 ring-secondary ring-offset-2 ring-offset-surface' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-space-sm">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">autorenew</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-secondary font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Active Inquiries
          </span>
        </div>
        <div>
          <div className="font-display-lg text-display-lg text-on-surface leading-none mb-1 font-extrabold text-3xl">
            11
          </div>
          <div className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-0.5">
            In Progress
          </div>
          <div className="font-body-sm text-body-sm text-outline">Currently being handled</div>
        </div>
      </div>

      {/* Card 4: Overdue */}
      <div
        onClick={() => onSelectFilter && onSelectFilter('overdue')}
        className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group border border-outline-variant/20 hover:-translate-y-0.5 ${
          activeFilter === 'overdue' ? 'ring-2 ring-error ring-offset-2 ring-offset-surface' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-space-sm">
          <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container font-label-sm text-label-sm text-error font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
            Immediate Action
          </span>
        </div>
        <div>
          <div className="font-display-lg text-display-lg text-error leading-none mb-1 font-extrabold text-3xl">
            3
          </div>
          <div className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-0.5">
            Overdue
          </div>
          <div className="font-body-sm text-body-sm text-outline">Past response deadline</div>
        </div>
      </div>
    </div>
  );
}
