import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import StudentHeader from '../../components/student/StudentHeader';
import { studentAPI, messageAPI } from '../../services/api';
import { socketService } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Clock,
  ShieldCheck,
  Building,
  User,
  AlertTriangle,
  Send,
  Sparkles,
  Paperclip,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Star,
  RefreshCw,
  Copy,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export default function GrievanceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Messages & WebSocket Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Modals & Action States
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const [responseMessage, setResponseMessage] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [reconsiderRequested, setReconsiderRequested] = useState(false);
  const [reconsiderReason, setReconsiderReason] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // AI Insights State
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Fetch Grievance
  const fetchGrievance = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await studentAPI.getGrievanceById(id);
      if (res.data?.success && res.data.grievance) {
        setGrievance(res.data.grievance);
        if (res.data.grievance.aiInsights) {
          setAiInsights(res.data.grievance.aiInsights);
        }
      }
    } catch (err) {
      console.error('Failed to load grievance details:', err);
      setError(err.response?.data?.message || err.message || 'Unable to retrieve grievance record.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch Messages
  const fetchMessages = useCallback(async (grievanceId) => {
    try {
      const res = await messageAPI.getMessages(grievanceId);
      if (res.data?.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.warn('Failed to load conversation thread:', err.message);
    }
  }, []);

  // Fetch AI Insights
  const fetchAiInsights = async () => {
    if (!grievance) return;
    setLoadingAi(true);
    try {
      const res = await studentAPI.getAiInsights(grievance.ticketId || grievance._id);
      if (res.data?.success && res.data.aiInsights) {
        setAiInsights(res.data.aiInsights);
      }
    } catch (err) {
      console.warn('Failed to load AI insights:', err.message);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchGrievance();
  }, [fetchGrievance]);

  // Real-time WebSocket connection for this grievance
  useEffect(() => {
    if (!grievance?._id) return;

    fetchMessages(grievance._id);

    // Join room
    socketService.joinGrievance(grievance._id);

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    const handleStatusUpdated = (data) => {
      if (data?.grievanceId === grievance._id) {
        setGrievance((prev) => ({
          ...prev,
          status: data.toStatus,
          statusHistory: [
            ...(prev.statusHistory || []),
            { toStatus: data.toStatus, remarks: data.remarks, timestamp: new Date() },
          ],
        }));
      }
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onStatusUpdated(handleStatusUpdated);

    return () => {
      socketService.leaveGrievance(grievance._id);
      socketService.off('new_message');
      socketService.off('status_updated');
    };
  }, [grievance?._id, fetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage || !grievance?._id) return;

    setSendingMessage(true);
    try {
      const res = await messageAPI.sendMessage(grievance._id, {
        message: newMessage.trim(),
        visibility: 'public',
      });
      if (res.data?.success) {
        setNewMessage('');
        fetchMessages(grievance._id);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawReason.trim() || isWithdrawing) return;
    setIsWithdrawing(true);
    try {
      const res = await studentAPI.withdrawGrievance(grievance.ticketId || grievance._id, {
        reason: withdrawReason.trim(),
      });
      if (res.data?.success) {
        setWithdrawModalOpen(false);
        fetchGrievance();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw grievance.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!responseMessage.trim() || isResponding) return;
    setIsResponding(true);
    try {
      const res = await studentAPI.respondToOfficer(grievance.ticketId || grievance._id, {
        message: responseMessage.trim(),
      });
      if (res.data?.success) {
        setResponseMessage('');
        fetchGrievance();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit response.');
    } finally {
      setIsResponding(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      const res = await studentAPI.submitFeedback(grievance.ticketId || grievance._id, {
        rating,
        comments: feedbackComments.trim(),
        isReconsiderationRequested: reconsiderRequested,
        reconsiderationReason: reconsiderRequested ? reconsiderReason.trim() : undefined,
      });
      if (res.data?.success) {
        setFeedbackModalOpen(false);
        fetchGrievance();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const copyTicketId = () => {
    if (grievance?.ticketId) {
      navigator.clipboard?.writeText(grievance.ticketId);
      alert(`Ticket ID ${grievance.ticketId} copied to clipboard!`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <StudentSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="my-grievances"
      />

      <div className="flex-1 w-full lg:pl-[260px] flex flex-col min-h-screen">
        <StudentHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          breadcrumb={`Grievance / ${id}`}
        />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Top Return and Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              to="/student/my-grievances"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-nivaran-textSecondary hover:text-nivaran-forest transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Grievance Ledger</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchGrievance}
                className="p-2 rounded-xl bg-white border border-nivaran-border text-nivaran-forest hover:bg-nivaran-warmCream/60 transition-colors shadow-2xs"
                title="Refresh Details"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              {grievance?.status !== 'Withdrawn' && grievance?.status !== 'Closed' && grievance?.status !== 'Resolved' && (
                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-nivaran-error/30 text-nivaran-error hover:bg-nivaran-errorBg text-xs font-semibold transition-colors"
                >
                  Withdraw Docket
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-nivaran-primary/30 border-t-nivaran-primary rounded-full animate-spin"></div>
              <span className="text-xs text-nivaran-textMuted">Loading verified grievance docket...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-white rounded-2xl border border-nivaran-border text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-nivaran-error mx-auto" />
              <h2 className="text-base font-bold text-nivaran-forest">Grievance Not Accessible</h2>
              <p className="text-xs text-nivaran-textSecondary max-w-md mx-auto">{error}</p>
              <Link
                to="/student/my-grievances"
                className="inline-block px-4 py-2 rounded-xl bg-nivaran-primary text-white text-xs font-semibold"
              >
                Return to Ledger
              </Link>
            </div>
          ) : !grievance ? null : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Columns: Grievance Details, Timeline & Chat */}
              <div className="lg:col-span-2 space-y-6">
                {/* Case Overview Card */}
                <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-nivaran-primary">
                        {grievance.ticketId}
                      </span>
                      <button
                        onClick={copyTicketId}
                        className="p-1 text-nivaran-textMuted hover:text-nivaran-primary"
                        title="Copy Docket ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        grievance.status === 'Resolved'
                          ? 'bg-nivaran-successBg text-nivaran-success border-nivaran-success/30'
                          : grievance.status === 'Awaiting Student Response'
                          ? 'bg-nivaran-warningBg text-nivaran-warning border-nivaran-warning/30'
                          : grievance.status === 'Rejected'
                          ? 'bg-nivaran-errorBg text-nivaran-error border-nivaran-error/30'
                          : 'bg-nivaran-softGreen text-nivaran-forest border-nivaran-softGreen'
                      }`}
                    >
                      {grievance.status}
                    </span>
                  </div>

                  <h1 className="text-xl font-bold font-manrope text-nivaran-forest">
                    {grievance.title}
                  </h1>

                  <div className="p-4 bg-nivaran-ivory rounded-xl border border-nivaran-border text-xs text-nivaran-text leading-relaxed whitespace-pre-wrap">
                    {grievance.description}
                  </div>

                  {/* Attachments if any */}
                  {grievance.attachments && grievance.attachments.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-nivaran-text block mb-2">
                        Attached Supporting Evidence ({grievance.attachments.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {grievance.attachments.map((att, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl border border-nivaran-border bg-nivaran-paleGreen/30 flex items-center justify-between text-xs"
                          >
                            <span className="truncate font-medium text-nivaran-text pr-2">
                              {att.originalName || att.filename}
                            </span>
                            <Paperclip className="w-3.5 h-3.5 text-nivaran-primary shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Banner for Awaiting Student Response */}
                  {grievance.status === 'Awaiting Student Response' && (
                    <div className="p-4 rounded-xl bg-nivaran-warningBg border border-nivaran-warning/30 space-y-3">
                      <div className="flex items-center gap-2 text-nivaran-warning font-bold text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Action Required: The Nodal Officer requested clarification</span>
                      </div>
                      <form onSubmit={handleRespond} className="space-y-2">
                        <textarea
                          rows={3}
                          required
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          placeholder="Provide the requested details or answers here..."
                          className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-white text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
                        />
                        <button
                          type="submit"
                          disabled={isResponding}
                          className="px-4 py-2 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isResponding ? 'Submitting...' : 'Submit Clarification'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Feedback Button for Resolved Grievance */}
                  {grievance.status === 'Resolved' && (
                    <div className="p-4 rounded-xl bg-nivaran-successBg/60 border border-nivaran-success/30 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-xs text-nivaran-forest block">
                          Case Marked Resolved
                        </span>
                        <p className="text-[11px] text-nivaran-textSecondary mt-0.5">
                          {grievance.studentFeedback?.rating
                            ? `You rated this resolution ${grievance.studentFeedback.rating}/5 stars.`
                            : 'Please submit your feedback or request official reconsideration if unsatisfied.'}
                        </p>
                      </div>
                      {!grievance.studentFeedback?.rating && (
                        <button
                          onClick={() => setFeedbackModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-nivaran-success text-white font-semibold text-xs shadow-xs"
                        >
                          Rate or Reconsider
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Timeline History */}
                <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-6 space-y-4">
                  <h2 className="text-base font-bold font-manrope text-nivaran-forest">
                    Official Lifecycle Timeline
                  </h2>

                  <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-nivaran-divider">
                    {(grievance.statusHistory || []).map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-nivaran-primary border-2 border-white shadow-xs"></div>
                        <div className="text-xs">
                          <span className="font-bold text-nivaran-forest">{step.toStatus}</span>
                          <span className="text-[10px] text-nivaran-textMuted ml-2">
                            {step.timestamp ? new Date(step.timestamp).toLocaleString() : ''}
                          </span>
                          {step.remarks && (
                            <p className="text-[11px] text-nivaran-textSecondary mt-0.5 italic">
                              "{step.remarks}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time WebSocket Communication Thread */}
                <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-nivaran-divider">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold font-manrope text-nivaran-forest">
                        Case Communication Thread
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-nivaran-paleGreen text-nivaran-primary font-semibold text-[10px]">
                        Live WebSockets
                      </span>
                    </div>
                    <span className="text-[11px] text-nivaran-textMuted">
                      {messages.length} message(s)
                    </span>
                  </div>

                  {/* Messages Bubble Canvas */}
                  <div className="max-h-80 overflow-y-auto space-y-3 p-2">
                    {messages.length === 0 ? (
                      <p className="text-center py-6 text-xs text-nivaran-textMuted">
                        No messages exchanged yet. Send a direct query to the assigned officer below.
                      </p>
                    ) : (
                      messages.map((m) => {
                        const isMe = m.sender?._id === user?.id || m.sender === user?.id;
                        return (
                          <div
                            key={m._id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] text-nivaran-textMuted mb-0.5 px-1">
                              {isMe ? 'You' : m.sender?.name || 'Officer'}
                            </span>
                            <div
                              className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                                isMe
                                  ? 'bg-nivaran-primary text-white rounded-tr-none'
                                  : 'bg-nivaran-paleGreen text-nivaran-forest rounded-tl-none border border-nivaran-softGreen'
                              }`}
                            >
                              {m.message}
                            </div>
                            <span className="text-[9px] text-nivaran-textMuted mt-0.5 px-1">
                              {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Composer */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-nivaran-divider">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message to the grievance committee..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !newMessage.trim()}
                      className="px-4 py-2 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Case Metadata & AI Advisory Card */}
              <div className="space-y-6">
                {/* Case Metadata Panel */}
                <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 space-y-3">
                  <h3 className="text-xs font-bold text-nivaran-forest uppercase tracking-wider">
                    Docket Metadata
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-nivaran-divider">
                      <span className="text-nivaran-textMuted">Department</span>
                      <span className="font-semibold text-nivaran-text">
                        {grievance.department?.name || 'General'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-nivaran-divider">
                      <span className="text-nivaran-textMuted">Category</span>
                      <span className="font-semibold text-nivaran-text">{grievance.category}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-nivaran-divider">
                      <span className="text-nivaran-textMuted">Priority</span>
                      <span className="font-semibold text-nivaran-forest uppercase">
                        {grievance.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-nivaran-divider">
                      <span className="text-nivaran-textMuted">Assigned Officer</span>
                      <span className="font-semibold text-nivaran-text">
                        {grievance.assignedOfficer?.name || 'Unassigned / Queue'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-nivaran-textMuted">SLA Target</span>
                      <span className="font-semibold text-nivaran-warning">
                        {grievance.slaHours || 168} Hours Limit
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Advisory Insights Card */}
                <div className="bg-gradient-to-br from-nivaran-paleGreen to-nivaran-softGreen rounded-2xl border border-nivaran-softGreen shadow-xs p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-nivaran-forest font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-nivaran-primary" />
                      <span>AI Advisory Insights</span>
                    </div>
                    {!aiInsights && (
                      <button
                        onClick={fetchAiInsights}
                        disabled={loadingAi}
                        className="text-[11px] font-semibold text-nivaran-primary hover:underline cursor-pointer"
                      >
                        {loadingAi ? 'Analyzing...' : 'Generate'}
                      </button>
                    )}
                  </div>

                  {aiInsights ? (
                    <div className="space-y-3 text-xs">
                      {aiInsights.summary && (
                        <div>
                          <span className="text-[10px] font-semibold text-nivaran-forest uppercase tracking-wider block">
                            Executive Summary
                          </span>
                          <p className="text-[11px] text-nivaran-text mt-0.5 leading-relaxed">
                            {aiInsights.summary}
                          </p>
                        </div>
                      )}
                      {aiInsights.suggestedCategory && (
                        <div className="p-2.5 bg-white/70 rounded-xl border border-nivaran-softGreen">
                          <span className="text-[10px] text-nivaran-textMuted block">AI Categorization</span>
                          <span className="font-bold text-nivaran-forest text-xs">
                            {aiInsights.suggestedCategory}
                          </span>
                        </div>
                      )}
                      <p className="text-[10px] text-nivaran-textMuted italic">
                        {aiInsights.disclaimer || 'Advisory intelligence for administrative reference.'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-nivaran-textSecondary leading-relaxed">
                      AI grievance analytics synthesize long complaints into concise summaries and highlight key questions for faster committee triaging.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nivaran-forest/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-nivaran-border space-y-4">
            <h3 className="text-base font-bold font-manrope text-nivaran-forest">
              Withdraw Grievance #{grievance?.ticketId}
            </h3>
            <p className="text-xs text-nivaran-textSecondary">
              Are you sure you want to withdraw this grievance? This will transition the status to Withdrawn and halt all active SLA clocks.
            </p>
            <textarea
              rows={3}
              required
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="State the reason for withdrawal (e.g. resolved informally)..."
              className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setWithdrawModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-nivaran-textSecondary hover:bg-nivaran-warmCream/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={isWithdrawing || !withdrawReason.trim()}
                className="px-4 py-2 rounded-xl bg-nivaran-error text-white font-semibold text-xs hover:bg-red-700 disabled:opacity-50"
              >
                {isWithdrawing ? 'Withdrawing...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback & Reconsideration Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nivaran-forest/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-nivaran-border space-y-4">
            <h3 className="text-base font-bold font-manrope text-nivaran-forest">
              Redressal Resolution Feedback
            </h3>

            {/* Star Rating */}
            <div>
              <span className="text-xs font-semibold text-nivaran-text block mb-1.5">
                Resolution Quality Rating
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-yellow-500 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-nivaran-text block mb-1">Comments</span>
              <textarea
                rows={3}
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                placeholder="Share your experience regarding resolution timeliness and committee support..."
                className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
              />
            </div>

            {/* Reconsideration Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer text-xs text-nivaran-textSecondary">
              <input
                type="checkbox"
                checked={reconsiderRequested}
                onChange={(e) => setReconsiderRequested(e.target.checked)}
                className="mt-0.5 rounded border-nivaran-border text-nivaran-primary"
              />
              <span>I am dissatisfied with this resolution and request formal reconsideration.</span>
            </label>

            {reconsiderRequested && (
              <div>
                <span className="text-xs font-semibold text-nivaran-error block mb-1">
                  Justification for Reconsideration
                </span>
                <textarea
                  rows={2}
                  required
                  value={reconsiderReason}
                  onChange={(e) => setReconsiderReason(e.target.value)}
                  placeholder="Explain why the current outcome is incomplete or inadequate..."
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-error/30 bg-nivaran-errorBg text-nivaran-text focus:outline-none"
                />
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-nivaran-textSecondary hover:bg-nivaran-warmCream/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={isSubmittingFeedback || (reconsiderRequested && !reconsiderReason.trim())}
                className="px-4 py-2 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs disabled:opacity-50"
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
