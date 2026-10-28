import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LotusLogo from '../common/LotusLogo';

export default function StitchNavbar({ activeTab = 'overview', onTabChange, onOpenLodgeModal, onReplayIntro }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { id: 'overview', label: 'Overview', href: '#overview' },
   
    { id: 'institutional-intelligence', label: 'Institutional Intelligence', href: '#tracking-section' },
    { id: 'tracking', label: 'Tracking', href: '#tracking-section' },
    { id: 'ombudsman-portal', label: 'Ombudsman Portal', href: '#ombudsman-portal' },
  ];

  const handleNavClick = (id, href) => {
    if (onTabChange) onTabChange(id);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-low transition-all">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3 md:gap-space-md">
        
        {/* Brand Group */}
        <div className="flex items-center gap-2 sm:gap-space-md shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-space-sm group"
          >
            <LotusLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <span className="font-headline-sm text-headline-sm tracking-tight text-primary font-bold">
              NIVARAN
            </span>
          </Link>

          {/* Regulatory Badge */}
          <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Govt &amp; UGC Accredited Architecture
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id, item.href);
                }}
                className={`px-3 py-2 rounded-lg font-label-lg text-label-lg transition-colors ${
                  isActive
                    ? 'text-primary font-bold bg-surface-container-low'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Group */}
        <div className="flex items-center gap-2 sm:gap-space-sm shrink-0">
          {/* Replay intro animation pill */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              title="Replay Brand Experience Intro"
              className="hidden md:inline-flex items-center p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">play_circle</span>
            </button>
          )}

          {/* Sign In Button -> Link to /student/dashboard */}
          <Link
            to="/student/dashboard"
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 rounded-lg font-label-lg text-label-lg text-primary-container bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
          >
            Sign In
          </Link>

          {/* Grievance Portal CTA -> Link to /student/dashboard */}
          <Link
            to="/student/dashboard"
            className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 rounded-lg font-label-lg text-label-lg bg-primary-container text-on-primary hover:bg-primary transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            Grievance Portal
          </Link>

          {/* User Avatar Circle */}
          <Link
            to="/student/dashboard"
            title="Open Student Dashboard"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 cursor-pointer hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container focus:outline-none ml-1"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-surface-container px-6 py-4 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-3 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            Govt &amp; UGC Accredited
          </div>

          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id, item.href);
                }}
                className="px-3 py-2.5 rounded-lg font-label-lg text-label-lg text-on-surface hover:bg-surface-container transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 mt-3 border-t border-surface-container flex flex-col gap-2.5">
            <Link
              to="/student/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg font-label-lg text-label-lg bg-primary-container text-on-primary hover:bg-primary text-center font-bold shadow-sm"
            >
              Open Student Dashboard
            </Link>
            <Link
              to="/officer/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg font-label-lg text-label-lg text-secondary bg-surface-container-low hover:bg-surface-container text-center font-semibold flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">shield_person</span>
              <span>Department Officer Desk</span>
            </Link>
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg font-label-lg text-label-lg text-primary bg-surface-container-low hover:bg-surface-container text-center font-semibold flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
              <span>Institution Admin Desk</span>
            </Link>
            <Link
              to="/student/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg font-label-lg text-label-lg text-primary-container bg-surface-container-low hover:bg-surface-container text-center font-semibold"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
