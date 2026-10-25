import React, { useState } from 'react';

export default function EvidenceCard({ caseData, onTriggerToast }) {
  const [inspectOpen, setInspectOpen] = useState(false);

  const attachments = caseData.attachments || [];

  const handleSimulatePdfPreview = (fileName) => {
    onTriggerToast &&
      onTriggerToast(`Loading digital signature viewer for ${fileName}...`, 'picture_as_pdf');
  };

  const handleDownload = (fileName) => {
    onTriggerToast && onTriggerToast(`Downloading attachment: ${fileName}`, 'download');
  };

  return (
    <section className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">attachment</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Evidence &amp; Supporting Attachments
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-primary font-bold">
          {attachments.length} {attachments.length === 1 ? 'File' : 'Files'} Attached
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {attachments.map((att) => {
          const isPdf = att.type === 'pdf';
          const isImg = att.type === 'image';

          return (
            <div
              key={att.id}
              className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors border border-outline-variant/20"
            >
              <div className="flex items-start gap-space-sm">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isPdf
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-secondary-fixed text-on-secondary-fixed'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isPdf ? 'picture_as_pdf' : 'image'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                    {att.name}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">
                    {att.size} • {att.date} • {att.tag}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-space-xs">
                {isPdf ? (
                  <button
                    onClick={() => handleSimulatePdfPreview(att.name)}
                    className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Preview Document
                  </button>
                ) : (
                  <button
                    onClick={() => setInspectOpen(true)}
                    className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    Inspect Optical Mount
                  </button>
                )}

                <button
                  onClick={() => handleDownload(att.name)}
                  className="inline-flex items-center gap-1 font-label-md text-label-md text-outline hover:text-on-surface cursor-pointer"
                  title="Download File"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-Line Evidence Preview Drawer Triggered by Modal */}
      {inspectOpen && (
        <div className="p-space-md rounded-lg bg-surface-container-high flex flex-col gap-space-sm animate-fadeIn border border-outline-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
              Evidence Inspector: Spectrometer Grating Clamp hairline fracture
            </span>
            <button
              className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container cursor-pointer"
              onClick={() => setInspectOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="w-full h-64 rounded-lg overflow-hidden relative bg-black">
            <img
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              alt="Close up photograph of a scientific laboratory optical spectrometer apparatus"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-p8nkhtB8K2dtjUnL3Spm6KDAZw7uTrtqiGuZYPcV-dVS5Jy1OBVZClreHOEToKCioQFF2C9sfd5F4aQ8dQwhGEkZWNdeq-0YORZ7NfG7y_NlZzMIYCPrlx5StkhdpvP5BWL79bMDUncL6V2h5Lex27PrJpHnuOFSNZyXgCHEefCtdU1mRtg4pcVA1I3IxBKTrNgeBa6UaWqmZqws0JxdDkwVDz7qKyTpZ_B89_yyrLeeXwJnYd-X"
            />
            <div className="absolute bottom-2 left-2 bg-inverse-surface/85 text-inverse-on-surface px-2.5 py-1 rounded font-label-sm text-label-sm backdrop-blur-sm shadow-md">
              Ramanujan Hall Lab 2 • Optical Bench 03 • Reticle Alignment Fracture
            </div>
          </div>

          <span className="font-label-sm text-label-sm text-outline">
            EXIF verified: Timestamp matches incident filing date (11 Oct 2026, 11:22 AM).
          </span>
        </div>
      )}
    </section>
  );
}
