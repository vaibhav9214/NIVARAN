import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ATTENTION_REQUIRED_CASES } from '../../data/adminDashboardData';

export default function AttentionRequiredCard({ onTriggerToast }) {
  const navigate = useNavigate();

  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
      <div className="flex items-start justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-[20px]">crisis_alert</span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              Attention Required
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            High-risk dockets requiring executive intervention
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
      </div>

      {/* 4 Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
        <div className="p-2.5 rounded-lg bg-surface-container-low text-center border border-outline-variant/10">
          <div className="font-headline-sm text-headline-sm font-bold text-error">47</div>
          <div className="font-label-sm text-label-sm text-outline uppercase font-semibold">Overdue</div>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-container-low text-center border border-outline-variant/10">
          <div className="font-headline-sm text-headline-sm font-bold text-tertiary">19</div>
          <div className="font-label-sm text-label-sm text-outline uppercase font-semibold">High Prio</div>
        </div>

        <div className="p-2.5 rounded-lg bg-error-container text-center border border-error/20">
          <div className="font-headline-sm text-headline-sm font-bold text-on-error-container">8</div>
          <div className="font-label-sm text-label-sm text-on-error-container uppercase font-bold">Dean Alert</div>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-container-low text-center border border-outline-variant/10">
          <div className="font-headline-sm text-headline-sm font-bold text-secondary">14</div>
          <div className="font-label-sm text-label-sm text-outline uppercase font-semibold">&lt; 24h Left</div>
        </div>
      </div>

      {/* Compact Urgent Cases List */}
      <div className="space-y-3 mt-4">
        {ATTENTION_REQUIRED_CASES.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(item.link)}
            className="p-3.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer border border-outline-variant/20 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-xs text-primary group-hover:underline">
                  {item.ticketId}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                  {item.slaTag}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-label-sm font-semibold">
                {item.alertType}
              </span>
            </div>

            <h4 className="font-label-md text-label-md text-on-surface font-semibold mt-1 group-hover:text-primary transition-colors">
              {item.title}
            </h4>

            <div className="flex items-center gap-2 font-body-sm text-body-sm text-outline mt-1 text-[12px]">
              <span>{item.dept}</span>
              <span>•</span>
              <span className="text-error font-medium">{item.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 mt-3 border-t border-outline-variant/10">
        <button
          type="button"
          onClick={() =>
            onTriggerToast &&
            onTriggerToast('Opening Executive Escalation Queue (8 critical dockets)...', 'forward')
          }
          className="w-full font-label-md text-label-md text-primary hover:text-secondary flex items-center justify-between font-semibold cursor-pointer"
        >
          <span>Open Executive Escalation Queue (8 Dockets)</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}
