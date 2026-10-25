import React from 'react';

export default function ReviewStickyBottomBar({
  caseData,
  outcome,
  onSaveDraft,
  onExecuteDecision,
}) {
  const getOutcomeBtnText = () => {
    switch (outcome) {
      case 'accept':
        return 'Accept for Investigation';
      case 'forward':
        return 'Forward to Department';
      case 'info':
        return 'Request Information';
      case 'duplicate':
        return 'Mark as Duplicate';
      case 'reject':
        return 'Reject Grievance';
      default:
        return 'Accept for Investigation';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_-2px_12px_rgba(0,0,0,0.08)] px-4 sm:px-space-lg py-3 z-30 flex items-center justify-between border-t border-outline-variant/30">
      <div className="flex items-center gap-2 sm:gap-space-md min-w-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0"></span>
          <span className="font-label-md text-label-md font-bold text-on-surface truncate">
            {caseData.id}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-outline font-label-md text-label-md">
          <span>•</span>
          <span>
            Status: <strong className="text-on-surface">{caseData.status || 'Awaiting Review'}</strong>
          </span>
          <span>•</span>
          <span className="text-amber-800 font-semibold">
            SLA: {caseData.sla?.countdown || '6h remaining'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-sm flex-shrink-0">
        <button
          type="button"
          onClick={onSaveDraft}
          className="px-3 sm:px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors cursor-pointer"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onExecuteDecision}
          className="px-3.5 sm:px-space-lg py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{getOutcomeBtnText()}</span>
        </button>
      </div>
    </div>
  );
}
