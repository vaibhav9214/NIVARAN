import React, { useState } from 'react';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import GrievanceForm from '../../components/student/raise-grievance/GrievanceForm';
import AiGuidanceCard from '../../components/student/raise-grievance/AiGuidanceCard';
import ChecklistCard from '../../components/student/raise-grievance/ChecklistCard';
import TimelineCard from '../../components/student/raise-grievance/TimelineCard';
import SuccessModal from '../../components/student/raise-grievance/SuccessModal';
import SubmittingLoader from '../../components/student/raise-grievance/SubmittingLoader';
import ToastNotification from '../../components/student/raise-grievance/ToastNotification';

export default function RaiseGrievancePage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [simulationState, setSimulationState] = useState('edit'); // 'edit' | 'loader' | 'success'
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3500);
  };

  const handleAiScan = () => {
    setIsAiScanning(true);
    showToast('NIVARAN AI re-analyzed complaint: 96% match to Hostel & Residence.');
    setTimeout(() => {
      setIsAiScanning(false);
    }, 1500);
  };

  const handlePolish = () => {
    showToast('NIVARAN AI polished description for statutory precision.');
  };

  const handleSaveDraft = () => {
    showToast('Draft saved successfully. Session encrypted and retained.');
  };

  const handleFormSubmit = () => {
    setSimulationState('loader');
    setTimeout(() => {
      setSimulationState('success');
    }, 1200);
  };

  const handleSimStateChange = (state) => {
    setSimulationState(state);
    if (state === 'loader') {
      setTimeout(() => {
        setSimulationState('edit');
      }, 1800);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface font-sans text-body-md text-on-surface antialiased flex">
      {/* 1. Left Sidebar Navigation */}
      <StudentSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="submit-grievance"
      />

      {/* 2. Main Layout Area (pl-0 on mobile, pl-[260px] on desktop) */}
      <div className="flex-1 w-full lg:pl-[260px] flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <StudentHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          breadcrumb="Submit Grievance"
        />

        {/* Main Content Area */}
        <main className="relative pt-20 px-4 sm:px-space-md lg:px-space-lg py-space-lg flex-1 flex flex-col">
          <div className="flex flex-col w-full">
            
            {/* Interactive State Bar / Quick Simulation Toolbar */}
            <div className="mb-space-lg flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-xl shadow-sm">
              <div className="flex items-center gap-space-sm">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-container text-on-primary">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                  Simulation Modes:
                </span>
              </div>

              <div className="flex items-center gap-space-xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => handleSimStateChange('edit')}
                  className={`px-space-md py-1 rounded-lg font-label-md text-label-md transition-all duration-150 font-semibold cursor-pointer ${
                    simulationState === 'edit'
                      ? 'bg-primary-container text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Edit Form
                </button>

                <button
                  type="button"
                  onClick={() => handleSimStateChange('loader')}
                  className={`px-space-md py-1 rounded-lg font-label-md text-label-md transition-all duration-150 font-semibold cursor-pointer ${
                    simulationState === 'loader'
                      ? 'bg-primary-container text-on-primary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Submitting State
                </button>

                <button
                  type="button"
                  onClick={handleAiScan}
                  className="px-space-md py-1 rounded-lg font-label-md text-label-md transition-all duration-150 bg-surface-container text-on-surface-variant hover:text-on-surface font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span>Scan via AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimStateChange('success')}
                  className={`px-space-md py-1 rounded-lg font-label-md text-label-md transition-all duration-150 font-semibold flex items-center gap-1 cursor-pointer ${
                    simulationState === 'success'
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Success Modal</span>
                </button>
              </div>
            </div>

            {/* Page Header & Reassurance Banner */}
            <header className="mb-space-xl flex flex-col gap-space-md">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                <div>
                  <div className="flex items-center gap-space-xs text-secondary mb-space-xs font-label-md text-label-md uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Collegiate Statutory Portal • Form 05-A</span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
                    Raise a Grievance
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mt-1 max-w-2xl">
                    Tell us what happened. We'll register your formal statement and help you track it through to institutional resolution.
                  </p>
                </div>

                {/* Quick Docket Status Pill */}
                <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm self-start lg:self-auto border border-outline-variant/30">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                      Draft Session
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      Auto-saved 2 mins ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Statutory Privacy Reassurance Banner */}
              <div className="bg-surface-container-low px-space-md py-space-sm rounded-xl flex items-start sm:items-center gap-space-md shadow-sm border border-outline-variant/30">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">policy</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-lg text-label-lg text-primary-container font-semibold">
                    Confidential &amp; Statutory Protection Guaranteed
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Your complaint is cryptographically sealed upon filing. Docket details are visible exclusively to designated ombudsmen and the authorized collegiate grievance committee under University Redressal Regulation 14(B).
                  </p>
                </div>
                <span className="hidden md:inline-flex bg-surface-container-lowest text-secondary px-space-sm py-1 rounded-full font-label-sm text-label-sm font-semibold tracking-wider uppercase shrink-0 border border-secondary/20">
                  Encrypted Protocol
                </span>
              </div>
            </header>

            {/* Main Grid: 2 Columns (~65% Left / ~35% Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* Left Column: Primary Submission Form (~65% -> 8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-space-lg">
                <GrievanceForm
                  onSubmit={handleFormSubmit}
                  onSaveDraft={handleSaveDraft}
                  onPolishWithAi={handlePolish}
                  showToast={showToast}
                />
              </div>

              {/* Right Column: Side Panels (~35% -> 4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-space-lg">
                <AiGuidanceCard
                  isScanning={isAiScanning}
                  onReanalyze={handleAiScan}
                />
                <ChecklistCard />
                <TimelineCard />
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Overlays & Modals */}
      <SubmittingLoader isOpen={simulationState === 'loader'} />
      <SuccessModal
        isOpen={simulationState === 'success'}
        onClose={() => setSimulationState('edit')}
        docketId="#NIV-1025"
      />
      <ToastNotification
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}
