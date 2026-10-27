import React, { useState } from 'react';

export default function DepartmentsHierarchyView({
  departments = [],
  onOpenAddDepartment,
  onTriggerToast,
  onDeleteDepartment,
  onSelectDepartmentForFilter,
}) {
  const [activeMenuDeptId, setActiveMenuDeptId] = useState(null);

  return (
    <div className="flex flex-col gap-space-lg animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20">
        <div>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            Active Academic &amp; Administrative Units
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Departments handle automatic ticket routing, SLA resolution assignments, and physical
            works dispatch.
          </p>
        </div>
        <button
          onClick={onOpenAddDepartment}
          className="px-4 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm hover:bg-primary transition-all cursor-pointer font-bold shrink-0 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> Register Unit
        </button>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {departments.map((dept) => {
          return (
            <div
              key={dept.id}
              className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20 hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[22px]">
                      {dept.icon || 'apartment'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
                      {dept.status || 'Active Unit'}
                    </span>

                    {/* Department More Actions */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuDeptId(activeMenuDeptId === dept.id ? null : dept.id)
                        }
                        className="p-1 rounded text-outline hover:text-on-surface cursor-pointer"
                        title="Department Actions"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>

                      {activeMenuDeptId === dept.id && (
                        <div
                          className="absolute right-0 mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-xl py-1 z-30 border border-outline-variant/30 text-left animate-fadeIn"
                          onMouseLeave={() => setActiveMenuDeptId(null)}
                        >
                          <button
                            onClick={() => {
                              onSelectDepartmentForFilter?.(dept.id);
                              setActiveMenuDeptId(null);
                            }}
                            className="w-full px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-outline">
                              group
                            </span>
                            View Department Users
                          </button>
                          <button
                            onClick={() => {
                              onTriggerToast?.(
                                `Routing rules refreshed for ${dept.name}.`,
                                'success'
                              );
                              setActiveMenuDeptId(null);
                            }}
                            className="w-full px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-outline">
                              tune
                            </span>
                            Configure SLA Routing
                          </button>
                          <button
                            onClick={() => {
                              onDeleteDepartment?.(dept);
                              setActiveMenuDeptId(null);
                            }}
                            className="w-full px-3 py-2 text-xs font-semibold text-error hover:bg-error-container/20 flex items-center gap-2 cursor-pointer border-t border-outline-variant/10"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              delete
                            </span>
                            Decommission Unit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  {dept.name}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  {dept.description}
                </p>

                {dept.leadOfficer && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-outline">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      shield_person
                    </span>
                    <span>Liaison: <strong className="text-on-surface font-semibold">{dept.leadOfficer}</strong></span>
                  </div>
                )}
              </div>

              {/* Bottom Card Strip */}
              <div className="mt-6 pt-4 bg-surface-container-low/50 -mx-space-lg -mb-space-lg p-space-md rounded-b-xl flex items-center justify-between font-label-md text-label-md border-t border-outline-variant/20">
                <span className="text-on-surface font-medium">{dept.officersCount} Officers</span>
                <span
                  className={
                    dept.isHeavy
                      ? 'text-error font-bold flex items-center gap-1'
                      : 'text-secondary font-bold'
                  }
                >
                  {dept.openCasesCount} Open Cases {dept.isHeavy ? '(Heavy)' : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
