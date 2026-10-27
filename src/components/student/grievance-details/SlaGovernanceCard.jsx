import React from 'react';

export default function SlaGovernanceCard({ simState }) {
  const isOverdue = simState === 'overdue';
  const isResolved = simState === 'resolved';

  const healthText = isOverdue
    ? 'Breached (Dean Escalated)'
    : isResolved
    ? 'Fulfilled (Compliant)'
    : 'Compliant (On Track)';

  const healthClass = isOverdue
    ? 'text-error font-bold'
    : 'text-secondary font-bold';

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-4 shadow-sm border border-outline-variant/20">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          SLA Governance
        </h3>
        <span className="material-symbols-outlined text-outline text-[18px]">gavel</span>
      </div>

      <div className="space-y-3 font-body-sm text-xs text-on-surface-variant">
        <p>
          In accordance with{' '}
          <strong>University Redressal Regulation Clause 11.2</strong>, academic facility complaints must be addressed within 15 working days.
        </p>

        <div className="space-y-2 bg-surface-container-low p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>Maximum Allowable TAT:</span>
            <span className="font-bold text-on-surface">15 Days</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Automatic Escalation Window:</span>
            <span className="font-bold text-secondary">7 Days Unresolved</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Current Compliance Health:</span>
            <span className={healthClass}>{healthText}</span>
          </div>
        </div>

        <p className="text-[11px] text-outline">
          If resolution is not finalized before 28 October 2026, the grievance escalates to the Joint Dean of Student Affairs.
        </p>
      </div>
    </div>
  );
}
