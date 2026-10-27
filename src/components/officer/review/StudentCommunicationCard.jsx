import React, { useState } from 'react';

export default function StudentCommunicationCard({ caseData, onTriggerToast }) {
  const [messages, setMessages] = useState(caseData.messages || []);
  const [messageText, setMessageText] = useState('');

  const insertTemplate = (type) => {
    let t = '';
    if (type === 'request_serial') {
      t = 'Please provide the exact asset barcodes stamped on the back panel of Bench 04 and Bench 07 oscilloscope units.';
    } else if (type === 'request_confirm') {
      t = 'Kindly confirm your upcoming practical slot timings so the field technician does not interrupt scheduled class batches.';
    } else if (type === 'request_attendant') {
      t = 'Please confirm whether an incident note was recorded in the physical laboratory register with Mr. Verma on 11 Oct.';
    }
    setMessageText(t);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      onTriggerToast && onTriggerToast('Please enter an inquiry before sending.', 'warning');
      return;
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Ananya Sharma',
      role: 'Officer',
      initials: 'AS',
      time: 'Just now',
      avatarBg: 'bg-primary text-on-primary',
      text: messageText.trim(),
      isStudent: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    onTriggerToast &&
      onTriggerToast('Official inquiry transmitted to student & logged in audit record.', 'send');
  };

  return (
    <section className="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      <div className="flex items-center justify-between pb-space-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">forum</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Communication with Student
          </h2>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
          <span className="material-symbols-outlined text-[14px]">shield</span>
          Official Encrypted Audit Channel
        </div>
      </div>

      {/* Message History Thread */}
      <div className="flex flex-col gap-space-md bg-surface p-space-md rounded-lg max-h-80 overflow-y-auto border border-outline-variant/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-space-sm max-w-[88%] sm:max-w-[85%] ${
              msg.isStudent ? '' : 'self-end flex-row-reverse'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md flex-shrink-0 ${
                msg.avatarBg || 'bg-primary text-on-primary'
              }`}
            >
              {msg.initials}
            </div>
            <div className={`flex flex-col gap-1 ${msg.isStudent ? '' : 'items-end'}`}>
              <div
                className={`flex items-center gap-2 ${
                  msg.isStudent ? '' : 'flex-row-reverse'
                }`}
              >
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  {msg.sender}
                </span>
                <span className="font-label-sm text-label-sm text-outline">{msg.time}</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-label-sm text-label-sm ${
                    msg.isStudent
                      ? 'bg-surface-container-highest text-outline'
                      : 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                  }`}
                >
                  {msg.role}
                </span>
              </div>
              <div
                className={`p-space-sm rounded-lg shadow-xs text-body-md font-body-md text-on-surface ${
                  msg.isStudent
                    ? 'bg-surface-container-lowest border border-outline-variant/20'
                    : 'bg-surface-container-low text-right'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer Box */}
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <label className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
          Official Query / Student Redressal Notice
        </label>

        {/* Quick template buttons */}
        <div className="flex flex-wrap gap-1.5 mb-1">
          <button
            type="button"
            onClick={() => insertTemplate('request_serial')}
            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-colors cursor-pointer"
          >
            + Request Equipment Barcodes
          </button>
          <button
            type="button"
            onClick={() => insertTemplate('request_confirm')}
            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-colors cursor-pointer"
          >
            + Confirm Lab Batch Hours
          </button>
          <button
            type="button"
            onClick={() => insertTemplate('request_attendant')}
            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-colors cursor-pointer"
          >
            + Request Attendant Log Entry
          </button>
        </div>

        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="w-full p-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none border border-outline-variant/30"
          placeholder="Compose inquiry or status update to student..."
          rows="3"
        />

        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTriggerToast && onTriggerToast('Attach file dialog simulated', 'attach_file')}
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              title="Attach file"
            >
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <span className="font-label-sm text-label-sm text-outline">
              Official communications become part of the immutable grievance audit record.
            </span>
          </div>

          <button
            type="button"
            onClick={handleSendMessage}
            className="px-space-md py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            Send Official Message
          </button>
        </div>
      </div>
    </section>
  );
}
