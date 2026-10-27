import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuccessModal({ isOpen, onClose, docketId = '#NIV-1025' }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      id="success-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-xl shadow-xl flex flex-col items-center text-center relative">
        {/* Close icon button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-on-surface p-1 rounded-lg cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Big Checkmark Circle */}
        <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container mb-space-md">
          <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>

        <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-space-xs">
          Docket Formally Logged
        </span>

        <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          Grievance Submitted Successfully
        </h3>

        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Your grievance has been assigned an immutable tracker and forwarded to the Collegiate Redressal Committee.
        </p>

        {/* Ticket ID Summary Box */}
        <div className="w-full bg-surface-container-low rounded-xl p-space-md my-space-lg flex flex-col gap-space-xs text-left">
          <div className="flex justify-between items-center">
            <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
              Assigned Docket ID
            </span>
            <span className="font-headline-md text-headline-md text-primary font-bold">
              {docketId}
            </span>
          </div>

          <div className="w-full h-px bg-surface-container my-1"></div>

          <div className="grid grid-cols-2 gap-space-xs font-body-sm text-body-sm">
            <div>
              <span className="text-outline block font-label-sm text-label-sm">Category</span>
              <span className="text-on-surface font-semibold">Hostel &amp; Residence</span>
            </div>
            <div>
              <span className="text-outline block font-label-sm text-label-sm">Statutory SLA</span>
              <span className="text-secondary font-semibold">15 Days (Due 06 Nov)</span>
            </div>
            <div className="col-span-2 pt-1">
              <span className="text-outline block font-label-sm text-label-sm">Assigned Proctor</span>
              <span className="text-on-surface font-semibold">
                Dr. S. K. Mahapatra (Hostel C Wardenship)
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons in Modal */}
        <div className="flex flex-col sm:flex-row gap-space-sm w-full">
          <button
            onClick={() => {
              onClose();
              navigate('/student/my-grievances');
            }}
            className="flex-1 py-3 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View in My Grievances</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/student/dashboard');
            }}
            className="flex-1 py-3 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-space-md flex items-center gap-2 text-outline font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[14px]">sms</span>
          <span>SMS Confirmation sent to +91 98*** **421</span>
        </div>
      </div>
    </div>
  );
}
