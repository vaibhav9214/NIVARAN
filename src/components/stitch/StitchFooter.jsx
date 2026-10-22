import React from 'react';
import LotusLogo from '../common/LotusLogo';

export default function StitchFooter() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand identity */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-center sm:text-left">
          <LotusLogo className="w-6 h-6 opacity-80" />
          <span className="font-label-lg text-label-lg font-bold text-primary">
            NIVARAN
          </span>
          <span className="text-outline font-body-sm text-body-sm">
            | Higher Education Redressal Infrastructure
          </span>
        </div>

        {/* Regulatory Links & Helplines */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-outline font-medium">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            UGC Redressal Gazette 2023
          </span>
          <span>•</span>
          <a
            href="#ombudsman-portal"
            onClick={(e) => {
              e.preventDefault();
              alert('Ombudsman Appeals Registry: Governed under Section 5(1) Academic Regulations.');
            }}
            className="hover:text-primary transition-colors"
          >
            Ombudsman Registry
          </a>
          <span>•</span>
          <a
            href="#privacy-charter"
            onClick={(e) => {
              e.preventDefault();
              alert('Zero-Knowledge Student Privacy Charter: Roll numbers are cryptographically salted.');
            }}
            className="hover:text-primary transition-colors"
          >
            Zero-Knowledge Charter
          </a>
          <span>•</span>
          <span>Helpline: <strong>1800-11-2026</strong></span>
        </div>

      </div>
    </footer>
  );
}
