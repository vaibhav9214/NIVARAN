import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import OfficerHeader from '../../components/officer/OfficerHeader';
import ReviewSimulationBar from '../../components/officer/review/ReviewSimulationBar';
import ReviewSkeletonView from '../../components/officer/review/ReviewSkeletonView';
import ReviewHeader from '../../components/officer/review/ReviewHeader';
import SubmittedGrievanceCard from '../../components/officer/review/SubmittedGrievanceCard';
import EvidenceCard from '../../components/officer/review/EvidenceCard';
import StudentCommunicationCard from '../../components/officer/review/StudentCommunicationCard';
import InternalStaffNotesCard from '../../components/officer/review/InternalStaffNotesCard';
import CaseActivityAuditTrail from '../../components/officer/review/CaseActivityAuditTrail';
import ReviewOutcomeCard from '../../components/officer/review/ReviewOutcomeCard';
import ResponseSlaCard from '../../components/officer/review/ResponseSlaCard';
import CaseRoutingCard from '../../components/officer/review/CaseRoutingCard';
import AiReviewAssistantCard from '../../components/officer/review/AiReviewAssistantCard';
import ReviewStickyBottomBar from '../../components/officer/review/ReviewStickyBottomBar';
import ReassignModal from '../../components/officer/review/ReassignModal';
import { getOfficerCaseDetails } from '../../data/officerReviewData';

export default function OfficerGrievanceReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load realistic mock data based on ID
  const caseId = id || 'GRV-2026-0138';
  const initialCaseData = getOfficerCaseDetails(caseId);

  const [caseData, setCaseData] = useState(initialCaseData);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [simState, setSimState] = useState('awaiting'); // 'awaiting' | 'inforeq' | 'forwarded' | 'resolved' | 'skeleton'
  const [outcome, setOutcome] = useState('accept'); // 'accept' | 'info' | 'forward' | 'duplicate' | 'reject'
  const [technician, setTechnician] = useState('rajesh');
  const [forwardDept, setForwardDept] = useState('physics_hod');
  const [remarks, setRemarks] = useState(initialCaseData.initialRemarks || '');
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ visible: false, message: '', icon: 'check_circle' });
  const toastTimeoutRef = useRef(null);

  const showToast = (message, icon = 'check_circle') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ visible: true, message, icon });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '', icon: 'check_circle' });
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Update case data when id parameter changes
  useEffect(() => {
    const updated = getOfficerCaseDetails(caseId);
    setCaseData(updated);
    setRemarks(updated.initialRemarks || '');
  }, [caseId]);

  // Handle simulation state changes
  const handleSimStateChange = (nextState) => {
    setSimState(nextState);
    if (nextState === 'skeleton') {
      showToast('Simulation: displaying pulsing skeleton state...', 'hourglass_top');
    } else if (nextState === 'awaiting') {
      showToast('State switched to Awaiting Review (Active Desk).', 'hourglass_empty');
    } else if (nextState === 'inforeq') {
      showToast('State switched to Request Info Pending (Student response required).', 'contact_support');
    } else if (nextState === 'forwarded') {
      showToast('State switched to Forwarded to Central Workshop.', 'forward');
    } else if (nextState === 'resolved') {
      showToast('State switched to Resolved & Sealed (UGC statutory closure).', 'check_circle');
    }
  };

  // Decision Execution
  const handleExecuteDecision = () => {
    let msg = 'Statutory order executed. Action committed to immutable audit record.';
    if (outcome === 'accept') {
      msg = 'Investigation accepted. Work order transmitted to lead technician.';
    } else if (outcome === 'forward') {
      msg = `Docket forwarded to ${forwardDept === 'physics_hod' ? 'Physics HOD' : forwardDept}.`;
    } else if (outcome === 'info') {
      msg = 'Official inquiry transmitted to student. SLA timer paused.';
    } else if (outcome === 'duplicate') {
      msg = 'Docket linked as secondary duplicate in central university register.';
    } else if (outcome === 'reject') {
      msg = 'Statutory rejection order registered with registrar notice.';
    }
    showToast(msg, 'verified');
  };

  const handleSaveDraft = () => {
    showToast('Draft assessment saved to Officer Desk local storage.', 'save');
  };

  const handleConfirmReassign = (targetOfficerName) => {
    setReassignModalOpen(false);
    showToast(`Docket reassigned to ${targetOfficerName}. Notification dispatched.`, 'swap_horiz');
  };

  const handleEscalateDean = () => {
    showToast('High-priority statutory escalation submitted to Office of Dean.', 'flag');
  };

  const breadcrumbs = [
    { label: 'Officer Workspace', path: '/officer/dashboard' },
    { label: 'Review Queue', path: '/officer/dashboard#queue' },
    { label: caseData.id },
  ];

  return (
    <div className="w-full min-h-screen bg-background font-body-md text-body-md text-on-surface antialiased flex flex-col">
      {/* 1. Left Officer Sidebar */}
      <OfficerSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="review-queue"
      />

      {/* 2. Main Page Column with Left Margin for Sidebar */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <OfficerHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onTriggerToast={showToast}
          breadcrumbs={breadcrumbs}
        />

        {/* Content Body */}
        <main className="relative pt-20 px-4 sm:px-space-lg py-space-lg flex-1">
          <div className="flex flex-col w-full pb-28">
            {/* Top Simulation Control Strip */}
            <ReviewSimulationBar
              simState={simState}
              onSetSimState={handleSimStateChange}
            />

            {/* Skeleton Container (Visible when simulation state is 'skeleton') */}
            {simState === 'skeleton' ? (
              <ReviewSkeletonView />
            ) : (
              /* Actual Case Viewport Wrapper */
              <div className="flex flex-col gap-space-lg w-full">
                {/* Page / Case Header */}
                <ReviewHeader
                  caseData={caseData}
                  simState={simState}
                  onTriggerToast={showToast}
                  onEscalateDean={handleEscalateDean}
                />

                {/* Two-Column Content Grid (65% / 35%) */}
                <div className="grid grid-cols-12 gap-space-lg items-start">
                  {/* Left Column (65%) */}
                  <div className="col-span-12 lg:col-span-8 flex flex-col gap-space-lg">
                    {/* 1. Submitted Grievance */}
                    <SubmittedGrievanceCard
                      caseData={caseData}
                      onTriggerToast={showToast}
                    />

                    {/* 2. Evidence & Supporting Attachments */}
                    <EvidenceCard
                      caseData={caseData}
                      onTriggerToast={showToast}
                    />

                    {/* 3. Communication with Student */}
                    <StudentCommunicationCard
                      caseData={caseData}
                      onTriggerToast={showToast}
                    />

                    {/* 4. Internal Staff Notes (Restricted) */}
                    <InternalStaffNotesCard
                      caseData={caseData}
                      onTriggerToast={showToast}
                    />

                    {/* 5. Case Activity History & Statutory Audit Trail */}
                    <CaseActivityAuditTrail
                      caseData={caseData}
                      onTriggerToast={showToast}
                    />
                  </div>

                  {/* Right Column (35%) */}
                  <div className="col-span-12 lg:col-span-4 flex flex-col gap-space-lg">
                    {/* 1. Review Outcome & Decision */}
                    <ReviewOutcomeCard
                      outcome={outcome}
                      onOutcomeChange={setOutcome}
                      technician={technician}
                      onTechnicianChange={setTechnician}
                      forwardDept={forwardDept}
                      onForwardDeptChange={setForwardDept}
                      remarks={remarks}
                      onRemarksChange={setRemarks}
                      onExecuteDecision={handleExecuteDecision}
                      onSaveDraft={handleSaveDraft}
                    />

                    {/* 2. Response SLA */}
                    <ResponseSlaCard caseData={caseData} />

                    {/* 3. Case Routing */}
                    <CaseRoutingCard
                      caseData={caseData}
                      onOpenReassign={() => setReassignModalOpen(true)}
                    />

                    {/* 4. NIVARAN AI Assistant */}
                    <AiReviewAssistantCard
                      caseData={caseData}
                      onTriggerToast={showToast}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Sticky Action Bar at Bottom */}
        {simState !== 'skeleton' && (
          <ReviewStickyBottomBar
            caseData={caseData}
            outcome={outcome}
            onSaveDraft={handleSaveDraft}
            onExecuteDecision={handleExecuteDecision}
          />
        )}
      </div>

      {/* Reassign Modal Dialog */}
      <ReassignModal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        onConfirm={handleConfirmReassign}
      />

      {/* Toast Notification Banner */}
      <div
        className={`fixed top-20 right-6 z-50 transform transition-all duration-300 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-lg shadow-xl font-label-md text-label-md border border-outline-variant/30 ${
          toast.visible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-[20px] text-primary-fixed">
          {toast.icon}
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
