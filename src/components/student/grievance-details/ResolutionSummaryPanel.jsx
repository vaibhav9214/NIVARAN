import React, { useState } from 'react';

export default function ResolutionSummaryPanel({
  docket,
  onTriggerToast,
}) {
  const [feedbackVerdict, setFeedbackVerdict] = useState(null); // 'satisfied' | 'not-satisfied' | null

  const handleFeedback = (verdict) => {
    setFeedbackVerdict(verdict);
    if (verdict === 'satisfied') {
      onTriggerToast('Feedback recorded: Scholar Satisfied', 'thumb_up');
    } else {
      onTriggerToast('Feedback recorded: Unsatisfied. Appeal window unlocked.', 'info');
    }
  };

  const resolution = docket.resolutionSummary || {
    closedBy: 'Er. R. Sundaram on 22 October 2026, 05:40 PM',
    finding:
      'The technician replaced the damaged PoE injector serving AP-04 and AP-07 in Hostel Block B corridor. Both access points were reassigned to distinct non-overlapping channels (Ch 36 & Ch 44) to eliminate packet collision.',
    telemetryNote:
      '24-hour sniffer telemetry confirmed zero packet drops over an 8-hour testing cycle with 114 concurrent student devices connected.',
    slipFile: 'it_repair_signoff_slip.pdf (840 KB)',
  };

  return (
    <div
      className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 flex flex-col gap-5 shadow-sm border border-outline-variant/20"
      id="resolution-summary-panel"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-lg">task_alt</span>
          </span>
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Official Resolution Record
            </h3>
            <span className="font-label-sm text-[11px] text-outline">
              Closed by {resolution.closedBy}
            </span>
          </div>
        </div>
        <span className="bg-secondary-container text-on-secondary-container font-label-sm text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start sm:self-auto">
          Formal Redress Completed
        </span>
      </div>

      <div className="bg-surface-container-low/70 rounded-lg p-4 font-body-sm text-body-sm text-on-surface leading-relaxed space-y-2">
        <p>
          <strong>Finding &amp; Remediation:</strong> {resolution.finding}
        </p>
        <p>{resolution.telemetryNote}</p>
        <div className="flex items-center gap-3 pt-2">
          <span className="font-label-sm text-xs font-semibold text-outline">Verification Slip:</span>
          <a
            href="#download-slip"
            onClick={(e) => {
              e.preventDefault();
              onTriggerToast(`Downloading ${resolution.slipFile}...`, 'download');
            }}
            className="text-secondary font-label-sm text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">description</span>
            <span>{resolution.slipFile}</span>
          </a>
        </div>
      </div>

      {/* Feedback / Satisfaction Survey */}
      <div className="rounded-lg bg-surface-container-low/40 p-5 flex flex-col gap-3 border border-outline-variant/30">
        {feedbackVerdict === null && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                Are you satisfied with this resolution?
              </h4>
              <p className="font-body-sm text-xs text-outline">
                Your verdict seals the statutory feedback metric under the UGC guidelines.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFeedback('satisfied')}
                className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-xs font-bold hover:bg-primary transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">thumb_up</span>
                <span>Yes, Satisfied</span>
              </button>
              <button
                onClick={() => handleFeedback('not-satisfied')}
                className="px-4 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-xs font-bold hover:bg-surface-container-high transition-all flex items-center gap-1 cursor-pointer border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-sm">thumb_down</span>
                <span>Not Satisfied</span>
              </button>
            </div>
          </div>
        )}

        {feedbackVerdict === 'satisfied' && (
          <div className="flex items-center gap-3 text-secondary p-2 bg-secondary-container/20 rounded-lg">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
            <div>
              <p className="font-bold text-sm">Thank you for your feedback!</p>
              <p className="text-xs text-outline">
                Your affirmation has been logged with the Student Welfare Redressal Board.
              </p>
            </div>
          </div>
        )}

        {feedbackVerdict === 'not-satisfied' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-error-container/30 rounded-lg">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined">report_problem</span>
              <span className="text-xs font-bold">Feedback logged: Not satisfied.</span>
            </div>
            <button
              onClick={() => onTriggerToast('Opening formal reconsideration form...', 'gavel')}
              className="px-3 py-1.5 rounded bg-primary-container text-on-primary font-bold text-xs hover:bg-primary cursor-pointer shadow-xs"
            >
              File Immediate Appeal
            </button>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-on-surface-variant border-t border-outline-variant/20">
          <span>Dissatisfied? You may file an institutional appeal within 7 calendar days.</span>
          <button
            onClick={() => onTriggerToast('Opening Statutory Appeal Form...', 'gavel')}
            className="font-bold text-secondary hover:underline cursor-pointer self-start sm:self-auto"
          >
            Request Reconsideration (Appeal)
          </button>
        </div>
      </div>
    </div>
  );
}
