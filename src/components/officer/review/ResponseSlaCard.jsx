import React from 'react';

export default function ResponseSlaCard({ caseData }) {
  const sla = caseData.sla || {
    reference: 'UGC Redressal Protocol § 9.3 • Infrastructure',
    countdown: '6h 18m',
    deadline: 'Deadline: 21 Oct 2026',
    progressPercent: 70,
    elapsed: '7 days elapsed',
    max: '10 days maximum SLA',
    urgencyBadge: 'Action Window Closing',
    legalNotice:
      'Statutory response window requires official triage within 72 hours of docket intake. Dean escalation triggers automatically in 18 hours if unacknowledged.',
  };

  return (
    <section className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-700 text-[22px]">timer</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Response SLA
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-label-sm text-label-sm font-bold">
          {sla.urgencyBadge}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-label-sm text-label-sm text-outline uppercase">
          Statutory SLA Reference
        </span>
        <span className="font-label-md text-label-md text-on-surface font-bold">
          {sla.reference}
        </span>
      </div>

      {/* Countdown / SLA Metric Gauge */}
      <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-sm border border-outline-variant/20">
        <div className="flex items-baseline justify-between flex-wrap gap-1">
          <span className="font-headline-md text-headline-md text-primary font-bold">
            {sla.countdown}
          </span>
          <span className="font-label-sm text-label-sm text-outline">{sla.deadline}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
          <div
            className="h-full bg-amber-600 rounded-full transition-all duration-500"
            style={{ width: `${sla.progressPercent}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between font-label-sm text-label-sm text-outline">
          <span>{sla.elapsed}</span>
          <span>{sla.max}</span>
        </div>
      </div>

      <p className="font-body-sm text-body-sm text-outline leading-relaxed">
        {sla.legalNotice}
      </p>
    </section>
  );
}
