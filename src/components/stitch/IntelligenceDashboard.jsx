import React, { useState } from 'react';

const INITIAL_DOCKETS = [
  {
    id: 'GRV-2024-8841',
    subject: 'Lab Chemical Fume Hood Maintenance',
    meta: 'Biotechnology Block 3 • Filed Anonymously',
    tier: 'Tier 1 • Safety Hazard',
    tierColor: 'bg-error-container/60 text-on-error-container',
    dotColor: 'bg-error',
    committee: 'Campus Infrastructure Board',
    status: 'Dispatched',
    statusColor: 'bg-secondary-container/40 text-on-secondary-container',
    actionLabel: 'View Details',
    actionIcon: 'chevron_right',
    details: {
      filedOn: '20 Oct 2026, 09:15 AM',
      slaCountdown: '18 Hours Remaining',
      assignedOfficer: 'Er. N. Kashyap (Facilities Nodal Officer)',
      anonymity: 'Zero-Knowledge SHA-256 Token',
      description: 'Exhaust motor bearing failure on fume hood #4 causing accumulation of acidic vapor during organic synthesis practicum.',
      milestones: [
        { label: 'Ingested & Cryptographically Hashed', time: '09:15 AM', done: true },
        { label: 'AI Urgent Triaging: Level 1 Hazardous', time: '09:17 AM', done: true },
        { label: 'Dispatched to Campus Infrastructure Board', time: '09:40 AM', done: true },
        { label: 'On-site Inspection Scheduled', time: 'Pending', done: false },
      ]
    }
  },
  {
    id: 'GRV-2024-8839',
    subject: 'End-Semester Evaluation Discrepancy',
    meta: 'Electrical Eng. • Dept Roll ID Masked',
    tier: 'Tier 2 • Academic Review',
    tierColor: 'bg-surface-container text-on-surface-variant',
    dotColor: 'bg-secondary',
    committee: 'Academic Grievance Cell (SGRC)',
    status: 'In Inquiry',
    statusColor: 'bg-surface-container-high text-on-surface-variant',
    actionLabel: 'View Details',
    actionIcon: 'chevron_right',
    details: {
      filedOn: '19 Oct 2026, 03:30 PM',
      slaCountdown: '32 Hours Remaining',
      assignedOfficer: 'Dr. V. Ramanathan (SGRC Convenor)',
      anonymity: 'Masked Institutional Roll ID',
      description: 'Discrepancy in digital total tabulation for EE-402 Power Electronics end-semester evaluation script.',
      milestones: [
        { label: 'Ingested & Masked Token Generated', time: '03:30 PM', done: true },
        { label: 'SGRC Docket Enrolled', time: '04:10 PM', done: true },
        { label: 'Original Evaluator Review Ordered', time: 'Active', done: true },
        { label: 'Score Reconciliation Publication', time: 'Pending', done: false },
      ]
    }
  },
  {
    id: 'GRV-2024-8822',
    subject: 'Hostel Dining Water Purification Replacement',
    meta: 'Gargi Hostel Complex • Verified Student ID',
    tier: 'Tier 3 • Operational',
    tierColor: 'bg-secondary-container/30 text-secondary',
    dotColor: 'bg-secondary',
    committee: 'Health & Welfare Committee',
    status: 'Resolved & Closed',
    statusColor: 'bg-secondary-container text-on-secondary-container',
    actionLabel: 'Audit Trail',
    actionIcon: 'receipt_long',
    details: {
      filedOn: '18 Oct 2026, 08:00 AM',
      slaCountdown: 'Resolved within 22h',
      assignedOfficer: 'Warden Office & Estate Maintenance',
      anonymity: 'Verified Student Identification',
      description: 'Sediment filter replacement and UV sterilizer bulb installation for dining hall water fountain.',
      milestones: [
        { label: 'Complaint Registered', time: '08:00 AM', done: true },
        { label: 'Health Committee Verification', time: '10:30 AM', done: true },
        { label: 'Replacement Parts Installed & Tested', time: '04:15 PM', done: true },
        { label: 'Student Resident Confirmation Sign-Off', time: '06:00 AM', done: true },
      ]
    }
  }
];

export default function IntelligenceDashboard({ onSelectDocket }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  const filteredDockets = INITIAL_DOCKETS.filter((docket) => {
    const matchesSearch =
      docket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      docket.committee.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterTier === 'ALL') return matchesSearch;
    if (filterTier === 'TIER1') return matchesSearch && docket.tier.includes('Tier 1');
    if (filterTier === 'TIER2') return matchesSearch && docket.tier.includes('Tier 2');
    if (filterTier === 'TIER3') return matchesSearch && docket.tier.includes('Tier 3');
    return matchesSearch;
  });

  return (
    <section id="tracking-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20 flex flex-col gap-10">
      
      {/* Section Architectural Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Campus Oversight Console · Illustrative Demo Data
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
            Institutional Triaging &amp; Resolution Engine
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Real-time oversight panel demonstrating AI urgency triaging, committee allocation, and autonomous regulatory timelines.
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Live Ingestion Active
          </span>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
            title="Reload Ledger"
          >
            <span className={`material-symbols-outlined text-[20px] ${isRefreshing ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
        </div>
      </div>

      {/* Live Platform KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Active Dockets */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group border border-surface-container-low">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-outline">
              Open Grievances
            </span>
            <span className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display-lg text-display-lg font-bold text-on-surface">18</span>
            <span className="font-label-sm text-label-sm text-secondary font-semibold bg-secondary-container/50 px-2 py-0.5 rounded-full">
              -4 from yesterday
            </span>
          </div>
          {/* Category Pill Breakdown */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-surface-container-low">
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span>Academics</span>
              <span className="font-semibold text-primary">7</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span>Hostel/Infra</span>
              <span className="font-semibold text-primary">6</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span>Harassment</span>
              <span className="font-semibold text-error">1</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span>Administrative</span>
              <span className="font-semibold text-primary">4</span>
            </div>
          </div>
        </div>

        {/* KPI 2: AI Sentiment & Urgent Triaging */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between relative border border-surface-container-low">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-outline">
              AI Urgency Triaging
            </span>
            <span className="w-9 h-9 rounded-xl bg-secondary-container/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline-sm text-headline-sm font-bold text-primary">
                94.8% SLA Adherence
              </span>
              <span className="font-label-md text-label-md font-bold text-secondary">
                Tier 1 Prioritized
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Zero backlog breaches detected in past 90 academic days.
            </p>
          </div>
          {/* Micro SLA Progress Indicator */}
          <div className="w-full bg-surface-container-low rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-secondary h-full rounded-full w-[94.8%]"></div>
          </div>
          <div className="flex justify-between font-label-sm text-label-sm text-outline">
            <span>Target: &gt;90%</span>
            <span>Autonomous Escalation: Enabled</span>
          </div>
        </div>

        {/* KPI 3: Ombudsman & Appellate State */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between relative border border-surface-container-low">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-md text-label-md font-bold uppercase tracking-wider text-outline">
              Independent Ombudsman
            </span>
            <span className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display-lg text-display-lg font-bold text-on-surface">03</span>
              <span className="font-label-sm text-label-sm text-outline">Active External Reviews</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Direct statutory escalation for collegiate appeals per UGC Redressal Gazette 2023.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-secondary text-base">verified_user</span>
            <span className="truncate">Cryptographic Signatures Verified</span>
          </div>
        </div>

      </div>

      {/* Live Redressal Pipeline / Docket Ledger */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col border border-surface-container-low">
        
        {/* Ledger Filter Bar */}
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container-low">
          <div className="flex items-center gap-3">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Recent Redressal Dockets
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">
              Active Cycle 2024-Q2
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Docket ID..."
                className="pl-9 pr-4 py-2 rounded-lg bg-surface text-body-sm text-on-surface border-none focus:outline-none focus:ring-2 focus:ring-secondary/40 w-56 font-sans"
              />
            </div>

            {/* Filter Pill */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-lg">
              <button
                onClick={() => setFilterTier('ALL')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors ${
                  filterTier === 'ALL' ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTier('TIER1')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors ${
                  filterTier === 'TIER1' ? 'bg-error-container text-on-error-container font-bold' : 'text-on-surface-variant'
                }`}
              >
                Tier 1
              </button>
              <button
                onClick={() => setFilterTier('TIER2')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors ${
                  filterTier === 'TIER2' ? 'bg-surface-container-high text-on-surface font-bold' : 'text-on-surface-variant'
                }`}
              >
                Tier 2
              </button>
              <button
                onClick={() => setFilterTier('TIER3')}
                className={`px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors ${
                  filterTier === 'TIER3' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant'
                }`}
              >
                Tier 3
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Table (Responsive) */}
        <div className="overflow-x-auto w-full">
          <table className={`w-full text-left border-collapse transition-opacity duration-300 ${isRefreshing ? 'opacity-40' : 'opacity-100'}`}>
            <thead>
              <tr className="bg-surface-container-low/60 text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3.5 px-6 font-semibold">Docket ID</th>
                <th className="py-3.5 px-6 font-semibold">Category &amp; Subject</th>
                <th className="py-3.5 px-6 font-semibold">AI Sentiment Triaging</th>
                <th className="py-3.5 px-6 font-semibold">Assigned Committee</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-body-sm text-body-sm">
              {filteredDockets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-outline text-sm">
                    No matching dockets found for "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredDockets.map((docket) => (
                  <tr key={docket.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-primary whitespace-nowrap">
                      {docket.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-on-surface">{docket.subject}</div>
                      <div className="text-outline font-label-sm text-label-sm">{docket.meta}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${docket.tierColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${docket.dotColor}`}></span>
                        {docket.tier}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant font-medium whitespace-nowrap">
                      {docket.committee}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider ${docket.statusColor}`}>
                        {docket.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectDocket && onSelectDocket(docket)}
                        className="text-primary hover:text-secondary font-label-md text-label-md font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>{docket.actionLabel}</span>
                        <span className="material-symbols-outlined text-[16px]">{docket.actionIcon}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer & Compliance Affirmation */}
        <div className="p-4 bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between text-outline font-label-sm text-label-sm gap-2">
          <span>Displaying verified audit ledger dockets under Section 3(b) UGC Regulations</span>
          <span className="text-outline font-semibold" title="Report export is not implemented in this demo">
            Audit report export unavailable in demo
          </span>
        </div>

      </div>
    </section>
  );
}
