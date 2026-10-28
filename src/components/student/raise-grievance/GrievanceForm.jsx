import React, { useState, useEffect } from 'react';
import { Upload, X, FileText, Sparkles, AlertCircle, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { studentAPI } from '../../../services/api';

const CATEGORIES = [
  'Hostel & Residence',
  'Academics & Examination',
  'Mess & Food Quality',
  'Campus Infrastructure & Maintenance',
  'Administrative & Registry',
  'Fees & Financial Assistance',
  'Student Services & Welfare',
  'Safety & Security',
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function GrievanceForm({
  formData,
  setFormData,
  files,
  setFiles,
  onSubmit,
  isSubmitting,
  onRunAiAssist,
  aiLoading,
}) {
  const [validationErrors, setValidationErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  useEffect(() => {
    let isMounted = true;
    studentAPI.getDepartments()
      .then((res) => {
        if (isMounted && res.data?.departments) {
          setDepartments(res.data.departments);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic departments:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingDepts(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const newFiles = Array.from(selected);
    // Limit to 5 files
    if (files.length + newFiles.length > 5) {
      alert('You can upload a maximum of 5 files.');
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errors = {};
    if (!formData.title || formData.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long.';
    } else if (formData.title.trim().length > 200) {
      errors.title = 'Title cannot exceed 200 characters.';
    }

    if (!formData.category) {
      errors.category = 'Please select a grievance category.';
    }

    if (!formData.department) {
      errors.department = 'Please select a designated department.';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long.';
    }

    if (!formData.confirmedAccuracy) {
      errors.confirmedAccuracy = 'You must confirm the accuracy of this statement.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-nivaran-border flex flex-col gap-6"
    >
      {/* SECTION 1: Core Grievance Particulars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-nivaran-divider">
          <div className="flex items-center gap-2 text-nivaran-forest font-bold text-base">
            <span className="w-6 h-6 rounded-lg bg-nivaran-paleGreen text-nivaran-primary flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>Grievance Particulars</span>
          </div>
          <span className="text-[11px] font-semibold text-nivaran-textMuted uppercase tracking-wider">
            Mandatory Fields
          </span>
        </div>

        {/* Title */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-nivaran-text">
              Grievance Title <span className="text-nivaran-error">*</span>
            </label>
            <span className="text-[11px] text-nivaran-textMuted">
              {formData.title?.length || 0} / 200
            </span>
          </div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Non-functioning water heating systems in Hostel Block C"
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 transition-all ${
              validationErrors.title
                ? 'border-nivaran-error focus:border-nivaran-error'
                : 'border-nivaran-border focus:border-nivaran-primary'
            }`}
          />
          {validationErrors.title && (
            <p className="text-xs text-nivaran-error mt-1">{validationErrors.title}</p>
          )}
        </div>

        {/* Category & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-nivaran-text mb-1">
              Grievance Category <span className="text-nivaran-error">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 transition-all ${
                validationErrors.category
                  ? 'border-nivaran-error focus:border-nivaran-error'
                  : 'border-nivaran-border focus:border-nivaran-primary'
              }`}
            >
              <option value="">Select Category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="text-xs text-nivaran-error mt-1">{validationErrors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-nivaran-text mb-1">
              Designated Department <span className="text-nivaran-error">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 transition-all ${
                validationErrors.department
                  ? 'border-nivaran-error focus:border-nivaran-error'
                  : 'border-nivaran-border focus:border-nivaran-primary'
              }`}
            >
              <option value="">
                {loadingDepts ? 'Loading departments from database...' : 'Select Department...'}
              </option>
              {departments.map((dept) => (
                <option key={dept.code || dept._id} value={dept.code || dept.name}>
                  {dept.name} {dept.code ? `(${dept.code})` : ''}
                </option>
              ))}
            </select>
            {validationErrors.department && (
              <p className="text-xs text-nivaran-error mt-1">{validationErrors.department}</p>
            )}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-semibold text-nivaran-text mb-1">
            Urgency / Priority
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRIORITIES.map((p) => {
              const isSelected = formData.priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, priority: p }))}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-nivaran-forest text-white border-nivaran-forest shadow-xs'
                      : 'bg-white border-nivaran-border text-nivaran-textSecondary hover:border-nivaran-primary hover:text-nivaran-primary'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-nivaran-text">
              Detailed Description <span className="text-nivaran-error">*</span>
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-nivaran-textMuted">
                {formData.description?.length || 0} characters
              </span>
              <button
                type="button"
                onClick={onRunAiAssist}
                disabled={aiLoading || !formData.title || !formData.description}
                className="text-xs font-semibold text-nivaran-primary hover:text-nivaran-forest flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiLoading ? 'Analyzing...' : 'AI Assist'}</span>
              </button>
            </div>
          </div>
          <textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the incident, dates, locations, affected individuals, and previous spoken notices..."
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 transition-all ${
              validationErrors.description
                ? 'border-nivaran-error focus:border-nivaran-error'
                : 'border-nivaran-border focus:border-nivaran-primary'
            }`}
          />
          {validationErrors.description && (
            <p className="text-xs text-nivaran-error mt-1">{validationErrors.description}</p>
          )}
        </div>
      </div>

      {/* SECTION 2: Supporting Documents & Evidence */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-nivaran-divider">
          <div className="flex items-center gap-2 text-nivaran-forest font-bold text-base">
            <span className="w-6 h-6 rounded-lg bg-nivaran-paleGreen text-nivaran-primary flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>Supporting Evidence &amp; Attachments</span>
          </div>
          <span className="text-[11px] font-semibold text-nivaran-textMuted uppercase tracking-wider">
            Up to 5 files (Max 10MB each)
          </span>
        </div>

        {/* Drag/Drop & File Input */}
        <label className="border-2 border-dashed border-nivaran-border hover:border-nivaran-primary rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center bg-nivaran-paleGreen/30 hover:bg-nivaran-paleGreen/60 transition-all block">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-xl bg-white border border-nivaran-softGreen flex items-center justify-center text-nivaran-primary mb-2 shadow-2xs">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-nivaran-text">
            Click or drag files to attach evidence
          </p>
          <p className="text-[11px] text-nivaran-textMuted mt-0.5">
            Supported formats: PDF, DOC, DOCX, JPG, PNG
          </p>
        </label>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-nivaran-ivory rounded-xl border border-nivaran-border text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileText className="w-4 h-4 text-nivaran-primary shrink-0" />
                  <span className="truncate font-medium text-nivaran-text">{file.name}</span>
                  <span className="text-[10px] text-nivaran-textMuted shrink-0">
                    ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="p-1 rounded-lg text-nivaran-textMuted hover:text-nivaran-error hover:bg-nivaran-errorBg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: Confirmation & Submission */}
      <div className="space-y-4 pt-2">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-nivaran-textSecondary select-none">
          <input
            type="checkbox"
            name="confirmedAccuracy"
            checked={formData.confirmedAccuracy || false}
            onChange={handleInputChange}
            className="mt-0.5 rounded border-nivaran-border text-nivaran-primary focus:ring-nivaran-primary"
          />
          <span>
            I solemnly declare that all particulars stated above are true to the best of my knowledge and understand that false representation is subject to disciplinary policy.
          </span>
        </label>
        {validationErrors.confirmedAccuracy && (
          <p className="text-xs text-nivaran-error">{validationErrors.confirmedAccuracy}</p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-nivaran-divider">
          <p className="text-[11px] text-nivaran-textMuted">
            Official Case ID will be generated immediately by the server upon submission.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Transmitting Docket...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Grievance Officially</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
