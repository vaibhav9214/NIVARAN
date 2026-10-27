import React, { useState, useRef, useEffect } from 'react';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import OfficerHeader from '../../components/officer/OfficerHeader';
import OfficerKpiGrid from '../../components/officer/OfficerKpiGrid';
import AttentionTable from '../../components/officer/AttentionTable';
import WorkloadVelocityChart from '../../components/officer/WorkloadVelocityChart';
import DeadlineMonitor from '../../components/officer/DeadlineMonitor';
import OfficerAiAssistant from '../../components/officer/OfficerAiAssistant';
import OfficerRecentActivity from '../../components/officer/OfficerRecentActivity';
import OfficerQuickActions from '../../components/officer/OfficerQuickActions';
import OfficerEmptyState from '../../components/officer/OfficerEmptyState';
import OfficerSkeleton from '../../components/officer/OfficerSkeleton';

export default function OfficerDashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [simState, setSimState] = useState('active'); // 'active' | 'empty' | 'overdue' | 'loading'
  const [dateFilter, setDateFilter] = useState('7d'); // 'today' | '7d' | '30d'
  const [kpiFilter, setKpiFilter] = useState('all');
  const [headerSearch, setHeaderSearch] = useState('');

  // Floating Toast
  const [toast, setToast] = useState({ visible: false, message: '', icon: 'info' });
  const toastTimeoutRef = useRef(null);

  const showToast = (message, icon = 'info') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ visible: true, message, icon });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '', icon: 'info' });
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleSimSwitch = (stateName) => {
    setSimState(stateName);
    if (stateName === 'loading') {
      showToast('Simulating Department Officer data synchronization...', 'sync');
    } else if (stateName === 'empty') {
      showToast('Zero pending grievances state active.', 'checklist_rtl');
    } else if (stateName === 'overdue') {
      showToast('Critical SLA Breach Warning triggered.', 'warning');
    } else {
      showToast('Loaded active Officer Workspace view.', 'info');
    }
  };

  const handleResolveCritical = () => {
    const el = document.getElementById('needs-attention-card');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    showToast('Highlighting 3 Critical SLA dockets.', 'priority_high');
  };

  return (
    <div className="w-full min-h-screen bg-background font-body-md text-body-md text-on-surface antialiased flex">
      {/* 1. Left Sidebar Navigation for Department Officers */}
      <OfficerSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="overview"
      />

      {/* 2. Main Content Layout (offset by 256px on desktop) */}
      <div className="flex-1 w-full lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <OfficerHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={headerSearch}
          onSearchChange={setHeaderSearch}
          onTriggerToast={showToast}
        />

        {/* Main Workspace Canvas */}
        <main className="relative pt-16 bg-surface min-h-screen px-4 sm:px-space-lg py-space-lg">
          <div className="flex flex-col w-full pb-16">
            {/* Interactive Simulation Harness */}
            <div className="w-full bg-surface-container-low px-space-md py-2.5 rounded-xl mb-space-lg flex flex-wrap items-center justify-between gap-space-sm shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                  Interactive State Simulation:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5" id="sim-controls">
                <button
                  type="button"
                  onClick={() => handleSimSwitch('active')}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                    simState === 'active'
                      ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  Active (Officer View)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimSwitch('empty')}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                    simState === 'empty'
                      ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  Zero Cases Empty State
                </button>
                <button
                  type="button"
                  onClick={() => handleSimSwitch('overdue')}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                    simState === 'overdue'
                      ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  Overdue Critical SLA Alert
                </button>
                <button
                  type="button"
                  onClick={() => handleSimSwitch('loading')}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                    simState === 'loading'
                      ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  Loading Skeleton
                </button>
              </div>
            </div>

            {/* Global Banner: Overdue Critical SLA Alert Banner (shown conditionally or in overdue state) */}
            {simState === 'overdue' && (
              <div
                className="w-full bg-error-container text-on-error-container p-space-md rounded-xl mb-space-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md shadow-sm border border-error/30 animate-in fade-in duration-200"
                id="alert-overdue-banner"
              >
                <div className="flex items-start gap-space-md">
                  <div className="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                    <span className="material-symbols-outlined text-[22px]">warning</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm leading-tight text-error font-bold">
                      Critical SLA Breach Warning • Statutory Section 11.2 Escalation
                    </span>
                    <span className="font-body-sm text-body-sm text-on-error-container mt-0.5">
                      3 dockets have passed the mandated statutory reply window. Next automated escalation to the Dean of Students triggers in 24 hours.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResolveCritical}
                  className="px-space-md py-1.5 rounded-lg bg-error text-on-error font-label-md text-label-md whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  Resolve Critical First
                </button>
              </div>
            )}

            {/* Welcome & Context Header */}
            <div className="w-full bg-surface-container-lowest p-space-lg rounded-xl mb-space-lg shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md border border-outline-variant/20">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-space-sm">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-extrabold text-2xl sm:text-3xl">
                    Good morning, Ananya
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-primary tracking-wide font-semibold">
                    <span className="material-symbols-outlined text-[14px]">shield_person</span>
                    IT Services • Assigned Dept
                  </span>
                </div>
                <p className="font-body-md text-body-md text-outline">
                  Here is your department's grievance activity and the cases that need your attention.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-space-sm">
                {/* Date Range Filter Pills */}
                <div className="inline-flex p-1 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setDateFilter('today')}
                    className={`px-3 py-1 rounded-md font-label-md text-label-md transition-colors cursor-pointer ${
                      dateFilter === 'today'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter('7d')}
                    className={`px-3 py-1 rounded-md font-label-md text-label-md transition-colors cursor-pointer ${
                      dateFilter === '7d'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter('30d')}
                    className={`px-3 py-1 rounded-md font-label-md text-label-md transition-colors cursor-pointer ${
                      dateFilter === '30d'
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    Last 30 Days
                  </button>
                </div>

                {/* Secondary Action */}
                <button
                  type="button"
                  onClick={() => showToast('Exporting Departmental Grievance Report...', 'download')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low text-primary hover:bg-surface-container transition-colors font-label-md text-label-md font-semibold cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Export Report</span>
                </button>

                {/* Primary Action */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('needs-attention-card');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    showToast('Opening Review Queue', 'rate_review');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md shadow-xs cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Open Review Queue</span>
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            {simState !== 'loading' && (
              <OfficerKpiGrid
                activeFilter={kpiFilter}
                onSelectFilter={(type) => setKpiFilter(type)}
              />
            )}

            {/* SKELETON STATE */}
            {simState === 'loading' && <OfficerSkeleton />}

            {/* EMPTY STATE */}
            {simState === 'empty' && (
              <OfficerEmptyState
                onReturnActive={() => handleSimSwitch('active')}
                onTriggerToast={showToast}
              />
            )}

            {/* ACTIVE WORKSPACE */}
            {simState !== 'loading' && simState !== 'empty' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg w-full" id="main-workspace-grid">
                {/* Left Column (8 of 12 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-space-lg">
                  {/* Section A: Needs Your Attention Table */}
                  <AttentionTable onTriggerToast={showToast} />

                  {/* Section B: My Workload Velocity Chart */}
                  <WorkloadVelocityChart />
                </div>

                {/* Right Column (4 of 12 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-space-lg">
                  {/* Section C: Deadline Monitor */}
                  <DeadlineMonitor onTriggerToast={showToast} />

                  {/* Section D: NIVARAN AI Assistant */}
                  <OfficerAiAssistant onTriggerToast={showToast} />

                  {/* Section E: Recent Activity Audit Trail */}
                  <OfficerRecentActivity onTriggerToast={showToast} />

                  {/* Section F: Quick Actions Panel */}
                  <OfficerQuickActions
                    onTriggerToast={showToast}
                    onFilterOverdue={handleResolveCritical}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Feedback Toast Notification */}
      {toast.visible && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 font-body-sm text-xs animate-in slide-in-from-bottom duration-200 border border-outline-variant/30"
          id="system-toast"
        >
          <span className="material-symbols-outlined text-secondary-fixed text-lg">
            {toast.icon}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
