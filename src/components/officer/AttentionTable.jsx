import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const OFFICER_CASES = [
  {
    id: 'GRV-2026-0142',
    ticketId: 'GRV-2026-0142',
    section: 'Sec: Residential',
    title: 'Hostel Wi-Fi Connectivity',
    summary: 'Repeated evening drops in Hostel Block B after 20:00 hrs',
    category: 'IT & Technical',
    submitted: '14 Oct 2026',
    priority: 'High',
    priorityClass: 'bg-error-container text-error font-bold',
    slaText: 'Overdue by 2d',
    slaTarget: 'Target: 20 Oct 2026',
    slaStatus: 'overdue',
    slaClass: 'text-error font-bold',
    slaIcon: 'error',
    status: 'In Progress',
    statusClass: 'bg-surface-container text-primary font-semibold',
    lastUpdated: '20 Oct, 04:15 PM',
  },
  {
    id: 'GRV-2026-0138',
    ticketId: 'GRV-2026-0138',
    section: 'Sec: Academics',
    title: 'Laboratory Equipment Issue',
    summary: 'Physics Lab 2 oscilloscope & spectrometer failure during practicals',
    category: 'Facilities',
    submitted: '13 Oct 2026',
    priority: 'Medium',
    priorityClass: 'bg-surface-container-high text-tertiary-container font-semibold',
    slaText: 'Due in 6h',
    slaTarget: 'Target: 21 Oct 2026',
    slaStatus: 'today',
    slaClass: 'text-amber-800 font-bold',
    slaIcon: 'alarm',
    status: 'Awaiting Review',
    statusClass: 'bg-amber-100 text-amber-900 font-bold',
    lastUpdated: '19 Oct, 11:30 AM',
  },
  {
    id: 'GRV-2026-0129',
    ticketId: 'GRV-2026-0129',
    section: 'Sec: University Portal',
    title: 'Portal Login Failure',
    summary: 'SSO Token expiration loop on macOS Safari causing mid-term upload halts',
    category: 'IT & Technical',
    submitted: '11 Oct 2026',
    priority: 'High',
    priorityClass: 'bg-error-container text-error font-bold',
    slaText: 'Overdue by 4d',
    slaTarget: 'Target: 18 Oct 2026',
    slaStatus: 'overdue',
    slaClass: 'text-error font-bold',
    slaIcon: 'timer_off',
    status: 'Overdue',
    statusClass: 'bg-error-container text-error font-bold',
    lastUpdated: '20 Oct, 09:10 AM',
  },
  {
    id: 'GRV-2026-0124',
    ticketId: 'GRV-2026-0124',
    section: 'Sec: Lecture Theatres',
    title: 'Classroom Projector Malfunction',
    summary: 'LH-201 HDMI audio sync failure during hybrid seminar lectures',
    category: 'Facilities',
    submitted: '10 Oct 2026',
    priority: 'Low',
    priorityClass: 'bg-surface-container text-outline font-semibold',
    slaText: 'Due in 1d',
    slaTarget: 'Target: 22 Oct 2026',
    slaStatus: 'soon',
    slaClass: 'text-secondary font-semibold',
    slaIcon: 'calendar_today',
    status: 'In Progress',
    statusClass: 'bg-surface-container text-primary font-semibold',
    lastUpdated: '18 Oct, 03:40 PM',
  },
  {
    id: 'GRV-2026-0117',
    ticketId: 'GRV-2026-0117',
    section: 'Sec: Research Wing',
    title: 'Network Access Request',
    summary: 'Post-doc researcher eduroam cert configuration for high-throughput cluster',
    category: 'IT & Technical',
    submitted: '09 Oct 2026',
    priority: 'Medium',
    priorityClass: 'bg-surface-container-high text-tertiary-container font-semibold',
    slaText: 'Due in 2d',
    slaTarget: 'Target: 23 Oct 2026',
    slaStatus: 'soon',
    slaClass: 'text-secondary font-semibold',
    slaIcon: 'calendar_today',
    status: 'Student Action',
    statusClass: 'bg-surface-container text-outline font-semibold',
    lastUpdated: '20 Oct, 02:00 PM',
  },
  {
    id: 'GRV-2026-0109',
    ticketId: 'GRV-2026-0109',
    section: 'Sec: Examinations',
    title: 'Student Portal Access Issue',
    summary: 'Grade card decryption key error for Batch 2024 Computer Science cohort',
    category: 'IT & Technical',
    submitted: '06 Oct 2026',
    priority: 'Medium',
    priorityClass: 'bg-surface-container-high text-tertiary-container font-semibold',
    slaText: 'Due in 3d',
    slaTarget: 'Target: 24 Oct 2026',
    slaStatus: 'soon',
    slaClass: 'text-secondary font-semibold',
    slaIcon: 'calendar_today',
    status: 'In Progress',
    statusClass: 'bg-surface-container text-primary font-semibold',
    lastUpdated: '19 Oct, 05:15 PM',
  },
];

export default function AttentionTable({ onTriggerToast }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all'); // 'all' | 'overdue' | 'today' | 'soon'
  const [search, setSearch] = useState('');

  const filtered = OFFICER_CASES.filter((item) => {
    if (tab === 'overdue' && item.slaStatus !== 'overdue') return false;
    if (tab === 'today' && item.slaStatus !== 'today') return false;
    if (tab === 'soon' && item.slaStatus !== 'soon') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.ticketId.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyTicket = (ticket, e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ticket).then(() => {
        onTriggerToast && onTriggerToast(`Ticket ID ${ticket} copied to clipboard!`, 'content_copy');
      });
    } else {
      onTriggerToast && onTriggerToast(`Copied ${ticket}`, 'content_copy');
    }
  };

  return (
    <section
      className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col border border-outline-variant/20"
      id="needs-attention-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md pb-space-sm border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">priority_high</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Needs Your Attention
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-0.5">
            Priority dockets and cases nearing statutory SLA thresholds
          </p>
        </div>

        {/* Tab pills */}
        <div className="inline-flex p-1 rounded-lg bg-surface-container-low text-xs font-semibold self-start sm:self-auto border border-outline-variant/30">
          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              tab === 'all'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Priority ({OFFICER_CASES.length})
          </button>
          <button
            onClick={() => setTab('overdue')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              tab === 'overdue'
                ? 'bg-surface-container-lowest text-error shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-error'
            }`}
          >
            Overdue (2)
          </button>
          <button
            onClick={() => setTab('today')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              tab === 'today'
                ? 'bg-surface-container-lowest text-amber-800 shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-amber-800'
            }`}
          >
            Due Today (1)
          </button>
          <button
            onClick={() => setTab('soon')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              tab === 'soon'
                ? 'bg-surface-container-lowest text-secondary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-secondary'
            }`}
          >
            Due Soon (3)
          </button>
        </div>
      </div>

      {/* Quick Search inside Table */}
      <div className="mb-4 relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
          search
        </span>
        <input
          id="table-search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter attention queue by ticket ID or title..."
          className="w-full pl-9 pr-4 py-1.5 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto -mx-space-lg px-space-lg">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/30 select-none">
              <th className="py-3 px-3">Ticket ID</th>
              <th className="py-3 px-3 min-w-[220px]">Grievance &amp; Particulars</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3 min-w-[150px]">Deadline &amp; SLA</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
            {filtered.map((item) => (
              <tr
                key={item.id}
                onClick={() => navigate(`/officer/grievance/${item.id}`)}
                className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
              >
                {/* 1. Ticket ID */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="font-label-md text-label-md font-bold text-primary group-hover:underline">
                      {item.ticketId}
                    </span>
                    <button
                      onClick={(e) => handleCopyTicket(item.ticketId, e)}
                      className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity cursor-pointer"
                      title="Copy Ticket ID"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-outline font-label-sm block">
                    {item.section}
                  </span>
                </td>

                {/* 2. Grievance & Summary */}
                <td className="py-3.5 px-3">
                  <div className="font-label-lg text-label-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </div>
                  <div className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">
                    {item.summary}
                  </div>
                </td>

                {/* 3. Category */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                    {item.category}
                  </span>
                </td>

                {/* 4. Priority */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${item.priorityClass}`}>
                    {item.priority}
                  </span>
                </td>

                {/* 5. Deadline & SLA */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className={`font-label-sm text-label-sm flex items-center gap-1 ${item.slaClass}`}>
                      <span className="material-symbols-outlined text-[14px]">{item.slaIcon}</span>
                      <span>{item.slaText}</span>
                    </span>
                    <span className="text-[11px] text-outline">{item.slaTarget}</span>
                  </div>
                </td>

                {/* 6. Status */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${item.statusClass}`}>
                    {item.status}
                  </span>
                </td>

                {/* 7. Action */}
                <td className="py-3.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`/officer/grievance/${item.id}`)}
                    className="px-3.5 py-1.5 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm font-bold hover:bg-primary-container transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Review</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
