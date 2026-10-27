import React from 'react';
import { Link } from 'react-router-dom';

export default function OfficerAiAssistant({ onTriggerToast }) {
  return (
    <div className="p-space-lg rounded-xl shadow-sm flex flex-col relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface-container-low to-secondary-container/20 border border-outline-variant/20">
      {/* AI left-hand accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>

      <div className="flex items-start justify-between mb-space-sm">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-secondary text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            psychology
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            NIVARAN AI Assistant
          </h3>
        </div>
        <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
      </div>

      <p className="font-body-sm text-body-sm text-outline mb-2">
        Insights to help you prioritize your workload.
      </p>

      <span className="inline-block px-2 py-0.5 rounded bg-surface-container-lowest text-outline font-label-sm text-label-sm mb-space-md w-fit border border-outline-variant/30">
        AI-assisted triage v2.4 • Non-binding recommendations
      </span>

      <div className="flex flex-col gap-space-sm">
        {/* Rec 1 */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-2xs flex flex-col gap-2 border border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-error font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[16px]">priority_high</span>
            <span>Triage Overdue SLA First</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Docket <strong className="text-on-surface font-semibold">#GRV-2026-0129</strong> is 4 days past target and subject to Dean escalation within 24 hours.
          </p>
          <Link
            to="/officer/grievance/GRV-2026-0129"
            className="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-bold hover:underline"
          >
            <span>View Docket</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>

        {/* Rec 2 */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-2xs flex flex-col gap-2 border border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-primary font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[16px]">hub</span>
            <span>Cluster Detected</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <strong className="text-on-surface font-semibold">4 out of 9 open IT cases</strong> report campus Wi-Fi drops in North Campus hostels, indicating shared access point firmware faults.
          </p>
          <button
            type="button"
            onClick={() => onTriggerToast && onTriggerToast('Opening AI Root-Cause Cluster Analysis...', 'hub')}
            className="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-bold hover:underline text-left cursor-pointer"
          >
            <span>View Cluster (4 Dockets)</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Rec 3 */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-2xs flex flex-col gap-2 border border-outline-variant/20">
          <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[16px]">build_circle</span>
            <span>Review Equipment Tickets</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            2 infrastructure complaints contain technician diagnostic logs awaiting your closure endorsement.
          </p>
          <Link
            to="/officer/grievance/GRV-2026-0138"
            className="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-bold hover:underline"
          >
            <span>Endorse Logs</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
