import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Heart, 
  CheckCircle2, 
  Lock, 
  FileText
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">NIVARAN</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An institutional grievance redressal & accountability framework engineered to ensure swift, transparent, and bias-free resolution of academic, administrative, and student life concerns.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit Encrypted
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                UGC Compliant
              </span>
            </div>
          </div>

          {/* Grievance Portals */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Access Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#raise-grievance" className="hover:text-blue-400 transition-colors">
                  Lodge Student Grievance
                </a>
              </li>
              <li>
                <a href="#status-tracker" className="hover:text-blue-400 transition-colors">
                  Track Resolution Status
                </a>
              </li>
              <li>
                <a href="#login-portal" className="hover:text-blue-400 transition-colors">
                  Department Officer Desk
                </a>
              </li>
              <li>
                <a href="#login-portal" className="hover:text-blue-400 transition-colors">
                  Ombudsperson & Admin
                </a>
              </li>
              <li>
                <a href="#transparency" className="hover:text-blue-400 transition-colors">
                  Public Transparency Hub
                </a>
              </li>
            </ul>
          </div>

          {/* Grievance Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#departments" className="hover:text-blue-400 transition-colors">Academic & Evaluations</a>
              </li>
              <li>
                <a href="#departments" className="hover:text-blue-400 transition-colors">Hostel & Mess Amenities</a>
              </li>
              <li>
                <a href="#departments" className="hover:text-blue-400 transition-colors">Fee & Scholarship Redressal</a>
              </li>
              <li>
                <a href="#departments" className="hover:text-blue-400 transition-colors">Anti-Ragging Committee</a>
              </li>
              <li>
                <a href="#departments" className="hover:text-blue-400 transition-colors">Internal Complaints (ICC)</a>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Emergency Support
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-medium">National Anti-Ragging Helpline:</span>
                <span className="text-emerald-400 font-bold text-sm">1800-180-5522</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-medium">Campus Women Safety Cell:</span>
                <span className="text-blue-400 font-bold text-sm">+91 11-2026-9900</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block font-medium">Mental Health & Counseling:</span>
                <span className="text-amber-400 font-bold text-sm">14416 (Tele-MANAS)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NIVARAN Redressal Framework. Governed under Institutional Grievance Regulations.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Charter of Redressal</a>
            <a href="#sla" className="hover:text-slate-300 transition-colors">SLA Guidelines</a>
            <a href="#audit" className="hover:text-slate-300 transition-colors">Annual Audit Report</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
