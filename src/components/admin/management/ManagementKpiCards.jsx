import React from 'react';

export default function ManagementKpiCards({
  totalAccounts = 2486,
  enrolledStudents = 2412,
  authorizedOfficers = 58,
  pendingApprovals = 16,
  onReviewPending,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
      {/* Total Accounts */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/20 hover:shadow-md transition-shadow">
        <div className="absolute -right-3 -top-3 w-20 h-20 bg-secondary-container/20 rounded-full blur-xl pointer-events-none"></div>
        <div>
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">
              Total Accounts
            </span>
            <span className="material-symbols-outlined text-secondary text-[22px]">group</span>
          </div>
          <div className="font-display-lg text-headline-xl text-primary font-bold">
            {totalAccounts.toLocaleString()}
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/10">
          <span className="flex items-center gap-1 text-secondary font-semibold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span> +42 this term
          </span>
          <span className="text-outline text-xs">Active database</span>
        </div>
      </div>

      {/* Enrolled Students */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20 hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">
              Enrolled Students
            </span>
            <span className="material-symbols-outlined text-secondary text-[22px]">school</span>
          </div>
          <div className="font-display-lg text-headline-xl text-primary font-bold">
            {enrolledStudents.toLocaleString()}
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/10">
          <span className="flex items-center gap-1 text-on-surface font-medium text-xs">
            <span className="w-2 h-2 rounded-full bg-secondary"></span> 98.4% verified .edu
          </span>
          <span className="text-outline text-xs">CAS-SSO Link</span>
        </div>
      </div>

      {/* Authorized Officers */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20 hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">
              Authorized Officers
            </span>
            <span className="material-symbols-outlined text-secondary text-[22px]">badge</span>
          </div>
          <div className="font-display-lg text-headline-xl text-primary font-bold">
            {authorizedOfficers}
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/10">
          <span className="text-on-surface text-xs">Across 5 departments</span>
          <span className="text-secondary font-semibold text-xs">100% Assigned</span>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative border border-outline-variant/20 hover:shadow-md transition-shadow">
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-error-container text-on-error-container font-semibold">
            Urgent Action
          </span>
        </div>
        <div>
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">
              Pending Approvals
            </span>
          </div>
          <div className="font-display-lg text-headline-xl text-primary font-bold flex items-baseline gap-2">
            <span>{pendingApprovals}</span>
            <span className="font-label-sm text-label-sm text-outline font-normal">
              officer / faculty requests
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between font-body-sm text-body-sm border-t border-outline-variant/10">
          <button
            onClick={onReviewPending}
            className="text-secondary font-semibold hover:underline flex items-center gap-1 cursor-pointer text-xs"
          >
            Review queue <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
          <span className="text-outline text-xs">Avg SLA: 4.2h</span>
        </div>
      </div>
    </div>
  );
}
