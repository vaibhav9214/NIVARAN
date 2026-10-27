import React, { useState } from 'react';

export default function WithdrawModal({ isOpen, onClose, onConfirm, docketId }) {
  const [reason, setReason] = useState('Issue was resolved independently');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in duration-200"
      id="withdraw-modal"
    >
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-xl flex flex-col gap-4 border border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">warning</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Withdraw Grievance?
            </h3>
            <span className="font-label-sm text-xs text-outline">
              Docket #{docketId}
            </span>
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Withdrawing will close this grievance immediately and abort all active investigations by the assigned committee. This action cannot be reversed, though you may lodge a fresh docket if the issue recurs.
        </p>

        <div className="space-y-1">
          <label
            htmlFor="withdraw-reason"
            className="font-label-md text-xs font-bold text-on-surface block"
          >
            Reason for Withdrawal (Optional)
          </label>
          <select
            id="withdraw-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-surface-container-low rounded-lg p-2.5 font-body-sm text-xs text-on-surface outline-none border border-outline-variant/30 cursor-pointer"
          >
            <option>Issue was resolved independently</option>
            <option>Filed in error / duplicate submission</option>
            <option>No longer experiencing this issue</option>
            <option>Other personal reason</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-on-surface-variant font-label-md text-label-md font-bold hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 rounded-lg bg-error text-on-error font-label-md text-label-md font-bold hover:bg-error/90 transition-colors shadow-sm cursor-pointer"
          >
            Confirm Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}
