import React, { useState, useEffect } from 'react';
import LotusLogo from '../common/LotusLogo';

export default function BrandIntroOverlay({ isOpen, onClose }) {
  const [phase, setPhase] = useState(0); // 0: init, 1: progress/logo, 2: text, 3: shockwave, 4: done

  useEffect(() => {
    if (!isOpen) return;

    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 950);
    const t3 = setTimeout(() => setPhase(3), 1900);
    const t4 = setTimeout(() => {
      setPhase(4);
      setTimeout(onClose, 600);
    }, 2900);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface overflow-hidden transition-opacity duration-700 ease-out select-none ${
        phase === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Concentric Ambient Ripple Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[260px] h-[260px] md:w-[380px] md:h-[380px] rounded-full border border-secondary/15 animate-ping opacity-25"></div>
        <div className="w-[440px] h-[440px] md:w-[620px] md:h-[620px] rounded-full border border-secondary-container/60 opacity-30 animate-pulse"></div>
        <div className="w-[640px] h-[640px] md:w-[860px] md:h-[860px] rounded-full border border-surface-container-high opacity-40"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-secondary-container/20 to-primary-fixed/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* Center Stage Animation Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl mx-auto">
        {/* Lotus Emblem Graphic Animation */}
        <div
          className={`relative w-28 h-28 md:w-36 md:h-36 mb-6 flex items-center justify-center transition-all duration-1000 transform ${
            phase >= 1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
          }`}
        >
          {/* Botanical Aura Shockwave Backdrop */}
          <div
            className={`absolute inset-0 rounded-full bg-secondary-fixed/40 transition-transform duration-700 pointer-events-none ${
              phase >= 3 ? 'opacity-70 scale-[2.2]' : 'opacity-0 scale-50'
            }`}
          />
          <LotusLogo className="w-full h-full" />
        </div>

        {/* Typography Sequence Reveal */}
        <div
          className={`transition-all duration-700 ease-out flex flex-col items-center ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="font-display-lg text-display-lg tracking-[0.25em] font-bold text-primary mb-2">
            NIVARAN
          </h1>
          <p className="font-headline-sm text-headline-sm text-secondary font-semibold mb-2 tracking-tight">
            Every Grievance Deserves a Resolution.
          </p>
          <span className="inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-wider text-outline bg-surface-container px-3.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            AI-Powered Redressal &amp; Transparency Infrastructure
          </span>
        </div>

        {/* Cinematic Progress Bar */}
        <div className="w-48 h-1 bg-surface-container-high rounded-full mt-10 overflow-hidden relative">
          <div
            className="h-full bg-primary rounded-full transition-all duration-[2600ms] ease-linear"
            style={{ width: phase >= 1 ? '100%' : '0%' }}
          ></div>
        </div>
      </div>

      {/* Quick Skip Action Pill */}
      <button
        onClick={onClose}
        className="absolute bottom-8 right-8 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md hover:text-primary hover:bg-surface-container shadow-sm transition-all border border-outline-variant/30 group cursor-pointer"
        aria-label="Skip Intro Sequence"
      >
        <span>Skip Sequence</span>
        <span className="px-1.5 py-0.5 rounded bg-surface-container text-outline text-[10px] font-mono group-hover:text-primary">
          ESC
        </span>
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </button>
    </div>
  );
}
