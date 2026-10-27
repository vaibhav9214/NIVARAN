import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function StudentHeader({ onToggleSidebar, onSearch, searchQuery = '', breadcrumb = 'Dashboard' }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md z-30 border-b border-outline-variant/30 px-4 sm:px-space-lg flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all">
      
      {/* Left side: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-space-md">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-on-surface-variant font-label-md text-label-md">
          <span className="material-symbols-outlined text-[16px]">home</span>
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-outline-variant">/</span>
          {breadcrumb === 'Dashboard' ? (
            <span className="text-primary font-semibold">Dashboard</span>
          ) : breadcrumb.startsWith('GRV-') || breadcrumb.startsWith('NIV-') ? (
            <>
              <Link to="/student/my-grievances" className="hover:text-primary transition-colors">My Grievances</Link>
              <span className="text-outline-variant">/</span>
              <span className="text-primary-container font-semibold font-mono">#{breadcrumb.replace('#', '')}</span>
            </>
          ) : (
            <>
              <Link to="/student/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <span className="text-outline-variant">/</span>
              <span className="text-primary-container font-semibold">{breadcrumb}</span>
            </>
          )}
        </div>

        <div className="h-4 w-px bg-outline-variant/50 hidden md:block"></div>

        {/* Search Input */}
        <div className="relative hidden sm:flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            placeholder="Search your grievances..."
            className="w-56 md:w-72 pl-9 pr-space-md py-1.5 bg-surface-container-low border border-outline-variant/40 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-secondary-container transition-all"
          />
        </div>
      </div>

      {/* Right side: Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-space-md">
        {/* Notification Button */}
        <button
          onClick={() => alert('Notifications: 3 unread updates from Proctorial and Dean offices.')}
          className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
          title="3 Unread Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest animate-pulse"></span>
        </button>

        <div className="h-6 w-px bg-outline-variant/40"></div>

        {/* User Profile Pill */}
        <div
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="relative flex items-center gap-space-sm cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ring-2 ring-primary/10">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>

          <div className="hidden md:flex flex-col items-start leading-none">
            <div className="flex items-center gap-1.5">
              <span className="font-label-lg text-label-lg text-on-surface group-hover:text-primary transition-colors">
                Aditya Verma
              </span>
              <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-1.5 py-0.5 rounded-full font-medium">
                Scholar
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">
              IIT Delhi
            </span>
          </div>

          <span className="material-symbols-outlined text-outline text-[18px] group-hover:text-on-surface transition-colors">
            expand_more
          </span>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-11 w-52 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <p className="font-label-md font-bold text-on-surface">Aditya Verma</p>
                <p className="font-body-sm text-xs text-outline font-mono">#IITD-2023-CS042</p>
              </div>
              <a
                href="#profile"
                className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">account_circle</span>
                Student Profile
              </a>
              <Link
                to="/student/raise-grievance"
                className="flex items-center gap-2 px-4 py-2 text-xs text-primary hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">post_add</span>
                Raise a Grievance
              </Link>
              <Link
                to="/officer/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-xs text-secondary hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">shield_person</span>
                Officer Desk Portal
              </Link>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-xs text-primary hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
                Admin Portal
              </Link>
              <div className="border-t border-outline-variant/20 mt-1 pt-1">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-error hover:bg-error-container hover:text-on-error-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Sign Out to Landing
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
}
