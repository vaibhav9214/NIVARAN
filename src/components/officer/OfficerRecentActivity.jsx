import React from 'react';
import { Link } from 'react-router-dom';

export default function OfficerRecentActivity({ onTriggerToast }) {
  const activities = [
    {
      id: 1,
      dotClass: 'bg-primary',
      title: 'Reviewed grievance GRV-2026-0138',
      meta: 'Lab equipment GPU cluster • 35 mins ago',
      link: '/officer/grievance/GRV-2026-0138',
    },
    {
      id: 2,
      dotClass: 'bg-secondary',
      title: 'Added official update to GRV-2026-0142',
      meta: 'Assigned technician Rajesh • 2 hours ago',
      link: '/officer/grievance/GRV-2026-0142',
    },
    {
      id: 3,
      dotClass: 'bg-primary-fixed-dim',
      title: 'Marked GRV-2026-0117 as resolved',
      meta: 'Eduroam cert re-issued • Yesterday, 4:30 PM',
      link: '/officer/grievance/GRV-2026-0117',
    },
    {
      id: 4,
      dotClass: 'bg-outline',
      title: 'Received 3 new assignments',
      meta: "From Dean's Office triage • Yesterday, 11:15 AM",
      link: null,
    },
  ];

  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col border border-outline-variant/20">
      <div className="flex items-center justify-between mb-space-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
          Recent Activity
        </h3>
        <span className="material-symbols-outlined text-outline text-[20px]">history</span>
      </div>

      <ol className="relative border-l border-surface-container ml-2.5 flex flex-col gap-space-md">
        {activities.map((act) => (
          <li key={act.id} className="ml-4">
            <span
              className={`absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-surface-container-lowest ${act.dotClass}`}
            ></span>
            {act.link ? (
              <Link
                to={act.link}
                className="font-body-sm text-body-sm text-on-surface font-semibold hover:text-primary transition-colors block"
              >
                {act.title}
              </Link>
            ) : (
              <div className="font-body-sm text-body-sm text-on-surface font-semibold">
                {act.title}
              </div>
            )}
            <div className="font-label-sm text-label-sm text-outline mt-0.5">{act.meta}</div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => onTriggerToast && onTriggerToast('Opening Complete Cryptographic Audit Trail...', 'history')}
        className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between font-label-md text-label-md text-primary font-bold hover:underline cursor-pointer text-left"
      >
        <span>View My Audit History</span>
        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
      </button>
    </div>
  );
}
