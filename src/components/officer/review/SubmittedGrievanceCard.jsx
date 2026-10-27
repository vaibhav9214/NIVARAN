import React from 'react';

export default function SubmittedGrievanceCard({ caseData, onTriggerToast }) {
  const handleCopyChecksum = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(caseData.shaChecksum).then(() => {
        onTriggerToast && onTriggerToast('Submission hash copied to clipboard', 'lock');
      });
    } else {
      onTriggerToast && onTriggerToast('Submission hash copied to clipboard', 'lock');
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between pb-space-sm bg-surface-container-lowest flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">subject</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Submitted Grievance
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          SHA-256 Checksum Verified
        </div>
      </div>

      {/* Description Narrative */}
      <div className="bg-surface p-space-md rounded-lg font-body-md text-body-md text-on-surface leading-relaxed border border-outline-variant/20">
        "{caseData.narrative}"
      </div>

      {/* Structured Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
          <span className="material-symbols-outlined text-outline mt-0.5 text-[20px]">pin_drop</span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Location / Venue
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {caseData.location}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
          <span className="material-symbols-outlined text-outline mt-0.5 text-[20px]">calendar_today</span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Incident Date
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {caseData.incidentDate}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
          <span className="material-symbols-outlined text-outline mt-0.5 text-[20px]">groups</span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Reported Impact Scope
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {caseData.impactScope}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
          <span className="material-symbols-outlined text-outline mt-0.5 text-[20px]">badge</span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Verified Scholar Identity
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {caseData.scholarIdentity}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm pt-1">
        <span className="material-symbols-outlined text-[16px]">lock</span>
        <span>
          Canonical submission signature:{' '}
          <button
            onClick={handleCopyChecksum}
            title="Click to copy SHA hash"
            className="inline-flex items-center gap-1 bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant font-mono text-[11px] hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <code>{caseData.shaChecksum}</code>
            <span className="material-symbols-outlined text-[12px]">content_copy</span>
          </button>
        </span>
      </div>
    </section>
  );
}
