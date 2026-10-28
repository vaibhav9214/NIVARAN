import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Bell
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentAPI.getDashboard();
      if (res.data?.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
      setError(err.response?.data?.message || err.message || 'Unable to retrieve dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const counts = dashboardData?.statusCounts || {
    total: 0,
    active: 0,
    resolved: 0,
    overdue: 0,
    submitted: 0,
    underReview: 0,
    inProgress: 0,
    awaitingStudentResponse: 0,
    rejected: 0,
  };

  const actionRequired = dashboardData?.actionRequired || [];
  const recentGrievances = dashboardData?.recentGrievances || [];
  const announcements = dashboardData?.announcements || [];

  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      {/* 1. Left Sidebar Navigation */}
      <StudentSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="dashboard"
        onNavChange={(id) => {
          if (id === 'submit-grievance') navigate('/student/raise-grievance');
          if (id === 'my-grievances') navigate('/student/my-grievances');
        }}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 w-full lg:pl-[260px] flex flex-col min-h-screen">
        <StudentHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          breadcrumb="Dashboard"
        />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Welcome & Quick Action Banner */}
          <div className="bg-gradient-to-r from-nivaran-forest to-nivaran-primary rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-nivaran-softGreen mb-2">
                <span className="w-2 h-2 rounded-full bg-nivaran-softGreen animate-pulse"></span>
                Official Redressal Channel
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-manrope tracking-tight">
                Welcome back, {user?.name || 'Scholar'}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                Track your active institutional dockets, respond to committee inquiries, and verify SLA resolution timelines.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link
                to="/student/raise-grievance"
                className="px-4 py-2.5 rounded-xl bg-white text-nivaran-forest hover:bg-nivaran-ivory font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all"
              >
                <PlusCircle className="w-4 h-4 text-nivaran-primary" />
                <span>Lodge Grievance</span>
              </Link>
              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Refresh metrics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-nivaran-errorBg border border-nivaran-error/30 text-nivaran-error text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={fetchDashboard}
                className="px-3 py-1 rounded-lg bg-white font-semibold shadow-xs"
              >
                Retry
              </button>
            </div>
          )}

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-nivaran-textSecondary">Total Grievances</span>
                <div className="p-2 rounded-xl bg-nivaran-paleGreen text-nivaran-primary">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-forest">
                  {loading ? '...' : counts.total}
                </span>
                <p className="text-[11px] text-nivaran-textMuted mt-0.5">Historical submissions</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-nivaran-textSecondary">Active &amp; In-Progress</span>
                <div className="p-2 rounded-xl bg-nivaran-warningBg text-nivaran-warning">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-warning">
                  {loading ? '...' : counts.active}
                </span>
                <p className="text-[11px] text-nivaran-textMuted mt-0.5">Currently under review</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-nivaran-textSecondary">Resolved Successfully</span>
                <div className="p-2 rounded-xl bg-nivaran-successBg text-nivaran-success">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-success">
                  {loading ? '...' : counts.resolved}
                </span>
                <p className="text-[11px] text-nivaran-textMuted mt-0.5">Officially redressed</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-nivaran-textSecondary">Action Required</span>
                <div className="p-2 rounded-xl bg-nivaran-errorBg text-nivaran-error">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-error">
                  {loading ? '...' : counts.awaitingStudentResponse}
                </span>
                <p className="text-[11px] text-nivaran-textMuted mt-0.5">Awaiting your reply</p>
              </div>
            </div>
          </div>

          {/* Action Required Banner if Any */}
          {actionRequired.length > 0 && (
            <div className="bg-nivaran-warningBg border border-nivaran-warning/30 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3 text-nivaran-warning font-bold text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>Urgent: Committee Officer Requested Information ({actionRequired.length})</span>
              </div>
              <div className="space-y-2.5">
                {actionRequired.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-3.5 rounded-xl border border-nivaran-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-nivaran-forest">{item.ticketId}</span>
                        <span className="px-2 py-0.5 rounded-full bg-nivaran-warningBg text-nivaran-warning font-semibold text-[10px]">
                          Awaiting Response
                        </span>
                      </div>
                      <p className="font-semibold text-nivaran-text mt-1">{item.title}</p>
                      <p className="text-[11px] text-nivaran-textMuted">
                        Assigned to: {item.department?.name || 'Department Committee'}
                      </p>
                    </div>
                    <Link
                      to={`/student/grievance-details/${item.ticketId || item._id}`}
                      className="shrink-0 px-3.5 py-1.5 rounded-lg bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs flex items-center gap-1.5"
                    >
                      <span>Submit Clarification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Grid: Recent Grievances & Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Grievances Table/List (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold font-manrope text-nivaran-forest">
                      Recent Grievances
                    </h2>
                    <p className="text-xs text-nivaran-textMuted">Latest records filed under your student profile</p>
                  </div>
                  <Link
                    to="/student/my-grievances"
                    className="text-xs font-semibold text-nivaran-primary hover:underline flex items-center gap-1"
                  >
                    <span>View All Ledger</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-nivaran-textMuted">
                    <div className="w-6 h-6 border-2 border-nivaran-primary/30 border-t-nivaran-primary rounded-full animate-spin"></div>
                    <span>Loading real-time records...</span>
                  </div>
                ) : recentGrievances.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-nivaran-paleGreen text-nivaran-primary flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-nivaran-text">No grievances on record</p>
                      <p className="text-xs text-nivaran-textMuted mt-0.5">
                        You have not lodged any formal grievances yet.
                      </p>
                    </div>
                    <Link
                      to="/student/raise-grievance"
                      className="mt-2 px-4 py-2 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white text-xs font-semibold shadow-xs"
                    >
                      Lodge Your First Grievance
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-nivaran-divider">
                    {recentGrievances.map((g) => (
                      <Link
                        key={g._id}
                        to={`/student/grievance-details/${g.ticketId || g._id}`}
                        className="py-3 flex items-center justify-between hover:bg-nivaran-paleGreen/40 px-2 rounded-xl transition-colors group"
                      >
                        <div className="min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-nivaran-forest">
                              {g.ticketId}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                g.status === 'Resolved'
                                  ? 'bg-nivaran-successBg text-nivaran-success'
                                  : g.status === 'Awaiting Student Response'
                                  ? 'bg-nivaran-warningBg text-nivaran-warning'
                                  : g.status === 'Rejected'
                                  ? 'bg-nivaran-errorBg text-nivaran-error'
                                  : 'bg-nivaran-softGreen text-nivaran-forest'
                              }`}
                            >
                              {g.status}
                            </span>
                            <span className="text-[10px] font-semibold text-nivaran-textMuted uppercase">
                              {g.priority}
                            </span>
                          </div>
                          <h3 className="text-xs font-semibold text-nivaran-text truncate mt-1 group-hover:text-nivaran-primary transition-colors">
                            {g.title}
                          </h3>
                          <p className="text-[11px] text-nivaran-textMuted mt-0.5">
                            {g.department?.name || 'General'} • Submitted{' '}
                            {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-nivaran-textMuted group-hover:text-nivaran-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-nivaran-divider flex items-center justify-between text-xs text-nivaran-textMuted">
                <span>Governed under UGC Redressal Regulations</span>
                <Link to="/student/my-grievances" className="text-nivaran-primary font-semibold hover:underline">
                  Filter by status &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: AI Guidance & Announcements */}
            <div className="space-y-6">
              {/* Pre-submission AI Card */}
              <div className="bg-gradient-to-br from-nivaran-paleGreen to-nivaran-softGreen p-5 rounded-2xl border border-nivaran-softGreen shadow-xs">
                <div className="flex items-center gap-2 text-nivaran-forest font-bold text-sm mb-2">
                  <Sparkles className="w-4 h-4 text-nivaran-primary" />
                  <span>AI Pre-Submission Assistant</span>
                </div>
                <p className="text-xs text-nivaran-textSecondary leading-relaxed mb-4">
                  Need help wording your complaint? NIVARAN's Gemini-powered assistant audits your draft for clarity, suggests correct department routing, and checks for missing evidence before you submit.
                </p>
                <Link
                  to="/student/raise-grievance"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-nivaran-forest hover:bg-nivaran-primary text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <span>Draft with AI Help</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Campus Announcements */}
              <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs">
                <div className="flex items-center gap-2 text-nivaran-forest font-bold text-sm mb-3">
                  <Bell className="w-4 h-4 text-nivaran-primary" />
                  <span>Campus Notices</span>
                </div>
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="pb-2.5 border-b border-nivaran-divider last:border-0 last:pb-0">
                      <p className="text-xs font-semibold text-nivaran-text">{ann.title}</p>
                      <span className="text-[10px] text-nivaran-textMuted">{ann.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
