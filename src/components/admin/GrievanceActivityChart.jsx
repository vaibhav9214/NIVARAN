import React from 'react';

export default function GrievanceActivityChart({ onTriggerToast }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
            Grievance Activity
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Submissions and resolutions over time (12-Week granular telemetry)
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-label-md">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-primary"></span>
            <span className="text-on-surface-variant font-semibold">Submitted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-secondary"></span>
            <span className="text-on-surface-variant font-semibold">Resolved</span>
          </div>
        </div>
      </div>

      {/* Inline SVG Multi-Curve Chart Visualization */}
      <div className="w-full relative mt-2 bg-surface-container-low rounded-lg p-4 border border-outline-variant/20">
        <div className="h-64 w-full relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 720 220">
            <defs>
              <linearGradient id="submittedGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#07583F" stopOpacity="0.18"></stop>
                <stop offset="100%" stopColor="#07583F" stopOpacity="0.00"></stop>
              </linearGradient>
              <linearGradient id="resolvedGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#21845B" stopOpacity="0.22"></stop>
                <stop offset="100%" stopColor="#21845B" stopOpacity="0.00"></stop>
              </linearGradient>
            </defs>

            {/* Subtle Horizontal Reference Grids */}
            <line stroke="#E6EBE7" strokeDasharray="3 3" x1="30" x2="710" y1="20" y2="20"></line>
            <line stroke="#E6EBE7" strokeDasharray="3 3" x1="30" x2="710" y1="70" y2="70"></line>
            <line stroke="#E6EBE7" strokeDasharray="3 3" x1="30" x2="710" y1="120" y2="120"></line>
            <line stroke="#E6EBE7" x1="30" x2="710" y1="170" y2="170"></line>

            {/* Left Y-Axis labels */}
            <text fill="#8B9690" fontFamily="Manrope" fontSize="10" textAnchor="end" x="22" y="24">160</text>
            <text fill="#8B9690" fontFamily="Manrope" fontSize="10" textAnchor="end" x="22" y="74">120</text>
            <text fill="#8B9690" fontFamily="Manrope" fontSize="10" textAnchor="end" x="22" y="124">80</text>
            <text fill="#8B9690" fontFamily="Manrope" fontSize="10" textAnchor="end" x="22" y="174">40</text>

            {/* Submitted Fill & Line */}
            <path
              d="M 60 145 L 115 115 L 170 130 L 225 101 L 280 82 L 335 97 L 390 65 L 445 57 L 500 42 L 555 80 L 610 97 L 665 87 L 665 170 L 60 170 Z"
              fill="url(#submittedGrad)"
            ></path>
            <path
              d="M 60 145 L 115 115 L 170 130 L 225 101 L 280 82 L 335 97 L 390 65 L 445 57 L 500 42 L 555 80 L 610 97 L 665 87"
              fill="none"
              stroke="#003f2b"
              strokeLinecap="round"
              strokeWidth="2.5"
            ></path>

            {/* Resolved Fill & Line */}
            <path
              d="M 60 160 L 115 142 L 170 122 L 225 117 L 280 100 L 335 105 L 390 90 L 445 76 L 500 72 L 555 60 L 610 82 L 665 76 L 665 170 L 60 170 Z"
              fill="url(#resolvedGrad)"
            ></path>
            <path
              d="M 60 160 L 115 142 L 170 122 L 225 117 L 280 100 L 335 105 L 390 90 L 445 76 L 500 72 L 555 60 L 610 82 L 665 76"
              fill="none"
              stroke="#006c47"
              strokeLinecap="round"
              strokeWidth="2.5"
            ></path>

            {/* Week 9 Peak Highlight Line */}
            <line opacity="0.6" stroke="#006c47" strokeDasharray="2 2" strokeWidth="1.5" x1="500" x2="500" y1="20" y2="170"></line>
            <circle cx="500" cy="42" fill="#003f2b" r="4.5" stroke="#ffffff" strokeWidth="2"></circle>
            <circle cx="500" cy="72" fill="#006c47" r="4.5" stroke="#ffffff" strokeWidth="2"></circle>
          </svg>

          {/* Active Point Tooltip Callout for Week 9 */}
          <div className="absolute left-[62%] sm:left-[66%] top-3 -translate-x-1/2 bg-surface-container-lowest/95 backdrop-blur-md p-2.5 rounded-lg shadow-md text-left z-10 border border-outline-variant/30">
            <div className="font-label-sm text-label-sm text-tertiary font-bold pb-1 flex items-center justify-between gap-3">
              <span>Week 09 Peak</span>
              <span className="text-[10px] text-outline font-normal">Mid-Semester Exam</span>
            </div>
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>Submitted: <strong>142 dockets</strong></span>
            </div>
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-secondary">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>Resolved: <strong>118 cases</strong></span>
            </div>
          </div>
        </div>

        {/* X-Axis Week Markers */}
        <div className="grid grid-cols-12 text-center pt-2 font-label-sm text-label-sm text-outline">
          <span>W1</span>
          <span>W2</span>
          <span>W3</span>
          <span>W4</span>
          <span>W5</span>
          <span>W6</span>
          <span>W7</span>
          <span>W8</span>
          <span className="text-primary font-bold">W9</span>
          <span>W10</span>
          <span>W11</span>
          <span>W12</span>
        </div>
      </div>

      {/* Quick Intake Velocity Stats Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-2">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary text-[22px]">north_east</span>
          <div>
            <div className="font-label-sm text-label-sm text-outline">Peak Intake</div>
            <div className="font-label-lg text-label-lg text-on-surface font-bold">W9: 142 dockets</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
          <span className="material-symbols-outlined text-secondary text-[22px]">calendar_view_week</span>
          <div>
            <div className="font-label-sm text-label-sm text-outline">Avg Weekly Intake</div>
            <div className="font-label-lg text-label-lg text-on-surface font-bold">107 cases / wk</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/20">
          <span className="material-symbols-outlined text-secondary text-[22px]">speed</span>
          <div>
            <div className="font-label-sm text-label-sm text-outline">Current Momentum</div>
            <div className="font-label-lg text-label-lg text-secondary font-bold">+9.4% resolution gain</div>
          </div>
        </div>
      </div>
    </section>
  );
}
