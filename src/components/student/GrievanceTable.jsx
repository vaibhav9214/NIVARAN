import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MOCK_GRIEVANCES = [
  {
    id: '#NIV-1024',
    subject: 'Hostel Block C hot water supply & boiler maintenance',
    meta: 'Assigned to: Chief Proctorial Warden',
    category: 'Hostel & Infra',
    filed: '18 Oct 2026',
    status: 'In Review',
    statusType: 'active',
    statusBadge: (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> In Review
      </span>
    ),
    actionText: 'View Docket →',
    actionClass: 'border border-outline-variant/40 hover:border-primary text-primary',
    details: {
      location: 'Block C, 3rd Floor Boiler Plant',
      slaCountdown: '2 Days Remaining (Day 9 of 15)',
      description: 'Heating element burnt out in the south-wing storage tank. Resident scholars reported lukewarm water during morning hours.',
      committee: 'Hostel & Infrastructure Board'
    }
  },
  {
    id: '#NIV-1023',
    subject: 'Mess food quality & hygiene inspection concern',
    meta: '1 Question pending scholar reply',
    metaClass: 'text-amber-700 font-medium',
    rowClass: 'bg-amber-500/[0.02]',
    category: 'Campus Services',
    filed: '16 Oct 2026',
    status: 'Action Req.',
    statusType: 'active',
    statusBadge: (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-sm text-label-sm font-bold uppercase tracking-wider">
        <span className="material-symbols-outlined text-[13px]">help_center</span> Action Req.
      </span>
    ),
    actionText: 'Respond →',
    actionClass: 'bg-amber-600 text-on-primary hover:bg-amber-700 shadow-xs',
    details: {
      location: 'Aravali Dining Facility',
      slaCountdown: '24 Hours Due (Scholar Response Needed)',
      description: 'Requesting batch date and vendor invoice photos for milk supply delivered on 15 Oct.',
      committee: 'Mess Audit Committee'
    }
  },
  {
    id: '#NIV-1022',
    subject: 'Classroom LH-301 projector & audio system failure',
    meta: 'Replaced by Estates • 48hr TAT',
    category: 'Academics',
    filed: '12 Oct 2026',
    status: 'Resolved',
    statusType: 'resolved',
    statusBadge: (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold uppercase tracking-wider border border-outline-variant/30">
        <span className="material-symbols-outlined text-[13px] text-secondary">check_small</span> Resolved
      </span>
    ),
    actionText: 'Summary →',
    actionClass: 'border border-outline-variant/40 hover:border-outline text-on-surface',
    details: {
      location: 'Lecture Hall Complex LH-301',
      slaCountdown: 'Resolved (2-Day TAT)',
      description: 'New Epson ceiling projector calibrated and HDMI audio cabling renewed.',
      committee: 'Academic Facilities & Estates'
    }
  },
  {
    id: '#NIV-1019',
    subject: 'Library 24/7 reading room air conditioning breakdown',
    meta: 'HVAC compressor restored',
    category: 'Infrastructure',
    filed: '05 Oct 2026',
    status: 'Resolved',
    statusType: 'resolved',
    statusBadge: (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold uppercase tracking-wider border border-outline-variant/30">
        <span className="material-symbols-outlined text-[13px] text-secondary">check_small</span> Resolved
      </span>
    ),
    actionText: 'Summary →',
    actionClass: 'border border-outline-variant/40 hover:border-outline text-on-surface',
    details: {
      location: 'Central Library, 2nd Floor Quiet Zone',
      slaCountdown: 'Resolved (4-Day TAT)',
      description: 'Primary refrigerant leak repaired and dual compressors recharged.',
      committee: 'Central Library Management'
    }
  },
  {
    id: '#NIV-1015',
    subject: 'Lab attendance discrepancy during biometric server sync',
    meta: 'Dean of Academics direct review',
    metaClass: 'text-rose-700',
    category: 'Administration',
    filed: '28 Sep 2026',
    status: 'Escalated',
    statusType: 'active',
    statusBadge: (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-error font-label-sm text-label-sm font-bold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span> Escalated
      </span>
    ),
    actionText: 'Escalation Log →',
    actionClass: 'border border-error/30 text-error hover:bg-error-container',
    details: {
      location: 'Computer Systems Lab 2',
      slaCountdown: 'Escalated to Academic Dean',
      description: 'Biometric device gateway timeout caused attendance omission for CS-301 practical. Manual sign-in sheets verified.',
      committee: 'Academic Dean & SGRC'
    }
  }
];

export default function GrievanceTable({ filter = 'all', onSelectGrievance, onFilterChange }) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = MOCK_GRIEVANCES.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'active') return item.statusType === 'active';
    if (filter === 'resolved') return item.statusType === 'resolved';
    return true;
  });

  return (
    <div className="flex flex-col gap-space-md bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xs p-space-lg">
      
      {/* Table Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant/20">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            Recent Grievances
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Live chronological tracking of academic and hostel petitions
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="inline-flex p-0.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-body-sm">
            <button
              onClick={() => onFilterChange && onFilterChange('all')}
              className={`px-2.5 py-1 rounded-md font-label-md text-label-md font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All (12)
            </button>
            <button
              onClick={() => onFilterChange && onFilterChange('active')}
              className={`px-2.5 py-1 rounded-md font-label-md text-label-md font-medium transition-all ${
                filter === 'active'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Active (6)
            </button>
            <button
              onClick={() => onFilterChange && onFilterChange('resolved')}
              className={`px-2.5 py-1 rounded-md font-label-md text-label-md font-medium transition-all ${
                filter === 'resolved'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Resolved (6)
            </button>
          </div>

          <Link
            to="/student/my-grievances"
            className="hidden sm:inline-flex items-center gap-1 font-label-lg text-label-lg font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-space-lg px-space-lg">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-low/40">
              <th className="py-2.5 px-3 font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                Ticket ID
              </th>
              <th className="py-2.5 px-3 font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                Grievance Subject
              </th>
              <th className="py-2.5 px-3 font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                Category
              </th>
              <th className="py-2.5 px-3 font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                Filed
              </th>
              <th className="py-2.5 px-3 font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                Status
              </th>
              <th className="py-2.5 px-3 font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-surface-container-low/40 transition-colors group ${item.rowClass || ''}`}
              >
                <td className="py-3 px-3 font-label-md text-label-md font-bold text-primary font-mono">
                  {item.id}
                </td>
                <td className="py-3 px-3 max-w-[220px]">
                  <span className="font-semibold text-on-surface block truncate group-hover:text-primary transition-colors">
                    {item.subject}
                  </span>
                  <span className={`text-[11px] ${item.metaClass || 'text-on-surface-variant'}`}>
                    {item.meta}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-3 text-on-surface-variant whitespace-nowrap">
                  {item.filed}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  {item.statusBadge}
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onSelectGrievance && onSelectGrievance(item)}
                    className={`px-2.5 py-1 rounded bg-surface font-label-sm text-label-sm font-bold transition-all cursor-pointer ${item.actionClass}`}
                  >
                    {item.actionText}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-sm border-t border-outline-variant/20">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Showing <strong className="text-on-surface font-semibold">{filteredItems.length}</strong> of{' '}
          <strong className="text-on-surface font-semibold">12</strong> lodged grievances
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="w-8 h-8 rounded border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40"
            disabled={currentPage === 1}
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 rounded font-label-md text-label-md font-bold transition-colors ${
              currentPage === 1 ? 'bg-primary-container text-on-primary' : 'border border-outline-variant/30 text-on-surface hover:bg-surface-container-low'
            }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-8 h-8 rounded font-label-md text-label-md transition-colors ${
              currentPage === 2 ? 'bg-primary-container text-on-primary font-bold' : 'border border-outline-variant/30 text-on-surface hover:bg-surface-container-low'
            }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`w-8 h-8 rounded font-label-md text-label-md transition-colors ${
              currentPage === 3 ? 'bg-primary-container text-on-primary font-bold' : 'border border-outline-variant/30 text-on-surface hover:bg-surface-container-low'
            }`}
          >
            3
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
            className="w-8 h-8 rounded border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-40"
            disabled={currentPage === 3}
          >
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

    </div>
  );
}
