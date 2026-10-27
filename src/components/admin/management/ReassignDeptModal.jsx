import React, { useState, useEffect } from 'react';

export default function ReassignDeptModal({
  isOpen,
  onClose,
  user,
  departments = [],
  onReassign,
}) {
  const [selectedDeptKey, setSelectedDeptKey] = useState('');

  useEffect(() => {
    if (user) {
      setSelectedDeptKey(user.deptKey || 'it');
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetDept = departments.find((d) => d.id === selectedDeptKey);
    const deptName = targetDept ? targetDept.name : 'Infrastructure & Facilities';
    onReassign(user.id, selectedDeptKey, deptName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-space-lg z-10 overflow-hidden border border-outline-variant/30 animate-scaleUp">
        <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">swap_horiz</span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              Reassign Department Unit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-space-md space-y-space-md">
          <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-3 border border-outline-variant/10">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold font-label-md text-label-md">
              {user.initials}
            </div>
            <div>
              <div className="font-label-md text-label-md font-bold text-primary">{user.name}</div>
              <div className="text-xs text-outline font-mono">{user.id} • Current: {user.department}</div>
            </div>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
              Select New Assigned Department
            </label>
            <select
              value={selectedDeptKey}
              onChange={(e) => setSelectedDeptKey(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20 cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.officersCount} Officers)
                </option>
              ))}
              <option value="cs">Computer Science (Academic)</option>
              <option value="ee">Electrical Engineering (Academic)</option>
              <option value="me">Mechanical Engineering (Academic)</option>
            </select>
          </div>

          <div className="pt-space-md flex items-center justify-end gap-space-sm border-t border-outline-variant/10">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all cursor-pointer font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-all shadow-sm flex items-center gap-1.5 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Confirm Reassignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
