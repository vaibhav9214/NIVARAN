import React from 'react';

export default function CtaBanner({ onBeginGrievance }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 w-full" id="submit-portal">
      <div className="bg-primary rounded-3xl p-8 lg:p-14 text-on-primary flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xl relative overflow-hidden">
        {/* Decorative Mint Ambient Accent */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-secondary/30 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col max-w-2xl relative z-10 text-left">
          <span className="inline-flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-primary-fixed"></span>
            Confidential Grievance Portal
          </span>
          <h2 className="font-headline-xl text-headline-xl font-bold tracking-tight mb-4">
            Ready to lodge a confidential academic or campus inquiry?
          </h2>
          <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
            NIVARAN assigns a tamper-proof SHA-256 tracking code immediately upon filing. You retain complete visibility into committee deliberation logs without revealing your identity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative z-10 w-full sm:w-auto">
          <button
            onClick={onBeginGrievance}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-label-lg text-label-lg font-bold bg-primary-fixed text-on-primary-fixed hover:bg-secondary-fixed transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            <span>Begin New Grievance</span>
          </button>
        </div>
      </div>
    </section>
  );
}
