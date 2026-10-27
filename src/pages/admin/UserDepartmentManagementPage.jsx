import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ManagementSimulationBar from '../../components/admin/management/ManagementSimulationBar';
import ManagementKpiCards from '../../components/admin/management/ManagementKpiCards';
import ManagementTabBar from '../../components/admin/management/ManagementTabBar';
import UsersRegistryView from '../../components/admin/management/UsersRegistryView';
import DepartmentsHierarchyView from '../../components/admin/management/DepartmentsHierarchyView';
import OfficersDeskView from '../../components/admin/management/OfficersDeskView';
import RolesMatrixView from '../../components/admin/management/RolesMatrixView';
import UserProfileDrawer from '../../components/admin/management/UserProfileDrawer';
import AddUserModal from '../../components/admin/management/AddUserModal';
import AddDepartmentModal from '../../components/admin/management/AddDepartmentModal';
import ConfirmDeleteModal from '../../components/admin/management/ConfirmDeleteModal';
import ReassignDeptModal from '../../components/admin/management/ReassignDeptModal';
import { initialUsers, initialDepartments } from '../../data/userDepartmentData';

export default function UserDepartmentManagementPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'users';
  const [activeTab, setActiveTab] = useState(
    ['users', 'officers', 'departments', 'roles'].includes(initialTab) ? initialTab : 'users'
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['users', 'officers', 'departments', 'roles'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Main state collections
  const [users, setUsers] = useState(initialUsers);
  const [departments, setDepartments] = useState(initialDepartments);

  // Filters state
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  // Modals and Drawer state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState(null);

  // Reassignment modal
  const [reassignTargetUser, setReassignTargetUser] = useState(null);

  // Delete confirmation modal
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });

  // Toast feedback state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success', // 'success' | 'info' | 'warning' | 'error'
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Helper counts
  const pendingOfficers = users.filter(
    (u) => u.role === 'officer' && u.status === 'pending'
  );
  const activeDepts = departments.filter((d) => d.status === 'Active Unit');

  // Actions on Users
  const handleAddUser = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
    showToast(
      `Institutional account created for ${newUser.name} (${newUser.id}). CAS credential dispatch sent.`,
      'success'
    );
  };

  const handleUpdateUserStatus = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const statusLabel =
            newStatus === 'active'
              ? 'Active'
              : newStatus === 'pending'
              ? 'Pending Approval'
              : 'Suspended';
          return { ...u, status: newStatus, statusLabel };
        }
        return u;
      })
    );
  };

  const handleApproveOfficer = (officerId) => {
    handleUpdateUserStatus(officerId, 'active');
    const officer = users.find((u) => u.id === officerId);
    showToast(
      `Officer credentials approved! Nominee ${officer ? officer.name : officerId} is now authorized for redressal dispatch.`,
      'success'
    );
  };

  const handleRejectOfficer = (officerId) => {
    const officer = users.find((u) => u.id === officerId);
    setUsers((prev) => prev.filter((u) => u.id !== officerId));
    showToast(
      `Officer nomination for ${officer ? officer.name : officerId} was rejected and removed from queue.`,
      'warning'
    );
  };

  const handleReassignDepartment = (userId, newDeptKey, newDeptName) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            deptKey: newDeptKey,
            department: newDeptName,
          };
        }
        return u;
      })
    );
    showToast(`Department routing reassigned to ${newDeptName}.`, 'success');
  };

  const handleDeleteUserPrompt = (user) => {
    setDeleteModalConfig({
      isOpen: true,
      title: 'Delete Institutional Account',
      itemName: `${user.name} (${user.id})`,
      message: `Are you sure you want to delete this profile? Associated records will be archived in compliance with statutory audit retention policies.`,
      confirmLabel: 'Delete Profile',
      onConfirm: () => {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setDeleteModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Account for ${user.name} was successfully deleted.`, 'info');
      },
    });
  };

  // Actions on Departments
  const handleAddDepartment = (newDept) => {
    setDepartments((prev) => [...prev, newDept]);
    showToast(
      `Department unit "${newDept.name}" registered successfully with active SLA routing.`,
      'success'
    );
  };

  const handleDeleteDepartmentPrompt = (dept) => {
    setDeleteModalConfig({
      isOpen: true,
      title: 'Decommission Department Unit',
      itemName: dept.name,
      message: `Decommissioning this unit will require re-routing ${dept.openCasesCount || 0} open grievances and reassigning ${dept.officersCount || 0} officers. Proceed?`,
      confirmLabel: 'Decommission Unit',
      onConfirm: () => {
        setDepartments((prev) => prev.filter((d) => d.id !== dept.id));
        setDeleteModalConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(`Department unit "${dept.name}" was decommissioned.`, 'info');
      },
    });
  };

  // Open Drawer with selected user
  const handleOpenProfileDrawer = (user) => {
    setSelectedUserForDrawer(user);
    setIsDrawerOpen(true);
  };

  // Simulation quick switches
  const handleSimulationSelectTab = (tab) => {
    handleTabChange(tab);
    if (tab === 'users') {
      setRoleFilter('all');
      setStatusFilter('all');
      setDeptFilter('all');
    } else if (tab === 'officers') {
      setRoleFilter('officer');
      setStatusFilter('pending');
    }
  };

  const handleOpenDrawerWithSample = () => {
    const sample = users.find((u) => u.id === 'OFF-0043') || users[0];
    handleOpenProfileDrawer(sample);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bounceIn flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface max-w-md">
          <span
            className={`material-symbols-outlined text-[20px] ${
              toast.type === 'success'
                ? 'text-secondary'
                : toast.type === 'error'
                ? 'text-error'
                : toast.type === 'warning'
                ? 'text-error'
                : 'text-primary'
            }`}
          >
            {toast.type === 'success'
              ? 'check_circle'
              : toast.type === 'error'
              ? 'error'
              : toast.type === 'warning'
              ? 'warning'
              : 'info'}
          </span>
          <p className="font-body-sm text-body-sm text-on-surface flex-1">{toast.message}</p>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="text-outline hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav={
          activeTab === 'departments'
            ? 'department-management'
            : activeTab === 'officers'
            ? 'officer-management'
            : 'user-management'
        }
      />

      <div className="lg:pl-72 transition-all">
        {/* Admin Top Header */}
        <AdminHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onTriggerToast={showToast}
          breadcrumb="User & Department Management"
        />

        {/* Main Content Area */}
        <main className="relative pt-20 w-full min-h-screen bg-surface px-4 sm:px-gutter py-space-lg">
          <div className="flex flex-col w-full max-w-7xl mx-auto">
            {/* Simulation State Banner & Quick Trigger Strip */}
            <ManagementSimulationBar
              activeTab={activeTab}
              onSelectTab={handleSimulationSelectTab}
              onOpenAddUser={() => setIsAddUserModalOpen(true)}
              onOpenDrawerWithSample={handleOpenDrawerWithSample}
            />

            {/* Page Title & Header Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Institutional Governance
                  </span>
                  <span className="text-outline text-xs">•</span>
                  <span className="font-label-sm text-label-sm text-outline">
                    Registry Sync: 3 mins ago
                  </span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-extrabold">
                  User &amp; Department Management
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-1 leading-relaxed">
                  Manage institutional accounts, assign department liaisons, oversee role privileges,
                  and maintain secure operational access to the NIVARAN redressal portal.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
                <button
                  onClick={() => setIsAddDeptModalOpen(true)}
                  className="px-4 py-2.5 rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg shadow-sm hover:bg-surface-container-low transition-all flex items-center gap-2 border border-outline-variant/30 font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">domain_add</span>
                  <span>+ Add Department</span>
                </button>
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="px-4 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary transition-all flex items-center gap-2 font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>+ Add User</span>
                </button>
              </div>
            </div>

            {/* 4-Card Summary Metrics Row */}
            <ManagementKpiCards
              totalAccounts={2486 + users.length - initialUsers.length}
              enrolledStudents={2412}
              authorizedOfficers={58 + (users.filter(u => u.role === 'officer' && u.status === 'active').length - 2)}
              pendingApprovals={pendingOfficers.length}
              onReviewPending={() => {
                handleTabChange('officers');
                setStatusFilter('pending');
                setRoleFilter('officer');
              }}
            />

            {/* Main Segmented Navigation Bar */}
            <ManagementTabBar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              usersCount={users.length}
              pendingOfficersCount={pendingOfficers.length}
              activeDeptsCount={activeDepts.length}
            />

            {/* View Switching Containers */}
            {activeTab === 'users' && (
              <UsersRegistryView
                users={users}
                onOpenProfileDrawer={handleOpenProfileDrawer}
                onOpenAddUser={() => setIsAddUserModalOpen(true)}
                onTriggerToast={showToast}
                onUpdateUserStatus={handleUpdateUserStatus}
                onReassignUserDepartment={(user) => setReassignTargetUser(user)}
                onDeleteUser={handleDeleteUserPrompt}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                deptFilter={deptFilter}
                setDeptFilter={setDeptFilter}
              />
            )}

            {activeTab === 'officers' && (
              <OfficersDeskView
                officers={users}
                onOpenProfileDrawer={handleOpenProfileDrawer}
                onApproveOfficer={handleApproveOfficer}
                onRejectOfficer={handleRejectOfficer}
                onTriggerToast={showToast}
              />
            )}

            {activeTab === 'departments' && (
              <DepartmentsHierarchyView
                departments={departments}
                onOpenAddDepartment={() => setIsAddDeptModalOpen(true)}
                onTriggerToast={showToast}
                onDeleteDepartment={handleDeleteDepartmentPrompt}
                onSelectDepartmentForFilter={(deptId) => {
                  setDeptFilter(deptId);
                  setActiveTab('users');
                }}
              />
            )}

            {activeTab === 'roles' && <RolesMatrixView />}
          </div>
        </main>
      </div>

      {/* Slide-out User Profile Drawer */}
      <UserProfileDrawer
        isOpen={isDrawerOpen}
        user={selectedUserForDrawer}
        onClose={() => setIsDrawerOpen(false)}
        onApproveOfficer={handleApproveOfficer}
        onRejectOfficer={handleRejectOfficer}
        onToggleStatus={handleUpdateUserStatus}
        onReassignDepartment={(u) => setReassignTargetUser(u)}
        onTriggerToast={showToast}
      />

      {/* Add User Modal Dialog */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />

      {/* Add Department Modal Dialog */}
      <AddDepartmentModal
        isOpen={isAddDeptModalOpen}
        onClose={() => setIsAddDeptModalOpen(false)}
        onAddDepartment={handleAddDepartment}
      />

      {/* Reassign Department Unit Modal Dialog */}
      <ReassignDeptModal
        isOpen={Boolean(reassignTargetUser)}
        user={reassignTargetUser}
        departments={departments}
        onClose={() => setReassignTargetUser(null)}
        onReassign={handleReassignDepartment}
      />

      {/* Confirm Delete / Decommission Modal Dialog */}
      <ConfirmDeleteModal
        isOpen={deleteModalConfig.isOpen}
        title={deleteModalConfig.title}
        itemName={deleteModalConfig.itemName}
        message={deleteModalConfig.message}
        confirmLabel={deleteModalConfig.confirmLabel}
        onConfirm={deleteModalConfig.onConfirm}
        onClose={() => setDeleteModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
