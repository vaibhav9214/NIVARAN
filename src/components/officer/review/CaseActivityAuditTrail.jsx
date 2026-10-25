import React from 'react';

export default function CaseActivityAuditTrail({ caseData, onTriggerToast }) {
  const auditEvents = caseData.auditTrail || [];

  const handleExportLog = () => {
    onTriggerToast &&
      onTriggerToast(`Generating cryptographically signed audit log for ${caseData.id}...`, 'file_download');
  };

  return (
    <section className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">history</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Case Activity History &amp; Statutory Audit Trail
          </h2>
        </div>
        <button
          onClick={handleExportLog}
          className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold hover:underline cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          Export Audit Log (PDF)
        </button>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 flex flex-col gap-space-md pt-space-xs">
        {/* Timeline vertical beam */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-surface-container-highest"></div>

        {auditEvents.map((event) => (
          <div key={event.id} className="relative flex flex-col gap-0.5">
            <div
              className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                event.dotClass || 'bg-surface-dim'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  event.innerClass || 'bg-outline'
                }`}
              ></div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                {event.title}
              </span>
              <span className="font-label-sm text-label-sm text-outline">{event.time}</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {event.desc}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
