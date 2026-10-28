import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function OfficerHeader({
  onToggleSidebar,
  searchQuery = '',
  onSearchChange,
  onTriggerToast,
  breadcrumbs,
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-space-lg border-b border-outline-variant/30 transition-all">
      {/* Left: Mobile hamburger + breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-space-md min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
          aria-label="Toggle Navigation"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-outline">/</span>}
                {b.path ? (
                  <Link to={b.path} className="truncate text-outline hover:text-primary transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-on-surface font-semibold truncate">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
            <span className="truncate text-outline">Officer Workspace</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-semibold truncate">Overview</span>
          </div>
        )}

        <span className="hidden md:inline-flex items-center px-space-sm py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-primary font-semibold">
          IT Services • Authorized Officer
        </span>
      </div>

      {/* Center: Search input */}
      <div className="hidden lg:flex items-center w-80 px-space-md py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant gap-space-sm focus-within:ring-2 focus-within:ring-primary border border-outline-variant/30">
        <span className="material-symbols-outlined text-[18px] text-outline">search</span>
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="bg-transparent border-0 outline-none w-full font-body-sm text-body-sm text-on-surface placeholder:text-outline"
          placeholder="Search ticket ID or grievance..."
          type="text"
        />
        <kbd className="font-label-sm text-label-sm bg-surface-container-lowest text-outline px-1.5 py-0.5 rounded shadow-sm border border-outline-variant/30">
          ⌘K
        </kbd>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-space-md">
        <button
          onClick={() => onTriggerToast && onTriggerToast('3 critical notifications awaiting triage', 'notifications')}
          className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          type="button"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary font-label-sm text-label-sm text-on-primary flex items-center justify-center font-bold">
            3
          </span>
        </button>

        <div className="relative">
          <div
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-space-sm pl-space-sm border-l border-surface-container-highest cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface leading-tight font-bold">
                Ananya Sharma
              </span>
              <span className="font-label-sm text-label-sm text-outline leading-tight">
                Department Officer
              </span>
            </div>
            <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
          </div>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <p className="text-xs font-bold text-on-surface">Ananya Sharma</p>
                <p className="text-[11px] text-outline">ananya.sharma@iitd.ac.in</p>
              </div>
              <Link
                to="/officer/dashboard"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-outline">badge</span>
                <span>Officer Profile</span>
              </Link>
              <Link
                to="/student/dashboard"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-outline">school</span>
                <span>Switch to Student View</span>
              </Link>
              <Link
                to="/admin/dashboard"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-outline">corporate_fare</span>
                <span>Switch to Admin Desk</span>
              </Link>
              <div className="border-t border-outline-variant/20 mt-1 pt-1">
                <Link
                  to="/"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-error hover:bg-error-container/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Exit to Landing Page</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
