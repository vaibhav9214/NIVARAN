import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LotusLogo from '../common/LotusLogo';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';
import { LogOut, User as UserIcon, Shield, ChevronDown, Bell } from 'lucide-react';

export default function StitchNavbar({ activeTab = 'overview', onTabChange, onOpenLodgeModal, onReplayIntro }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: 'overview', label: 'Overview', href: '#overview' },
   
    { id: 'institutional-intelligence', label: 'Institutional Intelligence', href: '#tracking-section' },
    { id: 'tracking', label: 'Tracking', href: '#tracking-section' },
   
  ];

  const handleNavClick = (item) => {
    if (item.to) {
      navigate(item.to);
      setMobileMenuOpen(false);
      return;
    }
    if (onTabChange) onTabChange(item.id);
    setMobileMenuOpen(false);
    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'officer') return '/officer/dashboard';
    return '/student/dashboard';
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-nivaran-border transition-all">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Group */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <LotusLogo className="w-8 h-8 text-nivaran-forest group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="font-manrope text-xl font-bold tracking-tight text-nivaran-forest leading-none">
                  NIVARAN
                </span>
                <span className="text-[10px] uppercase font-semibold text-nivaran-primary tracking-widest mt-0.5">
                  Civic-Tech Redressal
                </span>
              </div>
            </Link>

            {/* Regulatory Badge */}
            <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-nivaran-paleGreen border border-nivaran-softGreen text-nivaran-forest text-[11px] font-semibold uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-nivaran-primary animate-pulse"></span>
              UGC &amp; Institutional Governance Compliant
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-nivaran-forest bg-nivaran-paleGreen font-bold border border-nivaran-softGreen'
                      : 'text-nivaran-textSecondary hover:text-nivaran-text hover:bg-nivaran-warmCream/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Replay intro animation pill */}
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                title="Replay Brand Experience Intro"
                className="hidden md:inline-flex items-center p-2 rounded-xl text-nivaran-textMuted hover:text-nivaran-forest hover:bg-nivaran-warmCream/60 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">play_circle</span>
              </button>
            )}

            {isAuthenticated ? (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 pr-2.5 rounded-xl bg-nivaran-paleGreen hover:bg-nivaran-softGreen border border-nivaran-softGreen text-nivaran-forest transition-all cursor-pointer"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                      {user?.name || 'Account'}
                    </span>
                    <span className="text-[10px] font-semibold text-nivaran-primary uppercase tracking-wider">
                      {role}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-nivaran-primary" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-nivaran-border py-2 z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-nivaran-border/60">
                      <p className="text-xs font-bold text-nivaran-text truncate">{user?.name}</p>
                      <p className="text-[11px] text-nivaran-textMuted truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-nivaran-forest hover:bg-nivaran-paleGreen transition-colors"
                    >
                      <Shield className="w-4 h-4 text-nivaran-primary" />
                      <span>Open {role?.toUpperCase()} Dashboard</span>
                    </Link>

                    {role === 'student' && (
                      <>
                        <Link
                          to="/student/raise-grievance"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-nivaran-text hover:bg-nivaran-warmCream/60 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base text-nivaran-primary">add_circle</span>
                          <span>Lodge Grievance</span>
                        </Link>
                        <Link
                          to="/student/my-grievances"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-nivaran-text hover:bg-nivaran-warmCream/60 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base text-nivaran-primary">list_alt</span>
                          <span>My Grievance Ledger</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-nivaran-border/60 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-nivaran-error hover:bg-nivaran-errorBg transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Actions */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-nivaran-forest hover:bg-nivaran-warmCream/60 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-nivaran-primary hover:bg-nivaran-forest text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-nivaran-textSecondary hover:text-nivaran-forest hover:bg-nivaran-warmCream/60 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-nivaran-border px-6 py-4 shadow-lg animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-1 mb-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="px-3 py-2 text-left rounded-xl text-xs font-semibold text-nivaran-text hover:bg-nivaran-paleGreen transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-nivaran-border flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-nivaran-primary text-white text-center shadow-xs"
                  >
                    Open {role?.toUpperCase()} Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-nivaran-error bg-nivaran-errorBg text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-nivaran-primary text-white text-center shadow-xs cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-nivaran-forest bg-nivaran-paleGreen text-center cursor-pointer"
                  >
                    Citizen Registration
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
