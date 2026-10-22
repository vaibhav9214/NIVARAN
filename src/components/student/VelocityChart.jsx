import React, { useState } from 'react';

export default function VelocityChart() {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const monthsData = [
    { name: 'May', submitted: 1, resolved: 1, subH: 35, resH: 35, subY: 155, resY: 155, subX: 75, resX: 101, textX: 99 },
    { name: 'Jun', submitted: 2, resolved: 2, subH: 70, resH: 70, subY: 120, resY: 120, subX: 175, resX: 201, textX: 199 },
    { name: 'Jul', submitted: 3, resolved: 1, subH: 105, resH: 35, subY: 85, resY: 155, subX: 275, resX: 301, textX: 299 },
    { name: 'Aug', submitted: 1, resolved: 2, subH: 35, resH: 70, subY: 155, resY: 120, subX: 375, resX: 401, textX: 399 },
    { name: 'Sep', submitted: 2, resolved: 0, subH: 70, resH: 4, subY: 120, resY: 186, subX: 475, resX: 501, textX: 499 },
    { name: 'Oct', submitted: 3, resolved: 1, subH: 105, resH: 35, subY: 85, resY: 155, subX: 575, resX: 601, textX: 599, isCurrent: true },
  ];

  return (
    <section className="w-full bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs p-space-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-md border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Your Grievance Activity &amp; Redressal Velocity
            </h2>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
              May 2026 – Oct 2026
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Comparison of personal submissions versus statutory resolution speed across the current academic term
          </p>
        </div>

        <div className="flex items-center gap-space-md">
          {/* KPI Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary text-[20px]">speed</span>
            <div>
              <span className="font-label-sm text-label-sm text-outline block leading-none">Velocity</span>
              <span className="font-label-lg text-label-lg font-bold text-on-surface">Avg. 4.2 Days</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
              <span className="w-3 h-3 rounded bg-primary-container"></span> Submitted
            </div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface">
              <span className="w-3 h-3 rounded bg-secondary-container border border-secondary-container"></span> Resolved
            </div>
          </div>
        </div>
      </div>

      {/* High-Fidelity Responsive SVG Chart Component */}
      <div className="pt-space-md w-full overflow-x-auto">
        <div className="min-w-[640px] h-60 w-full relative">
          <svg className="w-full h-full" fill="none" viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg">
            {/* Horizontal Grid lines */}
            <line className="text-outline-variant/25" stroke="currentColor" strokeDasharray="3 3" x1="40" x2="660" y1="20" y2="20" />
            <text className="text-outline font-label-sm" fill="currentColor" fontSize="10" x="25" y="24">5</text>

            <line className="text-outline-variant/25" stroke="currentColor" strokeDasharray="3 3" x1="40" x2="660" y1="65" y2="65" />
            <text className="text-outline font-label-sm" fill="currentColor" fontSize="10" x="25" y="69">4</text>

            <line className="text-outline-variant/25" stroke="currentColor" strokeDasharray="3 3" x1="40" x2="660" y1="110" y2="110" />
            <text className="text-outline font-label-sm" fill="currentColor" fontSize="10" x="25" y="114">3</text>

            <line className="text-outline-variant/25" stroke="currentColor" strokeDasharray="3 3" x1="40" x2="660" y1="155" y2="155" />
            <text className="text-outline font-label-sm" fill="currentColor" fontSize="10" x="25" y="159">1</text>

            <line className="text-outline-variant/40" stroke="currentColor" x1="40" x2="660" y1="190" y2="190" />
            <text className="text-outline font-label-sm" fill="currentColor" fontSize="10" x="25" y="193">0</text>

            {/* Render Bars per Month */}
            {monthsData.map((m) => (
              <g
                key={m.name}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredMonth(m)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                {/* Submitted bar */}
                <rect
                  className="transition-opacity group-hover:opacity-85"
                  fill="#07583f"
                  height={m.subH}
                  rx="3"
                  width="22"
                  x={m.subX}
                  y={m.subY}
                />
                {/* Resolved bar */}
                <rect
                  className="transition-opacity group-hover:opacity-85"
                  fill="#98f6c4"
                  height={m.resH}
                  rx="3"
                  width="22"
                  x={m.resX}
                  y={m.resY}
                />
                {/* Month Label */}
                <text
                  className={m.isCurrent ? "text-primary font-label-md font-bold" : "text-on-surface-variant font-label-md"}
                  fill="currentColor"
                  fontSize="11"
                  textAnchor="middle"
                  x={m.textX}
                  y="206"
                >
                  {m.isCurrent ? 'Oct (Current)' : m.name}
                </text>
              </g>
            ))}

            {/* Trend Line (Resolution Trend Velocity) */}
            <path
              d="M 112 155 L 212 120 L 312 155 L 412 120 L 512 186 L 612 155"
              stroke="#006c47"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
            <circle cx="112" cy="155" fill="#ffffff" r="3.5" stroke="#006c47" strokeWidth="2" />
            <circle cx="212" cy="120" fill="#ffffff" r="3.5" stroke="#006c47" strokeWidth="2" />
            <circle cx="312" cy="155" fill="#ffffff" r="3.5" stroke="#006c47" strokeWidth="2" />
            <circle cx="412" cy="120" fill="#ffffff" r="3.5" stroke="#006c47" strokeWidth="2" />
            <circle cx="512" cy="186" fill="#ffffff" r="3.5" stroke="#006c47" strokeWidth="2" />
            <circle cx="612" cy="155" fill="#ffffff" r="3.5" stroke="#006c47" strokeWidth="2" />
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredMonth && (
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs px-3 py-1.5 rounded-lg shadow-md pointer-events-none flex items-center gap-3 animate-in fade-in duration-150"
            >
              <span className="font-bold">{hoveredMonth.name}:</span>
              <span>Submitted: {hoveredMonth.submitted}</span>
              <span>Resolved: {hoveredMonth.resolved}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
