import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import DocketModal from '../../components/stitch/DocketModal';
import SimulationHarness from '../../components/student/my-grievances/SimulationHarness';
import MetricsGrid from '../../components/student/my-grievances/MetricsGrid';
import FilterToolbar from '../../components/student/my-grievances/FilterToolbar';
import GrievanceLedgerTable from '../../components/student/my-grievances/GrievanceLedgerTable';
import FilterEmptyState from '../../components/student/my-grievances/FilterEmptyState';
import ScholarZeroState from '../../components/student/my-grievances/ScholarZeroState';
import LoadingSkeleton from '../../components/student/my-grievances/LoadingSkeleton';
import ExportModal from '../../components/student/my-grievances/ExportModal';
import { GRIEVANCE_RECORDS } from '../../components/student/my-grievances/grievanceData';

export default function MyGrievancesPage() {
  const navigate = useNavigate();

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Simulation harness state: 'active' | 'filter-empty' | 'scholar-zero' | 'loading'
  const [simState, setSimState] = useState('active');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Visible table columns
  const [visibleColumns, setVisibleColumns] = useState({
    ticketId: true,
    title: true,
    category: true,
    submitted: true,
    lastUpdated: true,
    status: true,
    statutorySla: true,
    action: true,
  });

  // Modals
  const [selectedDocket, setSelectedDocket] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toggle column helper
  const handleToggleColumn = (colKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [colKey]: !prev[colKey],
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setPriorityFilter('ALL');
    setDateRangeFilter('ALL');
    setSortBy('NEWEST');
    if (simState !== 'active') {
      setSimState('active');
    }
  };

  // Clear single filter chip
  const handleClearSingleFilter = (type) => {
    if (type === 'status') setStatusFilter('ALL');
    if (type === 'category') setCategoryFilter('ALL');
    if (type === 'priority') setPriorityFilter('ALL');
  };

  // Filter & sort logic
  const filteredRecords = useMemo(() => {
    if (simState === 'filter-empty') return [];
    if (simState === 'scholar-zero') return [];

    let result = [...GRIEVANCE_RECORDS];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.ticketId.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.scope.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.committee.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((item) => {
        if (statusFilter === 'In Review') {
          return item.status === 'In Review';
        }
        return item.status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      result = result.filter(
        (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      result = result.filter(
        (item) => item.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    // Date range filter
    if (dateRangeFilter === '7D') {
      const cutoff = new Date('2026-10-18');
      result = result.filter((item) => item.submittedDate >= cutoff);
    } else if (dateRangeFilter === '30D') {
      const cutoff = new Date('2026-09-25');
      result = result.filter((item) => item.submittedDate >= cutoff);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'NEWEST') return b.submittedDate - a.submittedDate;
      if (sortBy === 'OLDEST') return a.submittedDate - b.submittedDate;
      if (sortBy === 'UPDATED') return b.updatedDate - a.updatedDate;
      if (sortBy === 'DEADLINE') {
        const aVal = a.slaType === 'progress' ? a.slaProgress : 50;
        const bVal = b.slaType === 'progress' ? b.slaProgress : 50;
        return bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [searchQuery, statusFilter, categoryFilter, priorityFilter, dateRangeFilter, sortBy, simState]);

  // Navigate to Grievance Details page
  const handleViewDocket = (item) => {
    navigate(`/student/grievance-details/${item.id}`);
  };

  return (
    <div className="w-full min-h-screen bg-surface font-sans text-body-md text-on-surface antialiased flex">
      {/* 1. Left Sidebar Navigation */}
      <StudentSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="my-grievances"
        onNavChange={(id) => {
          if (id === 'dashboard') navigate('/student/dashboard');
          if (id === 'submit-grievance') navigate('/student/raise-grievance');
        }}
      />

      {/* 2. Main Content Canvas (offset by sidebar on desktop) */}
      <div className="flex-1 w-full lg:pl-[260px] flex flex-col min-h-screen">
        {/* Top Header */}
        <StudentHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          breadcrumb="My Grievances"
        />

        {/* Main Body */}
        <main className="pt-16 min-h-screen bg-surface flex flex-col w-full pb-16">
          {/* Top Simulation Harness Ribbon */}
          <SimulationHarness
            simState={simState}
            onSelectState={(state) => setSimState(state)}
          />

          <div className="px-4 sm:px-8 pt-6 pb-4">
            {/* Page Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">
                    My Grievances
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Live Portal
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Track every submission and stay informed about its progress in compliance with UGC statutory norms.
                </p>
                <p className="font-label-md text-label-md text-outline pt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  <span>
                    Showing <strong className="text-on-surface font-semibold">12 total grievances</strong> associated with scholar identity{' '}
                    <span className="font-mono text-primary font-bold">#IITD-2023-CS042</span> • Real-time statutory ledger
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold shadow-sm hover:bg-surface-container-low transition-all border border-outline-variant/30 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Export Summary</span>
                </button>
                <Link
                  to="/student/raise-grievance"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary transition-all transform active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span>+ Submit New Grievance</span>
                </Link>
              </div>
            </div>

            {/* Summary Metrics Grid */}
            <MetricsGrid
              activeFilter={statusFilter}
              onSelectFilter={(filterVal) => {
                setStatusFilter(filterVal);
                if (simState !== 'active') setSimState('active');
              }}
            />

            {/* Filter & Sort Control Toolbar */}
            <FilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              dateRangeFilter={dateRangeFilter}
              onDateRangeChange={setDateRangeFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
              onClearSingleFilter={handleClearSingleFilter}
              matchingCount={filteredRecords.length}
              visibleColumns={visibleColumns}
              onToggleColumn={handleToggleColumn}
            />

            {/* Main Content Area based on Sim State */}
            {simState === 'loading' ? (
              <LoadingSkeleton />
            ) : simState === 'scholar-zero' ? (
              <ScholarZeroState />
            ) : filteredRecords.length === 0 ? (
              <FilterEmptyState onResetFilters={handleResetFilters} />
            ) : (
              <GrievanceLedgerTable
                records={filteredRecords}
                totalRecordsCount={GRIEVANCE_RECORDS.length}
                onViewDocket={handleViewDocket}
                visibleColumns={visibleColumns}
              />
            )}
          </div>
        </main>
      </div>

      {/* Docket Inspection Modal */}
      <DocketModal
        docket={selectedDocket}
        onClose={() => setSelectedDocket(null)}
      />

      {/* Export Summary Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        totalRecords={GRIEVANCE_RECORDS.length}
      />
    </div>
  );
}
