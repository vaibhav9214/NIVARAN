import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssignedGrievancesTable({
  items,
  selectedRowIds,
  onToggleSelectRow,
  onToggleSelectAll,
  onInspectRow,
  activeInspectedId,
  onTriggerToast,
  rowsPerPage = 10,
  currentPage = 1,
  onPageChange,
}) {
  const navigate = useNavigate();

  const handleCopyTicket = (ticketId, e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ticketId).then(() => {
        onTriggerToast && onTriggerToast(`Ticket ID ${ticketId} copied to clipboard!`, 'content_copy');
      });
    } else {
      onTriggerToast && onTriggerToast(`Copied ${ticketId}`, 'content_copy');
    }
  };

  const isAllSelected = items.length > 0 && selectedRowIds.length === items.length;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-outline-variant/30 flex flex-col">
      <div className="overflow-x-auto min-h-[460px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20">
              <th className="py-3 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3">Ticket ID</th>
              <th className="py-3 px-3">Grievance &amp; Particulars</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Submitted</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Deadline &amp; SLA</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Last Updated</th>
              <th className="py-3 pl-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">
            {items.map((item) => {
              const isChecked = selectedRowIds.includes(item.id);
              const isInspected = activeInspectedId === item.id;

              return (
                <tr
                  key={item.id}
                  onClick={() => onInspectRow(item)}
                  className={`hover:bg-surface-container-low cursor-pointer transition-colors group ${
                    isInspected ? 'bg-surface-container/60 shadow-[inset_3px_0_0_0_#003f2b]' : ''
                  }`}
                >
                  {/* 1. Checkbox */}
                  <td className="py-3.5 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelectRow(item.id)}
                      className="w-4 h-4 rounded text-primary accent-primary focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* 2. Ticket ID */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="font-label-md text-label-md font-bold text-primary group-hover:underline">
                        {item.ticketId}
                      </span>
                      <button
                        onClick={(e) => handleCopyTicket(item.ticketId, e)}
                        className="opacity-0 group-hover:opacity-100 text-outline hover:text-primary transition-opacity cursor-pointer p-0.5"
                        title="Copy Ticket ID"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      </button>
                    </div>
                    <span className="text-[11px] text-outline font-label-sm block">
                      {item.section}
                    </span>
                  </td>

                  {/* 3. Grievance & Summary */}
                  <td className="py-3.5 px-3 min-w-[220px]">
                    <div className="font-label-lg text-label-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">
                      {item.summary}
                    </div>
                  </td>

                  {/* 4. Category */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/10">
                      {item.category}
                    </span>
                  </td>

                  {/* 5. Submitted */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-outline text-[12px]">
                    {item.submitted}
                  </td>

                  {/* 6. Priority */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full ${item.priorityClass}`}>
                      {item.priority}
                    </span>
                  </td>

                  {/* 7. Deadline & SLA */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span
                        className={`font-label-sm text-label-sm flex items-center gap-1 ${
                          item.slaStatus === 'overdue'
                            ? 'text-error font-bold'
                            : item.slaStatus === 'today'
                            ? 'text-amber-800 font-bold'
                            : 'text-secondary font-semibold'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {item.slaIcon}
                        </span>
                        {item.deadline}
                      </span>
                      <span className="text-[11px] text-outline">{item.target}</span>
                    </div>
                  </td>

                  {/* 8. Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full ${item.statusClass}`}>
                      {item.status}
                    </span>
                  </td>

                  {/* 9. Last Updated */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-[12px] text-outline">
                    {item.lastUpdated}
                  </td>

                  {/* 10. Actions */}
                  <td
                    className="py-3.5 pl-3 pr-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/officer/grievance/${item.id}`)}
                        className="px-3 py-1 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm font-bold hover:bg-primary-container transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Review</span>
                      </button>

                      <button
                        onClick={() => onInspectRow(item)}
                        className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
                        title="Inspect in side drawer"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer & Pagination */}
      <div className="py-3 px-space-md bg-surface-container-lowest border-t border-surface-container-high flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <span className="font-label-sm text-label-sm text-outline">
            Showing <span className="text-on-surface font-bold">1–{items.length}</span> of 24 grievances
          </span>
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-outline">
            <span>Rows per page:</span>
            <select
              defaultValue={rowsPerPage}
              className="bg-surface-container-low text-on-surface rounded px-2 py-0.5 outline-none cursor-pointer border border-outline-variant/20"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled
            className="px-2.5 py-1 rounded-lg text-outline font-label-sm text-label-sm opacity-40 cursor-not-allowed"
          >
            Previous
          </button>
          <button className="w-7 h-7 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center shadow-xs">
            1
          </button>
          <button
            onClick={() => onTriggerToast && onTriggerToast('Navigating to Page 2...', 'pages')}
            className="w-7 h-7 rounded-lg hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center cursor-pointer transition-colors"
          >
            2
          </button>
          <button
            onClick={() => onTriggerToast && onTriggerToast('Navigating to Page 3...', 'pages')}
            className="w-7 h-7 rounded-lg hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center cursor-pointer transition-colors"
          >
            3
          </button>
          <button
            onClick={() => onTriggerToast && onTriggerToast('Navigating to Page 2...', 'navigate_next')}
            className="px-2.5 py-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-sm text-label-sm cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
