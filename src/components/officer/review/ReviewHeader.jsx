import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ReviewHeader({
  caseData,
  simState,
  onTriggerToast,
  onEscalateDean,
}) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCopyTicket = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(caseData.id).then(() => {
        onTriggerToast && onTriggerToast(`Docket ID ${caseData.id} copied to clipboard`, 'content_copy');
      });
    } else {
      onTriggerToast && onTriggerToast(`Docket ID ${caseData.id} copied to clipboard`, 'content_copy');
    }
  };

  // Status pill calculation based on simulation state or active case status
  const getStatusPill = () => {
    if (simState === 'awaiting') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 font-label-sm text-label-sm uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
          Awaiting Review
        </span>
      );
    }
    if (simState === 'inforeq') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 text-blue-900 font-label-sm text-label-sm uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Request Info Pending
        </span>
      );
    }
    if (simState === 'forwarded') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-900 font-label-sm text-label-sm uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-purple-600"></span>
          Forwarded to Central Workshop
        </span>
      );
    }
    if (simState === 'resolved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          Resolved &amp; Sealed
        </span>
      );
    }

    // Default based on case status
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold ${caseData.statusPillClass || 'bg-amber-100 text-amber-900'}`}>
        <span className={`w-2 h-2 rounded-full ${caseData.statusDotClass || 'bg-amber-600 animate-pulse'}`}></span>
        {caseData.status || 'Awaiting Review'}
      </span>
    );
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      {/* Breadcrumbs & Quick Nav */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs font-label-md text-label-md text-outline">
          <Link to="/officer/dashboard" className="hover:text-primary transition-colors">
            Officer Workspace
          </Link>
          <span>/</span>
          <Link to="/officer/assigned-grievances" className="hover:text-primary transition-colors">
            Assigned Grievances
          </Link>
          <span>/</span>
          <span className="text-on-surface font-semibold">{caseData.id}</span>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => navigate('/officer/dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Review Queue
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
              title="Case Actions"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-1.5 w-56 rounded-lg bg-surface-container-lowest shadow-xl py-1.5 z-30 border border-outline-variant/30 animate-fadeIn"
                onClick={() => setDropdownOpen(false)}
              >
                <button
                  onClick={handleCopyTicket}
                  className="w-full text-left px-3 py-2 text-on-surface hover:bg-surface-container flex items-center gap-2 font-label-md text-label-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline">content_copy</span>
                  Copy Ticket Identifier
                </button>
                <button
                  onClick={() => onTriggerToast && onTriggerToast('Docket summary queued for print spooler...', 'print')}
                  className="w-full text-left px-3 py-2 text-on-surface hover:bg-surface-container flex items-center gap-2 font-label-md text-label-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-outline">print</span>
                  Print Docket Summary
                </button>
                <button
                  onClick={() => {
                    if (onEscalateDean) onEscalateDean();
                    else onTriggerToast && onTriggerToast('Urgent escalation dispatch sent to Dean of Student Affairs.', 'flag');
                  }}
                  className="w-full text-left px-3 py-2 text-error hover:bg-error-container/20 flex items-center gap-2 font-label-md text-label-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-error">flag</span>
                  Escalate to Dean
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Title Block & Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Grievance Review
            </span>
            <div className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-0.5 rounded-full">
              <span className="font-label-md text-label-md font-bold text-primary tracking-wide">
                #{caseData.id}
              </span>
              <button
                className="text-outline hover:text-primary transition-colors flex items-center cursor-pointer"
                onClick={handleCopyTicket}
                title="Copy ID"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
            {getStatusPill()}
          </div>

          <h1 className="font-headline-sm text-headline-sm text-on-surface-variant font-medium mt-1">
            {caseData.title}
          </h1>
        </div>
      </div>

      {/* Metadata Ribbon Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-sm pt-space-sm bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Category</span>
          <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1 mt-0.5 truncate">
            <span className="material-symbols-outlined text-[16px] text-secondary">
              {caseData.categoryIcon || 'domain'}
            </span>
            {caseData.category}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Subcategory</span>
          <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5 truncate">
            {caseData.subcategory}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Submitted On</span>
          <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5 truncate">
            {caseData.submittedOn}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Department</span>
          <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5 truncate">
            {caseData.department}
          </span>
        </div>

        <div className="flex flex-col col-span-2 sm:col-span-1">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Statutory Priority</span>
          <span className={`inline-flex items-center gap-1 font-label-md text-label-md font-bold mt-0.5 ${caseData.priorityText || 'text-amber-800'}`}>
            <span className={`w-2 h-2 rounded-full ${caseData.priorityDot || 'bg-amber-500'}`}></span>
            {caseData.statutoryPriority}
          </span>
        </div>
      </div>
    </div>
  );
}
