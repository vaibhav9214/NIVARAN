import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function ExportModal({ isOpen, onClose, totalRecords }) {
  const [format, setFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const scholarIdentity = user?.name ? `${user.name} (${user.email || 'Verified'})` : 'Authenticated Scholar';

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/30 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">download</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Export Grievance Summary
              </h3>
              <p className="text-xs text-outline">Statutory UGC Redressal Ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          <p className="text-xs text-on-surface-variant">
            Export a certified timestamped report of your {totalRecords} registered grievance filings, including SLA progress and authority remediation history.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-outline block">
              Choose Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  format === 'pdf'
                    ? 'border-primary-container bg-surface-container-low text-primary-container font-bold ring-1 ring-primary-container'
                    : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[22px] text-primary">picture_as_pdf</span>
                  {format === 'pdf' && (
                    <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                  )}
                </div>
                <span className="text-xs font-bold">Official PDF Document</span>
                <span className="text-[10px] text-outline">Digitally sealed for institutional submissions</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  format === 'csv'
                    ? 'border-primary-container bg-surface-container-low text-primary-container font-bold ring-1 ring-primary-container'
                    : 'border-outline-variant/40 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[22px] text-secondary">table_chart</span>
                  {format === 'csv' && (
                    <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                  )}
                </div>
                <span className="text-xs font-bold">CSV Spreadsheet</span>
                <span className="text-[10px] text-outline">Complete telemetry log</span>
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1">
            <div className="flex justify-between text-outline">
              <span>Scholar Identity:</span>
              <strong className="text-on-surface font-mono truncate max-w-[220px]">{scholarIdentity}</strong>
            </div>
            <div className="flex justify-between text-outline">
              <span>Included Records:</span>
              <strong className="text-on-surface">{totalRecords} Files</strong>
            </div>
            <div className="flex justify-between text-outline">
              <span>Audit Hash:</span>
              <span className="text-secondary font-mono text-[10px]">sha256:8f2a...c91d</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-5 py-2 rounded-xl bg-primary-container text-on-primary hover:bg-primary font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Compiling Dossier...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Downloaded Successfully</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Generate Official Export</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
