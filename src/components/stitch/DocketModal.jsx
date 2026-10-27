import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DocketModal({ docket, onClose }) {
  if (!docket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-surface-container overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-surface-container-low">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-primary text-sm bg-surface-container px-2 py-0.5 rounded">
                {docket.id}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${docket.statusColor}`}>
                {docket.status}
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {docket.subject}
            </h3>
            <p className="text-xs text-outline mt-0.5">{docket.meta}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content Details */}
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Metadata pill grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-surface-container-low/50 p-3 rounded-xl">
            <div>
              <span className="text-outline block font-medium">Assigned Committee:</span>
              <strong className="text-on-surface font-semibold">{docket.committee}</strong>
            </div>
            <div>
              <span className="text-outline block font-medium">Urgency Tier:</span>
              <strong className="text-primary font-semibold">{docket.tier}</strong>
            </div>
            <div>
              <span className="text-outline block font-medium">Filed On:</span>
              <span className="text-on-surface font-medium">{docket.details.filedOn}</span>
            </div>
            <div>
              <span className="text-outline block font-medium">SLA Resolution Target:</span>
              <span className="text-secondary font-semibold">{docket.details.slaCountdown}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-1">
              Grievance Description &amp; Scope
            </h4>
            <p className="text-body-sm text-body-sm text-on-surface-variant leading-relaxed bg-surface p-3 rounded-xl border border-surface-container-low">
              {docket.details.description}
            </p>
          </div>

          {/* Milestones Audit Trail */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">
              Cryptographic Audit Trail
            </h4>
            <div className="space-y-2.5">
              {docket.details.milestones.map((ms, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-container-low/40">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${ms.done ? 'bg-secondary' : 'bg-outline/40'}`}></span>
                    <span className={ms.done ? 'text-on-surface font-medium' : 'text-outline'}>
                      {ms.label}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-outline">{ms.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-surface-container-low flex items-center justify-between">
          <Link
            to={`/student/grievance-details/${docket.id.replace('#', '')}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-bold transition-colors cursor-pointer text-xs"
          >
            <span>Open Full Page</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </Link>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-label-md text-label-md font-semibold bg-primary-container text-on-primary hover:bg-primary transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
