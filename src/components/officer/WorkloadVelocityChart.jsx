import React from 'react';

export default function WorkloadVelocityChart() {
  const chartDays = [
    { label: 'Thu', newCases: 90, reviewed: 75, resolved: 60, xNew: 42, xRev: 56, xRes: 70 },
    { label: 'Fri', newCases: 110, reviewed: 95, resolved: 80, xNew: 137, xRev: 151, xRes: 165 },
    { label: 'Sat', newCases: 40, reviewed: 30, resolved: 20, xNew: 232, xRev: 246, xRes: 260 },
    { label: 'Sun', newCases: 20, reviewed: 15, resolved: 10, xNew: 327, xRev: 341, xRes: 355 },
    { label: 'Mon', newCases: 125, reviewed: 110, resolved: 90, xNew: 422, xRev: 436, xRes: 450 },
    { label: 'Tue', newCases: 115, reviewed: 100, resolved: 85, xNew: 517, xRev: 531, xRes: 545 },
    { label: 'Wed (Today)', newCases: 130, reviewed: 120, resolved: 105, xNew: 612, xRev: 626, xRes: 640 },
  ];

  return (
    <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col border border-outline-variant/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-sm mb-space-lg">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            My Workload
          </h2>
          <p className="font-body-sm text-body-sm text-outline">
            Weekly throughput and case resolution distribution (17 Oct – 24 Oct 2026)
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-space-md font-label-sm text-label-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-primary"></span>
            <span className="text-on-surface-variant font-medium">New assignments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-secondary"></span>
            <span className="text-on-surface-variant font-medium">Cases reviewed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-primary-fixed-dim"></span>
            <span className="text-on-surface-variant font-medium">Cases resolved</span>
          </div>
        </div>
      </div>

      {/* Inline SVG 7-Day Velocity Chart */}
      <div className="w-full h-56 relative mb-space-lg overflow-x-auto">
        <svg className="w-full h-full min-w-[500px] overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
          {/* Grid Lines */}
          <line className="text-surface-variant" stroke="currentColor" strokeDasharray="3,3" x1="0" x2="700" y1="20" y2="20" />
          <line className="text-surface-variant" stroke="currentColor" strokeDasharray="3,3" x1="0" x2="700" y1="70" y2="70" />
          <line className="text-surface-variant" stroke="currentColor" strokeDasharray="3,3" x1="0" x2="700" y1="120" y2="120" />
          <line className="text-surface-variant" stroke="currentColor" x1="0" x2="700" y1="170" y2="170" />

          {chartDays.map((day, idx) => (
            <g key={idx} className="transition-all hover:opacity-80 cursor-pointer">
              {/* Bar 1: New assignments */}
              <rect
                fill="#003f2b"
                height={day.newCases}
                rx="3"
                width="12"
                x={day.xNew}
                y={170 - day.newCases}
              >
                <title>{day.label} - New: {Math.round(day.newCases / 10)} cases</title>
              </rect>

              {/* Bar 2: Reviewed */}
              <rect
                fill="#006c47"
                height={day.reviewed}
                rx="3"
                width="12"
                x={day.xRev}
                y={170 - day.reviewed}
              >
                <title>{day.label} - Reviewed: {Math.round(day.reviewed / 10)} cases</title>
              </rect>

              {/* Bar 3: Resolved */}
              <rect
                fill="#8fd5b5"
                height={day.resolved}
                rx="3"
                width="12"
                x={day.xRes}
                y={170 - day.resolved}
              >
                <title>{day.label} - Resolved: {Math.round(day.resolved / 10)} cases</title>
              </rect>
            </g>
          ))}
        </svg>

        {/* Day Labels */}
        <div className="flex justify-between px-6 pt-2 font-label-sm text-label-sm text-outline select-none min-w-[500px]">
          {chartDays.map((d, i) => (
            <span key={i} className={i === 6 ? 'font-bold text-primary' : ''}>
              {d.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-md bg-surface-container-low/40 p-space-md rounded-lg border border-outline-variant/20">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline">Active Cases</span>
          <span className="font-headline-md text-headline-md text-on-surface font-bold text-2xl">
            24
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-medium">
            Department capacity safe
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline">Resolved This Month</span>
          <span className="font-headline-md text-headline-md text-on-surface font-bold text-2xl">
            38
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            +12% vs last month
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline">Avg. Resolution Time</span>
          <span className="font-headline-md text-headline-md text-on-surface font-bold text-2xl">
            4.2 days
          </span>
          <span className="font-label-sm text-label-sm text-outline">Statutory cap: 15 days</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline">SLA Adherence Rate</span>
          <span className="font-headline-md text-headline-md text-primary font-bold text-2xl">
            91.8%
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            Institutional tier: High
          </span>
        </div>
      </div>
    </section>
  );
}
