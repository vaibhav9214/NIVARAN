import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function CaseRoutingCard({ caseData, onOpenReassign }) {
  const { user } = useAuth();

  const officerName = caseData?.assignedOfficer?.name || caseData?.routing?.officerName || user?.name || 'Assigned Officer';
  const deptName = user?.department?.name || (typeof caseData?.department === 'string' ? caseData.department : caseData?.department?.name) || 'Grievance Review Cell';
  const roleTitle = caseData?.routing?.role || `${deptName} • Active Desk`;
  const supervisingCell = caseData?.routing?.supervisingCell || `${deptName} Oversight Committee`;

  const initials = officerName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'OF';

  return (
    <section className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">person_check</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Case Routing
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label-md text-label-md font-bold text-on-surface truncate">
              {officerName}
            </span>
            <span className="font-label-sm text-label-sm text-outline truncate">
              {roleTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant px-1 flex-wrap gap-1">
          <span className="text-outline">Supervising Cell:</span>
          <span className="font-semibold text-on-surface">{supervisingCell}</span>
        </div>

        <button
          type="button"
          onClick={onOpenReassign}
          className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
        >
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          Reassign Case Officer
        </button>
      </div>
    </section>
  );
}
