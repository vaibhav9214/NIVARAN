import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import DetailsHeader from '../../components/student/grievance-details/DetailsHeader';
import ResolutionTracker from '../../components/student/grievance-details/ResolutionTracker';
import ResolutionSummaryPanel from '../../components/student/grievance-details/ResolutionSummaryPanel';
import ParticularsStatement from '../../components/student/grievance-details/ParticularsStatement';
import CommunicationThread from '../../components/student/grievance-details/CommunicationThread';
import AssignedAuthorityCard from '../../components/student/grievance-details/AssignedAuthorityCard';
import AiInsightsCard from '../../components/student/grievance-details/AiInsightsCard';
import SlaGovernanceCard from '../../components/student/grievance-details/SlaGovernanceCard';
import CampusSupportCard from '../../components/student/grievance-details/CampusSupportCard';
import WithdrawModal from '../../components/student/grievance-details/WithdrawModal';
import SimulationBanner from '../../components/student/grievance-details/SimulationBanner';
import DetailsSkeleton from '../../components/student/grievance-details/DetailsSkeleton';
import { getGrievanceDetails } from '../../components/student/my-grievances/grievanceData';

export default function GrievanceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Load grievance data
  const docket = getGrievanceDetails(id);

  // Simulation State: 'in-progress' | 'resolved' | 'overdue' | 'skeleton'
  const initialSimState = docket.status === 'Resolved' || docket.status === 'Closed'
    ? 'resolved'
    : docket.status === 'Escalated'
    ? 'overdue'
    : 'in-progress';
  const [simState, setSimState] = useState(initialSimState);

  // Modals & Floating Toasts
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', icon: 'info' });
  const toastTimeoutRef = useRef(null);

  const showToast = (message, icon = 'info') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ visible: true, message, icon });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '', icon: 'info' });
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleCopyDocketId = () => {
    const text = docket.ticketId;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Docket ID ${text} copied to clipboard!`, 'content_copy');
      }).catch(() => {
        showToast(`Docket ID ${text} copied!`, 'content_copy');
      });
    } else {
      showToast(`Docket ID ${text} copied!`, 'content_copy');
    }
  };

  const handleExportPdf = () => {
    showToast('Summary PDF Generated and downloading...', 'download');
  };

  const handleConfirmWithdrawal = (reason) => {
    setIsWithdrawOpen(false);
    showToast(`Grievance #${docket.ticketId} successfully withdrawn and archived.`, 'check_circle');
    setSimState('in-progress');
  };

  const handleFocusReply = () => {
    const el = document.getElementById('reply-textarea');
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface font-sans text-body-md text-on-surface antialiased flex">
      {/* 1. Left Sidebar Navigation */}
      <StudentSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="my-grievances"
        onNavChange={(navId) => {
          if (navId === 'dashboard') navigate('/student/dashboard');
          if (navId === 'submit-grievance') navigate('/student/raise-grievance');
          if (navId === 'my-grievances') navigate('/student/my-grievances');
        }}
      />

      {/* 2. Main Content Layout (offset by 260px on desktop) */}
      <div className="flex-1 w-full lg:pl-[260px] flex flex-col min-h-screen">
        {/* Top Header */}
        <StudentHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          breadcrumb={docket.ticketId}
        />

        {/* Main Canvas */}
        <main className="pt-16 min-h-screen bg-surface flex flex-col w-full pb-16">
          {/* Simulation State Banner */}
          <SimulationBanner
            simState={simState}
            onSelectState={(state) => {
              setSimState(state);
              if (state === 'skeleton') {
                showToast('Simulating API data fetch with skeleton state...', 'sync');
              } else if (state === 'resolved') {
                showToast('Displaying Resolved Docket state with official findings & feedback rating.', 'check_circle');
              } else if (state === 'overdue') {
                showToast('Simulating Statutory SLA Breached alert condition.', 'warning');
              } else {
                showToast('Loaded default active grievance in-progress view.', 'info');
              }
            }}
          />

          {/* SKELETON LOADER STATE */}
          {simState === 'skeleton' ? (
            <DetailsSkeleton />
          ) : (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6" id="docket-main-content">
              {/* Back to Ledger breadcrumb link */}
              <div className="flex items-center gap-2 text-xs font-semibold text-outline">
                <Link
                  to="/student/my-grievances"
                  className="hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to My Grievances</span>
                </Link>
                <span>•</span>
                <span className="text-on-surface">Docket Dossier</span>
              </div>

              {/* Overdue SLA Critical Alert Banner (Visible conditionally) */}
              {simState === 'overdue' && (
                <div
                  className="rounded-xl bg-error-container text-on-error-container p-4 flex items-start justify-between shadow-sm border border-error/20"
                  id="overdue-alert-banner"
                >
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-error text-2xl shrink-0 mt-0.5">
                      warning
                    </span>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm font-bold text-on-error-container">
                        Statutory SLA Breached &amp; Escalation Active
                      </h2>
                      <p className="font-body-sm text-body-sm mt-0.5 text-on-error-container/90 leading-relaxed">
                        This grievance has exceeded the default collegiate resolution window of 15 working days. Immediate notice has been auto-dispatched to the Office of the Dean of Student Welfare (DoSW) and Appellate Authority.
                      </p>
                    </div>
                  </div>
                  <span className="bg-error text-on-error text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
                    Level 2 Escalated
                  </span>
                </div>
              )}

              {/* Header Section with Metadata & Actions */}
              <DetailsHeader
                docket={docket}
                simState={simState}
                onCopyDocketId={handleCopyDocketId}
                onExportPdf={handleExportPdf}
                onOpenWithdraw={() => setIsWithdrawOpen(true)}
              />

              {/* Resolution Progress Tracker Card */}
              <ResolutionTracker docket={docket} simState={simState} />

              {/* Two-Column Workspace Layout (65% Left / 35% Right) */}
              <div className="grid grid-cols-12 gap-6 items-start">
                {/* Left Column (65% on Desktop) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                  {/* Conditional Resolution Closure / Feedback Panel */}
                  {(simState === 'resolved' || docket.status === 'Resolved' || docket.status === 'Closed') && (
                    <ResolutionSummaryPanel
                      docket={docket}
                      onTriggerToast={showToast}
                    />
                  )}

                  {/* Grievance Statement & Particulars */}
                  <ParticularsStatement
                    docket={docket}
                    onTriggerToast={showToast}
                  />

                  {/* Communication & Official Inquiry Channel */}
                  <CommunicationThread
                    initialMessages={docket.messages}
                    officerName={docket.officer?.name}
                    onTriggerToast={showToast}
                  />
                </div>

                {/* Right Column (35% on Desktop) */}
                <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                  {/* Assigned Officer Card */}
                  <AssignedAuthorityCard
                    officer={docket.officer}
                    onFocusReply={handleFocusReply}
                  />

                  {/* NIVARAN AI Insights Card */}
                  <AiInsightsCard aiInsight={docket.aiInsight} />

                  {/* Statutory SLA Governance Card */}
                  <SlaGovernanceCard simState={simState} />

                  {/* Campus Support Quick Card */}
                  <CampusSupportCard onTriggerToast={showToast} />
                </aside>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Withdraw Grievance Confirmation Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onConfirm={handleConfirmWithdrawal}
        docketId={docket.ticketId}
      />

      {/* Floating Feedback Toast Notification */}
      {toast.visible && (
        <div
          className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 font-body-sm text-xs animate-in slide-in-from-bottom duration-200"
          id="system-toast"
        >
          <span className="material-symbols-outlined text-secondary-fixed text-lg">
            {toast.icon}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
