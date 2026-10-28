import React from 'react';

export default function AssignedKpiGrid({ activeFilter, onSelectFilter }) {
  const kpis = [
    {
      id: 'all',
      title: 'Total Assigned',
      count: '24',
      badge: '+3 new this week',
      badgeClass: 'text-secondary bg-surface-container font-bold',
      sub: 'Active workload roster',
      action: 'Filter →',
      icon: 'inbox',
      iconBg: 'bg-surface-container text-primary group-hover:bg-primary group-hover:text-on-primary',
    },
    {
      id: 'Awaiting Review',
      title: 'Awaiting Review',
      count: '8',
      badge: 'Initial triage needed',
      badgeClass: 'text-on-surface-variant bg-surface-container font-semibold',
      sub: 'Requires assessment',
      action: 'Filter →',
      icon: 'schedule',
      iconBg: 'bg-surface-container-high text-tertiary-container group-hover:bg-tertiary-container group-hover:text-on-tertiary',
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      count: '11',
      badge: 'Actively handled',
      badgeClass: 'text-secondary bg-surface-container font-semibold',
      sub: 'Under investigation',
      action: 'Filter →',
      icon: 'sync',
      iconBg: 'bg-secondary-fixed text-on-secondary-fixed group-hover:bg-secondary group-hover:text-on-secondary',
    },
    {
      id: 'Overdue',
      title: 'Overdue SLA',
      count: '3',
      badge: 'Past deadline',
      badgeClass: 'text-error bg-error-container font-bold',
      sub: 'Automated escalation risk',
      action: 'Isolate →',
      icon: 'warning',
      iconBg: 'bg-error-container text-error group-hover:bg-error group-hover:text-on-error',
      isOverdue: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-lg">
      {kpis.map((kpi) => {
        const isCurrent = activeFilter === kpi.id;

        return (
          <div
            key={kpi.id}
            onClick={() => onSelectFilter(kpi.id)}
            className={`cursor-pointer bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden border ${
              isCurrent
                ? 'ring-2 ring-primary border-primary/50'
                : 'border-outline-variant/30 hover:border-outline-variant'
            }`}
          >
            {kpi.isOverdue && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error"></div>}

            <div className={`flex items-center justify-between mb-2 ${kpi.isOverdue ? 'pl-2' : ''}`}>
              <span
                className={`font-label-md text-label-md uppercase tracking-wider ${
                  kpi.isOverdue ? 'text-error font-bold' : 'text-outline'
                }`}
              >
                {kpi.title}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${kpi.iconBg}`}
              >
                <span className="material-symbols-outlined text-[20px]">{kpi.icon}</span>
              </div>
            </div>

            <div className={`flex items-baseline gap-2 ${kpi.isOverdue ? 'pl-2' : ''}`}>
              <span
                className={`font-display-lg text-display-lg leading-none ${
                  kpi.isOverdue ? 'text-error' : 'text-on-surface'
                }`}
              >
                {kpi.count}
              </span>
              <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${kpi.badgeClass}`}>
                {kpi.badge}
              </span>
            </div>

            <div
              className={`mt-3 pt-2 flex items-center justify-between text-outline font-label-sm text-label-sm border-t border-outline-variant/10 ${
                kpi.isOverdue ? 'pl-2' : ''
              }`}
            >
              <span>{kpi.sub}</span>
              <span
                className={`font-bold group-hover:translate-x-1 transition-transform ${
                  kpi.isOverdue ? 'text-error' : 'text-primary'
                }`}
              >
                {kpi.action}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
