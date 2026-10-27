import React, { useState } from 'react';
import BrandIntroOverlay from '../components/stitch/BrandIntroOverlay';
import StitchNavbar from '../components/stitch/StitchNavbar';
import HeroSection from '../components/stitch/HeroSection';
import IntelligenceDashboard from '../components/stitch/IntelligenceDashboard';
import CtaBanner from '../components/stitch/CtaBanner';
import StitchFooter from '../components/stitch/StitchFooter';
import DocketModal from '../components/stitch/DocketModal';
import LodgeModal from '../components/stitch/LodgeModal';

export default function StitchLandingPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDocket, setSelectedDocket] = useState(null);
  const [isLodgeOpen, setIsLodgeOpen] = useState(false);

  const handleOpenLodge = () => {
    setIsLodgeOpen(true);
  };

  const handleCloseLodge = () => {
    setIsLodgeOpen(false);
  };

  const handleTrackDocket = () => {
    const el = document.getElementById('tracking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface font-sans text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed flex flex-col">
      {/* 1. Full-Screen Animated Brand Intro Sequence */}
      <BrandIntroOverlay
        isOpen={showIntro}
        onClose={() => setShowIntro(false)}
      />

      {/* 2. Fixed Stitch Responsive Navbar */}
      <StitchNavbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenLodgeModal={handleOpenLodge}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* 3. Main Content Container */}
      <main className="w-full pt-20 bg-surface flex-grow flex flex-col">
        {/* Hero Section & Stats Ribbon */}
        <HeroSection
          onSubmitGrievance={handleOpenLodge}
          onTrackDocket={handleTrackDocket}
        />

        {/* Live Institutional Triaging & Resolution Engine */}
        <IntelligenceDashboard
          onSelectDocket={(docket) => setSelectedDocket(docket)}
        />

        {/* Call To Action Confidential Grievance Portal Banner */}
        <CtaBanner
          onBeginGrievance={handleOpenLodge}
        />
      </main>

      {/* 4. Footer */}
      <StitchFooter />

      {/* Modals for Interactive Docket Review & Grievance Lodging */}
      <DocketModal
        docket={selectedDocket}
        onClose={() => setSelectedDocket(null)}
      />

      <LodgeModal
        isOpen={isLodgeOpen}
        onClose={handleCloseLodge}
      />
    </div>
  );
}
