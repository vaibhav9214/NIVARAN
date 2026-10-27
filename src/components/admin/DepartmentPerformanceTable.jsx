import React from 'react';
import { Link } from 'react-router-dom';
import { DEPARTMENT_PERFORMANCE } from '../../data/adminDashboardData';

export default function DepartmentPerformanceTable({
  isSlaRiskActive,
  onTriggerToast,
  onSelectDepartment,
}) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm overflow-hidden border border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
            Department Performance
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Compare workload, resolution progress, and deadline compliance across statutory faculties.
          </p>
        </div>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider px-2 py-1 rounded bg-surface-container font-semibold self-start sm:self-auto">
          Cycle 2026.Q1
        </span>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20">
              <th className="py-3 px-3.5 rounded-l-lg">Department</th>
              <th className="py-3 px-2 text-right">Assigned</th>
              <th className="py-3 px-2 text-right">Pending</th>
              <th className="py-3 px-2 text-right">Resolved</th>
              <th className="py-3 px-2 text-right">Overdue</th>
              <th className="py-3 px-3 text-right">Median Time</th>
              <th className="py-3 px-3">Resolution Rate</th>
              <th className="py-3 px-3.5 rounded-r-lg text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-container-high font-body-sm text-body-sm text-on-surface">
            {DEPARTMENT_PERFORMANCE.map((dept) => {
              const isHighlighted = isSlaRiskActive && dept.isHighRisk;

              return (
                <tr
                  key={dept.id}
                  className={`transition-colors cursor-pointer ${
                    isHighlighted
                      ? 'bg-error-container/30 hover:bg-error-container/40'
                      : 'hover:bg-surface-container-low/60'
                  }`}
                  onClick={() => onSelectDepartment && onSelectDepartment(dept.name)}
                >
                  {/* Department Name */}
                  <td className="py-3.5 px-3.5 font-label-md text-label-md text-primary font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dept.dotColor}`}></span>
                      <span>{dept.name}</span>
                    </div>
                  </td>

                  {/* Assigned */}
                  <td className="py-3.5 px-2 text-right font-medium">{dept.assigned}</td>

                  {/* Pending */}
                  <td className="py-3.5 px-2 text-right text-tertiary">{dept.pending}</td>

                  {/* Resolved */}
                  <td className="py-3.5 px-2 text-right font-semibold text-secondary">
                    {dept.resolved}
                  </td>

                  {/* Overdue */}
                  <td className="py-3.5 px-2 text-right">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded font-label-sm text-label-sm font-bold ${
                        dept.overdue > 15
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-high text-tertiary'
                      }`}
                    >
                      {dept.overdue}
                    </span>
                  </td>

                  {/* Median Time */}
                  <td className={`py-3.5 px-3 text-right ${dept.medianTimeClass}`}>
                    {dept.medianTime}
                  </td>

                  {/* Resolution Rate */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="w-24 bg-surface-container-high h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dept.progressColor}`}
                          style={{ width: `${dept.ratePercent}%` }}
                        ></div>
                      </div>
                      <span className="font-label-sm text-label-sm font-semibold">
                        {dept.resolutionRate}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <Link
                      to="/admin/user-department-management"
                      className="text-primary hover:text-secondary font-label-sm text-label-sm inline-flex items-center gap-0.5 font-semibold cursor-pointer"
                    >
                      <span>View</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Utility Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-2 border-t border-outline-variant/10">
        <Link
          to="/admin/user-department-management"
          className="font-label-sm text-label-sm text-primary hover:text-secondary flex items-center gap-1 font-semibold cursor-pointer"
        >
          <span>View All 12 Sub-Departments &amp; Hostels</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </Link>

        <button
          type="button"
          onClick={() =>
            onTriggerToast &&
            onTriggerToast('Compliance matrix generated in CSV spreadsheet format.', 'table_view')
          }
          className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">table_view</span>
          <span>Download Compliance Matrix (CSV)</span>
        </button>
      </div>
    </section>
  );
}
