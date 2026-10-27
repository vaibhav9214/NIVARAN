import React from 'react';

export default function AiInsightsCard({ aiInsight }) {
  const data = aiInsight || {
    assessment:
      'The complaint highlights recurring Wi-Fi failure in Hostel Block B. Peak degradation coincides with study windows (8 PM - 1 AM) with an estimated 42% packet drop rate.',
    probableCause: '2.4GHz / 5GHz Band Overlap & Secondary PoE Voltage Drop.',
    correlation:
      'Matched 91% similarity with closed docket #GRV-2026-0089 resolved within 48h via firmware patch on 5th October.',
  };

  return (
    <div className="rounded-xl bg-gradient-to-b from-surface-container-low to-secondary-container/20 p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden border border-outline-variant/20">
      <div className="w-1.5 absolute top-0 left-0 bottom-0 bg-secondary"></div>

      <div className="flex items-center justify-between pl-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-xl">auto_awesome</span>
          <span className="font-headline-sm text-headline-sm font-extrabold text-primary">
            NIVARAN AI Insight
          </span>
        </div>
        <span className="font-label-sm text-[10px] bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          v2.4 Core
        </span>
      </div>

      <div className="space-y-3 pl-1">
        <div className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-lg p-3">
          <span className="font-label-sm text-[10px] uppercase font-bold text-outline block">
            Auto Triage Assessment
          </span>
          <p className="font-body-sm text-xs text-on-surface mt-1 leading-relaxed">
            {data.assessment}
          </p>
        </div>

        <div className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-lg p-3">
          <span className="font-label-sm text-[10px] uppercase font-bold text-outline block">
            Probable Root Cause Detected
          </span>
          <p className="font-body-sm text-xs text-on-surface mt-1 font-semibold text-primary-container">
            {data.probableCause}
          </p>
        </div>

        <div className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-lg p-3">
          <span className="font-label-sm text-[10px] uppercase font-bold text-outline block">
            Institutional Correlation
          </span>
          <p className="font-body-sm text-xs text-on-surface mt-1 leading-relaxed">
            {data.correlation}
          </p>
        </div>

        <p className="font-label-sm text-[10px] text-outline italic pl-0.5">
          * Non-binding telemetry insight generated strictly to expedite proctor resolution.
        </p>
      </div>
    </div>
  );
}
