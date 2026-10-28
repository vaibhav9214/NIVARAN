import React from 'react';
import { Link } from 'react-router-dom';
import StitchNavbar from '../components/stitch/StitchNavbar';
import StitchFooter from '../components/stitch/StitchFooter';
import { Scroll, Users, CheckCircle, ArrowRight, ShieldAlert, Sparkles, Scale } from 'lucide-react';

export default function PetitionsPage() {
  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex flex-col selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <StitchNavbar />

      <main className="flex-grow pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nivaran-paleGreen border border-nivaran-softGreen text-nivaran-forest text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5 text-nivaran-primary" />
            Collective Governance &amp; Campus Representation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-manrope text-nivaran-forest tracking-tight">
            Institutional Petitions &amp; Campus Initiatives
          </h1>
          <p className="mt-2 text-base text-nivaran-textSecondary max-w-3xl">
            NIVARAN's collective grievance framework allows student bodies and academic cohorts to advocate for systemic campus improvements through transparent, auditable petition workflows.
          </p>
        </div>

        {/* Regulatory Status Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-white border border-nivaran-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-nivaran-warningBg text-nivaran-warning shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-nivaran-text">
                Academic Council Digital Petition Protocol
              </h3>
              <p className="text-xs text-nivaran-textSecondary mt-0.5">
                Per UGC Regulation 2026, individual grievances are actively processed through our live Redressal Engine. The multi-signatory digital petition voting module is currently synchronized with individual department queues.
              </p>
            </div>
          </div>
          <Link
            to="/student/raise-grievance"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Submit Formal Grievance</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* How Petitions Work Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-nivaran-border shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-nivaran-paleGreen text-nivaran-forest flex items-center justify-center font-bold text-base mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-nivaran-text mb-2">Draft with AI Assistance</h3>
            <p className="text-xs text-nivaran-textSecondary leading-relaxed">
              Use NIVARAN's AI pre-submission assistant to structure collective student concerns with actionable evidence and policy citations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-nivaran-border shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-nivaran-paleGreen text-nivaran-forest flex items-center justify-center font-bold text-base mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-nivaran-text mb-2">Departmental Allocation</h3>
            <p className="text-xs text-nivaran-textSecondary leading-relaxed">
              Cases are automatically routed to accredited Department Officers with strictly governed Service Level Agreements (SLAs).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-nivaran-border shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-nivaran-paleGreen text-nivaran-forest flex items-center justify-center font-bold text-base mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-nivaran-text mb-2">Transparent Redressal</h3>
            <p className="text-xs text-nivaran-textSecondary leading-relaxed">
              Every status shift is recorded in the tamper-proof audit trail and broadcasted over live WebSockets to all concerned stakeholders.
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-gradient-to-r from-nivaran-forest to-nivaran-primary rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-nivaran-softGreen mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Civic Action
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-manrope tracking-tight mb-3">
              Have an issue affecting multiple scholars or faculty?
            </h2>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Submit your complaint directly into the active triage pipeline. Department heads and the university ombudsman review all high-priority institutional matters.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/student/raise-grievance"
                className="px-5 py-3 rounded-xl bg-white text-nivaran-forest hover:bg-nivaran-ivory font-bold text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <span>Lodge Priority Case</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/student/my-grievances"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Track Ongoing Dockets
              </Link>
            </div>
          </div>
        </div>
      </main>

      <StitchFooter />
    </div>
  );
}

