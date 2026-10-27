import React from 'react';

export default function UserProfileDrawer({
  isOpen,
  user,
  onClose,
  onApproveOfficer,
  onRejectOfficer,
  onToggleStatus,
  onReassignDepartment,
  onTriggerToast,
}) {
  if (!isOpen || !user) return null;

  const isPending = user.status === 'pending';
  const isSuspended = user.status === 'suspended';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-50 transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-container-lowest shadow-2xl z-50 flex flex-col justify-between overflow-y-auto border-l border-outline-variant/30 animate-slideLeft">
        <div className="p-space-lg">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">badge</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                Institutional Dossier
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* User Primary Details Card */}
          <div className="mt-space-md flex items-center gap-space-md bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center font-bold font-headline-md text-headline-md shrink-0 shadow-sm ${
                isPending
                  ? 'bg-error-container text-on-error-container'
                  : user.avatarBg || 'bg-primary-container text-on-primary'
              }`}
            >
              {user.initials || 'AM'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold truncate">
                {user.name}
              </h3>
              <p className="font-mono text-xs text-outline font-semibold">{user.id}</p>
              <div className="mt-1 flex items-center gap-1.5">
                {isPending ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> Pending
                    Approval
                  </span>
                ) : isSuspended ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error font-label-sm text-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Suspended
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Attributes List */}
          <div className="mt-space-lg space-y-space-md font-body-sm text-body-sm">
            <div className="bg-surface-container-low/50 p-space-md rounded-xl space-y-3 border border-outline-variant/20">
              <div>
                <span className="font-label-sm text-label-sm uppercase text-outline block font-semibold text-[11px]">
                  Official Email Address
                </span>
                <span className="font-mono text-on-surface font-semibold text-xs">
                  {user.email}
                </span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase text-outline block font-semibold text-[11px]">
                  Assigned / Nominated Department
                </span>
                <span className="font-label-md text-label-md text-primary font-bold">
                  {user.department}
                </span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase text-outline block font-semibold text-[11px]">
                  Account Classification
                </span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  {user.role === 'officer'
                    ? 'Department Redressal Liaison'
                    : user.role === 'student'
                    ? 'Student Body Member'
                    : 'Institutional Registrar'}
                </span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm uppercase text-outline block font-semibold text-[11px]">
                  Registration Timestamp
                </span>
                <span className="font-body-sm text-body-sm text-on-surface">
                  {user.registeredDate}, 10:15 AM IST
                </span>
              </div>
            </div>

            {/* Verification Insight Box */}
            <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-2 text-secondary font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>UGC CAS Identity Check</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Identity match confirmed with Institution Active Directory. Security token:{' '}
                <strong className="font-mono text-on-surface font-bold">
                  {user.authToken || 'AUTH-88219-X9'}
                </strong>
                . No historical grievances or sanctions lodged against account holder.
              </p>
            </div>

            {/* Case Assignment Readiness */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-outline-variant/20">
              <div>
                <span className="font-label-md text-label-md text-primary font-bold block">
                  Active Grievance Queue
                </span>
                <span className="font-body-sm text-body-sm text-outline">
                  {user.activeCases > 0
                    ? `Handling ${user.activeCases} active dockets`
                    : 'Ready for initial ticket routing'}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-surface-container font-mono text-xs font-bold text-secondary">
                {user.activeCases || 0} Open
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer Quick Actions */}
        <div className="p-space-lg bg-surface-container-low flex flex-col gap-2 border-t border-outline-variant/20">
          {isPending ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onApproveOfficer?.(user.id);
                  onTriggerToast?.(
                    `Officer credentials approved! Department assignment confirmed and verification notification dispatched.`,
                    'success'
                  );
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Approve Officer</span>
              </button>
              <button
                onClick={() => {
                  onRejectOfficer?.(user.id);
                  onTriggerToast?.(
                    `Nomination rejected for ${user.name}.`,
                    'warning'
                  );
                  onClose();
                }}
                className="px-4 py-2.5 rounded-lg bg-error-container text-on-error-container font-label-lg text-label-lg hover:opacity-90 transition-all flex items-center justify-center cursor-pointer font-bold"
              >
                <span>Reject</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onToggleStatus?.(user.id, isSuspended ? 'active' : 'suspended');
                  onTriggerToast?.(
                    `Account status updated to ${isSuspended ? 'Active' : 'Suspended'} for ${user.name}.`,
                    'success'
                  );
                  onClose();
                }}
                className={`flex-1 py-2.5 rounded-lg font-label-lg text-label-lg transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer font-bold ${
                  isSuspended
                    ? 'bg-secondary text-on-secondary hover:bg-secondary/90'
                    : 'bg-error-container text-on-error-container hover:opacity-90'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSuspended ? 'lock_open' : 'block'}
                </span>
                <span>{isSuspended ? 'Reactivate Account' : 'Suspend Account'}</span>
              </button>
            </div>
          )}

          <button
            onClick={() => {
              onReassignDepartment?.(user);
              onClose();
            }}
            className="w-full py-2 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md hover:bg-surface-container transition-all text-center shadow-sm cursor-pointer font-bold border border-outline-variant/20"
          >
            Reassign Department Unit
          </button>
        </div>
      </aside>
    </>
  );
}
