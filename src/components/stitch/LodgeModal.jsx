import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LodgeModal({ isOpen, onClose, onGrievanceCreated }) {
  const [formData, setFormData] = useState({
    category: 'Academics & Evaluation',
    subject: '',
    description: '',
  });
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) return;

    // This quick form does not create a backend record. Carry the draft to the
    // authenticated, fully validated form instead of showing a fake success.
    const categoryMapping = {
      'Academics & Evaluation': { category: 'Academics & Examination', department: 'ACAD' },
      'Safety Hazard & Infrastructure': { category: 'Safety & Security', department: 'MAINT' },
      'Hostel & Mess Amenities': { category: 'Hostel & Residence', department: 'HOSTEL' },
      'Harassment / Internal Complaints (ICC)': { category: 'Student Services & Welfare', department: '' },
      'Administrative & Finance': { category: 'Administrative & Registry', department: '' },
    };
    const mappedCategory = categoryMapping[formData.category] || {};

    const draft = {
      title: formData.subject.trim(),
      description: formData.description.trim(),
      category: mappedCategory.category || '',
      department: mappedCategory.department || '',
    };
    onClose();
    navigate('/student/raise-grievance', { state: { draft } });
  };

  const handleReset = () => {
    setFormData({
      category: 'Academics & Evaluation',
      subject: '',
      description: '',
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

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <p className="text-xs text-outline bg-surface-container-low p-3 rounded-xl">
              Continue to the secure grievance form to review the required details before submitting. This quick form does not submit or register a grievance.
            </p>

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
                Continue to Secure Grievance Form
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

      </div>
    </div>
  );
}
