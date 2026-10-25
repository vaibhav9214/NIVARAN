import React from 'react';
import { rolesMatrixData } from '../../../data/userDepartmentData';

export default function RolesMatrixView() {
  return (
    <div className="flex flex-col gap-space-lg animate-fadeIn">
      <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-outline-variant/20">
        <div className="max-w-2xl mb-space-lg">
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            Institutional Access &amp; Permissions Matrix
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
            Strict role-based segregation enforces the UGC 2023 mandate and ensures grievance anonymity
            integrity across all departmental workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {rolesMatrixData.map((tier) => (
            <div
              key={tier.tier}
              className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between border border-outline-variant/20 hover:shadow-sm transition-shadow"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`p-2 rounded-lg material-symbols-outlined text-[20px] ${tier.iconBg}`}
                  >
                    {tier.icon}
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                    {tier.tier}
                  </h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                  {tier.tagline}
                </p>

                <ul className="space-y-2.5 text-on-surface font-body-sm text-body-sm">
                  {tier.permissions.map((perm, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      {perm.granted ? (
                        <span className="material-symbols-outlined text-secondary text-[18px]">
                          check
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-error text-[18px]">
                          close
                        </span>
                      )}
                      <span className={perm.granted ? 'font-medium' : 'text-outline'}>
                        {perm.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-outline-variant/20 text-outline font-label-sm text-label-sm font-semibold">
                {tier.totalAccounts}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
