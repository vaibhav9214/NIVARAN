import React from 'react';

export default function SlaModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest max-w-xl w-full rounded-2xl border border-outline-variant/40 shadow-xl p-space-lg flex flex-col gap-space-md">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Institutional SLA Charter
              </h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Standardized Timelines for Collegiate Resolution
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 3 Stages Content */}
        <div className="flex flex-col gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
          <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
            <span className="font-bold text-primary font-mono text-sm shrink-0">Stage 1</span>
            <div>
              <strong className="text-on-surface font-semibold block">
                Intake &amp; Autonomous Classification (24 Hours)
              </strong>
              <span>AI assessment, jurisdiction verification, and direct assignment to respective sub-committee.</span>
            </div>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
            <span className="font-bold text-primary font-mono text-sm shrink-0">Stage 2</span>
            <div>
              <strong className="text-on-surface font-semibold block">
                Proctorial Investigation &amp; Hearing (7 Days)
              </strong>
              <span>Direct examination of physical plant, hostel mess logs, or departmental records with student voice.</span>
            </div>
          </div>

          <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
            <span className="font-bold text-primary font-mono text-sm shrink-0">Stage 3</span>
            <div>
              <strong className="text-on-surface font-semibold block">
                Binding Resolution &amp; Remedial Order (15 Days Max)
              </strong>
              <span>Statutory ceiling for final executive resolution and closure report signed by the Dean.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-space-xs border-t border-outline-variant/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary transition-colors cursor-pointer"
          >
            I Acknowledge
          </button>
        </div>

      </div>
    </div>
  );
}
