import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OfficerQuickActions({ onTriggerToast, onFilterOverdue }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">
        Quick Actions
      </h3>

      <button
        type="button"
        onClick={() => navigate('/officer/assigned-grievances')}
        className="w-full py-2.5 px-space-md rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md font-semibold flex items-center justify-between cursor-pointer shadow-xs"
      >
        <span>Assigned Grievances (24)</span>
        <span className="material-symbols-outlined text-[18px]">assignment</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onFilterOverdue && onFilterOverdue();
          onTriggerToast && onTriggerToast('Filtering 3 Overdue statutory dockets', 'priority_high');
        }}
        className="w-full py-2.5 px-space-md rounded-lg bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors font-label-md text-label-md font-semibold flex items-center justify-between cursor-pointer border border-error/20"
      >
        <span>Review Overdue Cases (3)</span>
        <span className="material-symbols-outlined text-[18px]">priority_high</span>
      </button>

      <button
        type="button"
        onClick={() => onTriggerToast && onTriggerToast('Batch Acknowledged 8 new dockets with statutory timestamp', 'done_all')}
        className="w-full py-2.5 px-space-md rounded-lg bg-surface-container-low text-primary hover:bg-surface-container transition-colors font-label-md text-label-md font-semibold flex items-center justify-between cursor-pointer border border-outline-variant/30"
      >
        <span>Batch Acknowledge (8)</span>
        <span className="material-symbols-outlined text-[18px]">done_all</span>
      </button>

      <button
        type="button"
        onClick={() => onTriggerToast && onTriggerToast('Generating Department SLA Compliance Summary PDF...', 'download')}
        className="w-full py-2.5 px-space-md rounded-lg bg-surface-container-low text-primary hover:bg-surface-container transition-colors font-label-md text-label-md font-semibold flex items-center justify-between cursor-pointer border border-outline-variant/30"
      >
        <span>Download Department SLA Summary</span>
        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
      </button>
    </div>
  );
}
