import React from 'react';
import { Link } from 'react-router-dom';

export default function DeadlineMonitor({ onTriggerToast }) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col border border-outline-variant/20">
      <div className="flex items-center justify-between mb-space-md">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Deadline Monitor
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-outline">
          SLA Protocol § 11.2
        </span>
      </div>

      <div className="flex flex-col gap-space-md">
        {/* Urgency Bucket 1: Overdue */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-error font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              OVERDUE (2)
            </span>
            <span className="text-outline text-xs">Escalation imminent</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              to="/officer/grievance/GRV-2026-0129"
              className="p-2.5 rounded-lg bg-error-container/30 hover:bg-error-container/50 transition-colors flex flex-col gap-0.5 group border border-error/20"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-error-container font-bold group-hover:underline">
                  GRV-2026-0129
                </span>
                <span className="font-label-sm text-label-sm text-error font-bold">
                  Overdue by 4d
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface truncate font-medium">
                Portal Login Failure
              </span>
              <span className="font-label-sm text-label-sm text-error">
                Automated Dean escalation in 24h
              </span>
            </Link>

            <Link
              to="/officer/grievance/GRV-2026-0142"
              className="p-2.5 rounded-lg bg-error-container/30 hover:bg-error-container/50 transition-colors flex flex-col gap-0.5 group border border-error/20"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-error-container font-bold group-hover:underline">
                  GRV-2026-0142
                </span>
                <span className="font-label-sm text-label-sm text-error font-bold">
                  Overdue by 2d
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface truncate font-medium">
                Hostel Wi-Fi Connectivity
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                Current status: Diagnostic stage
              </span>
            </Link>
          </div>
        </div>

        {/* Urgency Bucket 2: Due Today */}
        <div className="flex flex-col gap-2 pt-space-xs">
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-amber-800 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              DUE TODAY (1)
            </span>
            <span className="text-outline text-xs">Action window closing</span>
          </div>

          <Link
            to="/officer/grievance/GRV-2026-0138"
            className="p-2.5 rounded-lg bg-amber-50 hover:bg-amber-100/70 transition-colors flex flex-col gap-0.5 group border border-amber-200"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-amber-900 font-bold group-hover:underline">
                GRV-2026-0138
              </span>
              <span className="font-label-sm text-label-sm text-amber-800 font-bold">
                6h remaining
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface truncate font-medium">
              Laboratory Equipment Issue
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              Needs immediate initial triage
            </span>
          </Link>
        </div>

        {/* Urgency Bucket 3: Due Soon */}
        <div className="flex flex-col gap-2 pt-space-xs">
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-secondary font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              DUE SOON (2)
            </span>
            <span className="text-outline text-xs">Within 48h</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Link
              to="/officer/grievance/GRV-2026-0124"
              className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between group border border-outline-variant/30"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
                  GRV-2026-0124 • Classroom Projector
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  Technician dispatch pending
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium whitespace-nowrap">
                Due in 1d
              </span>
            </Link>

            <Link
              to="/officer/grievance/GRV-2026-0117"
              className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between group border border-outline-variant/30"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-label-md text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
                  GRV-2026-0117 • Network Access
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  Certificate review
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium whitespace-nowrap">
                Due in 2d
              </span>
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onTriggerToast && onTriggerToast('Opening Institutional SLA Calendar...', 'calendar_month')}
        className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between font-label-md text-label-md text-primary font-bold hover:underline cursor-pointer text-left"
      >
        <span>View Full SLA Calendar</span>
        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
      </button>
    </div>
  );
}
