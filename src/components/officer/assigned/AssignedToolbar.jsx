import React from 'react';

export default function AssignedToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  sortOption,
  onSortChange,
  onResetFilters,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-md mb-space-md flex flex-col gap-space-md border border-outline-variant/30">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm">
        {/* Search Input */}
        <div className="md:col-span-4 relative flex items-center">
          <span className="material-symbols-outlined text-outline absolute left-3 text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-container-low pl-10 pr-space-md py-2 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:shadow-[inset_0_0_0_2px_#07583f] transition-all border border-outline-variant/20"
            placeholder="Search ticket ID, title, keyword, or student..."
            type="text"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg font-label-md text-label-md text-on-surface outline-none cursor-pointer focus:shadow-[inset_0_0_0_2px_#07583f] border border-outline-variant/20"
          >
            <option value="all">All Statuses (24)</option>
            <option value="Awaiting Review">Awaiting Review (8)</option>
            <option value="In Progress">In Progress (11)</option>
            <option value="Overdue">Overdue (3)</option>
            <option value="Student Action">Awaiting Student Response (2)</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="md:col-span-2">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg font-label-md text-label-md text-on-surface outline-none cursor-pointer focus:shadow-[inset_0_0_0_2px_#07583f] border border-outline-variant/20"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority (4)</option>
            <option value="Medium">Medium Priority (14)</option>
            <option value="Low">Low Priority (6)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg font-label-md text-label-md text-on-surface outline-none cursor-pointer focus:shadow-[inset_0_0_0_2px_#07583f] border border-outline-variant/20"
          >
            <option value="all">All Categories</option>
            <option value="IT & Technical">IT &amp; Technical Support (18)</option>
            <option value="Facilities">Infrastructure &amp; Facilities (6)</option>
            <option value="Academic">Academic Redressal</option>
            <option value="Administration">General Administration</option>
          </select>
        </div>

        {/* Sort Selection */}
        <div className="md:col-span-2">
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg font-label-md text-label-md text-on-surface outline-none cursor-pointer focus:shadow-[inset_0_0_0_2px_#07583f] border border-outline-variant/20"
          >
            <option value="deadline">Sort: Deadline (Nearest)</option>
            <option value="submitted">Sort: Submitted (Newest)</option>
            <option value="priority">Sort: Priority (Highest)</option>
            <option value="activity">Sort: Last Activity</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2 border-t border-surface-container-high">
        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mr-1">
            Active Filters:
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
            <span>Dept: IT Services</span>
            <span className="material-symbols-outlined text-[14px] text-outline">verified</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
            <span>Status: {statusFilter === 'all' ? 'All (Active)' : statusFilter}</span>
          </span>

          {priorityFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
              <span>Priority: {priorityFilter}</span>
            </span>
          )}

          {categoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
              <span>Category: {categoryFilter}</span>
            </span>
          )}

          {(statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={onResetFilters}
              className="font-label-sm text-label-sm text-secondary hover:underline ml-2 cursor-pointer font-bold"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="font-label-sm text-label-sm text-outline flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
          <span>Redressal Regulation 14(b) Compliant</span>
        </div>
      </div>
    </div>
  );
}
