import React from 'react';

export default function MetricsGrid({ activeFilter, onSelectFilter }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" id="metrics-grid">
      {/* Card 1: All */}
      <div
        onClick={() => onSelectFilter && onSelectFilter('ALL')}
        className={`rounded-xl p-5 bg-primary-container text-on-primary shadow-sm flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-0.5 ${
          activeFilter === 'ALL' ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-surface' : ''
        }`}
      >
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-on-primary/5 rounded-full pointer-events-none transform group-hover:scale-110 transition-transform"></div>
        <div className="flex items-start justify-between">
          <span className="font-label-md text-label-md tracking-wider uppercase text-on-primary-container font-semibold">
            All Grievances
          </span>
          <div className="w-9 h-9 rounded-lg bg-on-primary/10 flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-3xl font-extrabold leading-none tracking-tight">12</span>
            <span className="font-label-sm text-label-sm text-on-primary-container bg-on-primary/10 px-2 py-0.5 rounded-full font-bold">
              Total File
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-primary-container mt-1 block">
            All lifetime submissions registered
          </span>
        </div>
      </div>

      {/* Card 2: Pending / Filed */}
      <div
        onClick={() => onSelectFilter && onSelectFilter('Filed')}
        className={`rounded-xl p-5 bg-surface-container-lowest text-on-surface shadow-sm flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 border border-outline-variant/20 ${
          activeFilter === 'Filed' ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-surface' : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <span className="font-label-md text-label-md tracking-wider uppercase text-on-surface-variant font-semibold">
            Pending / Filed
          </span>
          <div className="w-9 h-9 rounded-lg bg-surface-container text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-3xl font-extrabold text-on-surface leading-none tracking-tight">3</span>
            <span className="font-label-sm text-label-sm text-tertiary bg-surface-container px-2 py-0.5 rounded-full font-bold">
              Triage
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
            Awaiting initial committee review
          </span>
        </div>
      </div>

      {/* Card 3: In Progress */}
      <div
        onClick={() => onSelectFilter && onSelectFilter('In Review')}
        className={`rounded-xl p-5 bg-surface-container-lowest text-on-surface shadow-sm flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 border border-outline-variant/20 ${
          activeFilter === 'In Review' ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-surface' : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <span className="font-label-md text-label-md tracking-wider uppercase text-on-surface-variant font-semibold">
            In Progress
          </span>
          <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">autorenew</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-3xl font-extrabold text-on-surface leading-none tracking-tight">4</span>
            <span className="font-label-sm text-label-sm text-primary font-bold bg-secondary-container/60 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
            Active proctorial &amp; dean inquiries
          </span>
        </div>
      </div>

      {/* Card 4: Resolved */}
      <div
        onClick={() => onSelectFilter && onSelectFilter('Resolved')}
        className={`rounded-xl p-5 bg-surface-container-lowest text-on-surface shadow-sm flex flex-col justify-between group hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 border border-outline-variant/20 ${
          activeFilter === 'Resolved' ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-surface' : ''
        }`}
      >
        <div className="flex items-start justify-between">
          <span className="font-label-md text-label-md tracking-wider uppercase text-on-surface-variant font-semibold">
            Resolved
          </span>
          <div className="w-9 h-9 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display-lg text-display-lg text-3xl font-extrabold text-secondary leading-none tracking-tight">5</span>
            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/50 px-2 py-0.5 rounded-full font-bold">
              100% Signed
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
            With official remediation docket
          </span>
        </div>
      </div>
    </div>
  );
}
