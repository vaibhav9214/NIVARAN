import React, { useState } from 'react';

export default function BatchTriageModal({ isOpen, onClose, onExecute }) {
  const [targetAction, setTargetAction] = useState('priority_high');
  const [logReason, setLogReason] = useState('');

  if (!isOpen) return null;

  const handleExecute = () => {
    onExecute({ targetAction, logReason });
    setLogReason('');
  };

  return (
    <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md animate-scaleUp border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">
              playlist_add_check
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Fast-Track Batch Triage
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Apply systemic classification, prioritize multiple cases concurrently, or assign to specialized engineering units.
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface">
            <span className="font-bold">Target Action:</span>
            <select
              value={targetAction}
              onChange={(e) => setTargetAction(e.target.value)}
              className="bg-surface-container-low p-2 rounded-lg text-on-surface outline-none border border-outline-variant/20 focus:ring-2 focus:ring-primary"
            >
              <option value="priority_high">Set Priority to High (Statutory Urgency)</option>
              <option value="dispatch_wifi">Dispatch to Campus Wi-Fi Operations Cell</option>
              <option value="send_sms">Send Generic Verification SMS &amp; Portal Notification</option>
              <option value="dean_agenda">Mark for Deans Council Agenda Review</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface">
            <span className="font-bold">Mandatory Redressal Log Reason:</span>
            <textarea
              value={logReason}
              onChange={(e) => setLogReason(e.target.value)}
              className="bg-surface-container-low p-2 rounded-lg text-on-surface placeholder:text-outline outline-none text-body-sm font-body-sm resize-none border border-outline-variant/20 focus:ring-2 focus:ring-primary"
              placeholder="Enter administrative justification for university audit log..."
              rows="3"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecute}
            className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
          >
            Execute Redressal Triage
          </button>
        </div>
      </div>
    </div>
  );
}
