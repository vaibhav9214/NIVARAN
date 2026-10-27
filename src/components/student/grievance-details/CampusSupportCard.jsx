import React from 'react';

export default function CampusSupportCard({ onTriggerToast }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-3 shadow-sm border border-outline-variant/20">
      <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
        Need Direct Assistance?
      </h3>
      <p className="font-body-sm text-xs text-on-surface-variant">
        For urgent hardware hazards (sparking equipment or battery leakage), bypass the portal and contact the Emergency Campus Desk.
      </p>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <a
          href="tel:1800114223"
          className="inline-flex items-center gap-1.5 font-label-md text-xs font-bold text-primary-container bg-surface-container-low px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">call</span>
          <span>Ext. 4223 (Helpdesk)</span>
        </a>
        <button
          type="button"
          onClick={() => onTriggerToast('Campus IT Proctor FAQ opened', 'help')}
          className="font-label-md text-xs font-bold text-outline hover:text-on-surface transition-colors px-2 cursor-pointer"
        >
          View SLA FAQ
        </button>
      </div>
    </div>
  );
}
