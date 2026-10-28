import React, { useState } from 'react';

export default function GrievanceLedgerTable({
  records,
  totalRecordsCount,
  onViewDocket,
  visibleColumns,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const totalPages = Math.ceil(records.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, records.length);
  const currentRecords = records.slice(startIndex, endIndex);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden transition-all relative border border-outline-variant/20">
      {/* Live Table View */}
      <div className="overflow-x-auto" id="main-table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider select-none border-b border-outline-variant/30">
              {visibleColumns.ticketId && (
                <th className="py-3.5 px-5 font-bold whitespace-nowrap" scope="col">
                  Ticket ID
                </th>
              )}
              {visibleColumns.title && (
                <th className="py-3.5 px-4 font-bold min-w-[280px]" scope="col">
                  Grievance Title &amp; Scope
                </th>
              )}
              {visibleColumns.category && (
                <th className="py-3.5 px-4 font-bold whitespace-nowrap" scope="col">
                  Category
                </th>
              )}
              {visibleColumns.submitted && (
                <th className="py-3.5 px-4 font-bold whitespace-nowrap" scope="col">
                  Submitted
                </th>
              )}
              {visibleColumns.lastUpdated && (
                <th className="py-3.5 px-4 font-bold whitespace-nowrap" scope="col">
                  Last Updated
                </th>
              )}
              {visibleColumns.status && (
                <th className="py-3.5 px-4 font-bold whitespace-nowrap" scope="col">
                  Status
                </th>
              )}
              {visibleColumns.statutorySla && (
                <th className="py-3.5 px-4 font-bold min-w-[180px]" scope="col">
                  Statutory SLA
                </th>
              )}
              {visibleColumns.action && (
                <th className="py-3.5 px-5 font-bold text-right whitespace-nowrap" scope="col">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-container-high/40 font-body-sm text-body-sm text-on-surface">
            {currentRecords.map((item) => (
              <tr
                key={item.id}
                className="ledger-row hover:bg-surface-container-low/40 transition-colors group"
              >
                {/* 1. Ticket ID */}
                {visibleColumns.ticketId && (
                  <td className="py-4 px-5 whitespace-nowrap">
                    <button
                      onClick={() => onViewDocket(item)}
                      className="font-mono font-bold text-primary hover:text-secondary flex items-center gap-1 cursor-pointer text-left"
                    >
                      <span>{item.ticketId}</span>
                      <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
                        open_in_new
                      </span>
                    </button>
                  </td>
                )}

                {/* 2. Grievance Title & Scope */}
                {visibleColumns.title && (
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <button
                        onClick={() => onViewDocket(item)}
                        className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors text-left"
                      >
                        {item.title}
                      </button>
                      <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[15px] text-outline">
                          {item.scopeIcon || 'apartment'}
                        </span>
                        <span>{item.scope}</span>
                      </span>
                    </div>
                  </td>
                )}

                {/* 3. Category */}
                {visibleColumns.category && (
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                      {item.categoryLabel || item.category}
                    </span>
                  </td>
                )}

                {/* 4. Submitted */}
                {visibleColumns.submitted && (
                  <td className="py-4 px-4 whitespace-nowrap font-label-md text-label-md text-on-surface-variant">
                    {item.submitted}
                  </td>
                )}

                {/* 5. Last Updated */}
                {visibleColumns.lastUpdated && (
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md text-on-surface font-medium">
                        {item.lastUpdated}
                      </span>
                      <span className={`font-label-sm text-label-sm ${item.updatedRelativeClass}`}>
                        {item.updatedRelative}
                      </span>
                    </div>
                  </td>
                )}

                {/* 6. Status */}
                {visibleColumns.status && (
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider ${
                        item.statusBadgeClass || 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {item.statusIcon ? (
                        <span className="material-symbols-outlined text-[14px]">{item.statusIcon}</span>
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${item.statusDotClass || 'bg-outline'}`}
                        ></span>
                      )}
                      <span>{item.status}</span>
                    </span>
                  </td>
                )}

                {/* 7. Statutory SLA */}
                {visibleColumns.statutorySla && (
                  <td className="py-4 px-4">
                    {item.slaType === 'progress' ? (
                      <div className="space-y-1.5 min-w-[150px]">
                        <div className="flex items-center justify-between text-on-surface font-label-sm text-label-sm">
                          <span className={`font-bold px-2 py-0.5 rounded ${item.slaBadgeClass}`}>
                            {item.slaText}
                          </span>
                          <span className="text-outline">{item.slaSubtext}</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`${item.slaProgressColor || 'bg-primary'} h-1.5 rounded-full transition-all duration-300`}
                            style={{ width: `${item.slaProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-label-sm text-label-sm font-bold ${
                          item.slaBadgeClass || 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {item.slaIcon && (
                          <span className="material-symbols-outlined text-[15px]">
                            {item.slaIcon}
                          </span>
                        )}
                        <span>{item.slaText}</span>
                      </div>
                    )}
                  </td>
                )}

                {/* 8. Action */}
                {visibleColumns.action && (
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onViewDocket(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary font-label-sm text-label-sm font-bold transition-all cursor-pointer"
                    >
                      <span>View Docket</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and Controls Bar */}
      <div className="p-4 bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-container-high/40 font-label-md text-label-md text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span>
            Showing{' '}
            <strong className="text-on-surface font-semibold">
              {records.length > 0 ? `${startIndex + 1} to ${endIndex}` : '0 to 0'}
            </strong>{' '}
            of {totalRecordsCount} grievances
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-all disabled:opacity-40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-primary-container text-on-primary shadow-xs'
                    : 'text-on-surface hover:bg-surface-container font-semibold'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-all disabled:opacity-40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-outline">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-surface-container-lowest text-on-surface font-label-md text-label-md rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-container border border-outline-variant/30 cursor-pointer"
          >
            <option value={7}>7</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
