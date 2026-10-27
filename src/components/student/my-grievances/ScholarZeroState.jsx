import React from 'react';
import { Link } from 'react-router-dom';

export default function ScholarZeroState() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-10 sm:p-16 text-center flex flex-col items-center justify-center space-y-4 border border-outline-variant/20 shadow-sm">
      <div className="w-20 h-20 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-secondary mb-2">
        <span className="material-symbols-outlined text-[42px]">fact_check</span>
      </div>
      <div className="max-w-md space-y-1.5">
        <h3 className="font-headline-md text-headline-md font-extrabold text-primary">
          No grievances submitted yet
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Your statutory ledger is pristine. Should you ever encounter an academic, hostel, administrative, or fee-related grievance, NIVARAN guarantees 15-day time-bound redressal.
        </p>
      </div>
      <div className="pt-3">
        <Link
          to="/student/raise-grievance"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>+ Raise Your First Grievance</span>
        </Link>
      </div>
      <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-outline font-label-sm text-label-sm">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
          100% Confidential
        </span>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
          UGC Ombudsman Mandate
        </span>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">update</span>
          15-Day Resolution Cap
        </span>
      </div>
    </div>
  );
}
