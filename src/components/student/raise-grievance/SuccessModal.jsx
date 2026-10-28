import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, X, Clock, Building, ShieldCheck } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, confirmation }) {
  const navigate = useNavigate();

  if (!isOpen || !confirmation) return null;

  const ticketId = confirmation.ticketId || '#TICKET';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nivaran-forest/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-nivaran-border flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-nivaran-textMuted hover:text-nivaran-text hover:bg-nivaran-warmCream/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Checkmark Circle */}
        <div className="w-16 h-16 rounded-2xl bg-nivaran-paleGreen border border-nivaran-softGreen flex items-center justify-center text-nivaran-success mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="px-3 py-1 rounded-full bg-nivaran-softGreen text-nivaran-forest text-xs font-bold uppercase tracking-wider mb-2">
          Docket Officially Registered
        </span>

        <h3 className="text-xl sm:text-2xl font-bold font-manrope text-nivaran-forest tracking-tight">
          Grievance Submitted Successfully
        </h3>

        <p className="text-xs sm:text-sm text-nivaran-textSecondary mt-1.5 max-w-sm">
          Your complaint is now in the official triage queue and assigned a legally binding SLA timer.
        </p>

        {/* Ticket ID Summary Box */}
        <div className="w-full bg-nivaran-paleGreen/50 border border-nivaran-softGreen rounded-2xl p-4 my-5 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-semibold text-nivaran-textMuted uppercase tracking-wider">
              Official Reference Number
            </span>
            <span className="font-mono text-lg font-bold text-nivaran-primary">
              {ticketId}
            </span>
          </div>

          <div className="w-full h-px bg-nivaran-border/60 my-2"></div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-nivaran-textMuted block text-[11px]">Department</span>
              <span className="text-nivaran-text font-semibold flex items-center gap-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-nivaran-primary" />
                {confirmation.department || 'Assigned Department'}
              </span>
            </div>
            <div>
              <span className="text-nivaran-textMuted block text-[11px]">Initial Status</span>
              <span className="text-nivaran-forest font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-nivaran-success" />
                {confirmation.status || 'Submitted'}
              </span>
            </div>
            <div>
              <span className="text-nivaran-textMuted block text-[11px]">Category</span>
              <span className="text-nivaran-text font-semibold mt-0.5 block">
                {confirmation.category || 'General'}
              </span>
            </div>
            <div>
              <span className="text-nivaran-textMuted block text-[11px]">SLA Response Deadline</span>
              <span className="text-nivaran-text font-semibold flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-nivaran-warning" />
                7 Days Standard
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              onClose();
              navigate(`/student/grievance-details/${ticketId}`);
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Open Case Docket</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/student/my-grievances');
            }}
            className="py-3 px-4 rounded-xl bg-white border border-nivaran-border hover:bg-nivaran-warmCream/60 text-nivaran-forest font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            View All Grievances
          </button>
        </div>
      </div>
    </div>
  );
}
