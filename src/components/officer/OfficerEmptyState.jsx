import React from 'react';

export default function OfficerEmptyState({ onReturnActive, onTriggerToast }) {
  return (
    <div
      className="w-full bg-surface-container-lowest p-space-xl rounded-xl shadow-sm text-center py-16 flex flex-col items-center justify-center border border-outline-variant/20"
      id="empty-state-view"
    >
      <div className="w-16 h-16 rounded-full bg-secondary-container text-primary flex items-center justify-center mb-space-md ring-8 ring-secondary-container/20">
        <span className="material-symbols-outlined text-[36px]">checklist_rtl</span>
      </div>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
        Workspace Clear • No Pending Grievances
      </h2>
      <p className="font-body-md text-body-md text-outline max-w-md mx-auto mb-space-lg leading-relaxed">
        All grievance dockets assigned to IT Services have been resolved or triaged. New submissions will automatically appear here.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-space-sm">
        <button
          onClick={onReturnActive}
          className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all cursor-pointer shadow-xs"
          type="button"
        >
          Return to Active View
        </button>
        <button
          onClick={() => onTriggerToast && onTriggerToast('Loading 38 Resolved Historical Redressals...', 'history')}
          className="px-4 py-2 rounded-lg bg-surface-container font-label-md text-label-md text-primary font-semibold hover:bg-surface-container-high transition-all cursor-pointer"
          type="button"
        >
          Review Historical Redressals
        </button>
      </div>
    </div>
  );
}
