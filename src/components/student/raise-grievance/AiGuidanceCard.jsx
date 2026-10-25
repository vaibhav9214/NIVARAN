import React from 'react';

export default function AiGuidanceCard({ isScanning, onReanalyze }) {
  return (
    <div
      id="ai-panel"
      className={`bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden transition-all duration-300 ${
        isScanning ? 'ring-2 ring-secondary-container' : ''
      }`}
    >
      {/* Architectural left highlight bar via background */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
              AI-Assisted Guidance
            </h3>
            <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase">
              Real-Time Classifier Active
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 bg-surface-container-low text-primary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
          v2.4 Core
        </span>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant">
        NIVARAN analyzes your text live to detect urgency metrics, duplicate occurrences, and institutional routing paths.
      </p>

      {/* Preview Box */}
      <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-sm">
        {/* Suggested Category */}
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
            Matched Category
          </span>
          <span className="bg-secondary text-on-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
            96% Confidence
          </span>
        </div>

        <div className="flex items-center gap-2 text-primary-container font-label-lg text-label-lg font-bold">
          <span className="material-symbols-outlined text-[18px]">apartment</span>
          <span>Hostel &amp; Student Residence</span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-surface-container-high my-1"></div>

        {/* AI Summary */}
        <div className="flex flex-col gap-0.5">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
            Urgency Assessment
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
            <p className="font-body-sm text-body-sm text-on-surface font-medium">
              High Winter Priority: Critical heating utility outage affecting 40+ scholars.
            </p>
          </div>
        </div>

        {/* Related Docket Match */}
        <div className="bg-surface-container rounded-lg p-space-sm flex items-start gap-space-sm mt-1">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            merge_type
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <strong className="text-on-surface">Related Docket Match:</strong> Ticket #HST-891 logged for Block C (2 days ago). NIVARAN will link these dockets for consolidated Proctorial action.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onReanalyze}
          className="px-space-md py-1.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold hover:bg-secondary hover:text-on-secondary transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className={`material-symbols-outlined text-[16px] ${isScanning ? 'animate-spin' : ''}`}>
            sync
          </span>
          <span>Re-analyze Complaint</span>
        </button>
        <span className="font-label-sm text-label-sm text-outline">Fast latency: 84ms</span>
      </div>

      <p className="font-body-sm text-body-sm text-outline text-[11px] leading-tight">
        Advisory notice: Automated AI suggestions serve strictly administrative assistance. You retain final control over content and classification.
      </p>
    </div>
  );
}
