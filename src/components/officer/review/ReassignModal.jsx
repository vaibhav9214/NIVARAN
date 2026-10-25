import React, { useState } from 'react';

export default function ReassignModal({ isOpen, onClose, onConfirm }) {
  const [selectedOfficer, setSelectedOfficer] = useState('narayanan');

  if (!isOpen) return null;

  const officers = [
    { id: 'narayanan', name: 'Prof. M. K. Narayanan (Physics HOD)' },
    { id: 'chawla', name: 'Sunil Chawla (Workshop Superintendent)' },
    { id: 'rao', name: 'Dr. Kavita Rao (Academic Grievance Cell)' },
  ];

  const handleTransfer = () => {
    const chosen = officers.find((o) => o.id === selectedOfficer);
    onConfirm(chosen ? chosen.name : 'Target Officer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center p-space-md animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full p-space-xl flex flex-col gap-space-md border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Reassign Docket
          </h3>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant">
          Select a designated peer officer in the Infrastructure or Academic affairs unit:
        </p>

        <div className="flex flex-col gap-2">
          {officers.map((officer) => (
            <label
              key={officer.id}
              className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer border transition-colors ${
                selectedOfficer === officer.id
                  ? 'bg-surface-container border-primary/40'
                  : 'bg-surface-container-low border-transparent hover:bg-surface-container'
              }`}
            >
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                {officer.name}
              </span>
              <input
                type="radio"
                name="reassign_officer"
                value={officer.id}
                checked={selectedOfficer === officer.id}
                onChange={() => setSelectedOfficer(officer.id)}
                className="accent-primary cursor-pointer"
              />
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleTransfer}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold cursor-pointer transition-colors shadow-sm"
          >
            Transfer Docket
          </button>
        </div>
      </div>
    </div>
  );
}
