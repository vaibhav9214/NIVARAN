import React from 'react';

export default function BulkActionBar({
  selectedCount,
  onExportSelected,
  onReassignSelected,
  onAcknowledgeSelected,
  onClearSelection,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="w-full bg-primary text-on-primary rounded-xl p-space-md mb-space-md shadow-lg flex flex-wrap items-center justify-between gap-space-md animate-fadeIn border border-primary-container">
      <div className="flex items-center gap-space-md">
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary text-label-md">
          <span>{selectedCount}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-lg text-label-lg font-bold">Selected Grievances</span>
          <span className="font-label-sm text-label-sm text-on-primary-container">
            Batch operation ready for execution
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-space-sm">
        <button
          type="button"
          onClick={onExportSelected}
          className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-opacity-80 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          Export Selected
        </button>

        <button
          type="button"
          onClick={onReassignSelected}
          className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-opacity-80 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">person_search</span>
          Reassign Case Officer
        </button>

        <button
          type="button"
          onClick={onAcknowledgeSelected}
          className="px-space-md py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold hover:bg-opacity-90 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">mark_email_read</span>
          Batch Acknowledge
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          className="px-space-sm py-1.5 rounded-lg text-on-primary-container hover:text-on-primary font-label-md text-label-md transition-colors cursor-pointer"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
}
