import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function QuickCaseInspectorDrawer({
  caseItem,
  onClose,
  onTriggerToast,
  onOpenReassign,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!caseItem) return null;

  const isOverdue = caseItem.slaStatus === 'overdue' || caseItem.status === 'Overdue';
  const officerName = caseItem.assignedOfficer?.name || user?.name || 'Assigned Officer';
  const departmentName = user?.department?.name || (typeof caseItem.department === 'string' ? caseItem.department : caseItem.department?.name) || 'Department Desk';

  return (
    <div className="lg:col-span-4 xl:col-span-4 transition-all duration-300 animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-lg flex flex-col gap-space-md sticky top-20 border-l-4 border-primary border-t border-r border-b border-outline-variant/30">
        {/* Panel Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Quick Case Inspector
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                #{caseItem.ticketId}
              </span>
              <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${caseItem.statusClass || ''}`}>
                {caseItem.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Title & Submitter Particulars */}
        <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
          <span className="font-label-sm text-label-sm text-outline">Grievance Matter:</span>
          <h4 className="font-label-lg text-label-lg text-on-surface font-bold">
            {caseItem.title}
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
            {caseItem.previewDesc || caseItem.summary || caseItem.description}
          </p>
        </div>

        {/* Student & Complainant Persona */}
        <div className="flex items-center justify-between p-space-sm bg-surface-container-lowest rounded-lg border border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-on-secondary-fixed flex-shrink-0">
              {caseItem.studentInitials || 'ST'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-bold truncate">
                {caseItem.student?.name || caseItem.student || 'Student Complainant'}
              </span>
              <span className="font-label-sm text-label-sm text-outline truncate">
                {caseItem.student?.email || caseItem.roll || 'Verified Student'}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
        </div>

        {/* SLA Countdown Visual Box */}
        <div
          className={`p-space-md rounded-xl flex items-center justify-between border ${
            isOverdue
              ? 'bg-error-container/40 border-error/20'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-[24px] ${
                isOverdue ? 'text-error' : 'text-amber-800'
              }`}
            >
              {isOverdue ? 'crisis_alert' : 'alarm'}
            </span>
            <div className="flex flex-col">
              <span
                className={`font-label-sm text-label-sm font-bold uppercase tracking-wider ${
                  isOverdue ? 'text-error' : 'text-amber-800'
                }`}
              >
                {isOverdue ? 'Statutory SLA Breach' : 'Statutory Redressal Window'}
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                {caseItem.previewSla || caseItem.deadline || 'Standard institutional turnaround'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onTriggerToast &&
              onTriggerToast(`Escalation dispatch initiated for ${caseItem.ticketId}`, 'priority_high')
            }
            className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-bold shadow-xs cursor-pointer transition-colors ${
              isOverdue
                ? 'bg-surface-container-lowest text-error hover:bg-error-container'
                : 'bg-surface-container-lowest text-amber-900 hover:bg-amber-100'
            }`}
          >
            {isOverdue ? 'Escalate Now' : 'Triage Fast'}
          </button>
        </div>

        {/* Key Meta Properties Bento */}
        <div className="grid grid-cols-2 gap-space-sm text-label-sm font-label-sm">
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/10">
            <span className="text-outline">Assigned Officer</span>
            <span className="text-on-surface font-semibold mt-0.5 truncate">{officerName}</span>
            <span className="text-outline text-[10px] truncate">{departmentName}</span>
          </div>

          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/10">
            <span className="text-outline">Category Roster</span>
            <span className="text-on-surface font-semibold mt-0.5 truncate">
              {caseItem.previewCategory || caseItem.category}
            </span>
            <span className="text-outline text-[10px] truncate">{caseItem.section || 'General'}</span>
          </div>

          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/10">
            <span className="text-outline">First Filed On</span>
            <span className="text-on-surface font-semibold mt-0.5">{caseItem.submitted || 'Recent'}</span>
          </div>

          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant/10">
            <span className="text-outline">Redressal Mandate</span>
            <span className="text-on-surface font-semibold mt-0.5">Statutory Policy</span>
          </div>
        </div>

        {/* Latest Internal Note */}
        <div className="flex flex-col gap-1 border-t border-surface-container pt-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline font-bold">
              Latest Internal Action Note:
            </span>
            <span className="text-[11px] text-outline">{caseItem.latestNoteTime || 'Recorded'}</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-2 rounded-lg italic border border-outline-variant/10 leading-relaxed">
            {caseItem.latestNote || 'Grievance docket active in officer queue.'}
          </p>
        </div>

        {/* Main Action CTA */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/officer/grievance/${caseItem.id || caseItem._id || caseItem.ticketId}`)}
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg font-bold shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Open Full Grievance Review</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>

          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() =>
                onTriggerToast &&
                onTriggerToast(`Opened quick internal note composer for ${caseItem.ticketId}`, 'edit_note')
              }
              className="text-primary hover:underline font-label-sm text-label-sm flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              Add Internal Note
            </button>

            <button
              type="button"
              onClick={() => onOpenReassign && onOpenReassign(caseItem)}
              className="text-error hover:underline font-label-sm text-label-sm flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[14px]">forward</span>
              Reassign Officer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
