import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GrievanceForm({
  onSubmit,
  onSaveDraft,
  onPolishWithAi,
  showToast
}) {
  const [formData, setFormData] = useState({
    title: 'Non-functioning hot water geyser in Hostel Block C, 3rd Floor',
    category: 'hostel',
    location: 'Hostel Block C, Wing B, 3rd Floor Bathroom',
    description:
      'The central water heater geyser for Block C (North Wing, 3rd floor washroom cluster) has been inoperable for the past 6 days. Morning temperatures have dropped below 11°C, severely affecting daily schedules and hygiene for over 48 resident scholars. Despite two verbal notifications to the assistant hostel warden and an entry in the physical caretaker ledger on 18 Oct, no technical technician has arrived.',
    incidentDate: '2026-10-22',
    area: 'Hostel Block C, North Wing',
    reportedBefore: 'yes',
    prevTicketId: 'HOSTEL-MAINT-891',
    confirmedAccuracy: true
  });

  const [files, setFiles] = useState([
    {
      id: 'file-item-1',
      name: 'geyser_maintenance_slip_oct22.pdf',
      size: '1.4 MB',
      type: 'pdf'
    },
    {
      id: 'file-item-2',
      name: 'corridor_notice_photo.jpg',
      size: '2.8 MB',
      type: 'image'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const uploaded = e.target.files;
    if (uploaded && uploaded.length > 0) {
      const newFiles = Array.from(uploaded).map((file, idx) => ({
        id: `upload-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type.includes('pdf') ? 'pdf' : 'image'
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      if (showToast) {
        showToast(`${uploaded.length} file(s) attached and scanned.`);
      }
    }
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (showToast) {
      showToast('Attachment removed.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.confirmedAccuracy) {
      if (showToast) showToast('Please confirm the accuracy checkbox before submitting.');
      return;
    }
    if (onSubmit) onSubmit(formData, files);
  };

  return (
    <form
      id="grievance-form"
      onSubmit={handleFormSubmit}
      className="bg-surface-container-lowest rounded-xl p-space-lg sm:p-space-xl shadow-sm flex flex-col gap-space-xl"
    >
      {/* SECTION A: Basic Information */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-xs bg-surface-container-lowest">
          <div className="flex items-center gap-space-sm">
            <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-bold">
              A
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Basic Information
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
            Essential Context
          </span>
        </div>

        {/* Field 1: Grievance Title */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex justify-between items-center">
            <label
              className="font-label-lg text-label-lg text-on-surface font-semibold"
              htmlFor="grievance-title"
            >
              Grievance Title <span className="text-error font-bold">*</span>
            </label>
            <span className="font-label-sm text-label-sm text-outline" id="title-counter">
              {formData.title.length} / 120 max
            </span>
          </div>
          <input
            id="grievance-title"
            name="title"
            type="text"
            required
            maxLength={120}
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Briefly describe your concern"
            className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary"
          />
          <p className="font-body-sm text-body-sm text-outline">
            State the primary core issue succinctly for the administrative roster.
          </p>
        </div>

        {/* Field 2 & 3: Category & Department/Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* Category Dropdown */}
          <div className="flex flex-col gap-space-xs">
            <label
              className="font-label-lg text-label-lg text-on-surface font-semibold"
              htmlFor="grievance-category"
            >
              Category <span className="text-error font-bold">*</span>
            </label>
            <div className="relative">
              <select
                id="grievance-category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full appearance-none px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary cursor-pointer pr-10"
              >
                <option value="hostel">Hostel &amp; Residence</option>
                <option value="mess">Mess &amp; Food Facilities</option>
                <option value="academics">Academics &amp; Curriculum</option>
                <option value="infrastructure">Campus Infrastructure &amp; IT</option>
                <option value="administration">Administrative &amp; Registry</option>
                <option value="finance">Fees &amp; Financial Redress</option>
                <option value="services">Student Well-being &amp; Services</option>
                <option value="other">Other Statutory Concerns</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Specific Sub-location */}
          <div className="flex flex-col gap-space-xs">
            <label
              className="font-label-lg text-label-lg text-on-surface font-semibold"
              htmlFor="grievance-loc"
            >
              Department or Location <span className="text-outline font-normal font-label-sm text-label-sm">(Specific)</span>
            </label>
            <input
              id="grievance-loc"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Mechanical Workshop 2 or Hall 4"
              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary"
            />
          </div>
        </div>

        {/* Field 4: Detailed Description */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex justify-between items-center">
            <label
              className="font-label-lg text-label-lg text-on-surface font-semibold"
              htmlFor="grievance-desc"
            >
              Detailed Description <span className="text-error font-bold">*</span>
            </label>
            <span className="font-label-sm text-label-sm text-outline" id="desc-counter">
              {formData.description.length} / 2000 chars
            </span>
          </div>
          <textarea
            id="grievance-desc"
            name="description"
            rows={5}
            required
            maxLength={2000}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Explain the issue, when it occurred, and how it affects you."
            className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary"
          />
          <div className="flex items-center justify-between text-outline font-body-sm text-body-sm pt-1">
            <span>Be specific regarding dates, previous spoken notices, and affected individuals.</span>
            <button
              type="button"
              onClick={onPolishWithAi}
              className="text-secondary hover:text-primary-container font-label-sm text-label-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
              Polish via AI
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-surface-container"></div>

      {/* SECTION B: Incident Details & History */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-bold">
              B
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Incident Details &amp; History
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
            Audit Trail
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* Incident Date */}
          <div className="flex flex-col gap-space-xs">
            <label
              className="font-label-lg text-label-lg text-on-surface font-semibold"
              htmlFor="incident-date"
            >
              Date Incident Began / Occurred <span className="text-error font-bold">*</span>
            </label>
            <input
              id="incident-date"
              name="incidentDate"
              type="date"
              required
              value={formData.incidentDate}
              onChange={handleInputChange}
              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary cursor-pointer"
            />
          </div>

          {/* Location of Incident */}
          <div className="flex flex-col gap-space-xs">
            <label
              className="font-label-lg text-label-lg text-on-surface font-semibold"
              htmlFor="incident-specific-loc"
            >
              Physical Area of Incident <span className="text-error font-bold">*</span>
            </label>
            <input
              id="incident-specific-loc"
              name="area"
              type="text"
              required
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Specific room, lab, or premises"
              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary"
            />
          </div>
        </div>

        {/* Radio Pill Selection: Has this issue been reported before? */}
        <div className="flex flex-col gap-space-sm pt-space-xs">
          <label className="font-label-lg text-label-lg text-on-surface font-semibold">
            Has this issue been reported before through college channels?
          </label>
          <div className="flex flex-wrap items-center gap-space-md">
            {/* Yes Option */}
            <label className="relative flex items-center gap-space-sm px-space-lg py-2.5 rounded-lg bg-surface-container-low cursor-pointer transition-all hover:bg-secondary-container/40">
              <input
                type="radio"
                name="reportedBefore"
                value="yes"
                checked={formData.reportedBefore === 'yes'}
                onChange={handleInputChange}
                className="accent-primary w-4 h-4 cursor-pointer"
              />
              <span className="font-label-lg text-label-lg text-primary-container font-semibold">
                Yes, previously logged
              </span>
            </label>

            {/* No Option */}
            <label className="relative flex items-center gap-space-sm px-space-lg py-2.5 rounded-lg bg-surface-container-low cursor-pointer transition-all hover:bg-secondary-container/40">
              <input
                type="radio"
                name="reportedBefore"
                value="no"
                checked={formData.reportedBefore === 'no'}
                onChange={handleInputChange}
                className="accent-primary w-4 h-4 cursor-pointer"
              />
              <span className="font-label-lg text-label-lg text-on-surface font-medium">
                No, first time reporting
              </span>
            </label>
          </div>
        </div>

        {/* Conditional Existing Ticket Field */}
        <div
          id="existing-ticket-wrap"
          className={`flex flex-col gap-space-xs transition-all duration-200 ${
            formData.reportedBefore === 'no' ? 'opacity-40 pointer-events-none' : ''
          }`}
        >
          <label
            className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-2"
            htmlFor="prev-ticket-id"
          >
            <span>Existing Docket ID or Caretaker Entry Slip</span>
            <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
              Auto-Linked
            </span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              receipt_long
            </span>
            <input
              id="prev-ticket-id"
              name="prevTicketId"
              type="text"
              disabled={formData.reportedBefore === 'no'}
              value={formData.prevTicketId}
              onChange={handleInputChange}
              placeholder="e.g. NIV-1011 or maintenance slip number"
              className="w-full pl-10 pr-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary"
            />
          </div>
          <p className="font-body-sm text-body-sm text-outline">
            Entering past ticket numbers allows ombudsmen to review previous non-compliance or delay timelines.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-surface-container"></div>

      {/* SECTION C: Supporting Evidence */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-bold">
              C
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Supporting Evidence
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
            Max 15MB total
          </span>
        </div>

        {/* Drag and Drop Box */}
        <div className="relative bg-surface-container-low rounded-xl p-space-xl flex flex-col items-center justify-center text-center transition-all hover:bg-secondary-container/20 group border-2 border-dashed border-outline-variant/40">
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-space-sm group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
          </div>
          <p className="font-label-lg text-label-lg text-primary-container font-semibold">
            Drag and drop relevant images, receipts, or maintenance slips, or{' '}
            <span className="underline decoration-2 text-secondary">Browse Files</span>
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Supported Formats: PDF, JPG, PNG, DOCX (Max 15MB file size)
          </p>
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="flex flex-col gap-space-xs" id="file-list-container">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold mb-1">
              Attached Files ({files.length} documents uploaded)
            </span>

            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {file.type === 'pdf' ? 'picture_as_pdf' : 'image'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                      {file.name}
                    </span>
                    <div className="flex items-center gap-2 font-body-sm text-body-sm text-outline">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span className="text-secondary flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Verified &amp; Encrypted
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  title="Remove attachment"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-surface-container"></div>

      {/* SECTION D: Confirmation & Action Buttons */}
      <section className="flex flex-col gap-space-md">
        {/* Accuracy Checkbox */}
        <label className="flex items-start gap-space-sm cursor-pointer select-none group">
          <input
            id="confirm-accuracy"
            type="checkbox"
            required
            name="confirmedAccuracy"
            checked={formData.confirmedAccuracy}
            onChange={handleInputChange}
            className="accent-primary mt-1 w-4 h-4 cursor-pointer"
          />
          <span className="font-body-md text-body-md text-on-surface leading-snug">
            I confirm that the information provided is accurate and true to the best of my knowledge under university conduct standards. I understand false submissions may be subject to institutional inquiry.
          </span>
        </label>

        {/* Action Bar Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
          <div className="flex items-center gap-space-sm w-full sm:w-auto">
            {/* Primary CTA: Submit Grievance */}
            <button
              id="submit-cta-btn"
              type="submit"
              className="w-full sm:w-auto px-space-xl py-3 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Grievance</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>

            {/* Secondary CTA: Save Draft */}
            <button
              type="button"
              onClick={() => onSaveDraft && onSaveDraft(formData)}
              className="w-full sm:w-auto px-space-lg py-3 rounded-lg bg-surface-container-low text-primary-container font-label-lg text-label-lg font-semibold hover:bg-surface-container transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save Draft</span>
            </button>
          </div>

          {/* Cancel Button */}
          <Link
            to="/student/dashboard"
            className="text-outline hover:text-on-surface font-label-lg text-label-lg font-medium transition-colors"
          >
            Cancel &amp; Return to Dashboard
          </Link>
        </div>
      </section>
    </form>
  );
}
