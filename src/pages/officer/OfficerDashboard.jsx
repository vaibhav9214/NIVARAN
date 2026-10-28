import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import OfficerHeader from '../../components/officer/OfficerHeader';
import { officerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Inbox
} from 'lucide-react';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await officerAPI.getDashboard();
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load officer dashboard:', err);
      setError(err.response?.data?.message || err.message || 'Unable to retrieve officer workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const counts = data?.statusCounts || {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    active: 0,
    overdue: 0,
    escalated: 0,
  };

  const sla = data?.slaMetrics || {
    complianceRate: 100,
    onTrackCount: 0,
    atRiskCount: 0,
    breachedCount: 0,
  };

  const attentionRequired = data?.attentionRequired || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <OfficerSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="overview"
      />

      <div className="flex-1 w-full lg:pl-64 flex flex-col min-h-screen">
        <OfficerHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={headerSearch}
          onSearchChange={setHeaderSearch}
        />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-nivaran-forest to-nivaran-primary rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-nivaran-softGreen mb-2">
                <span className="w-2 h-2 rounded-full bg-nivaran-softGreen animate-pulse"></span>
                Department Officer Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-manrope tracking-tight">
                Officer Desk • {user?.name || 'Department Officer'}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                Redress assigned scholar cases, review automated AI triaging suggestions, and ensure SLA compliance.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/officer/assigned-grievances"
                className="px-4 py-2.5 rounded-xl bg-white text-nivaran-forest hover:bg-nivaran-ivory font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Inbox className="w-4 h-4 text-nivaran-primary" />
                <span>Open Case Queue</span>
              </Link>
              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Refresh Metrics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-nivaran-errorBg border border-nivaran-error/30 text-nivaran-error text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={fetchDashboard} className="px-3 py-1 rounded-lg bg-white font-semibold">
                Retry
              </button>
            </div>
          )}

          {/* Metric KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs">
              <span className="text-xs font-semibold text-nivaran-textSecondary">Assigned Cases</span>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-forest">
                  {loading ? '...' : counts.total}
                </span>
                <span className="text-xs text-nivaran-textMuted">Lifetime</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs">
              <span className="text-xs font-semibold text-nivaran-textSecondary">Active &amp; Pending</span>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-warning">
                  {loading ? '...' : counts.active}
                </span>
                <span className="text-xs text-nivaran-warning font-semibold">Requires Action</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs">
              <span className="text-xs font-semibold text-nivaran-textSecondary">SLA Compliance</span>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-success">
                  {loading ? '...' : `${sla.complianceRate}%`}
                </span>
                <span className="text-xs text-nivaran-success font-semibold">Target &gt;95%</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs">
              <span className="text-xs font-semibold text-nivaran-textSecondary">Overdue Dockets</span>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-error">
                  {loading ? '...' : counts.overdue}
                </span>
                <span className="text-xs text-nivaran-error font-semibold">Critical Breach</span>
              </div>
            </div>
          </div>

          {/* Main Grid: Urgent Attention & Recent Audit Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attention Required Table (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold font-manrope text-nivaran-forest">
                      Attention Required • Escalation Radar
                    </h2>
                    <p className="text-xs text-nivaran-textMuted">
                      Cases nearing SLA threshold or requiring officer clarification
                    </p>
                  </div>
                  <Link
                    to="/officer/assigned-grievances"
                    className="text-xs font-semibold text-nivaran-primary hover:underline flex items-center gap-1"
                  >
                    <span>Full Case Queue</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-xs text-nivaran-textMuted">
                    <div className="w-6 h-6 border-2 border-nivaran-primary/30 border-t-nivaran-primary rounded-full animate-spin mx-auto mb-2"></div>
                    <span>Loading assigned cases...</span>
                  </div>
                ) : attentionRequired.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-nivaran-success" />
                    <p className="text-sm font-bold text-nivaran-text">All Cases on Track</p>
                    <p className="text-xs text-nivaran-textMuted">
                      Zero grievances are currently in SLA danger or escalated state.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-nivaran-divider">
                    {attentionRequired.map((c) => (
                      <Link
                        key={c._id}
                        to={`/officer/grievance/${c.ticketId || c._id}`}
                        className="py-3 flex items-center justify-between hover:bg-nivaran-paleGreen/40 px-2 rounded-xl transition-colors group"
                      >
                        <div className="min-w-0 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-nivaran-primary">
                              {c.ticketId}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-nivaran-warningBg text-nivaran-warning font-semibold text-[10px]">
                              {c.status}
                            </span>
                            <span className="text-[10px] font-semibold text-nivaran-error uppercase">
                              {c.priority}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-nivaran-text truncate mt-1 group-hover:text-nivaran-primary transition-colors">
                            {c.title}
                          </p>
                          <p className="text-[11px] text-nivaran-textMuted mt-0.5">
                            Category: {c.category} • Submitted by {c.student?.name || 'Scholar'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-nivaran-textMuted group-hover:text-nivaran-primary transition-transform shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-nivaran-divider flex items-center justify-between text-xs text-nivaran-textMuted">
                <span>Governed under University Escalation Policy</span>
                <Link to="/officer/assigned-grievances" className="text-nivaran-primary font-semibold hover:underline">
                  View {counts.active} active cases &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: AI Assistant Advisory & Recent Activity */}
            <div className="space-y-6">
              {/* AI Officer Assistant Card */}
              <div className="bg-gradient-to-br from-nivaran-paleGreen to-nivaran-softGreen rounded-2xl border border-nivaran-softGreen shadow-xs p-5 space-y-3">
                <div className="flex items-center gap-2 text-nivaran-forest font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-nivaran-primary" />
                  <span>AI Redressal Assistant</span>
                </div>
                <p className="text-xs text-nivaran-textSecondary leading-relaxed">
                  Open any assigned grievance to view Gemini's automatic analysis: summary preview, categorization confidence, missing information check, and suggested officer follow-up actions.
                </p>
                <div className="p-3 bg-white/70 rounded-xl border border-nivaran-softGreen text-[11px] text-nivaran-forest">
                  <span className="font-bold">Human-in-the-Loop Guarantee:</span> AI insights are strictly advisory and never change official grievance statuses without your review.
                </div>
              </div>

              {/* Department Activity Feed */}
              <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 space-y-3">
                <h3 className="text-xs font-bold text-nivaran-forest uppercase tracking-wider">
                  Recent Department Activity
                </h3>
                {recentActivity.length === 0 ? (
                  <p className="text-xs text-nivaran-textMuted py-4 text-center">
                    No recent audit events logged today.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {recentActivity.slice(0, 5).map((act, i) => (
                      <div key={i} className="text-xs pb-2 border-b border-nivaran-divider last:border-0 last:pb-0">
                        <span className="font-semibold text-nivaran-text">{act.action}</span>
                        <span className="text-[10px] text-nivaran-textMuted ml-1.5 font-mono">
                          {act.ticketId}
                        </span>
                        {act.remarks && (
                          <p className="text-[11px] text-nivaran-textSecondary mt-0.5 italic">
                            "{act.remarks}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
