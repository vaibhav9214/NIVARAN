import React from 'react';

export default function AssignedAuthorityCard({ officer, onFocusReply }) {
  const data = officer || {
    initials: 'RS',
    name: 'Er. R. Sundaram',
    role: 'Senior Network Systems Engineer',
    subtitle: 'Ombudsman Technical Liaison',
    assignedOn: '16 Oct 2026, 09:30 AM',
    deskOffice: 'Main Computer Center, Rm 104',
    activeDeskHours: '10:00 AM – 05:00 PM',
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-4 shadow-sm border border-outline-variant/20">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          Assigned Authority
        </h3>
        <span className="material-symbols-outlined text-outline text-[18px]">badge</span>
      </div>

      <div className="flex items-start gap-3.5">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary font-bold flex items-center justify-center text-base">
            {data.initials}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[10px]">
            <span className="material-symbols-outlined text-[12px]">check</span>
          </span>
        </div>
        <div className="flex flex-col">
          <h4 className="font-label-lg text-label-lg font-extrabold text-on-surface">
            {data.name}
          </h4>
          <span className="font-label-sm text-xs text-secondary font-semibold">
            {data.role}
          </span>
          <span className="font-body-sm text-[11px] text-outline mt-0.5">
            {data.subtitle}
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-2 bg-surface-container-low/60 rounded-lg p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-outline">Assigned On:</span>
          <span className="font-semibold text-on-surface">{data.assignedOn}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-outline">Desk Office:</span>
          <span className="font-semibold text-on-surface">{data.deskOffice}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-outline">Active Desk Hours:</span>
          <span className="font-semibold text-on-surface">{data.activeDeskHours}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onFocusReply}
        className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary-container font-label-md text-label-md font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">chat</span>
        <span>Message Assigned Officer</span>
      </button>
    </div>
  );
}
