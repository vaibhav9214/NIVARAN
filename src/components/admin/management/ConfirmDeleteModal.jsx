import React from 'react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to permanently remove this record? This action cannot be undone.',
  itemName = '',
  confirmLabel = 'Delete Record',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-space-lg z-10 overflow-hidden border border-outline-variant/30 animate-scaleUp">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px] text-error">warning</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">{title}</h3>
            {itemName && (
              <p className="font-label-md text-label-md text-secondary font-bold mt-0.5">
                {itemName}
              </p>
            )}
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="pt-space-lg mt-space-md flex items-center justify-end gap-space-sm border-t border-outline-variant/10">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all cursor-pointer font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="px-4 py-2 rounded-lg bg-error text-on-error font-label-md text-label-md hover:bg-error/90 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
