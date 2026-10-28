import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function OfficerSidebar({ isMobileOpen, onCloseMobile, activeNav = 'overview' }) {
  const location = useLocation();
  const { user } = useAuth();

  const officerName = user?.name || 'Grievance Officer';
  const departmentName = user?.department?.name || (typeof user?.department === 'string' ? user.department : 'Grievance Department');
  const initials = officerName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'GO';

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard', path: '/officer/dashboard' },
    { id: 'assigned-grievances', label: 'Assigned Grievances', icon: 'assignment', badge: 'Active', badgeColor: 'bg-surface-container text-primary font-bold', path: '/officer/assigned-grievances' },
    { id: 'review-queue', label: 'Review Queue', icon: 'rate_review', badge: 'Triage', badgeColor: 'bg-surface-container text-primary font-bold', path: '/officer/dashboard#queue' },
    { id: 'resolved-cases', label: 'Resolved Cases', icon: 'task_alt', path: '/officer/dashboard#resolved' },
    { id: 'reports-and-insights', label: 'Reports & Insights', icon: 'analytics', path: '/officer/dashboard#reports' },
  ];

  const secondaryNav = [
    { id: 'logout', label: 'Platform Home', icon: 'home', path: '/' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-outline-variant/30 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-space-lg flex items-center justify-between border-b border-outline-variant/30">
            <Link to="/officer/dashboard" className="flex items-center gap-space-sm group">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">spa</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-extrabold leading-none">
                  NIVARAN
                </span>
                <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase mt-1">
                  OFFICER DESK
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Main Navigation */}
          <div className="px-space-md py-space-sm">
            <nav className="flex flex-col gap-space-xs">
              {navItems.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-colors ${
                      isActive
                        ? 'bg-surface-container text-primary font-bold shadow-[inset_3px_0_0_0_#003f2b]'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span className="font-label-lg text-label-lg">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-space-xs py-0.5 rounded-full font-label-sm text-label-sm ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-space-sm p-space-md border-t border-outline-variant/30">
          <nav className="flex flex-col gap-space-xs">
            {secondaryNav.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={onCloseMobile}
                className="flex items-center gap-space-sm px-space-md py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Officer Persona Card */}
          <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center gap-space-sm border border-outline-variant/20">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-label-md text-label-md text-on-primary font-bold">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-md text-label-md text-on-surface truncate font-bold">
                {officerName}
              </span>
              <span className="font-label-sm text-label-sm text-outline truncate">
                {departmentName} • Active
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
