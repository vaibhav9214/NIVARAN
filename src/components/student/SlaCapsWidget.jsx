import React from 'react';

export default function SlaCapsWidget({ onSlaClick }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs p-space-lg flex flex-col gap-space-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">timer</span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Upcoming SLA Caps
          </h3>
        </div>
        <span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant font-semibold">
          Statutory 15-Day Cap
        </span>
      </div>

      {/* Deadline Item 1 */}
      <div className="flex flex-col gap-1.5 p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-primary font-bold">#NIV-1024</span>
            <p className="font-label-lg text-label-lg font-semibold text-on-surface leading-tight mt-0.5">
              Dean Hearing: Hostel Water Grid
            </p>
          </div>
          <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface font-bold">
            2 Days Left
          </span>
        </div>
        <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mt-1">
          <span>Day 9 of 15 elapsed</span>
          <span className="text-secondary font-semibold">Oct 26, 4:00 PM</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
          <div className="bg-secondary h-full rounded-full" style={{ width: '60%' }}></div>
        </div>
      </div>

      {/* Deadline Item 2 */}
      <div className="flex flex-col gap-1.5 p-space-sm rounded-lg bg-amber-500/[0.04] border border-amber-300/40">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-amber-800 font-bold">#NIV-1023</span>
            <p className="font-label-lg text-label-lg font-semibold text-on-surface leading-tight mt-0.5">
              Mess Quality Clarification
            </p>
          </div>
          <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-error-container text-error font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">alarm</span> 24h Due
          </span>
        </div>
        <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant mt-1">
          <span>Required response by Scholar</span>
          <span className="text-error font-bold">Oct 25, 11:59 PM</span>
        </div>
        {/* Progress Bar warning */}
        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }}></div>
        </div>
      </div>

    </div>
  );
}
