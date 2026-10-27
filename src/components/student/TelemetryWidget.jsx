import React from 'react';

const TELEMETRY_FEEDS = [
  {
    icon: 'person_check',
    iconBg: 'bg-secondary-container text-secondary',
    content: (
      <>
        <strong className="font-semibold text-primary">Dr. M. K. Rao (Welfare Dean)</strong> was assigned as official investigator for{' '}
        <span className="font-mono text-on-surface font-semibold text-xs">#NIV-1024</span>.
      </>
    ),
    time: '2 hours ago'
  },
  {
    icon: 'sync_alt',
    iconBg: 'bg-surface-container text-on-surface-variant',
    content: (
      <>
        Docket <span className="font-mono text-on-surface font-semibold text-xs">#NIV-1024</span> transitioned to status{' '}
        <span className="text-secondary font-bold">"In Review"</span> by Central Board.
      </>
    ),
    time: 'Yesterday, 4:15 PM'
  },
  {
    icon: 'add_photo_alternate',
    iconBg: 'bg-amber-100 text-amber-800',
    content: (
      <>
        Mess Committee requested supplemental photographic log on{' '}
        <span className="font-mono text-on-surface font-semibold text-xs">#NIV-1023</span>.
      </>
    ),
    time: '16 Oct, 11:30 AM'
  },
  {
    icon: 'verified',
    iconBg: 'bg-secondary-container text-on-secondary-container',
    content: (
      <>
        Docket <span className="font-mono text-on-surface font-semibold text-xs">#NIV-1022</span> was signed off:{' '}
        <span className="font-medium text-secondary">New Epson ceiling projector calibrated</span>.
      </>
    ),
    time: '14 Oct, 09:20 AM'
  }
];

export default function TelemetryWidget() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs p-space-lg flex flex-col gap-space-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">notifications_active</span>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Redressal Telemetry
          </h3>
        </div>
        <button
          onClick={() => alert('All notifications marked as read.')}
          className="font-label-sm text-label-sm text-secondary hover:text-primary font-semibold transition-colors cursor-pointer"
        >
          Mark all read
        </button>
      </div>

      {/* Timeline items with vertical connector */}
      <div className="flex flex-col gap-space-sm relative before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-outline-variant/30">
        {TELEMETRY_FEEDS.map((feed, idx) => (
          <div key={idx} className="relative flex items-start gap-space-sm">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-surface-container-lowest ${feed.iconBg}`}>
              <span className="material-symbols-outlined text-[16px]">{feed.icon}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-body-sm text-body-sm text-on-surface leading-tight">
                {feed.content}
              </p>
              <span className="font-label-sm text-label-sm text-outline mt-0.5">
                {feed.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
