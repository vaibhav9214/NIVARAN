import React, { useState } from 'react';

export default function FilterToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  dateRangeFilter,
  onDateRangeChange,
  sortBy,
  onSortChange,
  onResetFilters,
  onClearSingleFilter,
  matchingCount,
  visibleColumns,
  onToggleColumn,
}) {
  const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);

  const sortLabelMap = {
    NEWEST: 'Newest First',
    OLDEST: 'Oldest First',
    UPDATED: 'Recently Updated',
    DEADLINE: 'Nearest SLA Deadline',
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-4 mb-6 border border-outline-variant/20">
      {/* Top Row: Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xl">
          <span className="material-symbols-outlined text-outline absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ticket ID (e.g. #NIV-1024), keywords, or department..."
            className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-lg pl-10 pr-9 py-2 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md font-semibold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">restart_alt</span>
            <span>Clear Filters</span>
          </button>

          {/* Columns Toggle */}
          <div className="relative">
            <button
              onClick={() => setColumnsDropdownOpen(!columnsDropdownOpen)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">tune</span>
              <span>Columns</span>
            </button>

            {columnsDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg p-3 z-30 space-y-2">
                <span className="font-label-sm text-label-sm font-bold text-outline uppercase tracking-wider block mb-1">
                  Toggle Columns
                </span>
                {Object.keys(visibleColumns).map((colKey) => (
                  <label
                    key={colKey}
                    className="flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer select-none py-1 hover:text-primary"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => onToggleColumn(colKey)}
                      className="rounded border-outline-variant text-primary focus:ring-primary-container"
                    />
                    <span className="capitalize">{colKey.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Row: Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
        {/* Status Filter */}
        <div className="flex flex-col space-y-1">
          <label className="font-label-sm text-label-sm uppercase font-bold text-outline">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-container transition-all cursor-pointer"
          >
            <option value="ALL">All Statuses (12)</option>
            <option value="Filed">Filed (1)</option>
            <option value="Assigned">Assigned (1)</option>
            <option value="In Review">In Review (2)</option>
            <option value="Resolved">Resolved (2)</option>
            <option value="Closed">Closed (1)</option>
            <option value="Escalated">Escalated (1)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col space-y-1">
          <label className="font-label-sm text-label-sm uppercase font-bold text-outline">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-container transition-all cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Hostel">Hostel</option>
            <option value="Mess and Food">Mess &amp; Dining</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Fees and Finance">Fees &amp; Scholarships</option>
            <option value="Academics">Academics</option>
            <option value="Administration">Administration</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-col space-y-1">
          <label className="font-label-sm text-label-sm uppercase font-bold text-outline">
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-container transition-all cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent / Red Alert</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col space-y-1">
          <label className="font-label-sm text-label-sm uppercase font-bold text-outline">
            Date Range
          </label>
          <select
            value={dateRangeFilter}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-container transition-all cursor-pointer"
          >
            <option value="ALL">All Time</option>
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="SEM">Autumn Semester 2026</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex flex-col space-y-1 col-span-2 sm:col-span-1">
          <label className="font-label-sm text-label-sm uppercase font-bold text-outline">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-surface-container-low text-on-surface font-label-md text-label-md rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-container transition-all cursor-pointer"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="UPDATED">Recently Updated</option>
            <option value="DEADLINE">Nearest SLA Deadline</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags Ribbon */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-container-high/40">
        <span className="font-label-sm text-label-sm font-semibold text-outline uppercase tracking-wider">
          Active Filters:
        </span>

        {/* Status chip */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
          <span>
            Status: <strong className="text-primary">{statusFilter === 'ALL' ? 'All' : statusFilter}</strong>
          </span>
          {statusFilter !== 'ALL' && (
            <button
              onClick={() => onClearSingleFilter('status')}
              className="hover:text-error transition-colors cursor-pointer"
              title="Remove status filter"
            >
              <span className="material-symbols-outlined text-[14px]">cancel</span>
            </button>
          )}
        </span>

        {/* Category chip */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
          <span>
            Category:{' '}
            <strong className="text-primary">
              {categoryFilter === 'ALL' ? 'All' : categoryFilter}
            </strong>
          </span>
          {categoryFilter !== 'ALL' && (
            <button
              onClick={() => onClearSingleFilter('category')}
              className="hover:text-error transition-colors cursor-pointer"
              title="Remove category filter"
            >
              <span className="material-symbols-outlined text-[14px]">cancel</span>
            </button>
          )}
        </span>

        {/* Priority chip */}
        {priorityFilter !== 'ALL' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
            <span>
              Priority: <strong className="text-primary">{priorityFilter}</strong>
            </span>
            <button
              onClick={() => onClearSingleFilter('priority')}
              className="hover:text-error transition-colors cursor-pointer"
              title="Remove priority filter"
            >
              <span className="material-symbols-outlined text-[14px]">cancel</span>
            </button>
          </span>
        )}

        {/* Order chip */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
          <span>
            Order: <strong className="text-primary">{sortLabelMap[sortBy] || 'Newest First'}</strong>
          </span>
        </span>

        {/* Records match badge */}
        <span className="ml-auto font-label-sm text-label-sm text-outline">
          Showing {matchingCount} matching {matchingCount === 1 ? 'record' : 'records'}
        </span>
      </div>
    </div>
  );
}
