import React, { useState } from 'react';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import GrievanceForm from '../../components/student/raise-grievance/GrievanceForm';
import AiGuidanceCard from '../../components/student/raise-grievance/AiGuidanceCard';
import SuccessModal from '../../components/student/raise-grievance/SuccessModal';
import { studentAPI } from '../../services/api';
import { AlertCircle, Clock, Shield, Sparkles } from 'lucide-react';

export default function RaiseGrievancePage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    department: '',
    priority: 'Medium',
    description: '',
    confirmedAccuracy: false,
  });
  const [files, setFiles] = useState([]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // AI Assistance State
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleRunAiAssist = async () => {
    if (!formData.title || !formData.description) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await studentAPI.aiAssist({
        title: formData.title,
        description: formData.description,
        category: formData.category || undefined,
      });
      if (res.data?.success) {
        setAiResult(res.data);
      }
    } catch (err) {
      console.error('AI pre-submission assistance error:', err);
      setAiError(err.response?.data?.message || err.message || 'AI assistant is temporarily unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiSuggestions = () => {
    if (!aiResult) return;
    setFormData((prev) => {
      const updated = { ...prev };
      if (aiResult.classificationSuggestion?.suggestedCategory) {
        updated.category = aiResult.classificationSuggestion.suggestedCategory;
      }
      if (aiResult.classificationSuggestion?.suggestedDepartment) {
        // Map to standard department code if possible
        const deptName = aiResult.classificationSuggestion.suggestedDepartment.toLowerCase();
        if (deptName.includes('hostel')) updated.department = 'HOSTEL';
        else if (deptName.includes('acad')) updated.department = 'ACAD';
        else if (deptName.includes('mess') || deptName.includes('cafe')) updated.department = 'MESS';
        else if (deptName.includes('maint')) updated.department = 'MAINT';
        else if (deptName.includes('comp') || deptName.includes('ai')) updated.department = 'CS_AI';
        else if (deptName.includes('lib')) updated.department = 'LIB';
        else updated.department = 'HOSTEL';
      }
      return updated;
    });
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('category', formData.category);
      payload.append('department', formData.department);
      payload.append('priority', formData.priority);
      payload.append('description', formData.description.trim());

      files.forEach((file) => {
        payload.append('attachments', file);
      });

      const res = await studentAPI.submitGrievance(payload);

      if (res.data?.success && res.data.confirmation) {
        setConfirmationData(res.data.confirmation);
        setIsSuccessModalOpen(true);
      } else {
        throw new Error(res.data?.message || 'Failed to lodge grievance.');
      }
    } catch (err) {
      console.error('Grievance submission error:', err);
      setSubmissionError(
        err.response?.data?.message || err.message || 'An error occurred while submitting your grievance.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <StudentSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="submit-grievance"
      />

      <div className="flex-1 w-full lg:pl-[260px] flex flex-col min-h-screen">
        <StudentHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          breadcrumb="Submit Grievance"
        />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Header Description */}
          <div>
            <h1 className="text-2xl font-bold font-manrope text-nivaran-forest tracking-tight">
              Lodge Institutional Grievance
            </h1>
            <p className="text-xs sm:text-sm text-nivaran-textSecondary mt-0.5 max-w-2xl">
              File a formal grievance to the designated departmental nodal officer. Your report is cryptographically timestamped and governed under statutory college SLA response limits.
            </p>
          </div>

          {submissionError && (
            <div className="p-4 rounded-xl bg-nivaran-errorBg border border-nivaran-error/30 text-nivaran-error text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* Form and AI Guidance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* 2 Columns: Main Form */}
            <div className="lg:col-span-2">
              <GrievanceForm
                formData={formData}
                setFormData={setFormData}
                files={files}
                setFiles={setFiles}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                onRunAiAssist={handleRunAiAssist}
                aiLoading={aiLoading}
              />
            </div>

            {/* 1 Column: AI Guidance & Policy Cards */}
            <div className="space-y-6">
              <AiGuidanceCard
                aiResult={aiResult}
                loading={aiLoading}
                onRunAnalysis={handleRunAiAssist}
                onApplySuggestions={handleApplyAiSuggestions}
                hasDraftContent={Boolean(formData.title && formData.description)}
              />

              {aiError && (
                <div className="p-3 bg-nivaran-warningBg/60 border border-nivaran-warning/30 rounded-xl text-xs text-nivaran-warning">
                  {aiError}
                </div>
              )}

              {/* Policy & SLA Card */}
              <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 space-y-3">
                <div className="flex items-center gap-2 text-nivaran-forest font-bold text-sm">
                  <Shield className="w-4 h-4 text-nivaran-primary" />
                  <span>Statutory SLA Guarantees</span>
                </div>
                <div className="space-y-2 text-xs text-nivaran-textSecondary">
                  <div className="flex items-center justify-between pb-1.5 border-b border-nivaran-divider">
                    <span>Initial Acknowledgment</span>
                    <span className="font-semibold text-nivaran-text">Within 24 Hours</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-nivaran-divider">
                    <span>Departmental Review</span>
                    <span className="font-semibold text-nivaran-text">Within 48 Hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Target Resolution Time</span>
                    <span className="font-semibold text-nivaran-text">7 Days Standard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Real Success Confirmation Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        confirmation={confirmationData}
      />
    </div>
  );
}
