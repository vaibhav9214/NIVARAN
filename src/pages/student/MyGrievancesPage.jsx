import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import { studentAPI } from '../../services/api';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Awaiting Student Response', value: 'Awaiting Student Response' },
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Forwarded', value: 'Forwarded' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Withdrawn', value: 'Withdrawn' },
];

export default function MyGrievancesPage() {
  const navigate = useNavigate();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);

  const fetchGrievances = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (status && status !== 'all') params.status = status;
      if (priority) params.priority = priority;

      const res = await studentAPI.getMyGrievances(params);
      if (res.data?.success) {
        setGrievances(res.data.grievances || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load grievances:', err);
      setError(err.response?.data?.message || err.message || 'Unable to retrieve grievance ledger.');
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, page]);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchGrievances();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-nivaran-successBg text-nivaran-success border-nivaran-success/20';
      case 'Awaiting Student Response':
        return 'bg-nivaran-warningBg text-nivaran-warning border-nivaran-warning/20 font-bold';
      case 'Rejected':
        return 'bg-nivaran-errorBg text-nivaran-error border-nivaran-error/20';
      case 'In Progress':
        return 'bg-nivaran-paleGreen text-nivaran-primary border-nivaran-softGreen';
      case 'Under Review':
        return 'bg-nivaran-warmCream text-nivaran-forest border-nivaran-border';
      default:
        return 'bg-nivaran-paleGreen text-nivaran-forest border-nivaran-softGreen';
    }
  };

  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <StudentSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="my-grievances"
      />

      <div className="flex-1 w-full lg:pl-[260px] flex flex-col min-h-screen">
        <StudentHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={search}
          onSearch={(q) => {
            setSearch(q);
            setPage(1);
          }}
          breadcrumb="My Grievance Ledger"
        />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Header Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-manrope text-nivaran-forest tracking-tight">
                My Grievance Ledger
              </h1>
              <p className="text-xs sm:text-sm text-nivaran-textSecondary mt-0.5">
                Official registry of all formal complaints lodged under your authenticated student profile.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchGrievances}
                disabled={loading}
                className="p-2 rounded-xl bg-white border border-nivaran-border hover:bg-nivaran-warmCream/60 text-nivaran-forest transition-colors shadow-2xs"
                title="Refresh Ledger"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                to="/student/raise-grievance"
                className="px-4 py-2 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Lodge New Grievance</span>
              </Link>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-nivaran-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-nivaran-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket ID or keyword..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 focus:border-nivaran-primary"
              />
            </form>

            <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl text-xs border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl text-xs border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 cursor-pointer"
              >
                <option value="">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-nivaran-errorBg border border-nivaran-error/30 text-nivaran-error text-xs">
              {error}
            </div>
          )}

          {/* Ledger Table Container */}
          <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-nivaran-paleGreen/60 border-b border-nivaran-border text-nivaran-forest font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Subject / Title</th>
                    <th className="py-3 px-4">Department &amp; Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nivaran-divider">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-nivaran-textMuted">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-nivaran-primary/30 border-t-nivaran-primary rounded-full animate-spin"></div>
                          <span>Fetching official grievances...</span>
                        </div>
                      </td>
                    </tr>
                  ) : grievances.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-nivaran-textMuted">
                        <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
                          <FileText className="w-8 h-8 text-nivaran-textMuted" />
                          <p className="font-semibold text-nivaran-text text-sm">No grievances found</p>
                          <p className="text-xs">
                            {search || status !== 'all' || priority
                              ? 'No records match your selected filter criteria. Try clearing filters.'
                              : 'You have not submitted any complaints yet.'}
                          </p>
                          {(search || status !== 'all' || priority) && (
                            <button
                              onClick={() => {
                                setSearch('');
                                setStatus('all');
                                setPriority('');
                                setPage(1);
                              }}
                              className="mt-2 px-3 py-1.5 rounded-lg bg-nivaran-paleGreen text-nivaran-forest font-semibold text-xs"
                            >
                              Reset Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    grievances.map((item) => (
                      <tr
                        key={item._id}
                        onClick={() => navigate(`/student/grievance-details/${item.ticketId || item._id}`)}
                        className="hover:bg-nivaran-paleGreen/30 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-nivaran-primary">
                          {item.ticketId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-nivaran-text max-w-xs truncate group-hover:text-nivaran-primary transition-colors">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-nivaran-textSecondary">
                          <div>
                            <span className="font-medium text-nivaran-text">
                              {item.department?.name || 'General'}
                            </span>
                            <span className="block text-[11px] text-nivaran-textMuted">
                              {item.category}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold uppercase text-[10px] ${
                              item.priority === 'Urgent'
                                ? 'text-nivaran-error'
                                : item.priority === 'High'
                                ? 'text-nivaran-warning'
                                : 'text-nivaran-textMuted'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-nivaran-textMuted text-[11px]">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 font-semibold text-nivaran-primary group-hover:text-nivaran-forest">
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-nivaran-divider flex items-center justify-between text-xs text-nivaran-textSecondary">
                <span>
                  Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
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
        </main>
      </div>
    </div>
  );
}
