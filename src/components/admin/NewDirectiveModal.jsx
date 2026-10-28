import React, { useState } from 'react';

export default function NewDirectiveModal({ isOpen, onClose, onExecute }) {
  const [directiveType, setDirectiveType] = useState('audit');
  const [targetDept, setTargetDept] = useState('all');
  const [directiveNotes, setDirectiveNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onExecute({ directiveType, targetDept, directiveNotes });
    setDirectiveNotes('');
  };

  return (
    <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-lg shadow-2xl flex flex-col gap-space-md border border-outline-variant/30 animate-scaleUp">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">
              assignment_turned_in
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              New Institutional Directive / Audit
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
          Issue a binding administrative directive or statutory inquiry to university department heads.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface">
            <span className="font-bold">Directive Type:</span>
            <select
              value={directiveType}
              onChange={(e) => setDirectiveType(e.target.value)}
              className="bg-surface-container-low p-2 rounded-lg text-on-surface outline-none border border-outline-variant/20 focus:ring-2 focus:ring-primary"
            >
              <option value="audit">Statutory Redressal Compliance Audit</option>
              <option value="overdue_inquiry">Overdue SLA Resolution Notice (UGC § 14)</option>
              <option value="equipment_order">Special Workshop Resource Reallocation</option>
              <option value="dean_summons">Dean Redressal Council Summons</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface">
            <span className="font-bold">Recipient Faculty / Department:</span>
            <select
              value={targetDept}
              onChange={(e) => setTargetDept(e.target.value)}
              className="bg-surface-container-low p-2 rounded-lg text-on-surface outline-none border border-outline-variant/20 focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Departments (Institution-Wide)</option>
              <option value="it_services">IT Services (NOC &amp; Systems)</option>
              <option value="infra">Infrastructure &amp; Central Workshop</option>
              <option value="academics">Academic Affairs Committee</option>
              <option value="welfare">Dean of Student Welfare</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 font-label-sm text-label-sm text-on-surface">
            <span className="font-bold">Executive Directive Instructions:</span>
            <textarea
              value={directiveNotes}
              onChange={(e) => setDirectiveNotes(e.target.value)}
              required
              className="bg-surface-container-low p-2 rounded-lg text-on-surface placeholder:text-outline outline-none text-body-sm font-body-sm resize-none border border-outline-variant/20 focus:ring-2 focus:ring-primary"
              placeholder="State the regulatory grounds, remedial timeline, and required response documentation..."
              rows="3"
            />
          </label>

          <div className="flex items-center justify-end gap-space-sm pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold hover:bg-primary transition-colors shadow-xs cursor-pointer"
            >
              Issue Directive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
