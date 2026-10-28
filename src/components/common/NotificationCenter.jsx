import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../../services/api';
import { socketService } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  Check,
  CheckCheck,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  Sparkles,
  Inbox
} from 'lucide-react';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch unread count & notifications from MongoDB API
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationAPI.getUnreadCount();
      if (res.data?.success && typeof res.data.unreadCount === 'number') {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (e) {
      // ignore silently if not logged in
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationAPI.getNotifications();
      if (res.data?.success && Array.isArray(res.data.notifications)) {
        setNotifications(res.data.notifications);
        if (typeof res.data.unreadCount === 'number') {
          setUnreadCount(res.data.unreadCount);
        }
      }
    } catch (err) {
      console.warn('Could not fetch notifications from database:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and WebSocket listener
  useEffect(() => {
    fetchUnreadCount();

    // Listen for live new notifications via Socket.IO
    const handleLiveNotification = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socketService.onNewNotification(handleLiveNotification);

    return () => {
      socketService.off('new_notification');
    };
  }, [fetchUnreadCount]);

  // When dropdown opens, fetch fresh data
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mark single notification as read
  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Could not mark notification as read:', err.message);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Could not mark all notifications as read:', err.message);
    }
  };

  // Click on a notification item to navigate and mark read
  const handleItemClick = (notif) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif._id || notif.id);
    }
    setIsOpen(false);

    const grievanceId = notif.grievance?._id || notif.grievance?.ticketId || notif.grievance;
    if (grievanceId) {
      if (user?.role === 'officer') {
        navigate(`/officer/grievance/${grievanceId}`);
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(`/student/grievance-details/${grievanceId}`);
      }
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'grievance_submitted':
        return <FileText className="w-4 h-4 text-nivaran-primary" />;
      case 'status_changed':
        return <Clock className="w-4 h-4 text-nivaran-info" />;
      case 'officer_assigned':
        return <ShieldCheck className="w-4 h-4 text-nivaran-primary" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-nivaran-secondary" />;
      case 'deadline_reminder':
        return <AlertCircle className="w-4 h-4 text-nivaran-warning" />;
      case 'grievance_resolved':
        return <Check className="w-4 h-4 text-nivaran-success" />;
      default:
        return <Bell className="w-4 h-4 text-nivaran-primary" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-nivaran-textSecondary hover:text-nivaran-primary hover:bg-nivaran-paleGreen/60 transition-all cursor-pointer focus:outline-none"
        title="Notifications"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-nivaran-error text-white font-bold text-[10px] flex items-center justify-center shadow-xs animate-in zoom-in-75">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-nivaran-border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3 bg-nivaran-ivory border-b border-nivaran-divider flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-nivaran-forest">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-nivaran-softGreen text-nivaran-forest text-[11px] font-semibold">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-nivaran-primary hover:text-nivaran-forest flex items-center gap-1 cursor-pointer transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-nivaran-divider/60 flex gap-2 bg-white">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-nivaran-forest text-white shadow-2xs'
                  : 'text-nivaran-textSecondary hover:bg-nivaran-warmCream/60'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-nivaran-forest text-white shadow-2xs'
                  : 'text-nivaran-textSecondary hover:bg-nivaran-warmCream/60'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-nivaran-divider/40">
            {loading ? (
              <div className="py-8 text-center text-xs text-nivaran-textMuted flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-nivaran-primary/20 border-t-nivaran-primary rounded-full animate-spin"></div>
                <span>Loading notifications...</span>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4 flex flex-col items-center gap-2 text-nivaran-textMuted">
                <div className="w-10 h-10 rounded-full bg-nivaran-paleGreen flex items-center justify-center text-nivaran-primary mb-1">
                  <Inbox className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-nivaran-text">No notifications found</p>
                <p className="text-[11px]">
                  {filter === 'unread'
                    ? "You've caught up with all your updates!"
                    : 'System alerts and case updates will appear here.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const id = notif._id || notif.id;
                return (
                  <div
                    key={id}
                    onClick={() => handleItemClick(notif)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-nivaran-paleGreen/30 ${
                      !notif.isRead ? 'bg-nivaran-paleGreen/15' : 'bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-nivaran-paleGreen border border-nivaran-softGreen flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4
                          className={`text-xs truncate ${
                            !notif.isRead
                              ? 'font-bold text-nivaran-forest'
                              : 'font-semibold text-nivaran-text'
                          }`}
                        >
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-nivaran-textMuted shrink-0">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-nivaran-textSecondary line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.grievance && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-nivaran-primary">
                          <span>View Docket</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(id, e)}
                        className="w-2 h-2 rounded-full bg-nivaran-primary shrink-0 mt-2 hover:scale-125 transition-transform"
                        title="Mark as read"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-nivaran-ivory/80 border-t border-nivaran-divider flex items-center justify-between text-[11px] text-nivaran-textMuted">
            <span>Real-time connected via WebSockets</span>
            <span className="text-nivaran-primary font-semibold">NIVARAN Live</span>
          </div>
        </div>
      )}
    </div>
  );
}
