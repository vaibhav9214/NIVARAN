import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import SummaryCards from '../../components/student/SummaryCards';
import GrievanceTable from '../../components/student/GrievanceTable';
import SlaCapsWidget from '../../components/student/SlaCapsWidget';
import TelemetryWidget from '../../components/student/TelemetryWidget';
import VelocityChart from '../../components/student/VelocityChart';
import QuickActionsGrid from '../../components/student/QuickActionsGrid';
import SlaModal from '../../components/student/SlaModal';
import DocketModal from '../../components/stitch/DocketModal';
import LodgeModal from '../../components/stitch/LodgeModal';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState('active'); // 'active' | 'empty' | 'loading'
  const [tableFilter, setTableFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Modals
  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [selectedDocket, setSelectedDocket] = useState(null);

  const handleDocketSelect = (item) => {
    // Transform item to DocketModal format
    setSelectedDocket({
      id: item.id,
      subject: item.subject,
      meta: item.meta,
      tier: item.category,
      tierColor: 'bg-surface-container text-on-surface-variant',
      dotColor: 'bg-secondary',
      committee: item.details?.committee || 'Hostel & Infrastructure Board',
      status: item.status,
      statusColor: item.status === 'Resolved' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant',
      details: {
        filedOn: item.filed,
        slaCountdown: item.details?.slaCountdown || '48 Hours Remaining',
        assignedOfficer: 'Chief Proctorial Warden / SGRC Member',
        anonymity: 'Masked Student ID #IITD-2023-CS042',
        description: item.details?.description || 'Routine maintenance and inspection inquiry.',
        milestones: [
          { label: 'Grievance Docket Ingested', time: item.filed, done: true },
          { label: 'Proctorial Verification Ordered', time: 'In Progress', done: true },
          { label: 'Final Resolution Report', time: 'Upcoming', done: item.status === 'Resolved' },
        ]
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-surface font-sans text-body-md text-on-surface antialiased flex">
      {/* 1. Left Sidebar Navigation */}
      <StudentSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="dashboard"
        onNavChange={(id) => {
          if (id === 'submit-grievance') navigate('/student/raise-grievance');
          if (id === 'my-grievances') navigate('/student/my-grievances');
        }}
      />

      {/* 2. Main Layout Area (pl-0 on mobile, pl-[260px] on desktop) */}
      <div className="flex-1 w-full lg:pl-[260px] flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <StudentHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          breadcrumb="Dashboard"
        />

        {/* Dashboard Main Scroll Canvas */}
        <main className="relative pt-20 px-4 sm:px-space-md lg:px-space-lg py-space-lg flex-1 flex flex-col gap-space-lg">
          
          {/* Persona View Switcher Header (Simulation Switcher) */}
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-space-sm bg-surface-container-low px-space-md py-2.5 rounded-xl border border-outline-variant/30">
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[14px]">tune</span>
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold tracking-wide uppercase">
                Dashboard Persona View:
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
                Switch perspectives to inspect platform responsiveness
              </span>
            </div>

            <div className="inline-flex p-1 bg-surface-container-lowest rounded-lg border border-outline-variant/40 shadow-xs self-start md:self-auto" role="tablist">
              <button
                onClick={() => setViewState('active')}
                className={`px-3 py-1 rounded font-label-md text-label-md font-semibold transition-all duration-150 cursor-pointer ${
                  viewState === 'active'
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Active Scholar (Aditya)
              </button>
              <button
                onClick={() => setViewState('empty')}
                className={`px-3 py-1 rounded font-label-md text-label-md font-semibold transition-all duration-150 cursor-pointer ${
                  viewState === 'empty'
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                First-time Scholar (Empty)
              </button>
              <button
                onClick={() => setViewState('loading')}
                className={`px-3 py-1 rounded font-label-md text-label-md font-semibold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                  viewState === 'loading'
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                Loading State
              </button>
            </div>
          </div>

          {/* STATE 1: LOADING SKELETON */}
          {viewState === 'loading' && (
            <div className="flex flex-col gap-space-lg animate-pulse w-full">
              <div className="h-24 bg-surface-container-low rounded-2xl w-full"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                <div className="h-32 bg-surface-container-low rounded-xl"></div>
                <div className="h-32 bg-surface-container-low rounded-xl"></div>
                <div className="h-32 bg-surface-container-low rounded-xl"></div>
                <div className="h-32 bg-surface-container-low rounded-xl"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                <div className="lg:col-span-8 h-96 bg-surface-container-low rounded-2xl"></div>
                <div className="lg:col-span-4 h-96 bg-surface-container-low rounded-2xl"></div>
              </div>
            </div>
          )}

          {/* STATE 2: EMPTY STATE */}
          {viewState === 'empty' && (
            <div className="flex flex-col items-center justify-center py-16 px-space-lg bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-secondary-container/60 flex items-center justify-center text-secondary mb-space-md ring-8 ring-secondary-container/20">
                <span className="material-symbols-outlined text-[32px]">verified_user</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                No Grievances Lodged Yet
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mt-2 mb-space-lg">
                Your academic and residential record is completely clear. Should you ever encounter procedural, infrastructural, or welfare issues, NIVARAN guarantees statutory 15-day resolution transparency.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-space-md">
                <Link
                  to="/student/raise-grievance"
                  className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-sm hover:bg-primary transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">add_task</span>
                  Lodge New Grievance
                </Link>
                <button
                  onClick={() => setIsSlaModalOpen(true)}
                  className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface border border-outline-variant text-on-surface font-label-lg text-label-lg font-medium hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  Review University Redressal SLA
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: ACTIVE SCHOLAR DASHBOARD */}
          {viewState === 'active' && (
            <div className="flex flex-col gap-space-lg w-full">
              
              {/* 1. Welcome Header Section */}
              <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-xs border-b border-outline-variant/20">
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                      Protected Portal
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                      Wednesday, 24 October 2026 • Scholar ID: #IITD-2023-CS042
                    </span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface tracking-tight">
                    Welcome back, <span className="text-primary-container">Aditya Verma</span>
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                    Stay informed. Track procedural dockets. Experience unbiased institutional redressal.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-space-sm pt-2 lg:pt-0">
                  <button
                    onClick={() => setIsSlaModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary-container font-label-lg text-label-lg transition-all shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>View SLA Handbook</span>
                  </button>
                  <Link
                    to="/student/raise-grievance"
                    className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary hover:shadow-primary-container/20 active:translate-y-px transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    <span>+ Submit Grievance</span>
                  </Link>
                </div>
              </section>

              {/* 2. Grievance Summary Cards (Row of 4) */}
              <SummaryCards
                onCardClick={(filterType) => setTableFilter(filterType)}
              />

              {/* 3. Main Grid (65% Table / 35% SLA & Activity Feed) */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8">
                  <GrievanceTable
                    filter={tableFilter}
                    onFilterChange={(f) => setTableFilter(f)}
                    onSelectGrievance={handleDocketSelect}
                  />
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-space-lg">
                  <SlaCapsWidget />
                  <TelemetryWidget />
                </div>
              </section>

              {/* 4. Grievance Activity & Redressal Velocity (Analytics Chart) */}
              <VelocityChart />

              {/* 5. Quick Actions Section */}
              <QuickActionsGrid
                onSubmitClick={() => navigate('/student/raise-grievance')}
                onTrackClick={() => navigate('/student/my-grievances')}
                onArchiveClick={() => navigate('/student/my-grievances')}
              />

            </div>
          )}

        </main>
      </div>

      {/* Interactive Modals */}
      <SlaModal
        isOpen={isSlaModalOpen}
        onClose={() => setIsSlaModalOpen(false)}
      />

      <DocketModal
        docket={selectedDocket}
        onClose={() => setSelectedDocket(null)}
      />

      <LodgeModal
        isOpen={isLodgeModalOpen}
        onClose={() => setIsLodgeModalOpen(false)}
      />

    </div>
  );
}
