import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar({ isMobileOpen, onCloseMobile, activeNav = 'overview' }) {
  const location = useLocation();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard', path: '/admin/dashboard' },
    { id: 'grievance-analytics', label: 'Grievance Analytics', icon: 'insights', path: '/admin/dashboard#analytics' },
    { id: 'grievance-oversight', label: 'Grievance Oversight', icon: 'policy', path: '/admin/dashboard#oversight' },
    { id: 'transparency-and-audit', label: 'Transparency & Audit', icon: 'verified_user', path: '/admin/dashboard#transparency' },
    { id: 'department-management', label: 'Department Management', icon: 'apartment', path: '/admin/user-department-management?tab=departments' },
    { id: 'user-management', label: 'User Management', icon: 'group', path: '/admin/user-department-management?tab=users' },
    { id: 'officer-management', label: 'Officer Management', icon: 'badge', path: '/admin/user-department-management?tab=officers' },
    { id: 'reports-and-exports', label: 'Reports & Exports', icon: 'query_stats', path: '/admin/dashboard#reports' },
    { id: 'system-settings', label: 'System Settings', icon: 'tune', path: '/admin/dashboard#settings' },
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
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none border-r border-outline-variant/30 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className="h-16 px-gutter flex items-center justify-between bg-surface-container-lowest border-b border-outline-variant/20">
            <Link to="/admin/dashboard" className="flex items-center gap-space-sm group">
              <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">spa</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-extrabold leading-none">
                    NIVARAN
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider font-bold text-[10px]">
                    AI
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant truncate mt-0.5">
                  Administration Desk
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-space-md py-space-sm">
            <div className="px-space-md pt-space-sm pb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
              Operational Oversight
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-space-md px-space-md py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-lg text-label-lg'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="font-label-lg text-label-lg">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Administrator Profile Card */}
        <div className="p-space-md bg-surface-container-lowest m-space-sm rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 font-bold font-label-lg text-label-lg">
              RV
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-label-lg text-label-lg text-on-surface truncate font-bold leading-tight">
                Rahul Verma
              </div>
              <div className="font-label-sm text-label-sm text-secondary truncate font-semibold leading-tight">
                Institution Administrator
              </div>
              <div className="font-label-sm text-label-sm text-outline truncate text-[11px] leading-tight mt-0.5">
                Example Institute of Technology
              </div>
            </div>
            <Link
              to="/"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
              title="Return to Home"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
