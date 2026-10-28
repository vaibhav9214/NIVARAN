import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { adminAPI } from '../../services/api';
import {
  Users,
  Building,
  Shield,
  PlusCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function UserDepartmentManagementPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'departments' | 'officers'
  const [search, setSearch] = useState('');

  // Data
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pendingOfficers, setPendingOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isCreateDeptOpen, setIsCreateDeptOpen] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '' });
  const [creatingDept, setCreatingDept] = useState(false);

  const [isCreateOfficerOpen, setIsCreateOfficerOpen] = useState(false);
  const [officerForm, setOfficerForm] = useState({ name: '', email: '', password: '', department: '' });
  const [creatingOfficer, setCreatingOfficer] = useState(false);

  // Role filter
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, deptsRes, pendingRes] = await Promise.all([
        adminAPI.getUsers().catch(() => ({ data: { users: [] } })),
        adminAPI.getDepartments().catch(() => ({ data: { departments: [] } })),
        adminAPI.getPendingOfficers().catch(() => ({ data: { pendingOfficers: [] } })),
      ]);

      if (usersRes.data?.users) setUsers(usersRes.data.users);
      if (deptsRes.data?.departments) setDepartments(deptsRes.data.departments);
      if (pendingRes.data?.pendingOfficers) setPendingOfficers(pendingRes.data.pendingOfficers);
    } catch (err) {
      console.error('Failed to load user and department management data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch registry data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminAPI.updateUserRole(userId, newRole);
      if (res.data?.success) {
        alert(`User role updated to ${newRole}.`);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  // Toggle User Status
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await adminAPI.updateUserStatus(userId, newStatus);
      if (res.data?.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  // Create Department
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) return;
    setCreatingDept(true);
    try {
      const res = await adminAPI.createDepartment(deptForm);
      if (res.data?.success) {
        setIsCreateDeptOpen(false);
        setDeptForm({ name: '', code: '', description: '' });
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create department.');
    } finally {
      setCreatingDept(false);
    }
  };

  // Create Officer
  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    if (!officerForm.name || !officerForm.email || !officerForm.password) return;
    setCreatingOfficer(true);
    try {
      const res = await adminAPI.createOfficer(officerForm);
      if (res.data?.success) {
        setIsCreateOfficerOpen(false);
        setOfficerForm({ name: '', email: '', password: '', department: '' });
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create officer account.');
    } finally {
      setCreatingOfficer(false);
    }
  };

  // Approve Pending Officer
  const handleApproveOfficer = async (officerId, departmentId) => {
    try {
      const res = await adminAPI.approveOfficer(officerId, {
        departmentId: departmentId || undefined,
        accessScope: 'department',
      });
      if (res.data?.success) {
        alert('Officer account approved successfully.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve officer.');
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search.trim() ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="users-departments"
      />

      <div className="flex-1 w-full lg:pl-72 flex flex-col min-h-screen">
        <AdminHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={search}
          onSearchChange={setSearch}
        />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-manrope text-nivaran-forest tracking-tight">
                User &amp; Department Administration
              </h1>
              <p className="text-xs sm:text-sm text-nivaran-textSecondary mt-0.5">
                Manage university personnel, role assignments, collegiate units, and officer accreditations.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 rounded-xl bg-white border border-nivaran-border hover:bg-nivaran-warmCream/60 text-nivaran-forest shadow-2xs cursor-pointer"
                title="Refresh Registry"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsCreateDeptOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-nivaran-paleGreen border border-nivaran-softGreen text-nivaran-forest font-semibold text-xs flex items-center gap-1.5 hover:bg-nivaran-softGreen shadow-2xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-nivaran-primary" />
                <span>New Department</span>
              </button>
              <button
                onClick={() => setIsCreateOfficerOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Provision Officer</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-nivaran-errorBg border border-nivaran-error/30 text-nivaran-error text-xs">
              {error}
            </div>
          )}

          {/* Pending Officer Approvals Notification if any */}
          {pendingOfficers.length > 0 && (
            <div className="p-4 rounded-2xl bg-nivaran-warningBg border border-nivaran-warning/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-nivaran-warning shrink-0" />
                <div>
                  <span className="font-bold text-xs text-nivaran-forest block">
                    Pending Officer Accreditations ({pendingOfficers.length})
                  </span>
                  <p className="text-[11px] text-nivaran-textSecondary mt-0.5">
                    Newly registered officer accounts require administrative verification before accessing case dockets.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {pendingOfficers.map((po) => (
                  <button
                    key={po._id}
                    onClick={() => handleApproveOfficer(po._id, departments[0]?._id)}
                    className="px-3 py-1.5 rounded-lg bg-nivaran-warning hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve {po.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-nivaran-divider pb-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-nivaran-forest text-white shadow-xs'
                  : 'text-nivaran-textSecondary hover:bg-nivaran-warmCream/60'
              }`}
            >
              Users Registry ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'departments'
                  ? 'bg-nivaran-forest text-white shadow-xs'
                  : 'text-nivaran-textSecondary hover:bg-nivaran-warmCream/60'
              }`}
            >
              Collegiate Departments ({departments.length})
            </button>
          </div>

          {/* TAB 1: Users Registry */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Search & Role Filter */}
              <div className="bg-white p-4 rounded-2xl border border-nivaran-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-nivaran-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter by name or email..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
                  />
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-semibold text-nivaran-textMuted">Role:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs border border-nivaran-border bg-nivaran-ivory text-nivaran-text cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="officer">Officer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-nivaran-paleGreen/60 border-b border-nivaran-border text-nivaran-forest font-semibold uppercase text-[11px]">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Institutional Email</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nivaran-divider">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-nivaran-textMuted">
                            Loading user registry records...
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-nivaran-textMuted">
                            No users found matching query.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-nivaran-paleGreen/30 transition-colors">
                            <td className="py-3 px-4 font-semibold text-nivaran-text">{u.name}</td>
                            <td className="py-3 px-4 font-mono text-nivaran-textSecondary text-[11px]">
                              {u.email}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                className="px-2 py-1 rounded-lg text-xs font-semibold bg-nivaran-ivory border border-nivaran-border text-nivaran-forest cursor-pointer"
                              >
                                <option value="student">Student</option>
                                <option value="officer">Officer</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-nivaran-textSecondary">
                              {u.department?.name || 'General Campus'}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  u.status === 'active'
                                    ? 'bg-nivaran-successBg text-nivaran-success'
                                    : u.status === 'pending'
                                    ? 'bg-nivaran-warningBg text-nivaran-warning'
                                    : 'bg-nivaran-errorBg text-nivaran-error'
                                }`}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleToggleStatus(u._id, u.status)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                                  u.status === 'active'
                                    ? 'border border-nivaran-error/30 text-nivaran-error hover:bg-nivaran-errorBg'
                                    : 'bg-nivaran-successBg text-nivaran-success hover:bg-green-100'
                                }`}
                              >
                                {u.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Collegiate Departments */}
          {activeTab === 'departments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {departments.map((dept) => (
                <div
                  key={dept._id}
                  className="bg-white p-5 rounded-2xl border border-nivaran-border shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-nivaran-primary px-2 py-0.5 rounded bg-nivaran-paleGreen border border-nivaran-softGreen">
                        {dept.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          dept.isActive ? 'text-nivaran-success' : 'text-nivaran-error'
                        }`}
                      >
                        {dept.isActive ? 'Active Unit' : 'Inactive'}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-nivaran-forest">{dept.name}</h3>
                    <p className="text-xs text-nivaran-textSecondary mt-1 leading-relaxed">
                      {dept.description || 'Statutory university branch handling student redressal.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Department Modal */}
      {isCreateDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nivaran-forest/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-nivaran-border space-y-4">
            <h3 className="text-base font-bold font-manrope text-nivaran-forest">
              Register New Academic Department
            </h3>
            <form onSubmit={handleCreateDepartment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Mechanical Engineering"
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">
                  Department Code (Unique)
                </label>
                <input
                  type="text"
                  required
                  value={deptForm.code}
                  onChange={(e) => setDeptForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. MECH"
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">
                  Scope Description
                </label>
                <textarea
                  rows={3}
                  value={deptForm.description}
                  onChange={(e) => setDeptForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Outline jurisdiction and academic or facility areas covered..."
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateDeptOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-nivaran-textSecondary hover:bg-nivaran-warmCream/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDept}
                  className="px-4 py-2 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs disabled:opacity-50"
                >
                  {creatingDept ? 'Creating...' : 'Register Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provision Officer Modal */}
      {isCreateOfficerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nivaran-forest/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-nivaran-border space-y-4">
            <h3 className="text-base font-bold font-manrope text-nivaran-forest">
              Provision Department Officer Account
            </h3>
            <form onSubmit={handleCreateOfficer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={officerForm.name}
                  onChange={(e) => setOfficerForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Officer Name"
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  value={officerForm.email}
                  onChange={(e) => setOfficerForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="officer@nivaran.edu"
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">
                  Temporary Access Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={officerForm.password}
                  onChange={(e) => setOfficerForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Minimum 6 characters"
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">
                  Assigned Department
                </label>
                <select
                  value={officerForm.department}
                  onChange={(e) => setOfficerForm((p) => ({ ...p, department: e.target.value }))}
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text"
                >
                  <option value="">Select Department...</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOfficerOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-nivaran-textSecondary hover:bg-nivaran-warmCream/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingOfficer}
                  className="px-4 py-2 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs disabled:opacity-50"
                >
                  {creatingOfficer ? 'Provisioning...' : 'Provision Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
