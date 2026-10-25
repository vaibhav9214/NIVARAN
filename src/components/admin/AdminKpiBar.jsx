import React from 'react';
import { ADMIN_KPI_DATA } from '../../data/adminDashboardData';

export default function AdminKpiBar({ onTriggerToast, onFilterOverdue }) {
  const kpi = ADMIN_KPI_DATA;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-8">
      {/* Card 1: Total Grievances */}
      <div
        onClick={() => onTriggerToast && onTriggerToast('Total 1,284 student dockets lodged in current term.', 'folder_open')}
        className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/30 cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Total Grievances
          </span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-low text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">folder_open</span>
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-on-surface leading-none">
              {kpi.totalGrievances.value}
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              {kpi.totalGrievances.change}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1.5 truncate">
            {kpi.totalGrievances.sub}
          </p>
        </div>
      </div>

      {/* Card 2: Pending Grievances */}
      <div
        onClick={() => onTriggerToast && onTriggerToast('216 grievances currently under investigation.', 'pending_actions')}
        className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/30 cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Pending Grievances
          </span>
          <span className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center group-hover:bg-surface-container group-hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[18px]">pending_actions</span>
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-on-surface leading-none">
              {kpi.pendingGrievances.value}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm font-semibold">
              {kpi.pendingGrievances.badge}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1.5 truncate">
            {kpi.pendingGrievances.sub}
          </p>
        </div>
      </div>

      {/* Card 3: Resolved Cases */}
      <div
        onClick={() => onTriggerToast && onTriggerToast('892 certified resolutions sealed with UGC checksum.', 'check_circle')}
        className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/30 cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Resolved Cases
          </span>
          <span className="w-8 h-8 rounded-lg bg-surface-container text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-on-surface leading-none">
              {kpi.resolvedCases.value}
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[12px]">bolt</span>
              {kpi.resolvedCases.change}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1.5 truncate">
            {kpi.resolvedCases.sub}
          </p>
        </div>
      </div>

      {/* Card 4: Overdue Dockets */}
      <div
        onClick={() => {
          if (onFilterOverdue) onFilterOverdue();
          else onTriggerToast && onTriggerToast('47 dockets breached statutory 10-day SLA window.', 'warning');
        }}
        className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/30 cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <span className="font-label-sm text-label-sm text-error uppercase tracking-wider font-bold">
            Overdue Dockets
          </span>
          <span className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center group-hover:bg-error group-hover:text-on-error transition-colors">
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-error leading-none">
              {kpi.overdueDockets.value}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
              {kpi.overdueDockets.change}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1.5 truncate">
            {kpi.overdueDockets.sub}
          </p>
        </div>
      </div>

      {/* Card 5: Statutory Resolution Rate */}
      <div
        onClick={() => onTriggerToast && onTriggerToast('Institutional SLA compliance: 82.4% (UGC benchmark: >80%)', 'verified')}
        className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant/30 cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Statutory Rate
          </span>
          <span className="w-8 h-8 rounded-lg bg-surface-container text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-primary leading-none">
              {kpi.statutoryRate.value}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
              {kpi.statutoryRate.badge}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1.5 truncate">
            {kpi.statutoryRate.sub}
          </p>
        </div>
      </div>
    </section>
  );
}
