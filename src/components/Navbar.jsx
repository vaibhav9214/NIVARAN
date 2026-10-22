import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Menu, 
  X, 
  UserCircle2, 
  PlusCircle, 
  BarChart3, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickTrackId, setQuickTrackId] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      // Navigate to tracking anchor or status page
      const element = document.getElementById('status-tracker');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      {/* Top Notification / Institutional Compliance Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              UGC & AICTE COMPLIANT
            </span>
            <span>Centralized Institutional Grievance Redressal Mechanism & Transparency Portal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Toll-Free Helpline: <strong>1800-11-2026</strong></span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              99.8% Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  NIVARAN
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                  निवारण
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 -mt-0.5 tracking-tight">
                Institutional Grievance Redressal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#transparency" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Transparency Hub
            </a>
            <a href="#departments" className="hover:text-blue-600 transition-colors">
              Departments
            </a>
            <a href="#status-tracker" className="hover:text-blue-600 transition-colors">
              Track Grievance
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#login-portal"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <UserCircle2 className="w-4 h-4" />
              Institutional Sign In
            </a>
            <a
              href="#raise-grievance"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Lodge Grievance
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="#raise-grievance"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Lodge
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-700">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              How It Works
            </a>
            <a
              href="#transparency"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Transparency Hub</span>
              <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded">Live Data</span>
            </a>
            <a
              href="#departments"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Departments
            </a>
            <a
              href="#status-tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Track Grievance Status
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              Frequently Asked Questions
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <a
              href="#login-portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Institutional Sign In
            </a>
            <a
              href="#raise-grievance"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            >
              Lodge a New Grievance
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
