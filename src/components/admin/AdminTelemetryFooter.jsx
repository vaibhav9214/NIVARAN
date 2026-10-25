import React, { useState } from 'react';

export default function AdminTelemetryFooter({ onTriggerToast }) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onTriggerToast && onTriggerToast('Telemetry feed synchronized with central institutional database.', 'sync');
    }, 650);
  };

  return (
    <footer className="w-full bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 border border-outline-variant/30">
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
        </span>
        <div className="truncate text-xs">
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            Dean Office approved escalation dispatch
          </span>
          <span className="text-outline mx-1.5">•</span>
          <span className="font-mono text-outline">#GRV-2026-0129</span>
          <span className="text-outline mx-1.5">•</span>
          <span className="text-outline">14 mins ago by Prof. Ananya Roy</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs shrink-0 w-full lg:w-auto justify-between lg:justify-end">
        <span className="font-label-sm text-label-sm text-outline hidden sm:inline">
          Live Feed • Synced 14:52:10 IST • Example Institute of Technology
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSync}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-label-sm flex items-center gap-1 transition-all cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[15px] ${isSyncing ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onTriggerToast &&
              onTriggerToast('Institutional statutory compliance audit PDF ready for download.', 'picture_as_pdf')
            }
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
            <span>Audit PDF</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
