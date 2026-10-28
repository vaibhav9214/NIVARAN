import React from 'react';

export default function QuickActionsGrid({ onSubmitClick, onTrackClick, onArchiveClick }) {
  return (
    <>
      {/* 3 Quick Action Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xs">
        
        {/* Quick Action 1 */}
        <div
          onClick={onSubmitClick}
          className="group p-space-lg bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs hover:border-primary-container hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-secondary-container text-secondary flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-[22px]">post_add</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all">
              arrow_forward
            </span>
          </div>
          <div className="mt-space-md">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              Submit a Grievance
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-normal">
              File a confidential concern with AI automated cell routing and encrypted evidence storage.
            </p>
          </div>
        </div>

        {/* Quick Action 2 */}
        <div
          onClick={onTrackClick}
          className="group p-space-lg bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs hover:border-primary-container hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-[22px]">radar</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all">
              arrow_forward
            </span>
          </div>
          <div className="mt-space-md">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              Track Status &amp; Inquiries
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-normal">
              Monitor active grievance progress, response deadlines, SLA countdowns, and direct messages.
            </p>
          </div>
        </div>

        {/* Quick Action 3 */}
        <div
          onClick={onArchiveClick}
          className="group p-space-lg bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs hover:border-primary-container hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all">
              arrow_forward
            </span>
          </div>
          <div className="mt-space-md">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              View Resolution Archive
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-normal">
              Download certified PDF settlement letters, official signoffs, and institutional audit records.
            </p>
          </div>
        </div>

      </section>

      {/* Institutional Reassurance Footer Note */}
      <section className="flex flex-col sm:flex-row items-center justify-between px-space-md py-3 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface-variant font-body-sm text-body-sm mt-space-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px]">gavel</span>
          <span>Redressal governed under UGC (Grievance Redressal) Regulations • NIVARAN Internal Audit Cell</span>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 font-label-md text-label-md text-secondary">
          <a
            className="hover:underline"
            href="#charter"
            onClick={(e) => { e.preventDefault(); alert('Statutory Redressal Charter: Standard 15-day resolution guidelines.'); }}
          >
            Statutory Charter
          </a>
          <a
            className="hover:underline"
            href="#ombudsman"
            onClick={(e) => { e.preventDefault(); alert('Ombudsman Office: ombudsman@nivaran.edu • Room 204 Main Administration'); }}
          >
            Ombudsman Contact
          </a>
          <a
            className="hover:underline"
            href="#antiragging"
            onClick={(e) => { e.preventDefault(); alert('National Anti-Ragging Cell: 1800-180-5522 (Toll Free 24x7)'); }}
          >
            Anti-Ragging Squad
          </a>
        </div>
      </section>
    </>
  );
}
