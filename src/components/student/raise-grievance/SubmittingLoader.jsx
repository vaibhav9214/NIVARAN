import React from 'react';

export default function SubmittingLoader({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div
      id="submitting-loader"
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="bg-surface-container-lowest rounded-xl p-space-xl shadow-xl flex flex-col items-center gap-space-md text-center max-w-sm w-full">
        <div className="w-12 h-12 rounded-full border-4 border-secondary-container border-t-primary-container animate-spin"></div>
        <div className="flex flex-col gap-1">
          <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Registering Docket...
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Hashing submission timestamp and dispatching digital signature...
          </p>
        </div>
      </div>
    </div>
  );
}
