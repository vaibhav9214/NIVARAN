import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import OfficerHeader from '../../components/officer/OfficerHeader';
import { officerAPI } from '../../services/api';
import {
  Inbox,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  User,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const STATUSES = ['all', 'Submitted', 'Under Review', 'In Progress', 'Awaiting Student Response', 'Resolved', 'Forwarded', 'Rejected'];

export default function AssignedGrievancesPage() {
  const navigate = useNavigate();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [counts, setCounts] = useState({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);
  const [page, setPage] = useState(1);

  // Inspector Drawer
  const [inspectedCase, setInspectedCase] = useState(null);

  const fetchAssigned = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (status && status !== 'all') params.status = status;
      if (priority) params.priority = priority;
      if (isOverdue) params.isOverdue = true;

      const res = await officerAPI.getAssignedComplaints(params);
      if (res.data?.success) {
        setGrievances(res.data.grievances || []);
        if (res.data.statusCounts) setCounts(res.data.statusCounts);
        if (res.data.pagination) setPagination(res.data.pagination);
        if (res.data.grievances?.length > 0 && !inspectedCase) {
          setInspectedCase(res.data.grievances[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load assigned grievances:', err);
      setError(err.response?.data?.message || err.message || 'Unable to retrieve assigned case queue.');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, isOverdue, page]);

  useEffect(() => {
    fetchAssigned();
  }, [fetchAssigned]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAssigned();
  };

  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <OfficerSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="assigned"
      />

      <div className="flex-1 w-full lg:pl-64 flex flex-col min-h-screen">
        <OfficerHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={search}
          onSearchChange={(q) => {
            setSearch(q);
            setPage(1);
          }}
        />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-manrope text-nivaran-forest tracking-tight">
                Assigned Grievance Case Queue
              </h1>
              <p className="text-xs sm:text-sm text-nivaran-textSecondary mt-0.5">
                Official docket repository routed to your departmental node for triaging and resolution.
              </p>
            </div>
            <button
              onClick={fetchAssigned}
              disabled={loading}
              className="p-2 rounded-xl bg-white border border-nivaran-border hover:bg-nivaran-warmCream/60 text-nivaran-forest shadow-2xs self-start sm:self-auto cursor-pointer"
              title="Refresh Queue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-nivaran-border shadow-xs">
              <span className="text-[11px] font-semibold text-nivaran-textSecondary block">Active Queue</span>
              <span className="text-2xl font-bold font-manrope text-nivaran-forest mt-1 block">
                {counts.active || 0}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-nivaran-border shadow-xs">
              <span className="text-[11px] font-semibold text-nivaran-textSecondary block">Submitted / New</span>
              <span className="text-2xl font-bold font-manrope text-nivaran-primary mt-1 block">
                {counts.submitted || 0}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-nivaran-border shadow-xs">
              <span className="text-[11px] font-semibold text-nivaran-textSecondary block">In Progress</span>
              <span className="text-2xl font-bold font-manrope text-nivaran-warning mt-1 block">
                {counts.inProgress || 0}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-nivaran-border shadow-xs">
              <span className="text-[11px] font-semibold text-nivaran-textSecondary block">Overdue Cases</span>
              <span className="text-2xl font-bold font-manrope text-nivaran-error mt-1 block">
                {counts.overdue || 0}
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-nivaran-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-nivaran-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket ID or student name..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
              />
            </form>

            <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl text-xs border border-nivaran-border bg-nivaran-ivory text-nivaran-text cursor-pointer"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All Statuses' : s}
                  </option>
                ))}
              </select>

              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl text-xs border border-nivaran-border bg-nivaran-ivory text-nivaran-text cursor-pointer"
              >
                <option value="">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-nivaran-border bg-nivaran-ivory text-xs cursor-pointer select-none text-nivaran-text">
                <input
                  type="checkbox"
                  checked={isOverdue}
                  onChange={(e) => {
                    setIsOverdue(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded border-nivaran-border text-nivaran-error"
                />
                <span className="font-semibold text-nivaran-error">Overdue SLA Only</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-nivaran-errorBg border border-nivaran-error/30 text-nivaran-error text-xs">
              {error}
            </div>
          )}

          {/* Table & Quick Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Table Container (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-nivaran-border shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-nivaran-paleGreen/60 border-b border-nivaran-border text-nivaran-forest font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Docket ID</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Scholar</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nivaran-divider">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-nivaran-textMuted">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-6 h-6 border-2 border-nivaran-primary/30 border-t-nivaran-primary rounded-full animate-spin"></div>
                            <span>Loading assigned docket records...</span>
                          </div>
                        </td>
                      </tr>
                    ) : grievances.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-nivaran-textMuted">
                          <Inbox className="w-8 h-8 mx-auto mb-2 text-nivaran-textMuted" />
                          <p className="font-semibold text-nivaran-text text-sm">No dockets found</p>
                          <p className="text-xs">No grievances match the current filter selection.</p>
                        </td>
                      </tr>
                    ) : (
                      grievances.map((g) => {
                        const isSelected = inspectedCase?._id === g._id;
                        return (
                          <tr
                            key={g._id}
                            onClick={() => setInspectedCase(g)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-nivaran-paleGreen/80 font-medium' : 'hover:bg-nivaran-paleGreen/30'
                            }`}
                          >
                            <td className="py-3 px-4 font-mono font-bold text-nivaran-primary">
                              {g.ticketId}
                            </td>
                            <td className="py-3 px-4 font-semibold text-nivaran-text max-w-xs truncate">
                              {g.title}
                            </td>
                            <td className="py-3 px-4 text-nivaran-textSecondary">
                              {g.student?.name || 'Scholar'}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`font-semibold text-[10px] uppercase ${
                                  g.priority === 'Urgent'
                                    ? 'text-nivaran-error'
                                    : g.priority === 'High'
                                    ? 'text-nivaran-warning'
                                    : 'text-nivaran-textMuted'
                                }`}
                              >
                                {g.priority}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-nivaran-paleGreen text-nivaran-forest border border-nivaran-softGreen">
                                {g.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/officer/grievance/${g.ticketId || g._id}`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-[11px] transition-colors"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t border-nivaran-divider flex items-center justify-between text-xs text-nivaran-textSecondary">
                  <span>
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={pagination.page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-lg border border-nivaran-border hover:bg-nivaran-warmCream/60 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="p-1.5 rounded-lg border border-nivaran-border hover:bg-nivaran-warmCream/60 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Inspector Drawer (1 Col) */}
            <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-nivaran-divider">
                <span className="text-xs font-bold text-nivaran-forest uppercase tracking-wider">
                  Quick Docket Inspector
                </span>
                {inspectedCase && (
                  <span className="font-mono text-xs font-bold text-nivaran-primary">
                    {inspectedCase.ticketId}
                  </span>
                )}
              </div>

              {inspectedCase ? (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <h3 className="font-bold text-nivaran-text text-sm">{inspectedCase.title}</h3>
                    <p className="text-[11px] text-nivaran-textMuted mt-0.5">
                      Category: {inspectedCase.category} • Priority: {inspectedCase.priority}
                    </p>
                  </div>

                  <div className="p-3 bg-nivaran-ivory rounded-xl border border-nivaran-border text-nivaran-text leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {inspectedCase.description}
                  </div>

                  {inspectedCase.aiInsights?.summary && (
                    <div className="p-3 bg-nivaran-paleGreen/70 rounded-xl border border-nivaran-softGreen space-y-1">
                      <span className="text-[10px] font-semibold text-nivaran-primary uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Summary
                      </span>
                      <p className="text-[11px] text-nivaran-text leading-relaxed">
                        {inspectedCase.aiInsights.summary}
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => navigate(`/officer/grievance/${inspectedCase.ticketId || inspectedCase._id}`)}
                      className="w-full py-2.5 px-4 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <span>Open Full Review &amp; Redressal Desk</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-nivaran-textMuted text-center py-8">
                  Select a grievance from the table to preview particulars.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
