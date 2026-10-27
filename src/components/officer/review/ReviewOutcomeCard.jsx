import React from 'react';

export default function ReviewOutcomeCard({
  outcome,
  onOutcomeChange,
  technician,
  onTechnicianChange,
  forwardDept,
  onForwardDeptChange,
  remarks,
  onRemarksChange,
  onExecuteDecision,
  onSaveDraft,
}) {
  const getCtaDetails = () => {
    switch (outcome) {
      case 'accept':
        return {
          icon: 'task_alt',
          text: 'Accept for Investigation & Issue Work Order',
        };
      case 'forward':
        return {
          icon: 'forward',
          text: 'Forward Docket to Department',
        };
      case 'info':
        return {
          icon: 'contact_support',
          text: 'Transmit Information Request',
        };
      case 'duplicate':
        return {
          icon: 'content_copy',
          text: 'Merge into Existing Master Docket',
        };
      case 'reject':
        return {
          icon: 'cancel',
          text: 'Issue Formal Rejection Order',
        };
      default:
        return {
          icon: 'task_alt',
          text: 'Accept for Investigation',
        };
    }
  };

  const cta = getCtaDetails();

  return (
    <section className="bg-surface-container-lowest rounded-lg p-space-xl shadow-md flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">gavel</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Review Outcome &amp; Decision
          </h2>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Record your assessment and select the appropriate statutory next step.
        </p>
      </div>

      {/* Radio Outcome Selectors */}
      <div className="flex flex-col gap-2">
        {/* 1. Accept for Investigation */}
        <label
          className={`outcome-card flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
            outcome === 'accept'
              ? 'bg-surface-container-low border-primary/40 shadow-xs'
              : 'bg-surface-container-low/60 border-transparent hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="review_outcome"
            value="accept"
            checked={outcome === 'accept'}
            onChange={() => onOutcomeChange('accept')}
            className="mt-1 accent-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Accept for Investigation
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              Advances to 'In Progress', assigns field technician
            </span>
          </div>
        </label>

        {/* 2. Request More Information */}
        <label
          className={`outcome-card flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
            outcome === 'info'
              ? 'bg-surface-container-low border-primary/40 shadow-xs'
              : 'bg-surface-container-low/60 border-transparent hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="review_outcome"
            value="info"
            checked={outcome === 'info'}
            onChange={() => onOutcomeChange('info')}
            className="mt-1 accent-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Request More Information
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              Awaits student response, pauses SLA clock
            </span>
          </div>
        </label>

        {/* 3. Forward to Another Dept */}
        <label
          className={`outcome-card flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
            outcome === 'forward'
              ? 'bg-surface-container-low border-primary/40 shadow-xs'
              : 'bg-surface-container-low/60 border-transparent hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="review_outcome"
            value="forward"
            checked={outcome === 'forward'}
            onChange={() => onOutcomeChange('forward')}
            className="mt-1 accent-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Forward to Another Dept
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              Transfers docket to authorized redressal cell
            </span>
          </div>
        </label>

        {/* 4. Mark as Duplicate */}
        <label
          className={`outcome-card flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
            outcome === 'duplicate'
              ? 'bg-surface-container-low border-primary/40 shadow-xs'
              : 'bg-surface-container-low/60 border-transparent hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="review_outcome"
            value="duplicate"
            checked={outcome === 'duplicate'}
            onChange={() => onOutcomeChange('duplicate')}
            className="mt-1 accent-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Mark as Duplicate
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              Link to existing parent docket file
            </span>
          </div>
        </label>

        {/* 5. Reject with Justification */}
        <label
          className={`outcome-card flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
            outcome === 'reject'
              ? 'bg-surface-container-low border-primary/40 shadow-xs'
              : 'bg-surface-container-low/60 border-transparent hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="review_outcome"
            value="reject"
            checked={outcome === 'reject'}
            onChange={() => onOutcomeChange('reject')}
            className="mt-1 accent-primary cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Reject with Justification
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              Requires formal policy statutory ground
            </span>
          </div>
        </label>
      </div>

      {/* Dynamic Fields Section */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        {/* Dynamic Section: Technician Assignee (Visible for accept) */}
        {outcome === 'accept' && (
          <div className="flex flex-col gap-1 animate-fadeIn">
            <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Assign Lead Technician / Inspector
            </label>
            <select
              value={technician}
              onChange={(e) => onTechnicianChange(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none border border-outline-variant/30"
            >
              <option value="rajesh">Rajesh Kumar (Senior Lab Tech • Instrumentation)</option>
              <option value="vikram">Vikram Rathore (Central Workshop Machinist)</option>
              <option value="neha">Neha Deshmukh (Electronics Repair Specialist)</option>
            </select>
          </div>
        )}

        {/* Dynamic Section: Forward Dept (Visible for forward) */}
        {outcome === 'forward' && (
          <div className="flex flex-col gap-1 animate-fadeIn">
            <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Forward to Department
            </label>
            <select
              value={forwardDept}
              onChange={(e) => onForwardDeptChange(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface text-on-surface font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:outline-none border border-outline-variant/30"
            >
              <option value="physics_hod">Physics Department HOD Office</option>
              <option value="workshop">Central University Workshop</option>
              <option value="procurement">Central Stores &amp; Procurement</option>
              <option value="academic">Academic Affairs Committee</option>
            </select>
          </div>
        )}

        {/* Officer Formal Remarks */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Officer Remarks &amp; Grounds *
            </label>
            <span className="font-label-sm text-label-sm text-outline">
              {remarks.length}/1000
            </span>
          </div>
          <textarea
            value={remarks}
            maxLength={1000}
            onChange={(e) => onRemarksChange(e.target.value)}
            className="w-full p-space-sm rounded-lg bg-surface text-on-surface font-body-md text-body-md focus:ring-2 focus:ring-primary focus:outline-none resize-none border border-outline-variant/30"
            placeholder="Enter your formal assessment, observations, and required remediation instructions..."
            rows="4"
          />
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-space-xs pt-space-xs">
          <button
            type="button"
            onClick={onExecuteDecision}
            className="w-full py-3 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">{cta.icon}</span>
            {cta.text}
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold transition-colors cursor-pointer"
          >
            Save Draft Assessment
          </button>
        </div>
      </div>
    </section>
  );
}
