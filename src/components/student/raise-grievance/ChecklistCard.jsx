import React from 'react';

export default function ChecklistCard() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center gap-space-sm">
        <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
          <span className="material-symbols-outlined text-[20px]">checklist</span>
        </div>
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
            Before You Submit
          </h3>
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
            Quality Standards
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-space-sm">
        <div className="flex items-start gap-space-sm">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            check_circle
          </span>
          <p className="font-body-sm text-body-sm text-on-surface">
            <strong>Descriptive Title:</strong> Ensure the title reflects both the failure and the specific hostel wing.
          </p>
        </div>

        <div className="flex items-start gap-space-sm">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            check_circle
          </span>
          <p className="font-body-sm text-body-sm text-on-surface">
            <strong>Clear Timeline:</strong> Include exact calendar dates of onset and prior verbal notices given.
          </p>
        </div>

        <div className="flex items-start gap-space-sm">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            check_circle
          </span>
          <p className="font-body-sm text-body-sm text-on-surface">
            <strong>Corroborating Evidence:</strong> Attach photos, maintenance slips, or logbook entry snapshots.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center gap-space-sm">
        <span className="material-symbols-outlined text-primary-container text-[18px]">verified</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
          Only statutory ombudsmen &amp; verified cell heads can access docket documents.
        </span>
      </div>
    </div>
  );
}
