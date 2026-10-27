import React, { useState } from 'react';

export default function AddUserModal({ isOpen, onClose, onAddUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('officer');
  const [deptKey, setDeptKey] = useState('it');
  const [uid, setUid] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !uid.trim()) return;

    const deptMap = {
      cs: 'Computer Science',
      ee: 'Electrical Engineering',
      me: 'Mechanical Engineering',
      it: 'IT Services',
      infra: 'Infrastructure & Facilities',
      acad: 'Academic Affairs',
      welfare: 'Student Welfare & Housing',
      accounts: 'Accounts & Fee Redressal',
    };

    const department = deptMap[deptKey] || 'General Administration';

    const initials = name
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newUser = {
      id: uid.trim(),
      name: name.trim(),
      email: email.trim(),
      role,
      roleLabel: role === 'student' ? 'Student' : role === 'officer' ? 'Officer' : 'Administrator',
      roleIcon: role === 'student' ? 'school' : role === 'officer' ? 'badge' : 'shield',
      deptKey,
      department,
      subtitle:
        role === 'student'
          ? `${department} Student`
          : role === 'officer'
          ? `Liaison Officer • ${department}`
          : 'Institutional Administrator',
      status: role === 'officer' ? 'pending' : 'active',
      statusLabel: role === 'officer' ? 'Pending Approval' : 'Active',
      registeredDate: 'Today, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      initials: initials || 'NU',
      avatarBg:
        role === 'officer'
          ? 'bg-error-container text-on-error-container'
          : role === 'student'
          ? 'bg-secondary-container text-on-secondary-container'
          : 'bg-primary-container text-on-primary',
      verified: true,
      activeCases: 0,
      authToken: `AUTH-${Math.floor(10000 + Math.random() * 90000)}-Z8`,
    };

    onAddUser(newUser);
    onClose();
    setName('');
    setEmail('');
    setUid('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-xl w-full p-space-xl z-10 overflow-hidden border border-outline-variant/30 animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-space-md border-b border-outline-variant/20">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              User Lifecycle Provisioning
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-0.5">
              Provision Institutional Account
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="mt-space-md space-y-space-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Full Legal Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
                placeholder="e.g. Dr. Sunita Rao"
                required
                type="text"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Institutional Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
                placeholder="s.rao@example.edu"
                required
                type="email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Account Role Tier
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20 cursor-pointer"
                required
              >
                <option value="student">Student Account</option>
                <option value="officer">Department Redressal Officer</option>
                <option value="administrator">Institutional Administrator</option>
              </select>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Assigned Department
              </label>
              <select
                value={deptKey}
                onChange={(e) => setDeptKey(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20 cursor-pointer"
                required
              >
                <option value="it">IT Services</option>
                <option value="infra">Infrastructure &amp; Facilities</option>
                <option value="acad">Academic Affairs</option>
                <option value="welfare">Student Welfare &amp; Housing</option>
                <option value="accounts">Accounts &amp; Fee Redressal</option>
                <option value="cs">Computer Science</option>
                <option value="ee">Electrical Engineering</option>
                <option value="me">Mechanical Engineering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
              Employee / Student Identification Number
            </label>
            <input
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-mono text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
              placeholder="e.g. OFF-0044 or STU-1029"
              required
              type="text"
            />
          </div>

          {/* UGC Mandate Callout Box */}
          <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-3 border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
              security
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              <strong>Security Notice:</strong> Elevated roles (Department Officer &amp; Central Admin)
              trigger mandatory two-factor authorization and audit trail logging in compliance with the
              UGC Grievance Redressal Regulations.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-space-md flex items-center justify-end gap-space-sm border-t border-outline-variant/10">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-label-lg text-label-lg hover:bg-surface-container transition-all cursor-pointer font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-sm flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>Issue Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
