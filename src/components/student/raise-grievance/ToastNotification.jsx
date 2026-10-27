import React from 'react';

export default function ToastNotification({ message, isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div
      id="toast-notification"
      className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-lg py-space-sm rounded-xl shadow-xl flex items-center gap-space-sm animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <span className="material-symbols-outlined text-secondary text-[20px]">
        check_circle
      </span>
      <span className="font-label-lg text-label-lg" id="toast-message">
        {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-inverse-on-surface/60 hover:text-inverse-on-surface cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
}
