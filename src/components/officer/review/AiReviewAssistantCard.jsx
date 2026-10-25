import React from 'react';

export default function AiReviewAssistantCard({ caseData, onTriggerToast }) {
  const ai = caseData.aiAssistant || {
    confidence: '98% Confidence',
    summary:
      'Equipment malfunction in Physics Lab 2 impacting 48 students in PH-201 practicals. Focus on 2 oscilloscope units and 1 optical spectrometer grating clamp.',
    topics: ['#LaboratoryEquipment', '#PhysicsLab2', '#UndergradPracticals', '#HardwareFailure'],
    recommendations: [
      {
        icon: 'lightbulb',
        title: 'Prior Docket Overlap',
        desc: 'High correlation with #GRV-2026-0094 (Physics Lab surge spikes). Advise testing bench surge suppressors.',
        linkTicket: '#GRV-2026-0094',
      },
      {
        icon: 'inventory_2',
        title: 'Inventory Match Found',
        desc: 'Central Workshop database indicates 4 compatible spectrometer clamp units in stock (Shelf B-12).',
      },
    ],
    informationGaps: 'None detected. Hardware model and room data are sufficient for field dispatch.',
  };

  return (
    <section className="bg-surface-container-low rounded-lg p-space-xl shadow-sm flex flex-col gap-space-md border-l-4 border-l-secondary border-t border-r border-b border-outline-variant/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">psychology</span>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold tracking-tight">
              NIVARAN AI Assistant
            </h2>
            <span className="font-label-sm text-label-sm text-outline">
              v2.4 Core • Non-binding Statutory Aid
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
          {ai.confidence}
        </span>
      </div>

      {/* Complaint Summary */}
      <div className="flex flex-col gap-1">
        <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
          Synthesized Summary
        </span>
        <p className="font-body-sm text-body-sm text-on-surface leading-normal">
          {ai.summary}
        </p>
      </div>

      {/* Detected Topic Chips */}
      <div className="flex flex-col gap-1.5">
        <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
          Detected Topics
        </span>
        <div className="flex flex-wrap gap-1.5">
          {ai.topics.map((topic, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest font-label-sm text-label-sm text-on-surface shadow-xs border border-outline-variant/20"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="flex flex-col gap-2 pt-1">
        <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
          Smart Redressal Recommendations
        </span>

        {ai.recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-space-sm rounded-lg bg-surface-container-lowest flex items-start gap-2 shadow-xs border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 flex-shrink-0">
              {rec.icon}
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                {rec.title}
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                {rec.linkTicket ? (
                  <>
                    High correlation with{' '}
                    <button
                      type="button"
                      onClick={() =>
                        onTriggerToast &&
                        onTriggerToast(`Loading archival docket ${rec.linkTicket}...`, 'folder_open')
                      }
                      className="text-primary font-bold hover:underline cursor-pointer"
                    >
                      {rec.linkTicket}
                    </button>{' '}
                    (Physics Lab surge spikes). Advise testing bench surge suppressors.
                  </>
                ) : (
                  rec.desc
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Information Gaps */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-highest/60 text-body-sm font-body-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-secondary flex-shrink-0">
          check_circle
        </span>
        <span>
          <strong>Information Gaps:</strong> {ai.informationGaps}
        </span>
      </div>

      <span className="font-label-sm text-label-sm text-outline italic">
        Notice: AI insights serve purely as preliminary decision support. Final statutory redressal rests solely with the authorized presiding officer.
      </span>
    </section>
  );
}
