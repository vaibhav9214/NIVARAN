import React from 'react';

export default function TimelineCard() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
              What Happens Next?
            </h3>
            <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
              Statutory SLA
            </span>
          </div>
        </div>
        <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-bold px-2 py-0.5 rounded-full">
          15 Days Max
        </span>
      </div>

      {/* 3-Step Flow */}
      <div className="relative flex flex-col gap-space-md pl-6 mt-1">
        {/* Timeline Vertical Track */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-surface-container"></div>

        {/* Step 1 */}
        <div className="relative flex flex-col">
          <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center justify-center font-bold">
            1
          </span>
          <span className="font-label-lg text-label-lg text-on-surface font-bold">
            Lodged &amp; Timestamped
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Generates an immutable docket ID (#NIV-1025) and dispatches receipt SMS to your registered scholar phone.
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative flex flex-col">
          <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm flex items-center justify-center font-bold">
            2
          </span>
          <span className="font-label-lg text-label-lg text-on-surface font-bold">
            Triaged &amp; Assigned
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Forwarded to Chief Hostel Proctor &amp; Works Department Engineer within 24 operational hours.
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative flex flex-col">
          <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center justify-center font-bold">
            3
          </span>
          <span className="font-label-lg text-label-lg text-on-surface font-bold">
            Binding Resolution Hearing
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Enforced collegiate hearing with written remediation note or repair sign-off delivered to your dashboard.
          </p>
        </div>
      </div>

      {/* Metric Footer */}
      <div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low p-space-sm rounded-lg">
        <span>Avg Redressal Speed:</span>
        <span className="font-label-sm text-label-sm text-secondary font-bold">
          4.2 Days (IIT Delhi 2026)
        </span>
      </div>
    </div>
  );
}
