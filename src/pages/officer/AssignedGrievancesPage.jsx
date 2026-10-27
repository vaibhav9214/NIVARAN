import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import OfficerHeader from '../../components/officer/OfficerHeader';
import AssignedSimulationBar from '../../components/officer/assigned/AssignedSimulationBar';
import AssignedKpiGrid from '../../components/officer/assigned/AssignedKpiGrid';
import DeadlineRadarBanner from '../../components/officer/assigned/DeadlineRadarBanner';
import AssignedToolbar from '../../components/officer/assigned/AssignedToolbar';
import BulkActionBar from '../../components/officer/assigned/BulkActionBar';
import AssignedGrievancesTable from '../../components/officer/assigned/AssignedGrievancesTable';
import QuickCaseInspectorDrawer from '../../components/officer/assigned/QuickCaseInspectorDrawer';
import BatchTriageModal from '../../components/officer/assigned/BatchTriageModal';
import ReassignModal from '../../components/officer/review/ReassignModal';
import { ASSIGNED_GRIEVANCES } from '../../data/assignedGrievancesData';

export default function AssignedGrievancesPage() {
  const navigate = useNavigate();

  // App shell state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Simulation mode
  const [simMode, setSimMode] = useState('default'); // 'default' | 'batch' | 'overdue' | 'skeleton' | 'empty'

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('deadline');
  const [dateRange, setDateRange] = useState('all'); // 'all' | '7d' | '30d'

  // Row selection
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  // Inspection Drawer
  const [inspectedCase, setInspectedCase] = useState(ASSIGNED_GRIEVANCES[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Modals & Menus
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [reassignTargetItem, setReassignTargetItem] = useState(null);

  // Toast notification
  const [toast, setToast] = useState({ visible: false, title: '', message: '', icon: 'check_circle' });
  const toastTimeoutRef = useRef(null);

  const showToast = (title, message, icon = 'check_circle') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ visible: true, title, message, icon });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, title: '', message: '', icon: 'check_circle' });
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Filtered & sorted grievance list
  const filteredGrievances = useMemo(() => {
    if (simMode === 'empty') return [];

    let list = [...ASSIGNED_GRIEVANCES];

    // Status filter
    if (statusFilter !== 'all') {
      list = list.filter((item) => item.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      list = list.filter((item) => item.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      list = list.filter((item) => item.category === categoryFilter || item.categoryGroup === categoryFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.ticketId.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          (item.student && item.student.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortOption === 'priority') {
        const order = { High: 3, Medium: 2, Low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      if (sortOption === 'submitted') {
        return new Date(b.submitted) - new Date(a.submitted);
      }
      return 0; // Default order
    });

    return list;
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, sortOption, simMode]);

  // Simulation mode switcher
  const handleSetSimMode = (mode) => {
    setSimMode(mode);
    if (mode === 'default') {
      setSelectedRowIds([]);
      resetAllFilters();
      showToast('Default View Active', 'Displaying all departmental assigned grievances.');
    } else if (mode === 'batch') {
      setSelectedRowIds([ASSIGNED_GRIEVANCES[0].id, ASSIGNED_GRIEVANCES[1].id, ASSIGNED_GRIEVANCES[2].id]);
      showToast('Batch Mode Activated', '3 Grievances selected for expedited officer action.');
    } else if (mode === 'overdue') {
      setSelectedRowIds([]);
      setStatusFilter('Overdue');
      showToast('Overdue Filter Applied', 'Filtering 3 dockets past statutory SLA deadline.', 'warning');
    } else if (mode === 'skeleton') {
      showToast('Simulation Mode', 'Pulsing skeleton loader view active.', 'hourglass_empty');
    } else if (mode === 'empty') {
      showToast('Zero Results State', 'Simulating empty search & docket roster.', 'folder_off');
    }
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setSortOption('deadline');
    setSimMode('default');
  };

  // Row selection handlers
  const handleToggleSelectRow = (id) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((rowId) => rowId !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const handleToggleSelectAll = (checked) => {
    if (checked) {
      setSelectedRowIds(filteredGrievances.map((item) => item.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  // Bulk actions
  const handleBulkAction = (type) => {
    const count = selectedRowIds.length;
    if (type === 'export') {
      showToast('Export Initiated', `Exported ledger report for ${count} selected records.`, 'file_download');
    } else if (type === 'reassign') {
      setIsReassignModalOpen(true);
    } else if (type === 'acknowledge') {
      showToast('Batch Acknowledged', `Official formal receipt registered for ${count} grievances.`, 'mark_email_read');
    }
    setSelectedRowIds([]);
  };

  // Inspection Drawer
  const handleInspectRow = (item) => {
    setInspectedCase(item);
    setIsDrawerOpen(true);
  };

  const handleExecuteTriage = ({ targetAction, logReason }) => {
    setIsTriageModalOpen(false);
    showToast('Batch Triage Applied', 'Priority and routing parameters calibrated across docket.', 'done_all');
  };

  const handleConfirmReassign = (targetOfficerName) => {
    setIsReassignModalOpen(false);
    showToast(
      'Docket Reassigned',
      `Transferred to ${targetOfficerName}. Notification dispatched.`,
      'swap_horiz'
    );
  };

  const breadcrumbs = [
    { label: 'Officer Workspace', path: '/officer/dashboard' },
    { label: 'Assigned Grievances' },
  ];

  return (
    <div className="w-full min-h-screen bg-background font-body-md text-body-md text-on-surface antialiased flex flex-col">
      {/* 1. Left Sidebar Navigation for Department Officers */}
      <OfficerSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="assigned-grievances"
      />

      {/* 2. Main Page Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <OfficerHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onTriggerToast={(msg, icon) => showToast('Officer Notice', msg, icon)}
          breadcrumbs={breadcrumbs}
        />

        {/* Content Body */}
        <main className="relative pt-20 px-4 sm:px-space-lg py-space-lg flex-1">
          <div className="flex flex-col w-full pb-16">
            {/* Simulation Control Bar */}
            <AssignedSimulationBar
              simMode={simMode}
              onSetSimMode={handleSetSimMode}
            />

            {/* Header & Quick Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-lg">
              <div className="flex flex-col gap-1 max-w-2xl">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
                    Assigned Grievances
                  </h1>
                  <span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">domain_verification</span>
                    IT Services
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Manage departmental complaints, monitor statutory SLA compliance deadlines, and keep escalated student issues moving decisively toward certified redressal.
                </p>
              </div>

              {/* Actions and Date range pills */}
              <div className="flex flex-wrap items-center gap-space-sm">
                <div className="flex items-center bg-surface-container-low p-1 rounded-lg shadow-xs border border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setDateRange('all')}
                    className={`px-space-sm py-1 rounded-md font-label-md text-label-md transition-all cursor-pointer ${
                      dateRange === 'all'
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    All Time (24)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDateRange('7d');
                      showToast('Filtered Date', 'Showing cases filed within last 7 days.', 'date_range');
                    }}
                    className={`px-space-sm py-1 rounded-md font-label-md text-label-md transition-all cursor-pointer ${
                      dateRange === '7d'
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDateRange('30d');
                      showToast('Filtered Date', 'Showing cases filed within last 30 days.', 'date_range');
                    }}
                    className={`px-space-sm py-1 rounded-md font-label-md text-label-md transition-all cursor-pointer ${
                      dateRange === '30d'
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Last 30 Days
                  </button>
                </div>

                {/* Export Dropdown */}
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                    className="px-space-md py-2 bg-surface-container-lowest text-primary rounded-lg font-label-lg text-label-lg shadow-xs hover:bg-surface-container-high transition-colors flex items-center gap-1.5 border border-outline-variant/30 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">file_download</span>
                    <span>Export Ledger</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                  </button>

                  {isExportMenuOpen && (
                    <div
                      className="absolute right-0 mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-xl z-30 p-1.5 border border-outline-variant/30 animate-fadeIn"
                      onClick={() => setIsExportMenuOpen(false)}
                    >
                      <button
                        type="button"
                        onClick={() => showToast('Export CSV', 'CSV spreadsheet file downloaded.', 'table_view')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-secondary text-[18px]">table_view</span>
                        CSV Spreadsheet
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('Export PDF', 'Official PDF ledger generated.', 'picture_as_pdf')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-error text-[18px]">picture_as_pdf</span>
                        Official PDF Ledger
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast('Print Summary', 'Printing summary document...', 'print')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-outline text-[18px]">print</span>
                        Print Summary
                      </button>
                    </div>
                  )}
                </div>

                {/* Batch Triage Modal Button */}
                <button
                  type="button"
                  onClick={() => setIsTriageModalOpen(true)}
                  className="px-space-md py-2 bg-primary-container text-on-primary rounded-lg font-label-lg text-label-lg font-bold shadow-sm hover:bg-primary transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_task</span>
                  <span>+ Batch Triage</span>
                </button>
              </div>
            </div>

            {/* 4 Interactive KPI Metric Cards */}
            <AssignedKpiGrid
              activeFilter={statusFilter}
              onSelectFilter={(kpiStatus) => {
                setStatusFilter(kpiStatus);
                showToast('Filter Applied', `Filtered table view by status: ${kpiStatus}`, 'filter_alt');
              }}
            />

            {/* Institutional Deadline Radar Banner */}
            <DeadlineRadarBanner
              onFilterOverdue={() => {
                setStatusFilter('Overdue');
                showToast('Filter Applied', 'Showing 3 overdue statutory grievances', 'priority_high');
              }}
              onSearchDocket={(ticket) => {
                setSearchQuery(ticket);
                showToast('Docket Found', `Isolated docket ${ticket}`, 'search');
              }}
            />

            {/* Comprehensive Filter & Search Toolbar */}
            <AssignedToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              sortOption={sortOption}
              onSortChange={setSortOption}
              onResetFilters={resetAllFilters}
            />

            {/* Bulk Action Floating Bar */}
            <BulkActionBar
              selectedCount={selectedRowIds.length}
              onExportSelected={() => handleBulkAction('export')}
              onReassignSelected={() => handleBulkAction('reassign')}
              onAcknowledgeSelected={() => handleBulkAction('acknowledge')}
              onClearSelection={() => setSelectedRowIds([])}
            />

            {/* Main Content Layout (Table + Quick Slide Panel) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Grievances Table Wrapper */}
              <div
                className={`transition-all duration-300 flex flex-col ${
                  isDrawerOpen && inspectedCase
                    ? 'lg:col-span-8 xl:col-span-8'
                    : 'lg:col-span-12 xl:col-span-12'
                }`}
              >
                {/* 1. Skeleton Loader View */}
                {simMode === 'skeleton' ? (
                  <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-xs flex flex-col gap-4 animate-pulse border border-outline-variant/30">
                    <div className="h-8 bg-surface-container rounded-lg w-full"></div>
                    <div className="h-12 bg-surface-container-low rounded-lg w-full"></div>
                    <div className="h-12 bg-surface-container-low rounded-lg w-full"></div>
                    <div className="h-12 bg-surface-container-low rounded-lg w-full"></div>
                    <div className="h-12 bg-surface-container-low rounded-lg w-full"></div>
                    <div className="h-12 bg-surface-container-low rounded-lg w-full"></div>
                  </div>
                ) : filteredGrievances.length === 0 ? (
                  /* 2. Zero Results Empty State View */
                  <div className="py-16 px-space-lg bg-surface-container-lowest rounded-xl shadow-xs flex flex-col items-center justify-center text-center border border-outline-variant/30">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-space-md">
                      <span className="material-symbols-outlined text-[36px]">folder_off</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
                      No Matching Grievances Found
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mb-space-md">
                      There are no grievances in your docket matching the specified filter criteria or search keyword.
                    </p>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="px-space-md py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold shadow-xs hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      Reset Filters &amp; Reload
                    </button>
                  </div>
                ) : (
                  /* 3. Active Grievances Table */
                  <AssignedGrievancesTable
                    items={filteredGrievances}
                    selectedRowIds={selectedRowIds}
                    onToggleSelectRow={handleToggleSelectRow}
                    onToggleSelectAll={handleToggleSelectAll}
                    onInspectRow={handleInspectRow}
                    activeInspectedId={isDrawerOpen && inspectedCase ? inspectedCase.id : null}
                    onTriggerToast={(msg, icon) => showToast('Action', msg, icon)}
                  />
                )}
              </div>

              {/* Case Quick-Preview Side Sheet / Desktop Drawer */}
              {isDrawerOpen && inspectedCase && simMode !== 'skeleton' && filteredGrievances.length > 0 && (
                <QuickCaseInspectorDrawer
                  caseItem={inspectedCase}
                  onClose={() => setIsDrawerOpen(false)}
                  onTriggerToast={(msg, icon) => showToast('Action', msg, icon)}
                  onOpenReassign={(item) => {
                    setReassignTargetItem(item);
                    setIsReassignModalOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Batch Triage Modal */}
      <BatchTriageModal
        isOpen={isTriageModalOpen}
        onClose={() => setIsTriageModalOpen(false)}
        onExecute={handleExecuteTriage}
      />

      {/* Reassign Modal */}
      <ReassignModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        onConfirm={handleConfirmReassign}
      />

      {/* Toast Notification Simulation */}
      <div
        className={`fixed bottom-6 right-6 bg-surface-container-lowest text-on-surface px-4 py-3 rounded-xl shadow-xl border-l-4 border-secondary z-50 transition-all duration-300 flex items-center gap-3 border border-outline-variant/30 ${
          toast.visible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-secondary" text-primary-fixed>
          {toast.icon}
        </span>
        <div className="flex flex-col">
          <span className="font-label-md text-label-md font-bold">{toast.title}</span>
          <span className="font-label-sm text-label-sm text-outline">{toast.message}</span>
        </div>
      </div>
    </div>
  );
}
