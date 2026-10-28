import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({
  onToggleSidebar,
  searchQuery = '',
  onSearchChange,
  onTriggerToast,
  breadcrumb = 'Overview',
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminName = user?.name || 'System Administrator';
  const adminEmail = user?.email || 'admin@nivaran.edu';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-4 sm:px-gutter flex items-center justify-between gap-space-md border-b border-outline-variant/30 transition-all">
      {/* Left: Mobile hamburger + breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-space-md min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
          aria-label="Toggle Navigation"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <nav className="flex items-center gap-1.5 font-label-md text-label-md">
          <span className="text-on-surface-variant">Administration</span>
          <span className="text-outline">/</span>
          <span className="text-primary font-semibold truncate max-w-[200px] sm:max-w-none">{breadcrumb}</span>
        </nav>

        <div className="h-4 w-px bg-surface-container-highest hidden sm:block"></div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="truncate max-w-[280px]">
            NIVARAN • Central Administration
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md shrink-0">
        {/* Search Input */}
        <div className="relative hidden md:block w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-outline-variant/30"
            placeholder="Search grievances, users, or departments... (⌘K)"
            type="text"
          />
        </div>

        {/* Admin User Profile Pill */}
        <div className="relative">
          <div
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-outline-variant/30 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold leading-tight">
                {adminName}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px] leading-tight">
                Administrator
              </span>
            </div>
          </div>

          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container-lowest shadow-xl py-2 z-50 border border-outline-variant/30 animate-fadeIn"
              onClick={() => setProfileDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <div className="font-label-md text-label-md font-bold text-on-surface">{adminName}</div>
                <div className="font-label-sm text-label-sm text-outline text-[11px] truncate">{adminEmail}</div>
              </div>
              <Link
                to="/admin/user-department-management"
                className="w-full text-left px-4 py-2 text-on-surface hover:bg-surface-container flex items-center gap-2 font-label-md text-label-md transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-outline">group</span>
                User &amp; Dept Management
              </Link>
              <Link
                to="/admin/grievances-master"
                className="w-full text-left px-4 py-2 text-on-surface hover:bg-surface-container flex items-center gap-2 font-label-md text-label-md transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-outline">table_rows</span>
                Master Queue
              </Link>
              <div className="border-t border-outline-variant/20 my-1"></div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-error hover:bg-error-container/20 flex items-center gap-2 font-label-md text-label-md transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-error">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
