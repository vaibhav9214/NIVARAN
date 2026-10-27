import React from 'react';

export default function OfficersDeskView({
  officers = [],
  onOpenProfileDrawer,
  onApproveOfficer,
  onRejectOfficer,
  onTriggerToast,
}) {
  const pendingOfficers = officers.filter(
    (u) => u.role === 'officer' && u.status === 'pending'
  );
  const activeOfficers = officers.filter(
    (u) => u.role === 'officer' && u.status === 'active'
  );

  return (
    <div className="flex flex-col gap-space-lg animate-fadeIn">
      {/* Officer Approval Alert Banner */}
      <div className="bg-error-container/40 border border-error/20 p-space-md rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-space-sm shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px] text-error">notification_important</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              Officer Credentials Statutory Queue
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              {pendingOfficers.length} departmental liaisons require verification of institutional Active Directory tokens before handling student redressals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            onClick={() =>
              onTriggerToast?.(
                'Bulk verification dispatch triggered for all pending departmental officers.',
                'success'
              )
            }
            className="px-3.5 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all cursor-pointer font-bold shadow-xs"
          >
            Bulk Verify AD Tokens
          </button>
        </div>
      </div>

      {/* Pending Approvals Grid */}
      <div>
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-2">
            <h2 className="font-headline-md text-headline-md text-primary font-bold">
              Nominated Department Officers Awaiting Sanction
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
              {pendingOfficers.length} Pending
            </span>
          </div>
        </div>

        {pendingOfficers.length === 0 ? (
          <div className="bg-surface-container-lowest p-space-xl rounded-xl text-center border border-outline-variant/20">
            <span className="material-symbols-outlined text-[48px] text-secondary mb-2">
              check_circle
            </span>
            <h3 className="font-headline-md text-headline-md text-primary font-bold">
              All Officer Nominations are Clear!
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-md mx-auto">
              There are no pending departmental redressal officers in the verification queue.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {pendingOfficers.map((officer) => (
              <div
                key={officer.id}
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center font-bold text-headline-sm font-headline-sm shrink-0">
                        {officer.initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                          {officer.name}
                        </h4>
                        <p className="font-mono text-xs text-outline font-semibold">
                          {officer.id}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> Pending
                    </span>
                  </div>

                  <div className="bg-surface-container-low p-space-sm rounded-lg space-y-1.5 font-body-sm text-body-sm my-3 border border-outline-variant/10">
                    <div>
                      <span className="font-label-sm text-label-sm text-outline block uppercase text-[10px]">
                        Nominated Department
                      </span>
                      <span className="font-label-md text-label-md text-primary font-bold">
                        {officer.department}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-outline block uppercase text-[10px]">
                        Official Email
                      </span>
                      <span className="font-mono text-xs text-on-surface">
                        {officer.email}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-outline block uppercase text-[10px]">
                        Active Directory CAS Token
                      </span>
                      <span className="font-mono text-xs font-semibold text-secondary">
                        {officer.authToken || 'AUTH-88219-X9'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-space-md border-t border-outline-variant/10 flex items-center gap-2">
                  <button
                    onClick={() => onApproveOfficer(officer.id)}
                    className="flex-1 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Approve
                  </button>
                  <button
                    onClick={() => onOpenProfileDrawer(officer)}
                    className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-all cursor-pointer font-semibold"
                    title="Open Full Dossier"
                  >
                    Dossier
                  </button>
                  <button
                    onClick={() => onRejectOfficer(officer.id)}
                    className="p-2 rounded-lg text-error hover:bg-error-container/20 transition-all cursor-pointer"
                    title="Reject Nomination"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Officers Summary Section */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 mt-space-md">
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-2">
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              Active Authorized Officers ({activeOfficers.length})
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
              100% Redressal Duty
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm font-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-2.5 px-3">Officer</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Active Docket</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {activeOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-primary">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                        {officer.initials}
                      </div>
                      <span>{officer.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-on-surface">{officer.department}</td>
                  <td className="py-2.5 px-3 font-mono text-xs text-on-surface-variant">{officer.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-semibold text-xs font-mono">
                      {officer.activeCases} Open
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onOpenProfileDrawer(officer)}
                      className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-primary font-label-sm text-label-sm font-bold cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
