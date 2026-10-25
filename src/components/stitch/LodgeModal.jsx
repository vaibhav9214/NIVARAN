import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LodgeModal({ isOpen, onClose, onGrievanceCreated }) {
  const [formData, setFormData] = useState({
    category: 'Academics',
    subject: '',
    description: '',
    isAnonymous: true,
  });
  const [submittedDocket, setSubmittedDocket] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return;

    const newDocketId = `GRV-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedDocket(newDocketId);
    if (onGrievanceCreated) {
      onGrievanceCreated({
        id: newDocketId,
        subject: formData.subject,
        meta: `${formData.category} • ${formData.isAnonymous ? 'Filed Anonymously' : 'Verified Student ID'}`,
        tier: formData.category === 'Safety Hazard' ? 'Tier 1 • Safety Hazard' : 'Tier 2 • Academic Review',
        tierColor: formData.category === 'Safety Hazard' ? 'bg-error-container/60 text-on-error-container' : 'bg-surface-container text-on-surface-variant',
        dotColor: formData.category === 'Safety Hazard' ? 'bg-error' : 'bg-secondary',
        committee: 'Campus Grievance Redressal Committee',
        status: 'In Inquiry',
        statusColor: 'bg-surface-container-high text-on-surface-variant',
        actionLabel: 'View Details',
        actionIcon: 'chevron_right',
        details: {
          filedOn: 'Just now',
          slaCountdown: '48 Hours Remaining',
          assignedOfficer: 'Department Nodal Officer',
          anonymity: formData.isAnonymous ? 'Zero-Knowledge SHA-256 Token' : 'Verified Student ID',
          description: formData.description,
          milestones: [
            { label: 'Ingested & Cryptographically Hashed', time: 'Just now', done: true },
            { label: 'AI Urgent Triaging & Classification', time: 'In progress', done: true },
            { label: 'Routing to Respective Committee', time: 'Pending', done: false },
          ]
        }
      });
    }
  };

  const handleReset = () => {
    setSubmittedDocket(null);
    setFormData({
      category: 'Academics',
      subject: '',
      description: '',
      isAnonymous: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-container overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-low">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Confidential Docket
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Submit Institutional Grievance
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {!submittedDocket ? (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            {/* Anonymity Switch */}
            <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface block">
                  Zero-Knowledge Anonymity
                </span>
                <span className="text-outline text-xs block">
                  Mask roll number &amp; identity from reviewing faculty.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1 font-bold">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-surface text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary/40 font-sans"
              >
                <option>Academics &amp; Evaluation</option>
                <option>Safety Hazard &amp; Infrastructure</option>
                <option>Hostel &amp; Mess Amenities</option>
                <option>Harassment / Internal Complaints (ICC)</option>
                <option>Administrative &amp; Finance</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1 font-bold">
                Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your grievance..."
                className="w-full px-3 py-2 rounded-lg bg-surface text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary/40 font-sans"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-outline mb-1 font-bold">
                Detailed Context
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue, specific dates, or previous communication..."
                className="w-full px-3 py-2 rounded-lg bg-surface text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary/40 font-sans"
              ></textarea>
            </div>

            <div className="pt-2 flex flex-col items-center gap-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-label-lg text-label-lg font-bold bg-primary-container text-on-primary hover:bg-primary transition-all shadow-sm cursor-pointer"
              >
                Lodge Grievance &amp; Issue Token
              </button>
              <Link
                to="/student/raise-grievance"
                onClick={handleReset}
                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Or open full comprehensive grievance form</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container/60 text-secondary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Docket Successfully Lodged!
            </h4>
            <p className="text-body-sm text-outline max-w-sm mx-auto">
              Your grievance has been cryptographically registered and mapped to the institutional redressal pipeline.
            </p>
            <div className="p-3 bg-surface-container rounded-xl inline-block font-mono font-bold text-primary text-lg">
              {submittedDocket}
            </div>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl font-label-md text-label-md font-bold bg-primary text-on-primary hover:bg-primary-container transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
