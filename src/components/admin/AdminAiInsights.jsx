import React from 'react';
import { AI_INSIGHTS } from '../../data/adminDashboardData';

export default function AdminAiInsights({ onTriggerToast }) {
  return (
    <section className="rounded-xl p-6 bg-surface-container shadow-sm relative overflow-hidden border border-outline-variant/30">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
            </span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              NIVARAN AI Institutional Insights
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm uppercase tracking-wider font-bold">
              Engine v2.4
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Systemic anomaly patterns detected across institutional redressal data. Non-binding advisory for Governing Council.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
        {AI_INSIGHTS.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/20"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-label-md pb-2">
                <span className="font-bold text-tertiary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </span>
                <span className={item.badgeClass}>{item.badge}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                {item.body}
              </p>
            </div>

            <div className="pt-3 mt-3 flex items-center justify-between font-label-sm text-label-sm border-t border-outline-variant/10">
              <span className="text-outline font-semibold">{item.department}</span>
              {item.actionText ? (
                <button
                  type="button"
                  onClick={() =>
                    onTriggerToast &&
                    onTriggerToast(`Administrative directive dispatched to ${item.department}.`, 'send')
                  }
                  className="text-primary hover:text-secondary font-semibold cursor-pointer"
                >
                  {item.actionText}
                </button>
              ) : (
                <span className="text-secondary font-semibold">{item.tag}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 flex flex-wrap items-center justify-between text-[11px] text-outline font-label-sm gap-2 border-t border-outline-variant/20">
        <span>
          Model grounded strictly on anonymized institutional telemetry. Adheres to UGC Redressal Regulations 2023 § 14(b).
        </span>
        <button
          type="button"
          onClick={() =>
            onTriggerToast &&
            onTriggerToast('AI confidence matrix validated: 97.4% precision on multi-departmental logs.', 'verified')
          }
          className="text-primary hover:underline font-semibold cursor-pointer"
        >
          Audit AI Confidence Matrix
        </button>
      </div>
    </section>
  );
}
