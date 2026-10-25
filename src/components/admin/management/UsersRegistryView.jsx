import React, { useState, useMemo } from 'react';

export default function UsersRegistryView({
  users = [],
  onOpenProfileDrawer,
  onOpenAddUser,
  onTriggerToast,
  onUpdateUserStatus,
  onReassignUserDepartment,
  onDeleteUser,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  deptFilter,
  setDeptFilter,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuUserId, setActiveMenuUserId] = useState(null);

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q) ||
        user.department.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesDept = deptFilter === 'all' || user.deptKey === deptFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesDept;
    });
  }, [users, searchQuery, roleFilter, statusFilter, deptFilter]);

  // Selection handlers
  const isAllSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedUserIds.includes(u.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((item) => item !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const clearSelection = () => {
    setSelectedUserIds([]);
  };

  // Batch actions
  const handleBatchVerify = () => {
    onTriggerToast?.(
      `Verified SSO identity credentials for ${selectedUserIds.length} account(s).`,
      'success'
    );
    clearSelection();
  };

  const handleBatchSuspend = () => {
    selectedUserIds.forEach((id) => onUpdateUserStatus?.(id, 'suspended'));
    onTriggerToast?.(
      `Suspended access for ${selectedUserIds.length} account(s) pending audit review.`,
      'warning'
    );
    clearSelection();
  };

  const handleExportCSV = () => {
    onTriggerToast?.(
      'Generating signed UGC-compliant CSV export with masked PII and timestamp signatures...',
      'info'
    );
  };

  return (
    <div className="flex flex-col gap-space-lg animate-fadeIn">
      {/* Filter Toolbar & Operations Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md border border-outline-variant/20">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-lg pl-10 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
            placeholder="Search by name, institutional email, or user ID (e.g. STU-1024)..."
            type="text"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container text-outline">
              ⌘K
            </span>
          )}
        </div>

        {/* Filter Controls Group */}
        <div className="flex flex-wrap items-center gap-space-sm">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-on-surface font-label-md text-label-md focus:outline-none cursor-pointer"
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="student">Student ({users.filter((u) => u.role === 'student').length})</option>
              <option value="officer">Officer ({users.filter((u) => u.role === 'officer').length})</option>
              <option value="administrator">
                Administrator ({users.filter((u) => u.role === 'administrator').length})
              </option>
            </select>
          </div>

          {/* Account Status Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-outline text-[18px]">toggle_on</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-on-surface font-label-md text-label-md focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending Approval</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/20">
            <span className="material-symbols-outlined text-outline text-[18px]">apartment</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-transparent text-on-surface font-label-md text-label-md focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="cs">Computer Science</option>
              <option value="ee">Electrical Engineering</option>
              <option value="me">Mechanical Engineering</option>
              <option value="it">IT Services</option>
              <option value="infra">Infrastructure &amp; Facilities</option>
              <option value="acad">Academic Affairs</option>
              <option value="welfare">Student Welfare</option>
              <option value="accounts">Accounts &amp; Fee Redressal</option>
            </select>
          </div>

          {/* Export UGC Compliant Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container text-label-md font-label-md font-semibold transition-colors cursor-pointer border border-outline-variant/20"
            title="Export UGC Compliant Audit Log"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">download</span>
            <span className="hidden sm:inline">Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips / Batch Action Bar */}
      {selectedUserIds.length > 0 && (
        <div className="bg-primary text-on-primary px-space-md py-space-sm rounded-xl flex items-center justify-between shadow-md animate-fadeIn">
          <div className="flex items-center gap-space-md flex-wrap">
            <span className="font-label-lg text-label-lg flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-[20px] text-primary-fixed">
                check_circle
              </span>
              <span>
                {selectedUserIds.length} {selectedUserIds.length === 1 ? 'account' : 'accounts'}{' '}
                selected
              </span>
            </span>
            <div className="h-4 w-px bg-on-primary/20 hidden sm:block"></div>
            <div className="flex items-center gap-2 font-label-md text-label-md flex-wrap">
              <button
                onClick={() =>
                  onTriggerToast?.(
                    'Department batch re-assignment modal opened for selected accounts.',
                    'info'
                  )
                }
                className="px-2.5 py-1 rounded bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 transition-colors cursor-pointer"
              >
                Assign Department
              </button>
              <button
                onClick={handleBatchVerify}
                className="px-2.5 py-1 rounded bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 transition-colors cursor-pointer"
              >
                Bulk Verify SSO
              </button>
              <button
                onClick={handleBatchSuspend}
                className="px-2.5 py-1 rounded bg-error-container text-on-error-container hover:opacity-90 transition-opacity cursor-pointer font-bold"
              >
                Suspend Selected
              </button>
            </div>
          </div>
          <button
            onClick={clearSelection}
            className="text-on-primary/80 hover:text-on-primary font-label-sm text-label-sm flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span> Deselect
          </button>
        </div>
      )}

      {/* Interactive Data Table Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20">
                <th className="p-space-md w-12 text-center">
                  <input
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-primary focus:ring-secondary accent-primary cursor-pointer"
                    type="checkbox"
                    aria-label="Select all accounts"
                  />
                </th>
                <th className="py-space-md px-space-sm font-bold">User &amp; Identity</th>
                <th className="py-space-md px-space-sm font-bold">Institutional Email</th>
                <th className="py-space-md px-space-sm font-bold">ID / UID</th>
                <th className="py-space-md px-space-sm font-bold">Role Tier</th>
                <th className="py-space-md px-space-sm font-bold">Department</th>
                <th className="py-space-md px-space-sm font-bold">Status</th>
                <th className="py-space-md px-space-sm font-bold">Registered</th>
                <th className="py-space-md px-space-md text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-on-surface font-body-sm text-body-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[40px] text-outline mb-2">
                      person_search
                    </span>
                    <p className="font-headline-sm text-headline-sm text-primary font-bold">
                      No matching institutional accounts found
                    </p>
                    <p className="font-body-sm text-body-sm text-outline mt-1">
                      Try adjusting your search criteria or resetting filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  const isPending = user.status === 'pending';
                  const isSuspended = user.status === 'suspended';

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-surface-container-low/70 transition-colors ${
                        isPending ? 'bg-surface-container-low/40' : ''
                      } ${isSelected ? 'bg-primary-fixed/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="p-space-md text-center">
                        <input
                          checked={isSelected}
                          onChange={() => toggleSelectUser(user.id)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                          type="checkbox"
                        />
                      </td>

                      {/* User & Identity */}
                      <td className="py-space-md px-space-sm">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-label-md font-label-md shrink-0 shadow-xs ${user.avatarBg}`}
                          >
                            {user.initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-lg text-label-lg text-primary font-bold truncate flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isPending && (
                                <span
                                  className="w-2 h-2 rounded-full bg-error animate-ping"
                                  title="Urgent statutory approval required"
                                ></span>
                              )}
                            </span>
                            <span className="font-label-sm text-label-sm text-outline truncate">
                              {user.subtitle}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Institutional Email */}
                      <td className="py-space-md px-space-sm text-on-surface-variant">
                        <span className="font-mono text-xs">{user.email}</span>
                      </td>

                      {/* ID / UID */}
                      <td className="py-space-md px-space-sm">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-xs font-semibold">
                          {user.id}
                        </span>
                      </td>

                      {/* Role Tier */}
                      <td className="py-space-md px-space-sm">
                        {user.role === 'student' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase font-semibold">
                            <span className="material-symbols-outlined text-[14px]">school</span>{' '}
                            Student
                          </span>
                        ) : user.role === 'officer' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm uppercase font-semibold">
                            <span className="material-symbols-outlined text-[14px]">
                              {user.roleIcon || 'badge'}
                            </span>{' '}
                            Officer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase font-semibold">
                            <span className="material-symbols-outlined text-[14px]">shield</span> Admin
                          </span>
                        )}
                      </td>

                      {/* Department */}
                      <td className="py-space-md px-space-sm text-on-surface font-medium">
                        {user.department}
                      </td>

                      {/* Status */}
                      <td className="py-space-md px-space-sm">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                            <span className="w-2 h-2 rounded-full bg-error"></span> Pending Approval
                          </span>
                        ) : isSuspended ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-on-error font-label-sm text-label-sm font-semibold">
                            <span className="w-2 h-2 rounded-full bg-error"></span> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
                            <span className="w-2 h-2 rounded-full bg-secondary"></span> Active
                          </span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="py-space-md px-space-sm text-outline text-xs">
                        {user.registeredDate}
                      </td>

                      {/* Actions */}
                      <td className="py-space-md px-space-md text-right relative">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending ? (
                            <button
                              onClick={() => onOpenProfileDrawer(user)}
                              className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm hover:bg-secondary-fixed transition-colors font-bold cursor-pointer"
                            >
                              Review
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenProfileDrawer(user)}
                              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
                              title="View Dossier"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                          )}

                          {/* More Menu Dropdown Toggle */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenuUserId(
                                  activeMenuUserId === user.id ? null : user.id
                                )
                              }
                              className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
                              title="Account Actions"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                more_vert
                              </span>
                            </button>

                            {activeMenuUserId === user.id && (
                              <div
                                className="absolute right-0 mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-xl py-1 z-30 border border-outline-variant/30 text-left animate-fadeIn"
                                onMouseLeave={() => setActiveMenuUserId(null)}
                              >
                                <button
                                  onClick={() => {
                                    onOpenProfileDrawer(user);
                                    setActiveMenuUserId(null);
                                  }}
                                  className="w-full px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[16px] text-outline">
                                    dock_to_left
                                  </span>
                                  Open Dossier
                                </button>
                                {isPending ? (
                                  <button
                                    onClick={() => {
                                      onUpdateUserStatus?.(user.id, 'active');
                                      setActiveMenuUserId(null);
                                      onTriggerToast?.(
                                        `Approved credentials for ${user.name} (${user.id}).`,
                                        'success'
                                      );
                                    }}
                                    className="w-full px-3 py-2 text-xs font-semibold text-secondary hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      check_circle
                                    </span>
                                    Approve Nominee
                                  </button>
                                ) : isSuspended ? (
                                  <button
                                    onClick={() => {
                                      onUpdateUserStatus?.(user.id, 'active');
                                      setActiveMenuUserId(null);
                                      onTriggerToast?.(
                                        `Re-activated account for ${user.name}.`,
                                        'success'
                                      );
                                    }}
                                    className="w-full px-3 py-2 text-xs font-semibold text-secondary hover:bg-surface-container flex items-center gap-2 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      lock_open
                                    </span>
                                    Reactivate Account
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      onUpdateUserStatus?.(user.id, 'suspended');
                                      setActiveMenuUserId(null);
                                      onTriggerToast?.(
                                        `Suspended account for ${user.name}.`,
                                        'warning'
                                      );
                                    }}
                                    className="w-full px-3 py-2 text-xs font-semibold text-error hover:bg-error-container/20 flex items-center gap-2 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">
                                      block
                                    </span>
                                    Suspend Account
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    onDeleteUser?.(user);
                                    setActiveMenuUserId(null);
                                  }}
                                  className="w-full px-3 py-2 text-xs font-semibold text-error hover:bg-error-container/20 flex items-center gap-2 cursor-pointer border-t border-outline-variant/10"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    delete
                                  </span>
                                  Delete Profile
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-outline-variant/20">
          <div className="flex items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant flex-wrap">
            <span>
              Showing{' '}
              <strong className="text-on-surface font-semibold">
                {filteredUsers.length === 0 ? 0 : 1}–{filteredUsers.length}
              </strong>{' '}
              of <strong className="text-on-surface font-semibold">{users.length}</strong>{' '}
              institutional accounts
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-label-sm uppercase text-outline">Rows:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-surface-container-lowest text-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-sm focus:outline-none cursor-pointer border border-outline-variant/20"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg bg-surface-container-lowest text-outline hover:text-on-surface flex items-center justify-center transition-colors shadow-sm disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center shadow-sm font-bold">
              1
            </button>
            <button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container flex items-center justify-center transition-colors shadow-sm cursor-pointer">
              2
            </button>
            <button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container flex items-center justify-center transition-colors shadow-sm cursor-pointer">
              3
            </button>
            <span className="px-1 text-outline font-label-md text-label-md">…</span>
            <button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container flex items-center justify-center transition-colors shadow-sm cursor-pointer">
              249
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface hover:text-primary flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
