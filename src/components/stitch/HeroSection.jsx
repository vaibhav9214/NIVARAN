import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HeroSection({ onSubmitGrievance, onTrackDocket }) {
  const { user } = useAuth();
  const isOfficer = user?.role === 'officer';
  const isAdmin = user?.role === 'admin';

  return (
    <section id="overview" className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-low/50 via-surface to-surface">
      {/* Background Architectural Grid Lines & Orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-secondary-fixed/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-10 w-72 h-72 rounded-full bg-primary-fixed/25 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-16 lg:pb-24 relative z-10 flex flex-col items-center text-center">
        {/* Trust & Regulatory Pill Indicator */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-md text-label-md font-semibold mb-8 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span>AI-Guided Fair Adjudication</span>
          <span className="text-outline/40">•</span>
          <span>UGC &amp; NAAC Compliant</span>
          <span className="text-outline/40">•</span>
          <span>100% Zero-Knowledge Anonymity</span>
        </div>

        {/* Main Anchor Headline */}
        <h1 className="font-display-lg text-display-lg md:text-[3.5rem] md:leading-[3.75rem] font-bold text-on-surface tracking-tight max-w-4xl mb-6">
          Every Grievance Deserves <br className="hidden sm:inline" />
          <span className="text-primary font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-container to-secondary">
            a Decisive Resolution.
          </span>
        </h1>

        {/* Supporting Narrative */}
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Autonomous triaging, bias-free AI sentiment assessment, and verifiable ombudsman audit trails designed for collegiate dignity, student safety, and institutional trust.
        </p>

        {/* Action Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
          {isOfficer ? (
            <Link
              to="/officer/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-label-lg text-label-lg bg-primary-container text-on-primary hover:bg-primary shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">badge</span>
              <span>Open Officer Workspace</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          ) : isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-label-lg text-label-lg bg-primary-container text-on-primary hover:bg-primary shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span>Open Admin Dashboard</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          ) : (
            <button
              onClick={onSubmitGrievance}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-label-lg text-label-lg bg-primary-container text-on-primary hover:bg-primary shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Submit a Grievance</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          )}
          
          <button
            onClick={onTrackDocket}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-label-lg text-label-lg bg-surface-container-lowest text-primary hover:bg-surface-container transition-all shadow-sm cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[20px]">search_check</span>
            <span>Track Docket Status</span>
          </button>
        </div>

        {/* Quick Trust & Performance Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl bg-surface-container-lowest p-6 rounded-2xl shadow-sm text-left border border-surface-container-low">
          <div className="flex flex-col border-r border-surface-container-high last:border-none pr-4">
            <span className="font-headline-lg text-headline-lg text-primary font-bold">48 Hrs</span>
            <span className="font-label-md text-label-md text-outline">Mean Redressal SLA</span>
          </div>
          <div className="flex flex-col sm:border-r border-surface-container-high last:border-none pr-4">
            <span className="font-headline-lg text-headline-lg text-primary font-bold">99.4%</span>
            <span className="font-label-md text-label-md text-outline">Privacy Integrity Index</span>
          </div>
          <div className="flex flex-col border-r border-surface-container-high last:border-none pr-4">
            <span className="font-headline-lg text-headline-lg text-secondary font-bold">140+</span>
            <span className="font-label-md text-label-md text-outline">Accredited Campuses</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-lg text-headline-lg text-primary font-bold">Zero-Bias</span>
            <span className="font-label-md text-label-md text-outline">AI Blind Evaluation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
