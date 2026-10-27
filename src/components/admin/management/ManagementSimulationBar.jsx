import React from 'react';

export default function ManagementSimulationBar({
  activeTab,
  onSelectTab,
  onOpenAddUser,
  onOpenDrawerWithSample,
}) {
  return (
    <div className="mb-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-sm rounded-xl border border-outline-variant/20">
      <div className="flex items-center gap-space-sm overflow-x-auto pb-1 md:pb-0 scrollbar-none text-nowrap">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline flex items-center gap-1 font-bold">
          <span className="material-symbols-outlined text-[15px]">terminal</span> Simulation
        </span>

        {/* All Users View */}
        <button
          onClick={() => onSelectTab('users')}
          className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer font-semibold ${
            activeTab === 'users'
              ? 'bg-primary-container text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
          }`}
        >
          All Users View (Active)
        </button>

        {/* Officer Approvals Pending */}
        <button
          onClick={() => onSelectTab('officers')}
          className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer font-semibold ${
            activeTab === 'officers'
              ? 'bg-primary-container text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
          }`}
        >
          Officer Approvals Pending (16)
        </button>

        {/* Departments & Hierarchy */}
        <button
          onClick={() => onSelectTab('departments')}
          className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all cursor-pointer font-semibold ${
            activeTab === 'departments'
              ? 'bg-primary-container text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
          }`}
        >
          Departments &amp; Hierarchy
        </button>

        {/* Add User Modal Preview */}
        <button
          onClick={onOpenAddUser}
          className="px-3 py-1 rounded-full font-label-sm text-label-sm transition-all bg-surface-container-lowest text-on-surface hover:bg-surface-container-high flex items-center gap-1 cursor-pointer font-semibold"
        >
          <span className="material-symbols-outlined text-[14px]">person_add</span> Add User Modal Preview
        </button>

        {/* User Profile Drawer Preview */}
        <button
          onClick={onOpenDrawerWithSample}
          className="px-3 py-1 rounded-full font-label-sm text-label-sm transition-all bg-surface-container-lowest text-on-surface hover:bg-surface-container-high flex items-center gap-1 cursor-pointer font-semibold"
        >
          <span className="material-symbols-outlined text-[14px]">dock_to_left</span> User Profile Drawer (Open)
        </button>
      </div>

      <div className="flex items-center gap-2 text-outline font-label-sm text-label-sm shrink-0 self-end md:self-auto font-medium">
        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
        <span>UGC Compliance Tier: Redressal v2.4</span>
      </div>
    </div>
  );
}
