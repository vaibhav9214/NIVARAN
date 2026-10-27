import React from 'react';

export default function DetailsHeader({
  docket,
  simState,
  onCopyDocketId,
  onExportPdf,
  onOpenWithdraw,
}) {
  // Determine dynamic status capsule styling based on simState or docket status
  const getStatusCapsule = () => {
    if (simState === 'overdue') {
      return {
        pillClass: 'bg-error-container text-on-error-container',
        dotClass: 'bg-error animate-ping',
        text: 'SLA Overdue',
      };
    }
    if (simState === 'resolved' || docket.status === 'Resolved' || docket.status === 'Closed') {
      return {
        pillClass: 'bg-secondary-container text-on-secondary-container',
        dotClass: 'bg-secondary',
        text: 'Resolved',
      };
    }
    return {
      pillClass: 'bg-secondary-container text-on-secondary-container',
      dotClass: 'bg-secondary animate-pulse',
      text: docket.status || 'In Progress',
    };
  };

  const statusConfig = getStatusCapsule();

  return (
    <header className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 flex flex-col gap-6 shadow-sm border border-outline-variant/20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider px-2.5 py-1 rounded-md">
              Docket Identifier
            </span>
            <div className="inline-flex items-center gap-1.5 bg-surface-container-low text-primary-container px-3 py-1 rounded-full font-mono text-xs font-bold">
              <span>{docket.ticketId}</span>
              <button
                onClick={onCopyDocketId}
                className="text-outline hover:text-primary-container transition-colors cursor-pointer"
                title="Copy Docket ID"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
              </button>
            </div>
            <span className="inline-flex items-center gap-1 bg-surface-container-low text-on-surface-variant text-xs font-semibold px-2.5 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm text-secondary">
                {docket.categoryIcon || 'category'}
              </span>
              <span>{docket.category}</span>
            </span>
          </div>

          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
            {docket.title}
          </h1>
        </div>

        {/* Dynamic Status Capsule & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${statusConfig.pillClass}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${statusConfig.dotClass}`}></span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-extrabold">
              {statusConfig.text}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary-container font-label-md text-label-md font-bold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export PDF</span>
            </button>
            <button
              onClick={onOpenWithdraw}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-outline hover:text-error hover:bg-error-container/30 font-label-md text-label-md transition-all cursor-pointer"
              title="Withdraw or cancel this petition"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
              <span className="hidden sm:inline">Withdraw</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 bg-surface-container-low/50 rounded-lg p-4">
        <div>
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline block">
            Assigned Wing
          </span>
          <span className="font-label-lg text-label-lg font-bold text-on-surface mt-0.5 block truncate">
            {docket.assignedWing}
          </span>
        </div>
        <div>
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline block">
            Lodged Timestamp
          </span>
          <span className="font-label-lg text-label-lg font-semibold text-on-surface mt-0.5 block">
            {docket.lodgedTimestamp}
          </span>
        </div>
        <div>
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline block">
            Last Interaction
          </span>
          <span className="font-label-lg text-label-lg font-semibold text-on-surface mt-0.5 block">
            {docket.lastInteraction}
          </span>
        </div>
        <div>
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline block">
            Security Ledger
          </span>
          <span className="font-mono text-xs text-secondary font-bold mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            {docket.securityLedger || 'SHA-256 Validated'}
          </span>
        </div>
      </div>
    </header>
  );
}
