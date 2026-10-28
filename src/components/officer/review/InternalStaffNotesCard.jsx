import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function InternalStaffNotesCard({ caseData, onTriggerToast }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState(caseData.internalNotes || []);
  const [noteText, setNoteText] = useState('');

  const officerName = user?.name || 'Authorized Officer';
  const deptName = user?.department?.name || (typeof caseData?.department === 'string' ? caseData.department : caseData?.department?.name) || 'Liaison';

  const handleAddNote = () => {
    if (!noteText.trim()) {
      onTriggerToast && onTriggerToast('Please enter note text.', 'warning');
      return;
    }

    const newNote = {
      id: `note-${Date.now()}`,
      author: `${officerName} (${deptName})`,
      time: 'Just now',
      tag: 'Internal Staff Memo',
      text: noteText.trim(),
    };

    setNotes([...notes, newNote]);
    setNoteText('');
    onTriggerToast &&
      onTriggerToast('Restricted internal staff note committed to ledger.', 'verified_user');
  };

  return (
    <section className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between pb-space-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[22px]">lock</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Internal Staff Notes
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-label-sm text-label-sm font-bold">
          <span className="material-symbols-outlined text-[14px]">visibility_off</span>
          Restricted: Redacted from Student View
        </div>
      </div>

      {/* Notes List */}
      <div className="flex flex-col gap-space-sm">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-outline-variant/20"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  {note.author}
                </span>
                <span className="font-label-sm text-label-sm text-outline">{note.time}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-semibold">
                {note.tag}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {note.text}
            </p>
          </div>
        ))}
      </div>

      {/* Add Quick Note */}
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="w-full p-space-sm rounded-lg bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm resize-none border border-outline-variant/30"
          placeholder="Add confidential observation, workshop reference, or technician directive..."
          rows="2"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddNote}
            className="px-space-md py-1.5 rounded-lg bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-on-secondary font-label-md text-label-md font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">post_add</span>
            Post Internal Note
          </button>
        </div>
      </div>
    </section>
  );
}
