import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  Lock, 
  Building2, 
  Users, 
  BarChart, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  HelpCircle,
  EyeOff,
  Send,
  Check,
  TrendingUp,
  Award,
  Zap,
  Layers,
  ArrowUpRight
} from 'lucide-react';

// Demo Grievance Data for Interactive Live Tracker
const DEMO_GRIEVANCES = {
  'NIV-2026-8941': {
    id: 'NIV-2026-8941',
    category: 'Academic & Evaluation',
    department: 'Department of Computer Science',
    title: 'Mid-term answer sheet re-evaluation request for CS-301',
    lodgedOn: '19 Oct 2026, 10:30 AM',
    slaTarget: '48 Hours (21 Oct 2026)',
    status: 'In Progress',
    statusColor: 'bg-amber-500/10 text-amber-700 border-amber-300',
    currentStage: 2,
    officer: 'Prof. R. Sen (Nodal Officer, CS Dept)',
    timeline: [
      { title: 'Grievance Registered', date: '19 Oct, 10:30 AM', desc: 'Securely logged and assigned unique token with cryptographic audit hash.', done: true },
      { title: 'Auto-Triaged & Assigned', date: '19 Oct, 11:15 AM', desc: 'Categorized under Examination Regulations and routed to Nodal Officer.', done: true },
      { title: 'Under Active Investigation', date: '20 Oct, 02:40 PM', desc: 'Course instructor notified to review Section B rubric discrepancies.', done: true },
      { title: 'Resolution & Student Sign-off', date: 'Estimated: 21 Oct', desc: 'Revised score publication and final resolution report awaiting upload.', done: false },
    ]
  },
  'NIV-2026-3320': {
    id: 'NIV-2026-3320',
    category: 'Hostel & Amenities',
    department: 'Hostel Affairs & Estate Office',
    title: 'Faulty RO water purifier on 3rd Floor, Block-B Boys Hostel',
    lodgedOn: '18 Oct 2026, 08:15 AM',
    slaTarget: '24 Hours (19 Oct 2026)',
    status: 'Resolved & Verified',
    statusColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    currentStage: 3,
    officer: 'Er. S. Verma (Maintenance Superintendent)',
    timeline: [
      { title: 'Grievance Registered', date: '18 Oct, 08:15 AM', desc: 'Priority flagged: Health & Sanitation.', done: true },
      { title: 'Auto-Triaged & Assigned', date: '18 Oct, 08:45 AM', desc: 'Estate Engineering team notified.', done: true },
      { title: 'Maintenance Action Taken', date: '18 Oct, 03:30 PM', desc: 'Sediment filter and membrane replaced; TDS reading verified at 110 ppm.', done: true },
      { title: 'Closed with Student Verification', date: '19 Oct, 09:00 AM', desc: 'Resident floor representative confirmed clean drinking water supply.', done: true },
    ]
  },
  'NIV-2026-7812': {
    id: 'NIV-2026-7812',
    category: 'Finance & Scholarships',
    department: 'Accounts & Student Welfare',
    title: 'Duplicate fee debit during semester registration portal glitch',
    lodgedOn: '16 Oct 2026, 04:20 PM',
    slaTarget: '72 Hours',
    status: 'Escalated to Dean',
    statusColor: 'bg-rose-500/10 text-rose-700 border-rose-300',
    currentStage: 2,
    officer: 'Dr. K. Narayanan (Dean of Student Affairs)',
    timeline: [
      { title: 'Grievance Registered', date: '16 Oct, 04:20 PM', desc: 'Bank reference transaction receipts uploaded.', done: true },
      { title: 'Accounts Verification', date: '17 Oct, 11:00 AM', desc: 'Payment gateway bank reconciliation pending.', done: true },
      { title: 'SLA Escalation Triggered', date: '19 Oct, 04:20 PM', desc: 'Exceeded standard 48-hr SLA; auto-escalated to Dean & Finance Officer.', done: true },
      { title: 'Refund Processing & Final Settlement', date: 'Processing', desc: 'Direct electronic refund initiated via Treasury gateway.', done: false },
    ]
  }
};

export default function LandingPage() {
  const [trackingId, setTrackingId] = useState('NIV-2026-8941');
  const [activeGrievance, setActiveGrievance] = useState(DEMO_GRIEVANCES['NIV-2026-8941']);
  const [searchError, setSearchError] = useState('');

  // Quick Lodge Form State
  const [lodgeStep, setLodgeStep] = useState(1);
  const [formData, setFormData] = useState({
    category: 'Academic & Examination',
    department: 'Computer Science & Engineering',
    isAnonymous: true,
    title: '',
    description: '',
    urgency: 'Medium',
    studentId: '',
  });
  const [submittedId, setSubmittedId] = useState(null);

  const handleTrack = (idToTrack) => {
    const cleanId = (idToTrack || trackingId).trim().toUpperCase();
    if (DEMO_GRIEVANCES[cleanId]) {
      setActiveGrievance(DEMO_GRIEVANCES[cleanId]);
      setSearchError('');
    } else {
      setSearchError(`Tracking token "${cleanId}" not found in demo records. Try NIV-2026-8941, NIV-2026-3320, or NIV-2026-7812.`);
    }
  };

  const handleLodgeSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    const newId = `NIV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedId(newId);
    setLodgeStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/15 blur-3xl pointer-events-none rounded-full"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Next-Generation Institutional Redressal System</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Empowering Voices. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  Resolving Grievances with Absolute Transparency.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                NIVARAN provides students, faculty, and administration with a unified, confidential, and SLA-guaranteed redressal portal. Protect your identity, track milestones in real time, and hold departments accountable.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#raise-grievance"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 text-base"
                >
                  <Send className="w-4 h-4" />
                  Lodge a Grievance Now
                </a>
                <a
                  href="#status-tracker"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all text-base"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  Track Existing Token
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <div className="text-2xl font-black text-white">96.8%</div>
                  <div className="text-xs text-slate-400 font-medium">SLA Resolution Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">&lt; 36 hrs</div>
                  <div className="text-xs text-slate-400 font-medium">Avg. First Response</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-400">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Confidential Option</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-400">Zero</div>
                  <div className="text-xs text-slate-400 font-medium">Swept-Under Escalations</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Live Interactive Grievance Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative">
                {/* Header of card */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live System Feed</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
                    Real-Time Redressal SLA
                  </span>
                </div>

                {/* Sample Case Display */}
                <div className="mt-4 space-y-4">
                  <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-mono font-semibold text-blue-400">NIV-2026-8941</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        In Progress (42h left)
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-1.5 line-clamp-1">
                      Mid-term answer sheet re-evaluation request for CS-301
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Dept: Computer Science & Engineering • Nodal Officer Assigned
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Investigation Phase</span>
                        <span className="text-emerald-400 font-medium">Stage 3 of 4</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>

                  {/* Micro features list */}
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Zero-Knowledge anonymous lodging prevents any academic bias.</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span>Automatic escalation to University Ombudsperson if SLA breaches.</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Tamper-evident audit logs protect both students and staff.</span>
                    </div>
                  </div>

                  {/* Portal Entry Links */}
                  <div className="pt-2 grid grid-cols-3 gap-2">
                    <a
                      href="#login-portal"
                      className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-center transition-colors group"
                    >
                      <Users className="w-4 h-4 text-blue-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-semibold text-slate-200 block">Student</span>
                    </a>
                    <a
                      href="#login-portal"
                      className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-center transition-colors group"
                    >
                      <Building2 className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-semibold text-slate-200 block">Officer</span>
                    </a>
                    <a
                      href="#login-portal"
                      className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-center transition-colors group"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-semibold text-slate-200 block">Admin</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE REAL-TIME GRIEVANCE TRACKER */}
      <section id="status-tracker" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Instant Verification & Audit
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Track Your Grievance Milestones
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Every grievance is assigned an immutable token. Enter your token below or select one of the active demo cases to test the live lifecycle viewer.
            </p>

            {/* Demo Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-500 font-medium">Quick Demo Cases:</span>
              {Object.keys(DEMO_GRIEVANCES).map((token) => (
                <button
                  key={token}
                  onClick={() => {
                    setTrackingId(token);
                    handleTrack(token);
                  }}
                  className={`px-2.5 py-1 rounded-md font-mono font-medium transition-all ${
                    trackingId === token
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {token}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={(e) => { e.preventDefault(); handleTrack(); }} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking Token (e.g., NIV-2026-8941)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium bg-slate-50/50"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md transition-colors flex items-center gap-1.5"
              >
                Track Now
              </button>
            </form>
            {searchError && (
              <p className="text-xs text-rose-600 mt-2 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {searchError}
              </p>
            )}
          </div>

          {/* Grievance Details Display Box */}
          {activeGrievance && (
            <div className="max-w-4xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-200">
                      {activeGrievance.id}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Lodged on: {activeGrievance.lodgedOn}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {activeGrievance.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>Department:</strong> {activeGrievance.department} • <strong>Category:</strong> {activeGrievance.category}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${activeGrievance.statusColor}`}>
                    ● {activeGrievance.status}
                  </span>
                  <div className="text-xs text-slate-500 mt-1 flex items-center sm:justify-end gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>SLA: {activeGrievance.slaTarget}</span>
                  </div>
                </div>
              </div>

              {/* Officer Note */}
              <div className="mt-4 p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span><strong>Designated Officer:</strong> {activeGrievance.officer}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Handling
                </span>
              </div>

              {/* Timeline Stages */}
              <div className="mt-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                  Resolution Progress & Audit Milestones
                </h4>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeGrievance.timeline.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div
                        className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white transition-all ${
                          item.done
                            ? 'border-emerald-500 bg-emerald-500 ring-4 ring-emerald-100'
                            : 'border-slate-300'
                        }`}
                      ></div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className={`text-sm font-bold ${item.done ? 'text-slate-900' : 'text-slate-400'}`}>
                          {item.title}
                        </span>
                        <span className="text-xs font-medium text-slate-500">{item.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: HOW NIVARAN WORKS (4-STEP PIPELINE) */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Standard Operating Procedure
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              A Transparent, Four-Stage Resolution Protocol
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Every complaint adheres to statutory institutional guidelines, guaranteeing that no issue is ignored, delayed, or subject to retaliation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Submission & Anonymity
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students lodge complaints with optional zero-knowledge anonymity. Upload supporting PDFs or media with client-side metadata sanitization.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                <EyeOff className="w-3.5 h-3.5" /> Retaliation-Proof Shield
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Automated Triage & SLA
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart routing algorithms classify the complaint by department, severity, and urgency, locking in a statutory 24h–72h turnaround clock.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                <Clock className="w-3.5 h-3.5" /> Immutable SLA Countdown
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Investigation & Redressal
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Departmental nodal officers examine facts, request clarifications via masked two-way messaging, and upload concrete resolution evidence.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Two-Way Masked Comms
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
                04
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Student Verification & Close
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A case cannot be closed until the student confirms satisfaction. Dissatisfied resolutions can be appealed directly to the Ombudsman.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <Award className="w-3.5 h-3.5" /> Student Right to Appeal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DEPARTMENTS & GRIEVANCE COVERAGE */}
      <section id="departments" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Departmental Oversight
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Comprehensive Redressal Across Campus
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Every major institutional domain is covered by dedicated Grievance Redressal Committees (GRC).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Academic & Evaluation',
                icon: FileText,
                color: 'text-blue-600 bg-blue-50 border-blue-200',
                items: ['Grading & answer script re-evaluations', 'Faculty attendance & syllabus progress', 'Course registration & lab access'],
                sla: '48 Hours'
              },
              {
                title: 'Hostels & Mess Amenities',
                icon: Building2,
                color: 'text-amber-600 bg-amber-50 border-amber-200',
                items: ['Drinking water, hygiene & sanitation', 'Room maintenance & electrical repairs', 'Mess food quality & dietary audits'],
                sla: '24 Hours'
              },
              {
                title: 'Fee, Accounts & Scholarships',
                icon: BarChart,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                items: ['Duplicate semester fee deductions', 'Scholarship stipend disbursement delays', 'Caution deposit refunds & clearance'],
                sla: '72 Hours'
              },
              {
                title: 'Anti-Ragging Committee (ARC)',
                icon: AlertCircle,
                color: 'text-rose-600 bg-rose-50 border-rose-200',
                items: ['Zero-tolerance intimidation reporting', 'Immediate 24x7 security intervention', 'Confidential ombudsman protection'],
                sla: 'Immediate (< 4h)'
              },
              {
                title: 'Internal Complaints Cell (ICC)',
                icon: ShieldCheck,
                color: 'text-purple-600 bg-purple-50 border-purple-200',
                items: ['POSH Act compliance & gender safety', 'Discriminatory behavior or harassment', 'Impartial presiding committee review'],
                sla: 'Priority (< 12h)'
              },
              {
                title: 'Campus IT & Digital Services',
                icon: Zap,
                color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
                items: ['Campus Wi-Fi & LMS portal downtimes', 'Library e-resource access barriers', 'Student ERP account credential resets'],
                sla: '24 Hours'
              },
            ].map((dept, index) => {
              const IconComp = dept.icon;
              return (
                <div key={index} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-sm group">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${dept.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                      SLA: {dept.sla}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {dept.title}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {dept.items.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE TRANSPARENCY & ACCOUNTABILITY HUB */}
      <section id="transparency" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              Real-Time Institutional Accountability
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Institutional Transparency Hub
            </h2>
            <p className="text-slate-300 text-base mt-2">
              Public performance indices foster trust. Review anonymized metrics and resolution timelines across all schools.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Metric Card 1 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Resolution Velocity
                </h3>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-4xl font-black text-white">36.4 hrs</div>
              <p className="text-xs text-slate-400 mt-1">Average time from lodging to verified resolution</p>
              
              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Hostels & Estates</span>
                    <span className="text-emerald-400 font-semibold">18.2 hrs</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[92%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Academics & Exams</span>
                    <span className="text-blue-400 font-semibold">39.5 hrs</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full w-[80%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Finance & Fees</span>
                    <span className="text-amber-400 font-semibold">44.1 hrs</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[74%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Resolution Success Rate
                </h3>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-4xl font-black text-emerald-400">96.8%</div>
              <p className="text-xs text-slate-400 mt-1">Resolved without student escalation to Ombudsman</p>

              <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span>Total Cases Lodged (This Term):</span>
                  <strong className="text-white">4,218</strong>
                </div>
                <div className="flex justify-between">
                  <span>Resolved & Signed Off:</span>
                  <strong className="text-emerald-400">4,082</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active In Investigation:</span>
                  <strong className="text-blue-400">112</strong>
                </div>
                <div className="flex justify-between">
                  <span>Ombudsman In Review:</span>
                  <strong className="text-amber-400">24</strong>
                </div>
              </div>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                  Recent Anonymized Redressals
                </h3>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="space-y-3">
                {[
                  { tag: 'Hostel', title: 'Hot water geyser replaced in Block-C', time: '2h ago', status: 'Closed' },
                  { tag: 'Academic', title: 'Grade attendance shortage recount granted', time: '5h ago', status: 'Closed' },
                  { tag: 'Finance', title: 'Library late fee fine waiver applied', time: '8h ago', status: 'Closed' },
                  { tag: 'Facility', title: 'Library silent reading air filter repaired', time: '11h ago', status: 'Closed' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-900/40 px-1.5 py-0.5 rounded mr-1.5">
                        {item.tag}
                      </span>
                      <span className="text-slate-200 line-clamp-1">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: INTERACTIVE LODGE GRIEVANCE WORKFLOW */}
      <section id="raise-grievance" className="py-24 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Direct Citizen Redressal
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Lodge an Institutional Grievance
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Choose anonymous mode if you prefer your personal details to remain completely hidden from departmental instructors and staff.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            {lodgeStep === 1 ? (
              <form onSubmit={handleLodgeSubmit} className="space-y-6">
                
                {/* Anonymity Toggle */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Zero-Knowledge Anonymous Submission</h4>
                      <p className="text-xs text-slate-500">Your student roll number and email are not exposed to the department.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Two-column selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Grievance Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 font-medium"
                    >
                      <option>Academic & Examination</option>
                      <option>Hostels & Mess Amenities</option>
                      <option>Finance & Scholarship Redressal</option>
                      <option>Anti-Ragging / Security</option>
                      <option>Internal Complaints Cell (ICC)</option>
                      <option>IT & Digital Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 font-medium"
                    >
                      <option>Computer Science & Engineering</option>
                      <option>Electronics & Communication</option>
                      <option>Mechanical & Civil Engineering</option>
                      <option>Hostel Affairs & Estate Office</option>
                      <option>Central Finance & Accounts</option>
                      <option>Dean of Student Welfare</option>
                    </select>
                  </div>
                </div>

                {/* Grievance Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Subject / Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief headline of the grievance (e.g., Delay in scholarship disbursement)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Grievance Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide specific details including dates, course codes, or previous correspondence..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  ></textarea>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Official Grievance & Generate Token
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-3">
                    By submitting, you affirm that the information provided is truthful and submitted in accordance with University Honor Code.
                  </p>
                </div>
              </form>
            ) : (
              /* Success Stage */
              <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Grievance Lodged Successfully!
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Your grievance has been encrypted, assigned to the Nodal Grievance Officer, and locked into a 48-hour resolution clock.
                </p>

                {/* Generated Token Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto">
                  <span className="text-xs text-slate-500 font-medium block">Your Tracking Token:</span>
                  <span className="text-2xl font-mono font-black text-blue-700 tracking-wider">
                    {submittedId}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Save this token to track milestones or download your resolution certificate.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      setLodgeStep(1);
                      setFormData({
                        category: 'Academic & Examination',
                        department: 'Computer Science & Engineering',
                        isAnonymous: true,
                        title: '',
                        description: '',
                        urgency: 'Medium',
                        studentId: '',
                      });
                    }}
                    className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Lodge Another Grievance
                  </button>
                  <a
                    href="#status-tracker"
                    onClick={() => {
                      setTrackingId(submittedId);
                      DEMO_GRIEVANCES[submittedId] = {
                        id: submittedId,
                        category: formData.category,
                        department: formData.department,
                        title: formData.title,
                        lodgedOn: 'Just now',
                        slaTarget: '48 Hours',
                        status: 'Registered & Triaged',
                        statusColor: 'bg-blue-500/10 text-blue-700 border-blue-300',
                        currentStage: 1,
                        officer: 'Nodal Officer Pending Assignment',
                        timeline: [
                          { title: 'Grievance Registered', date: 'Just now', desc: 'Securely registered with zero-knowledge token hash.', done: true },
                          { title: 'Auto-Triaged & Assigned', date: 'In progress', desc: 'Routing to department nodal officer.', done: false },
                          { title: 'Investigation & Resolution', date: 'Upcoming', desc: 'Fact-finding and remediation.', done: false },
                          { title: 'Student Verification', date: 'Upcoming', desc: 'Awaiting your sign-off upon resolution.', done: false },
                        ]
                      };
                      handleTrack(submittedId);
                    }}
                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md"
                  >
                    Track in Live Status Viewer
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 7: INSTITUTIONAL ROLE ACCESS PORTALS */}
      <section id="login-portal" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Role-Based Portals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Single Sign-On for All Stakeholders
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Log in with your institutional credentials (Google SSO, SAML 2.0, or University ERP IDs).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:border-blue-400 hover:shadow-lg transition-all text-center flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Student & Scholar Portal</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Lodge new complaints, monitor real-time SLA progress, participate in masked two-way chats, and sign off on verified remedies.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => alert('Student Portal Authentication (Will connect to Institutional SSO in Backend Phase)')}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  Student Sign In
                </button>
              </div>
            </div>

            {/* Department Officer Card */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:border-emerald-400 hover:shadow-lg transition-all text-center flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Department Nodal Officer Desk</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Review assigned department queues, manage active investigation countdowns, upload evidentiary proof, and propose closure actions.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => alert('Department Officer Desk (Will connect to Institutional LDAP in Backend Phase)')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  Officer Sign In
                </button>
              </div>
            </div>

            {/* Administration / Ombudsman Card */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 hover:border-amber-400 hover:shadow-lg transition-all text-center flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">University Ombudsman & Dean</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Monitor university-wide SLA adherence, review escalated unresolved appeals, inspect systemic bottlenecks, and generate UGC audit reports.
                </p>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => alert('Ombudsman & Executive Console (Will connect to Executive Security Auth in Backend Phase)')}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  Administrative Console
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Clarifications & Rights
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Learn about your statutory protections and how NIVARAN protects your privacy.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Is anonymous grievance lodging genuinely protected from academic retaliation?',
                a: 'Yes. When anonymous mode is selected, your institutional roll number and name are cryptographically hashed client-side. The department nodal officer communicates with you via an encrypted proxy channel, rendering retaliatory bias impossible.'
              },
              {
                q: 'What happens if a department ignores or exceeds the statutory SLA?',
                a: 'The moment a grievance timer breaches the designated SLA (24h to 72h depending on urgency), the ticket is automatically escalated to the University Ombudsperson and the Dean of Student Welfare with an audit violation flag.'
              },
              {
                q: 'Can a department officer close a grievance unilaterally?',
                a: 'No. Officers can only mark a grievance as "Resolution Proposed". Final verified closure strictly requires student sign-off or an independent Ombudsman verification.'
              },
              {
                q: 'Can I lodge complaints against external campus vendors (e.g. food courts, security contractors)?',
                a: 'Yes. All on-campus vendors are bound by institutional agreements. Issues related to sanitation, overcharging, or harassment are directed to the Estate Management Committee.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-sm text-slate-600 mt-2 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
