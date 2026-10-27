import React, { useState, useRef, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminHarnessBar from '../../components/admin/AdminHarnessBar';
import AdminKpiBar from '../../components/admin/AdminKpiBar';
import GrievanceActivityChart from '../../components/admin/GrievanceActivityChart';
import DepartmentPerformanceTable from '../../components/admin/DepartmentPerformanceTable';
import AttentionRequiredCard from '../../components/admin/AttentionRequiredCard';
import StatusBreakdownDonut from '../../components/admin/StatusBreakdownDonut';
import AdminAiInsights from '../../components/admin/AdminAiInsights';
import AdminTelemetryFooter from '../../components/admin/AdminTelemetryFooter';
import NewDirectiveModal from '../../components/admin/NewDirectiveModal';

export default function InstitutionAdminDashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [harnessState, setHarnessState] = useState('default'); // 'default' | 'sla-risk' | 'empty' | 'skeleton'
  const [dateTab, setDateTab] = useState('30D'); // '7D' | '30D' | '90D' | 'AY'
  const [selectedDept, setSelectedDept] = useState('all');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isDirectiveModalOpen, setIsDirectiveModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', icon: 'check_circle' });
  const toastTimeoutRef = useRef(null);

  const showToast = (message, icon = 'check_circle') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ visible: true, message, icon });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '', icon: 'check_circle' });
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleSetHarnessState = (stateName) => {
    setHarnessState(stateName);
    if (stateName === 'sla-risk') {
      showToast('SLA Risk Highlight active: Spotlighting overdue departmental dockets.', 'warning');
    } else if (stateName === 'empty') {
      showToast('Switched to zero-case reporting cycle. All department quotas reset.', 'folder_off');
    } else if (stateName === 'skeleton') {
      showToast('Telemetry polling active. Synthetic stream synchronized.', 'hourglass_empty');
    } else {
      showToast('Default Executive Telemetry view active.', 'check_circle');
    }
  };

  const handleExecuteDirective = ({ directiveType, targetDept, directiveNotes }) => {
    setIsDirectiveModalOpen(false);
    showToast(
      'Binding directive dispatched and committed to statutory university ledger.',
      'done_all'
    );
  };

  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col">
      {/* 1. Left Sidebar Navigation for Institution Administrators (w-72) */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="overview"
      />

      {/* 2. Main Page Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <AdminHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onTriggerToast={showToast}
        />

        {/* Content Body */}
        <main className="relative pt-20 px-4 sm:px-gutter py-space-lg flex-1">
          <div className="flex flex-col w-full pb-16">
            {/* Simulation Harness Bar */}
            <AdminHarnessBar
              harnessState={harnessState}
              onSetHarnessState={handleSetHarnessState}
            />

            {/* Skeleton View when in 'skeleton' mode */}
            {harnessState === 'skeleton' ? (
              <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-20 bg-surface-container rounded-xl w-full"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  <div className="h-28 bg-surface-container rounded-xl"></div>
                  <div className="h-28 bg-surface-container rounded-xl"></div>
                  <div className="h-28 bg-surface-container rounded-xl"></div>
                  <div className="h-28 bg-surface-container rounded-xl"></div>
                  <div className="h-28 bg-surface-container rounded-xl"></div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  <div className="xl:col-span-7 h-96 bg-surface-container rounded-xl"></div>
                  <div className="xl:col-span-5 h-96 bg-surface-container rounded-xl"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Page Header & Global Scope Controls */}
                <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 mb-8 pb-4 border-b border-outline-variant/20">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm border border-outline-variant/20">
                      <span className="material-symbols-outlined text-[15px]">corporate_fare</span>
                      <span>UGC Statutory Compliance Active</span>
                    </div>
                    <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
                      Institution Overview
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Monitor grievance activity, resolution performance, and departmental accountability across your institution.
                    </p>
                  </div>

                  {/* Controls Palette */}
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                    {/* Date Range Filter Tabs */}
                    <div className="bg-surface-container-low p-1 rounded-lg flex items-center gap-0.5 shadow-sm border border-outline-variant/20">
                      <button
                        type="button"
                        onClick={() => setDateTab('7D')}
                        className={`date-tab px-2.5 py-1.5 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                          dateTab === '7D'
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        7D
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateTab('30D')}
                        className={`date-tab px-2.5 py-1.5 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                          dateTab === '30D'
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Last 30 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateTab('90D')}
                        className={`date-tab px-2.5 py-1.5 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                          dateTab === '90D'
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        90D
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateTab('AY')}
                        className={`date-tab px-2.5 py-1.5 rounded-md font-label-sm text-label-sm transition-all cursor-pointer ${
                          dateTab === 'AY'
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        AY 2025-26
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('Date picker dialog simulated', 'date_range')}
                        className="date-tab px-2 py-1.5 rounded-md font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1 cursor-pointer"
                        title="Custom date range"
                      >
                        <span className="material-symbols-outlined text-[15px]">date_range</span>
                      </button>
                    </div>

                    {/* Department Selector */}
                    <div className="relative">
                      <select
                        value={selectedDept}
                        onChange={(e) => {
                          setSelectedDept(e.target.value);
                          showToast(`Telemetry scoped to: ${e.target.value}`, 'filter_alt');
                        }}
                        className="appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md pl-3 pr-8 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer border border-outline-variant/30 h-full"
                      >
                        <option value="all">All Departments (5 Active)</option>
                        <option value="it">IT Services (384 dockets)</option>
                        <option value="infra">Infrastructure &amp; Facilities (296 dockets)</option>
                        <option value="academic">Academic Affairs (248 dockets)</option>
                        <option value="welfare">Student Welfare (194 dockets)</option>
                        <option value="accounts">Administration &amp; Accounts (162 dockets)</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">
                        expand_more
                      </span>
                    </div>

                    {/* Export Dropdown */}
                    <div className="relative inline-flex group">
                      <button
                        type="button"
                        onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md hover:bg-surface-container transition-all shadow-sm border border-outline-variant/30 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">file_download</span>
                        <span>Export Report</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                      </button>

                      {isExportMenuOpen && (
                        <div
                          className="flex flex-col absolute right-0 top-full mt-1.5 w-56 bg-surface-container-lowest rounded-xl shadow-xl py-1.5 z-30 border border-outline-variant/30 animate-fadeIn"
                          onClick={() => setIsExportMenuOpen(false)}
                        >
                          <button
                            type="button"
                            onClick={() => showToast('UGC Statutory Audit PDF ready for export.', 'picture_as_pdf')}
                            className="px-3.5 py-2 text-left font-label-sm text-label-sm text-on-surface hover:bg-surface-container flex items-center justify-between cursor-pointer"
                          >
                            <span>UGC Statutory Audit Format</span>
                            <span className="font-mono text-outline text-[10px]">PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast('Executive Performance Deck XLSX ready.', 'table_view')}
                            className="px-3.5 py-2 text-left font-label-sm text-label-sm text-on-surface hover:bg-surface-container flex items-center justify-between cursor-pointer"
                          >
                            <span>Executive Performance Deck</span>
                            <span className="font-mono text-outline text-[10px]">XLSX</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast('Anonymized Grievance Ledger CSV downloaded.', 'csv')}
                            className="px-3.5 py-2 text-left font-label-sm text-label-sm text-on-surface hover:bg-surface-container flex items-center justify-between cursor-pointer"
                          >
                            <span>Anonymized Grievance Ledger</span>
                            <span className="font-mono text-outline text-[10px]">CSV</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Primary Action Button */}
                    <button
                      type="button"
                      onClick={() => setIsDirectiveModalOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      <span className="whitespace-nowrap font-bold">New Directive / Audit</span>
                    </button>
                  </div>
                </header>

                {/* 5 Institution-Wide KPI Metrics Bar */}
                <AdminKpiBar
                  onTriggerToast={showToast}
                  onFilterOverdue={() => handleSetHarnessState('sla-risk')}
                />

                {/* Primary Two-Column Analytical Workspace */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8 items-start">
                  {/* Left Column (62% width: xl:col-span-7) */}
                  <div className="xl:col-span-7 flex flex-col gap-6">
                    {/* Grievance Activity Trends Line Chart */}
                    <GrievanceActivityChart onTriggerToast={showToast} />

                    {/* Department Performance & Accountability Table */}
                    <DepartmentPerformanceTable
                      isSlaRiskActive={harnessState === 'sla-risk'}
                      onTriggerToast={showToast}
                      onSelectDepartment={(deptName) => showToast(`Selected department: ${deptName}`, 'apartment')}
                    />
                  </div>

                  {/* Right Column (38% width: xl:col-span-5) */}
                  <div className="xl:col-span-5 flex flex-col gap-6">
                    {/* Attention Required & Escalation Radar */}
                    <AttentionRequiredCard onTriggerToast={showToast} />

                    {/* Status Breakdown Donut Chart */}
                    <StatusBreakdownDonut onTriggerToast={showToast} />
                  </div>
                </div>

                {/* Lower Section: AI Insights, Action Palette & Freshness Footer */}
                <div className="flex flex-col gap-6 mb-8">
                  {/* NIVARAN AI Institutional Insights Card */}
                  <AdminAiInsights onTriggerToast={showToast} />

                  {/* Telemetry Freshness Footer */}
                  <AdminTelemetryFooter onTriggerToast={showToast} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* New Directive Modal Dialog */}
      <NewDirectiveModal
        isOpen={isDirectiveModalOpen}
        onClose={() => setIsDirectiveModalOpen(false)}
        onExecute={handleExecuteDirective}
      />

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 bg-surface-container-lowest text-on-surface px-4 py-3 rounded-xl shadow-xl border-l-4 border-secondary z-50 transition-all duration-300 flex items-center gap-3 border border-outline-variant/30 ${
          toast.visible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-secondary">
          {toast.icon}
        </span>
        <span className="font-label-md text-label-md font-semibold">{toast.message}</span>
      </div>
    </div>
  );
}
