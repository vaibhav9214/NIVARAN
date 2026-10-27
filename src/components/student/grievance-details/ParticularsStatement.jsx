import React from 'react';

export default function ParticularsStatement({ docket, onTriggerToast }) {
  const premises = docket.incidentPremises || 'Campus Premises';
  const incidentDate = docket.incidentDate || '12 October 2026';
  const priority = docket.priority || 'Normal (Standard Evaluation)';
  const paragraphs = docket.descriptionParagraphs || [docket.description];
  const attachments = docket.attachments || [];

  return (
    <article className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 flex flex-col gap-6 shadow-sm border border-outline-variant/20">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Grievance Statement &amp; Particulars
        </h2>
        <span className="font-label-sm text-xs text-outline uppercase tracking-wider">
          Lodged by Scholar
        </span>
      </div>

      {/* Contextual Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1">
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span>Incident Premises</span>
          </span>
          <span className="font-label-md text-label-md font-semibold text-on-surface">
            {premises}
          </span>
        </div>

        <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1">
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">event</span>
            <span>Incident Date</span>
          </span>
          <span className="font-label-md text-label-md font-semibold text-on-surface">
            {incidentDate}
          </span>
        </div>

        <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1">
          <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">flag</span>
            <span>Priority Severity</span>
          </span>
          <span className="font-label-md text-label-md font-bold text-secondary">
            {priority}
          </span>
        </div>
      </div>

      {/* Long Description */}
      <div className="space-y-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {/* Attachments Section */}
      {attachments.length > 0 && (
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Supporting Evidentiary Files
            </span>
            <span className="font-label-sm text-xs font-semibold text-secondary">
              {attachments.length} {attachments.length === 1 ? 'File' : 'Files'} Attached • Scanned Clean
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-lg group hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-md bg-surface-container-lowest flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {file.icon || 'description'}
                    </span>
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                      {file.name}
                    </span>
                    <span className="font-label-sm text-[11px] text-outline">
                      {file.size} • {file.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onTriggerToast(`Opening preview: ${file.name}`, 'visibility')}
                    className="p-1.5 text-outline hover:text-primary-container rounded transition-colors cursor-pointer"
                    title="Quick View"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                  <button
                    onClick={() => onTriggerToast(`Downloading ${file.name}...`, 'download')}
                    className="p-1.5 text-outline hover:text-primary-container rounded transition-colors cursor-pointer"
                    title="Download"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
