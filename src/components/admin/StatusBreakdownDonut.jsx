import React from 'react';
import { STATUS_BREAKDOWN } from '../../data/adminDashboardData';

export default function StatusBreakdownDonut({ onTriggerToast }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
      <div className="pb-3">
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
          Status Breakdown
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Active categorical distribution across 1,284 records
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
        {/* Donut SVG */}
        <div className="relative w-40 h-40 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Circumference = 2 * PI * 40 = 251.32 */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="#E6EBE7"
              strokeWidth="12"
            ></circle>
            {/* Resolved: 69.5% */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="#006c47"
              strokeDasharray="174.6 251.3"
              strokeDashoffset="0"
              strokeWidth="12"
            ></circle>
            {/* Closed/Redressed: 10.0% */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="#07583f"
              strokeDasharray="25.1 251.3"
              strokeDashoffset="-174.6"
              strokeWidth="12"
            ></circle>
            {/* In Progress: 8.9% */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="#2d3834"
              strokeDasharray="22.3 251.3"
              strokeDashoffset="-199.7"
              strokeWidth="12"
            ></circle>
            {/* Awaiting Review: 5.3% */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="#8fd5b5"
              strokeDasharray="13.3 251.3"
              strokeDashoffset="-222"
              strokeWidth="12"
            ></circle>
            {/* Overdue: 3.7% */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="#ba1a1a"
              strokeDasharray="9.3 251.3"
              strokeDashoffset="-235.3"
              strokeWidth="12"
            ></circle>
            {/* Awaiting Student: 2.6% */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="40"
              stroke="#bfc9c2"
              strokeDasharray="6.5 251.3"
              strokeDashoffset="-244.6"
              strokeWidth="12"
            ></circle>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              1,284
            </span>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>

        {/* Segments Legend */}
        <div className="grid grid-cols-1 gap-2 w-full text-xs font-label-md">
          {STATUS_BREAKDOWN.map((seg, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className={`flex items-center gap-2 ${seg.isError ? 'text-error font-medium' : 'text-on-surface'}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${seg.color}`}></span>
                {seg.label}
              </span>
              <span className={`font-semibold ${seg.isError ? 'text-error font-bold' : 'text-on-surface'}`}>
                {seg.count} ({seg.percent})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-outline-variant/10">
        <button
          type="button"
          onClick={() =>
            onTriggerToast &&
            onTriggerToast('Generating categorical grievance cluster report...', 'donut_small')
          }
          className="w-full font-label-sm text-label-sm text-primary hover:text-secondary flex items-center justify-between font-semibold cursor-pointer"
        >
          <span>Inspect Categorical Distribution</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
