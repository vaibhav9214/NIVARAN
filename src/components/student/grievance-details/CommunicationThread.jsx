import React, { useState } from 'react';

export default function CommunicationThread({
  initialMessages = [],
  officerName = 'Assigned Officer',
  onTriggerToast,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [replyText, setReplyText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      onTriggerToast('Please type a message before submitting.', 'error');
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: 'scholar',
      name: 'Aditya Verma (You)',
      initials: 'AV',
      timestamp: 'Just now',
      text: replyText.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setReplyText('');
    onTriggerToast(`Response delivered securely to ${officerName}.`, 'send');
  };

  return (
    <section
      className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 flex flex-col gap-6 shadow-sm border border-outline-variant/20"
      id="communication-thread-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            Updates &amp; Official Inquiries
          </h2>
          <p className="font-body-sm text-xs text-outline">
            Two-way monitored communication thread with the assigned authority.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary bg-secondary-container/40 px-2.5 py-1 rounded-full self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span>Encrypted Channel</span>
        </span>
      </div>

      {/* Message History Thread */}
      <div className="space-y-4" id="chat-messages-container">
        {messages.map((msg) => {
          const isScholar = msg.sender === 'scholar';

          if (isScholar) {
            return (
              <div key={msg.id} className="flex items-start justify-end gap-3.5">
                <div className="flex flex-col items-end gap-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-[11px] text-outline">
                      {msg.timestamp}
                    </span>
                    <span className="font-label-md text-label-md font-bold text-primary-container">
                      {msg.name}
                    </span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-4 rounded-xl rounded-tr-none font-body-sm text-body-sm leading-relaxed">
                    {msg.text}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-surface-container-high text-primary-container flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {msg.initials || 'AV'}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {msg.initials || 'OFF'}
              </div>
              <div className="flex flex-col gap-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface">
                    {msg.name}
                  </span>
                  <span className="font-label-sm text-[11px] text-outline">
                    {msg.timestamp}
                  </span>
                </div>
                <div className="bg-surface-container-low text-on-surface p-4 rounded-xl rounded-tl-none font-body-sm text-body-sm leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Reply Box */}
      <form
        onSubmit={handleSend}
        className="mt-2 flex flex-col gap-2 pt-4 bg-surface-container-low/40 rounded-xl p-4 border border-outline-variant/30"
      >
        <label
          htmlFor="reply-textarea"
          className="font-label-md text-label-md font-bold text-on-surface flex items-center justify-between"
        >
          <span>Compose Reply to Official Review Board</span>
          <span className="text-[11px] font-normal text-outline">
            Monitored for official redress records
          </span>
        </label>

        <textarea
          id="reply-textarea"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your response or update regarding current status..."
          rows={3}
          className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary-container resize-none border border-outline-variant/20 transition-all"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTriggerToast('Evidentiary attachment dialog opened', 'attach_file')}
              className="p-2 rounded-lg text-outline hover:text-primary-container hover:bg-surface-container transition-all flex items-center gap-1.5 font-label-md text-xs font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">attach_file</span>
              <span>Attach Evidence</span>
            </button>
            <span className="text-[11px] text-outline hidden sm:inline">
              • Do not disclose system passwords or OTPs
            </span>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Send Message</span>
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </form>
    </section>
  );
}
