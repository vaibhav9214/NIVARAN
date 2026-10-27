import React from 'react';

export default function ManagementTabBar({
  activeTab,
  onTabChange,
  usersCount = 2486,
  pendingOfficersCount = 16,
  activeDeptsCount = 5,
}) {
  return (
    <div className="flex items-center gap-1 bg-surface-container-low p-1.5 rounded-xl mb-space-lg w-full overflow-x-auto border border-outline-variant/20 scrollbar-none">
      {/* Tab 1: Users Registry */}
      <button
        onClick={() => onTabChange('users')}
        className={`px-5 py-2.5 rounded-lg font-label-lg text-label-lg flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === 'users'
            ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">group</span>
        <span>Users Registry</span>
        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
          {usersCount.toLocaleString()}
        </span>
      </button>

      {/* Tab 2: Officers Desk */}
      <button
        onClick={() => onTabChange('officers')}
        className={`px-5 py-2.5 rounded-lg font-label-lg text-label-lg flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === 'officers'
            ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">badge</span>
        <span>Officers Desk</span>
        <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
          {pendingOfficersCount} Pending
        </span>
      </button>

      {/* Tab 3: Departments Hierarchy */}
      <button
        onClick={() => onTabChange('departments')}
        className={`px-5 py-2.5 rounded-lg font-label-lg text-label-lg flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === 'departments'
            ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">apartment</span>
        <span>Departments Hierarchy</span>
        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold">
          {activeDeptsCount} Active
        </span>
      </button>

      {/* Tab 4: Roles & Governance Matrix */}
      <button
        onClick={() => onTabChange('roles')}
        className={`px-5 py-2.5 rounded-lg font-label-lg text-label-lg flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === 'roles'
            ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">policy</span>
        <span>Roles &amp; Governance Matrix</span>
      </button>
    </div>
  );
}
