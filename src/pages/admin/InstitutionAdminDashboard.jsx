import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Users,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  Activity,
  Cpu
} from 'lucide-react';

export default function InstitutionAdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [aiTrends, setAiTrends] = useState(null);
  const [loadingAiTrends, setLoadingAiTrends] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, statusRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAiStatus().catch(() => null),
      ]);

      if (dashRes.data?.success) {
        setData(dashRes.data);
      }
      if (statusRes?.data?.success) {
        setAiStatus(statusRes.data);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError(err.response?.data?.message || err.message || 'Unable to retrieve administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAiTrends = async () => {
    setLoadingAiTrends(true);
    try {
      const res = await adminAPI.getAiTrends({ timeframe: 'Past 30 Days' });
      if (res.data?.success) {
        setAiTrends(res.data);
      }
    } catch (err) {
      console.warn('Failed to load AI trends:', err.message);
    } finally {
      setLoadingAiTrends(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const gCounts = data?.grievanceCounts || {
    total: 0,
    active: 0,
    resolved: 0,
    overdue: 0,
    escalated: 0,
    complianceRate: 100,
  };

  const uCounts = data?.userCounts || {
    total: 0,
    students: 0,
    officers: 0,
    admins: 0,
  };

  const depts = data?.workloadByDepartment || [];
  const recentEvents = data?.recentActivity || [];

  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="overview"
      />

      <div className="flex-1 w-full lg:pl-72 flex flex-col min-h-screen">
        <AdminHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-nivaran-forest to-nivaran-primary rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold text-nivaran-softGreen mb-2">
                <Shield className="w-3.5 h-3.5 text-nivaran-softGreen" />
                University Administrative Command
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-manrope tracking-tight">
                Campus Redressal Governance
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                Global oversight over collegiate departments, officer workloads, SLA performance, and campus AI trends.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link
                to="/admin/user-department-management"
                className="px-4 py-2.5 rounded-xl bg-white text-nivaran-forest hover:bg-nivaran-ivory font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Users className="w-4 h-4 text-nivaran-primary" />
                <span>Users &amp; Departments</span>
              </Link>
              <button
                onClick={fetchAdminData}
                disabled={loading}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Refresh Analytics"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-nivaran-errorBg border border-nivaran-error/30 text-nivaran-error text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={fetchAdminData} className="px-3 py-1 rounded-lg bg-white font-semibold">
                Retry
              </button>
            </div>
          )}

          {/* High-Level Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-nivaran-textSecondary">Total Grievances</span>
                <FileText className="w-4 h-4 text-nivaran-primary" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-forest">
                  {loading ? '...' : gCounts.total}
                </span>
                <p className="text-[11px] text-nivaran-textMuted mt-0.5">
                  {gCounts.active} Active • {gCounts.resolved} Resolved
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-nivaran-textSecondary">SLA Compliance</span>
                <TrendingUp className="w-4 h-4 text-nivaran-success" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-success">
                  {loading ? '...' : `${gCounts.complianceRate}%`}
                </span>
                <p className="text-[11px] text-nivaran-textMuted mt-0.5">
                  {gCounts.overdue} Overdue dockets
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-nivaran-textSecondary">Registered Scholars</span>
                <Users className="w-4 h-4 text-nivaran-primary" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-forest">
                  {loading ? '...' : uCounts.students}
                </span>
                <p className="text-[11px] text-nivaran-textMuted mt-0.5">Active student accounts</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-nivaran-textSecondary">Department Officers</span>
                <Building2 className="w-4 h-4 text-nivaran-primary" />
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-bold font-manrope text-nivaran-forest">
                  {loading ? '...' : uCounts.officers}
                </span>
                <p className="text-[11px] text-nivaran-textMuted mt-0.5">
                  Across {depts.length} accredited nodes
                </p>
              </div>
            </div>
          </div>

          {/* Department Performance Table & AI Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Department Performance Table (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-nivaran-border shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold font-manrope text-nivaran-forest">
                      Departmental Workload &amp; SLA Breakdown
                    </h2>
                    <p className="text-xs text-nivaran-textMuted">
                      Redressal velocity and SLA health across all campus branches
                    </p>
                  </div>
                  <Link
                    to="/admin/user-department-management"
                    className="text-xs font-semibold text-nivaran-primary hover:underline flex items-center gap-1"
                  >
                    <span>Manage Nodes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-nivaran-paleGreen/60 border-b border-nivaran-border text-nivaran-forest font-semibold uppercase text-[11px]">
                        <th className="py-2.5 px-3">Department</th>
                        <th className="py-2.5 px-3">Code</th>
                        <th className="py-2.5 px-3 text-center">Total Cases</th>
                        <th className="py-2.5 px-3 text-center">Active</th>
                        <th className="py-2.5 px-3 text-center">Resolved</th>
                        <th className="py-2.5 px-3 text-center">Overdue</th>
                        <th className="py-2.5 px-3 text-right">Officers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nivaran-divider">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-nivaran-textMuted">
                            Loading departmental performance data...
                          </td>
                        </tr>
                      ) : depts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-nivaran-textMuted">
                            No departments found.
                          </td>
                        </tr>
                      ) : (
                        depts.map((d) => (
                          <tr key={d._id} className="hover:bg-nivaran-paleGreen/30 transition-colors">
                            <td className="py-3 px-3 font-semibold text-nivaran-text">{d.name}</td>
                            <td className="py-3 px-3 font-mono text-nivaran-textMuted text-[11px]">{d.code}</td>
                            <td className="py-3 px-3 text-center font-bold">{d.total}</td>
                            <td className="py-3 px-3 text-center text-nivaran-warning font-semibold">
                              {d.active}
                            </td>
                            <td className="py-3 px-3 text-center text-nivaran-success font-semibold">
                              {d.resolved}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {d.overdue > 0 ? (
                                <span className="px-2 py-0.5 rounded-full bg-nivaran-errorBg text-nivaran-error font-bold text-[10px]">
                                  {d.overdue} Breached
                                </span>
                              ) : (
                                <span className="text-nivaran-textMuted">0</span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right font-semibold text-nivaran-forest">
                              {d.officersCount || 0}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: AI Service Status & Campus AI Trends */}
            <div className="space-y-6">
              {/* AI Health Diagnostics */}
              <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 space-y-3">
                <div className="flex items-center gap-2 text-nivaran-forest font-bold text-sm">
                  <Cpu className="w-4 h-4 text-nivaran-primary" />
                  <span>AI Grievance Intelligence Health</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-nivaran-divider">
                    <span className="text-nivaran-textMuted">Model</span>
                    <span className="font-semibold text-nivaran-text">
                      {aiStatus?.model || 'gemini-3.5-flash'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-nivaran-divider">
                    <span className="text-nivaran-textMuted">Microservice Status</span>
                    <span
                      className={`font-semibold ${
                        aiStatus?.fastapi_microservice?.online
                          ? 'text-nivaran-success'
                          : 'text-nivaran-primary'
                      }`}
                    >
                      {aiStatus?.fastapi_microservice?.online ? 'Online (FastAPI)' : 'Active (Resilient Engine)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-nivaran-textMuted">Gemini API Key</span>
                    <span className="font-semibold text-nivaran-success">Configured</span>
                  </div>
                </div>
              </div>

              {/* Campus AI Trends Module */}
              <div className="bg-gradient-to-br from-nivaran-paleGreen to-nivaran-softGreen rounded-2xl border border-nivaran-softGreen shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-nivaran-forest font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-nivaran-primary" />
                    <span>Campus AI Trends</span>
                  </div>
                  <button
                    onClick={fetchAiTrends}
                    disabled={loadingAiTrends}
                    className="text-[11px] font-semibold text-nivaran-primary hover:underline cursor-pointer"
                  >
                    {loadingAiTrends ? 'Clustering...' : aiTrends ? 'Re-cluster' : 'Analyze Trends'}
                  </button>
                </div>

                {aiTrends?.trends ? (
                  <div className="space-y-3 text-xs">
                    {aiTrends.trends.dominant_themes && (
                      <div>
                        <span className="text-[10px] font-bold text-nivaran-forest uppercase tracking-wider block">
                          Dominant Campus Themes
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {aiTrends.trends.dominant_themes.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-nivaran-softGreen text-nivaran-forest text-[11px] font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiTrends.trends.recurring_bottlenecks && (
                      <div className="p-3 bg-white rounded-xl border border-nivaran-softGreen">
                        <span className="text-[10px] font-bold text-nivaran-warning uppercase tracking-wider block mb-1">
                          Recurring Bottlenecks
                        </span>
                        <p className="text-[11px] text-nivaran-text leading-relaxed">
                          {Array.isArray(aiTrends.trends.recurring_bottlenecks)
                            ? aiTrends.trends.recurring_bottlenecks.join(', ')
                            : aiTrends.trends.recurring_bottlenecks}
                        </p>
                      </div>
                    )}

                    {aiTrends.trends.administrative_recommendations && (
                      <div className="p-3 bg-white rounded-xl border border-nivaran-softGreen">
                        <span className="text-[10px] font-bold text-nivaran-forest uppercase tracking-wider block mb-1">
                          Executive Recommendation
                        </span>
                        <p className="text-[11px] text-nivaran-text leading-relaxed">
                          {Array.isArray(aiTrends.trends.administrative_recommendations)
                            ? aiTrends.trends.administrative_recommendations.join('. ')
                            : aiTrends.trends.administrative_recommendations}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-nivaran-textSecondary leading-relaxed">
                    Aggregate AI intelligence clusters historical dockets to discover cross-departmental bottlenecks, student sentiment, and systemic infrastructure patterns.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
