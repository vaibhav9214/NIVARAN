import React from 'react';

export default function ResolutionTracker({ docket, simState }) {
  // Stepper calculations based on simState
  const isResolved = simState === 'resolved';
  const isOverdue = simState === 'overdue';

  let fillWidth = '66%';
  let step3Config = {
    circleClass: 'bg-secondary text-on-secondary ring-4 ring-secondary-container',
    icon: 'sync',
    labelClass: 'text-primary-container',
    label: '3. In Progress',
    date: docket.stepper?.step3?.timestamp || '19 Oct, 11:00 AM',
  };
  let step4Config = {
    circleClass: 'bg-surface-container-high text-outline',
    icon: 'lock',
    labelClass: 'text-outline',
    label: '4. Resolved',
    date: docket.stepper?.step4?.timestamp || 'Est. 28 Oct',
  };
  let slaBadge = {
    text: docket.sla?.countdownBadge || '6 Days Remaining',
    badgeClass: 'text-primary-container bg-surface-container-lowest',
    fillWidth: '60%',
    fillClass: 'bg-secondary',
    healthLabel: 'Compliant (On Track)',
    healthClass: 'text-secondary font-bold',
  };

  if (isResolved) {
    fillWidth = '100%';
    step3Config = {
      circleClass: 'bg-primary-container text-on-primary',
      icon: 'check',
      labelClass: 'text-on-surface font-bold',
      label: '3. In Progress',
      date: docket.stepper?.step3?.timestamp || '19 Oct, 11:00 AM',
    };
    step4Config = {
      circleClass: 'bg-secondary text-on-secondary ring-4 ring-secondary-container',
      icon: 'check',
      labelClass: 'text-secondary font-bold',
      label: '4. Resolved',
      date: '22 Oct 2026',
    };
    slaBadge = {
      text: 'Closed in 8 Days (Within 15d Cap)',
      badgeClass: 'text-secondary bg-secondary-container/40',
      fillWidth: '100%',
      fillClass: 'bg-secondary',
      healthLabel: 'Fulfilled (Compliant)',
      healthClass: 'text-secondary font-bold',
    };
  } else if (isOverdue) {
    fillWidth = '75%';
    step3Config = {
      circleClass: 'bg-error text-on-error ring-4 ring-error-container',
      icon: 'priority_high',
      labelClass: 'text-error font-bold',
      label: '3. Overdue (>15d)',
      date: docket.stepper?.step3?.timestamp || '19 Oct, 11:00 AM',
    };
    step4Config = {
      circleClass: 'bg-surface-container-high text-outline',
      icon: 'lock',
      labelClass: 'text-outline',
      label: '4. Resolved',
      date: 'Pending Redress',
    };
    slaBadge = {
      text: 'Overdue by 3 Days',
      badgeClass: 'text-error bg-error-container',
      fillWidth: '100%',
      fillClass: 'bg-error',
      healthLabel: 'Breached (Dean Escalated)',
      healthClass: 'text-error font-bold',
    };
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 flex flex-col gap-6 shadow-sm border border-outline-variant/20">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Resolution Progress Tracker
        </h2>
        <span className="font-label-md text-label-md text-outline">Statutory Protocol § 11.2</span>
      </div>

      {/* Stepper Visual */}
      <div className="relative w-full py-4">
        <div className="grid grid-cols-4 items-center relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-outlined text-base">check</span>
            </div>
            <span className="font-label-md text-label-md font-bold text-on-surface mt-2">
              1. Submitted
            </span>
            <span className="font-label-sm text-[11px] text-outline">
              {docket.stepper?.step1?.timestamp || '14 Oct, 10:24 AM'}
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-outlined text-base">check</span>
            </div>
            <span className="font-label-md text-label-md font-bold text-on-surface mt-2">
              2. Under Review
            </span>
            <span className="font-label-sm text-[11px] text-outline">
              {docket.stepper?.step2?.timestamp || '16 Oct, 09:30 AM'}
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shadow-sm ${step3Config.circleClass}`}
            >
              <span className="material-symbols-outlined text-base">{step3Config.icon}</span>
            </div>
            <span className={`font-label-md text-label-md font-bold mt-2 ${step3Config.labelClass}`}>
              {step3Config.label}
            </span>
            <span className="font-label-sm text-[11px] text-outline">{step3Config.date}</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shadow-sm ${step4Config.circleClass}`}
            >
              <span className="material-symbols-outlined text-base">{step4Config.icon}</span>
            </div>
            <span className={`font-label-md text-label-md font-semibold mt-2 ${step4Config.labelClass}`}>
              {step4Config.label}
            </span>
            <span className="font-label-sm text-[11px] text-outline">{step4Config.date}</span>
          </div>

          {/* Progress Connector Line */}
          <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-surface-container-high -z-0">
            <div
              className="h-full bg-secondary transition-all duration-500"
              style={{ width: fillWidth }}
            ></div>
          </div>
        </div>
      </div>

      {/* SLA Context Callout */}
      <div className="bg-surface-container-low rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-2xl mt-0.5">
            verified_user
          </span>
          <div>
            <p className="font-body-sm text-body-sm font-semibold text-on-surface">
              {docket.sla?.tatText || 'Grievance assigned to designated review cell.'}
            </p>
            <p className="font-label-sm text-[11px] text-outline mt-0.5">
              Official University Redressal SLA TAT: {docket.sla?.officialTat || '15 Working Days'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-label-sm text-xs font-bold px-2.5 py-1 rounded-md shadow-xs ${slaBadge.badgeClass}`}
            >
              {slaBadge.text}
            </span>
          </div>
          <div className="w-36 h-2 bg-surface-container-high rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-300 ${slaBadge.fillClass}`}
              style={{ width: slaBadge.fillWidth }}
            ></div>
          </div>
          <span className={`text-[11px] mt-0.5 ${slaBadge.healthClass}`}>
            {slaBadge.healthLabel}
          </span>
        </div>
      </div>
    </section>
  );
}
