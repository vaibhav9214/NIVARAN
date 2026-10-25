import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function StudentSidebar({ isMobileOpen, onCloseMobile, activeNav = 'dashboard', onNavChange }) {
  const location = useLocation();

  const currentNav = activeNav || (
    location.pathname.includes('raise-grievance')
      ? 'submit-grievance'
      : location.pathname.includes('my-grievances') || location.pathname.includes('grievance-details')
      ? 'my-grievances'
      : 'dashboard'
  );

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view', path: '/student/dashboard' },
    { id: 'submit-grievance', label: 'Submit Grievance', icon: 'post_add', path: '/student/raise-grievance' },
    { id: 'my-grievances', label: 'My Grievances', icon: 'assignment', badge: '12', badgeColor: 'bg-surface-container-lowest text-primary-container border border-outline-variant/40 font-bold', path: '/student/my-grievances' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: '3', badgeColor: 'bg-secondary text-on-secondary font-semibold', path: '#notifications' },
    { id: 'profile-settings', label: 'Profile & Settings', icon: 'settings', path: '#profile' },
  ];

  const assistanceItems = [
    { id: 'help-support', label: 'Help & Support', icon: 'help_center', path: '#help' },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: 'policy', path: '#privacy' },
    { id: 'landing-page', label: 'Exit to Platform Home', icon: 'logout', textClass: 'text-error hover:bg-error-container hover:text-on-error-container', path: '/' },
  ];

  const handleItemClick = (item, e) => {
    if (item.path.startsWith('#')) {
      e.preventDefault();
      if (onNavChange) onNavChange(item.id);
      if (onCloseMobile) onCloseMobile();
    } else {
      if (onCloseMobile) onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-on-surface/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Aside Container */}
      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest z-50 flex flex-col justify-between border-r border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.02)] transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className="h-16 px-space-md flex items-center justify-between border-b border-outline-variant/30">
            <Link to="/" className="flex items-center gap-space-sm group">
              <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm group-hover:bg-primary transition-colors">
                <span className="material-symbols-outlined text-[22px]">spa</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-primary font-bold leading-none">
                  NIVARAN
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase mt-1">
                  Student Redressal
                </span>
              </div>
            </Link>

            {/* Close Button on Mobile */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="px-space-md py-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-space-sm block mb-space-xs">
              Navigation
            </span>
            <nav className="flex flex-col gap-space-xs">
              {mainNavItems.map((item) => {
                const isActive = currentNav === item.id;
                const isRouterLink = item.path.startsWith('/');

                const content = (
                  <>
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span className="font-label-lg text-label-lg">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                );

                const activeClasses = 'bg-surface-container-low text-primary-container font-bold border-l-4 border-primary-container pl-[calc(theme(spacing.space-md)-4px)]';
                const inactiveClasses = 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface';

                if (isRouterLink) {
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => onCloseMobile && onCloseMobile()}
                      className={`flex items-center justify-between px-space-md py-2.5 rounded-lg transition-all duration-150 ${
                        isActive ? activeClasses : inactiveClasses
                      }`}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={(e) => handleItemClick(item, e)}
                    className={`flex items-center justify-between px-space-md py-2.5 rounded-lg transition-all duration-150 ${
                      isActive ? activeClasses : inactiveClasses
                    }`}
                  >
                    {content}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Assistance & Version Footer */}
        <div className="p-space-md border-t border-outline-variant/30 flex flex-col gap-space-xs">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-space-sm mb-space-xs">
            Assistance
          </span>
          <nav className="flex flex-col gap-space-xs">
            {assistanceItems.map((item) => {
              const isRouterLink = item.path.startsWith('/');
              const className = `flex items-center gap-space-sm px-space-md py-2 rounded-lg transition-all duration-150 ${
                item.textClass || 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`;

              if (isRouterLink) {
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => onCloseMobile && onCloseMobile()}
                    className={className}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span className="font-label-lg text-label-lg">{item.label}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={(e) => handleItemClick(item, e)}
                  className={className}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="font-label-lg text-label-lg">{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="mt-space-sm pt-space-sm border-t border-outline-variant/20 flex items-center justify-between text-outline px-space-xs">
            <span className="font-label-sm text-label-sm">NIVARAN v2.4</span>
            <span className="flex items-center gap-1 font-label-sm text-label-sm text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Live
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
