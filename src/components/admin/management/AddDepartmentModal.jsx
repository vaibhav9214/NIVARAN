import React, { useState } from 'react';

export default function AddDepartmentModal({ isOpen, onClose, onAddDepartment }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [icon, setIcon] = useState('menu_book');
  const [description, setDescription] = useState('');
  const [leadOfficer, setLeadOfficer] = useState('');
  const [officersCount, setOfficersCount] = useState(5);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 12);

    const newDept = {
      id: id || `unit-${Date.now()}`,
      name: name.trim(),
      code: code.trim() || `UNIT-${name.slice(0, 4).toUpperCase()}`,
      description: description.trim(),
      icon,
      officersCount: Number(officersCount) || 4,
      openCasesCount: 0,
      status: 'Active Unit',
      leadOfficer: leadOfficer.trim() || 'Nomination in progress',
      isHeavy: false,
    };

    onAddDepartment(newDept);
    onClose();
    setName('');
    setCode('');
    setDescription('');
    setLeadOfficer('');
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
        {/* Header */}
        <div className="flex items-start justify-between pb-space-md border-b border-outline-variant/20">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
              Institutional Structure
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-0.5">
              Register Department Unit
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-space-md space-y-space-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Department Unit Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
                placeholder="e.g. Library & Digital Resources"
                required
                type="text"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Unit Code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-mono text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
                placeholder="e.g. UNIT-LIBR"
                type="text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Icon Classification
              </label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20 cursor-pointer"
              >
                <option value="menu_book">menu_book (Library / Publications)</option>
                <option value="devices">devices (IT / Digital Infra)</option>
                <option value="construction">construction (Works / Maintenance)</option>
                <option value="school">school (Academic / Faculty)</option>
                <option value="diversity_1">diversity_1 (Welfare / Housing)</option>
                <option value="account_balance">account_balance (Accounts / Fee)</option>
                <option value="sports_basketball">sports_basketball (Sports / Athletics)</option>
                <option value="local_hospital">local_hospital (Health / Medical)</option>
              </select>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
                Initial Liaison Officer
              </label>
              <input
                value={leadOfficer}
                onChange={(e) => setLeadOfficer(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
                placeholder="e.g. Dr. Kavita Joshi"
                type="text"
              />
            </div>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-1">
              Operational Mandate &amp; SLA Scope
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20 resize-none"
              placeholder="Describe ticket routing scope, jurisdiction, and redressal responsibilities..."
              required
            ></textarea>
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
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              <span>Register Unit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
