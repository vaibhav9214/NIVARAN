import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import OfficerSidebar from '../../components/officer/OfficerSidebar';
import OfficerHeader from '../../components/officer/OfficerHeader';
import { officerAPI, studentAPI, messageAPI, adminAPI } from '../../services/api';
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
  RefreshCw,
  Copy,
  ChevronRight,
  ArrowLeft,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Edit3
} from 'lucide-react';

const DEPARTMENTS = [
  { code: 'HOSTEL', name: 'Hostel & Infrastructure' },
  { code: 'ACAD', name: 'Academics & Examination' },
  { code: 'MESS', name: 'Mess & Cafeteria' },
  { code: 'MAINT', name: 'Maintenance & Works' },
  { code: 'CS_AI', name: 'Computer Science & AI' },
  { code: 'LIB', name: 'Library & Digital Services' },
];

export default function OfficerGrievanceReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI Insights State
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [humanDecision, setHumanDecision] = useState('Pending Review');
  const [humanReviewNotes, setHumanReviewNotes] = useState('');
  const [savingAiReview, setSavingAiReview] = useState(false);

  // Messages & WebSocket Chat
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageVisibility, setMessageVisibility] = useState('public');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Operational Action Modals
  const [actionType, setActionType] = useState(null); // 'status' | 'resolve' | 'reject' | 'forward' | 'request-info'
  const [actionNotes, setActionNotes] = useState('');
  const [targetStatus, setTargetStatus] = useState('In Progress');
  const [forwardDept, setForwardDept] = useState('MAINT');
  const [departments, setDepartments] = useState(DEPARTMENTS);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  useEffect(() => {
    officerAPI.getDepartments()
      .then((res) => {
        if (res.data?.departments?.length > 0) {
          setDepartments(res.data.departments);
          setForwardDept(res.data.departments[0]?.code || res.data.departments[0]?.name || 'HOSTEL');
        }
      })
      .catch((e) => console.warn('Could not fetch departments for officer review:', e));
  }, []);

  // Fetch Grievance
  const fetchGrievance = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // Use studentAPI.getGrievanceById which routes to grievanceController.getGrievanceById
      const res = await studentAPI.getGrievanceById(id);
      if (res.data?.success && res.data.grievance) {
        setGrievance(res.data.grievance);
        if (res.data.grievance.aiInsights) {
          setAiInsights(res.data.grievance.aiInsights);
          setHumanDecision(res.data.grievance.aiInsights.humanDecision || 'Pending Review');
          setHumanReviewNotes(res.data.grievance.aiInsights.humanReviewNotes || '');
        }
      }
    } catch (err) {
      console.error('Failed to load officer grievance review:', err);
      setError(err.response?.data?.message || err.message || 'Unable to retrieve docket particulars.');
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
      console.warn('Failed to load case messages:', err.message);
    }
  }, []);

  // Fetch or Generate AI Insights
  const fetchAiInsights = async (forceRefresh = false) => {
    if (!grievance) return;
    setLoadingAi(true);
    try {
      const res = await officerAPI.getAiInsights(grievance.ticketId || grievance._id, forceRefresh);
      if (res.data?.success && res.data.aiInsights) {
        setAiInsights(res.data.aiInsights);
      }
    } catch (err) {
      console.warn('Failed to fetch AI insights:', err.message);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchGrievance();
  }, [fetchGrievance]);

  // WebSocket Live Updates
  useEffect(() => {
    if (!grievance?._id) return;

    fetchMessages(grievance._id);
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
        visibility: messageVisibility,
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

  // Submit AI Review Decision
  const handleSaveAiReview = async (decision, applyCat = false, applyPrio = false) => {
    if (!grievance) return;
    setSavingAiReview(true);
    try {
      const res = await officerAPI.reviewAiInsights(grievance.ticketId || grievance._id, {
        humanDecision: decision,
        humanReviewNotes: humanReviewNotes.trim(),
        applySuggestedCategory: applyCat,
        applySuggestedPriority: applyPrio,
      });
      if (res.data?.success) {
        setHumanDecision(decision);
        if (res.data.aiInsights) setAiInsights(res.data.aiInsights);
        alert(`Human officer decision '${decision}' recorded. Case status remains strictly protected.`);
        fetchGrievance();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record AI review decision.');
    } finally {
      setSavingAiReview(false);
    }
  };

  // Execute Operational Action
  const handleExecuteAction = async (e) => {
    e.preventDefault();
    if (!grievance) return;
    setIsSubmittingAction(true);

    try {
      const identifier = grievance.ticketId || grievance._id;
      if (actionType === 'status') {
        await officerAPI.updateStatus(identifier, {
          status: targetStatus,
          remarks: actionNotes.trim(),
        });
      } else if (actionType === 'resolve') {
        await officerAPI.resolveGrievance(identifier, {
          resolutionNotes: actionNotes.trim(),
        });
      } else if (actionType === 'reject') {
        await officerAPI.rejectGrievance(identifier, {
          rejectionReason: actionNotes.trim(),
        });
      } else if (actionType === 'request-info') {
        await officerAPI.requestStudentInfo(identifier, {
          question: actionNotes.trim(),
        });
      } else if (actionType === 'forward') {
        await officerAPI.forwardGrievance(identifier, {
          targetDepartmentId: forwardDept,
          reason: actionNotes.trim(),
        });
      }

      setActionType(null);
      setActionNotes('');
      fetchGrievance();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed to execute.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-nivaran-cream font-sans text-nivaran-text flex selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <OfficerSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        activeNav="assigned"
      />

      <div className="flex-1 w-full lg:pl-64 flex flex-col min-h-screen">
        <OfficerHeader
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          breadcrumb={`Officer Review / ${id}`}
        />

        <main className="pt-20 px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
          {/* Top Bar Navigation & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Link
              to="/officer/assigned-grievances"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-nivaran-textSecondary hover:text-nivaran-forest transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Assigned Case Queue</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchGrievance}
                className="p-2 rounded-xl bg-white border border-nivaran-border text-nivaran-forest hover:bg-nivaran-warmCream/60 transition-colors shadow-2xs"
                title="Refresh Particulars"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-nivaran-primary/30 border-t-nivaran-primary rounded-full animate-spin"></div>
              <span className="text-xs text-nivaran-textMuted">Loading officer case docket...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-white rounded-2xl border border-nivaran-border text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-nivaran-error mx-auto" />
              <h2 className="text-base font-bold text-nivaran-forest">Docket Access Restricted</h2>
              <p className="text-xs text-nivaran-textSecondary max-w-md mx-auto">{error}</p>
              <Link
                to="/officer/assigned-grievances"
                className="inline-block px-4 py-2 rounded-xl bg-nivaran-primary text-white text-xs font-semibold"
              >
                Return to Queue
              </Link>
            </div>
          ) : !grievance ? null : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Columns: Grievance Content, Actions & Chat */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main Case Card */}
                <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-nivaran-primary">
                        {grievance.ticketId}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-nivaran-paleGreen text-nivaran-forest text-[11px] font-semibold">
                        {grievance.category}
                      </span>
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

                  {/* Attachments */}
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

                  {/* Operational Action Toolbar */}
                  <div className="pt-3 border-t border-nivaran-divider flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActionType('status');
                        setTargetStatus('In Progress');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-nivaran-paleGreen text-nivaran-forest hover:bg-nivaran-softGreen font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => setActionType('request-info')}
                      className="px-3 py-1.5 rounded-xl bg-nivaran-warningBg text-nivaran-warning hover:bg-amber-100 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Request Clarification
                    </button>
                    <button
                      onClick={() => setActionType('forward')}
                      className="px-3 py-1.5 rounded-xl bg-nivaran-ivory border border-nivaran-border text-nivaran-text hover:bg-nivaran-warmCream font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Forward Department
                    </button>
                    <button
                      onClick={() => setActionType('resolve')}
                      className="px-3.5 py-1.5 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                    >
                      Resolve Case
                    </button>
                    <button
                      onClick={() => setActionType('reject')}
                      className="px-3 py-1.5 rounded-xl border border-nivaran-error/30 text-nivaran-error hover:bg-nivaran-errorBg font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Reject with Notice
                    </button>
                  </div>
                </div>

                {/* AI Grievance Intelligence & Human Officer Review */}
                <div className="bg-gradient-to-br from-nivaran-paleGreen to-nivaran-softGreen rounded-2xl border border-nivaran-softGreen shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-nivaran-softGreen/60">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white text-nivaran-primary">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-bold font-manrope text-nivaran-forest">
                        AI Grievance Intelligence &amp; Human Review
                      </h2>
                    </div>
                    <button
                      onClick={() => fetchAiInsights(true)}
                      disabled={loadingAi}
                      className="text-xs font-semibold text-nivaran-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
                      <span>{loadingAi ? 'Analyzing...' : 'Re-run AI Analysis'}</span>
                    </button>
                  </div>

                  {aiInsights ? (
                    <div className="space-y-4 text-xs">
                      {/* Summary */}
                      <div className="p-3.5 bg-white rounded-xl border border-nivaran-softGreen/80">
                        <span className="text-[10px] font-bold text-nivaran-forest uppercase tracking-wider block mb-1">
                          Synthesized Executive Summary
                        </span>
                        <p className="text-xs text-nivaran-text leading-relaxed">
                          {aiInsights.summary}
                        </p>
                      </div>

                      {/* AI Recommendations */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-nivaran-border">
                          <span className="text-[10px] text-nivaran-textMuted uppercase font-semibold block">
                            Recommended Priority
                          </span>
                          <span className="font-bold text-sm text-nivaran-forest mt-0.5 block">
                            {aiInsights.recommendedPriority || 'Medium'}
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-nivaran-border">
                          <span className="text-[10px] text-nivaran-textMuted uppercase font-semibold block">
                            Suggested SLA
                          </span>
                          <span className="font-bold text-sm text-nivaran-forest mt-0.5 block">
                            {aiInsights.suggestedSlaHours || 168} Hours
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-nivaran-border">
                          <span className="text-[10px] text-nivaran-textMuted uppercase font-semibold block">
                            Categorization Match
                          </span>
                          <span className="font-bold text-sm text-nivaran-primary mt-0.5 block">
                            {aiInsights.classificationConfidence
                              ? `${Math.round(aiInsights.classificationConfidence * 100)}%`
                              : 'High'}
                          </span>
                        </div>
                      </div>

                      {/* Follow-up recommendations for officer */}
                      {aiInsights.recommendedOfficerActions && aiInsights.recommendedOfficerActions.length > 0 && (
                        <div className="p-3 bg-white rounded-xl border border-nivaran-border">
                          <span className="text-[11px] font-bold text-nivaran-forest block mb-1.5">
                            Recommended Action Steps:
                          </span>
                          <ul className="list-disc pl-4 space-y-1 text-nivaran-text">
                            {aiInsights.recommendedOfficerActions.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Human-in-the-Loop Review Controls */}
                      <div className="p-4 bg-white rounded-xl border border-nivaran-softGreen space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-nivaran-forest uppercase tracking-wider">
                            Record Human Officer Assessment
                          </span>
                          <span className="text-[11px] font-semibold text-nivaran-primary">
                            Status: {humanDecision}
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={humanReviewNotes}
                          onChange={(e) => setHumanReviewNotes(e.target.value)}
                          placeholder="Optional audit notes regarding AI advisory accuracy..."
                          className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={savingAiReview}
                            onClick={() => handleSaveAiReview('Accepted', true, true)}
                            className="px-3 py-1.5 rounded-lg bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs flex items-center gap-1 shadow-2xs"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Accept &amp; Apply AI Suggestions</span>
                          </button>
                          <button
                            type="button"
                            disabled={savingAiReview}
                            onClick={() => handleSaveAiReview('Modified')}
                            className="px-3 py-1.5 rounded-lg bg-nivaran-paleGreen hover:bg-nivaran-softGreen text-nivaran-forest font-semibold text-xs flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Modify Suggestions</span>
                          </button>
                          <button
                            type="button"
                            disabled={savingAiReview}
                            onClick={() => handleSaveAiReview('Rejected')}
                            className="px-3 py-1.5 rounded-lg border border-nivaran-error/30 text-nivaran-error hover:bg-nivaran-errorBg font-semibold text-xs flex items-center gap-1"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>Dismiss / Reject Advisory</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-nivaran-textSecondary">
                      <p className="mb-2">Click to run Google Gemini deep analysis on this grievance docket.</p>
                      <button
                        onClick={() => fetchAiInsights(false)}
                        disabled={loadingAi}
                        className="px-4 py-2 rounded-xl bg-nivaran-primary text-white font-semibold text-xs shadow-xs"
                      >
                        {loadingAi ? 'Analyzing...' : 'Generate AI Insights'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Real-time WebSocket Messaging Thread */}
                <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-nivaran-divider">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold font-manrope text-nivaran-forest">
                        Case Communication &amp; Internal Notes
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-nivaran-paleGreen text-nivaran-primary font-semibold text-[10px]">
                        Live WebSockets
                      </span>
                    </div>
                    <span className="text-[11px] text-nivaran-textMuted">
                      {messages.length} message(s)
                    </span>
                  </div>

                  {/* Messages Stream */}
                  <div className="max-h-80 overflow-y-auto space-y-3 p-2">
                    {messages.length === 0 ? (
                      <p className="text-center py-6 text-xs text-nivaran-textMuted">
                        No messages recorded yet.
                      </p>
                    ) : (
                      messages.map((m) => {
                        const isMe = m.sender?._id === user?.id || m.sender === user?.id;
                        const isInternal = m.visibility === 'internal';
                        return (
                          <div
                            key={m._id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] text-nivaran-textMuted mb-0.5 px-1">
                              <span>{isMe ? 'You (Officer)' : m.sender?.name || 'Scholar'}</span>
                              {isInternal && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                                  Internal Note
                                </span>
                              )}
                            </div>
                            <div
                              className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                                isInternal
                                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                                  : isMe
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
                  <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-nivaran-divider">
                    <div className="flex items-center gap-4 text-xs text-nivaran-textSecondary">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="vis"
                          value="public"
                          checked={messageVisibility === 'public'}
                          onChange={() => setMessageVisibility('public')}
                        />
                        <span>Public to Scholar</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="vis"
                          value="internal"
                          checked={messageVisibility === 'internal'}
                          onChange={() => setMessageVisibility('internal')}
                        />
                        <span className="text-amber-800 font-semibold">Staff Internal Note Only</span>
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                          messageVisibility === 'internal'
                            ? 'Record confidential staff note...'
                            : 'Send inquiry or update to student...'
                        }
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
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Case Metadata & Timeline */}
              <div className="space-y-6">
                {/* Case Particulars */}
                <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 space-y-3">
                  <h3 className="text-xs font-bold text-nivaran-forest uppercase tracking-wider">
                    Statutory Details
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-nivaran-divider">
                      <span className="text-nivaran-textMuted">Scholar</span>
                      <span className="font-semibold text-nivaran-text">
                        {grievance.student?.name || 'Scholar'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-nivaran-divider">
                      <span className="text-nivaran-textMuted">Student Email</span>
                      <span className="font-mono text-nivaran-text">
                        {grievance.student?.email || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-nivaran-divider">
                      <span className="text-nivaran-textMuted">Department</span>
                      <span className="font-semibold text-nivaran-text">
                        {grievance.department?.name || 'General'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-nivaran-divider">
                      <span className="text-nivaran-textMuted">Priority</span>
                      <span className="font-semibold text-nivaran-forest uppercase">
                        {grievance.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-nivaran-divider">
                      <span className="text-nivaran-textMuted">SLA Response Limit</span>
                      <span className="font-semibold text-nivaran-warning">
                        {grievance.slaHours || 168} Hours
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-nivaran-textMuted">Escalation Status</span>
                      <span className="font-semibold text-nivaran-text">
                        {grievance.isEscalated ? 'Escalated to Ombudsman' : 'Normal'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audit Trail Timeline */}
                <div className="bg-white rounded-2xl border border-nivaran-border shadow-xs p-5 space-y-3">
                  <h3 className="text-xs font-bold text-nivaran-forest uppercase tracking-wider">
                    Audit Trail History
                  </h3>
                  <div className="space-y-3 relative pl-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-nivaran-divider">
                    {(grievance.statusHistory || []).map((step, idx) => (
                      <div key={idx} className="relative text-xs">
                        <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-nivaran-primary border border-white"></div>
                        <span className="font-bold text-nivaran-forest">{step.toStatus}</span>
                        <span className="text-[10px] text-nivaran-textMuted block">
                          {step.timestamp ? new Date(step.timestamp).toLocaleString() : ''}
                        </span>
                        {step.remarks && (
                          <p className="text-[11px] text-nivaran-textSecondary mt-0.5 italic">
                            "{step.remarks}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Dynamic Action Execution Modal */}
      {actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nivaran-forest/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-nivaran-border space-y-4">
            <h3 className="text-base font-bold font-manrope text-nivaran-forest capitalize">
              {actionType === 'status' && 'Update Grievance Status'}
              {actionType === 'resolve' && 'Resolve & Conclude Grievance'}
              {actionType === 'reject' && 'Reject Docket with Official Justification'}
              {actionType === 'request-info' && 'Request Clarification from Student'}
              {actionType === 'forward' && 'Forward Docket to Another Department'}
            </h3>

            {actionType === 'status' && (
              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">Target Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Awaiting Student Response">Awaiting Student Response</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            )}

            {actionType === 'forward' && (
              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">Target Department</label>
                <select
                  value={forwardDept}
                  onChange={(e) => setForwardDept(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text"
                >
                  {departments.map((d) => (
                    <option key={d.code || d._id} value={d.code || d.name}>
                      {d.name} {d.code ? `(${d.code})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-nivaran-text mb-1">
                {actionType === 'resolve' ? 'Resolution Outcome & Redressal Notes' : 'Official Remarks / Justification'}
              </label>
              <textarea
                rows={3}
                required
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Document your findings, work order details, or rationale for this action..."
                className="w-full p-2.5 text-xs rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setActionType(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-nivaran-textSecondary hover:bg-nivaran-warmCream/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={isSubmittingAction || !actionNotes.trim()}
                className="px-4 py-2 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-xs disabled:opacity-50"
              >
                {isSubmittingAction ? 'Processing...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
