import axios from 'axios';

// Base API configuration (uses Vite proxy by default for flawless same-origin requests in Brave/Chrome)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nivaran_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authentication expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or revoked, remove token
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && !currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
        localStorage.removeItem('nivaran_token');
        localStorage.removeItem('nivaran_user');
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (data) => apiClient.post('/api/auth/register', data),
  login: (data) => apiClient.post('/api/auth/login', data),
  logout: () => apiClient.post('/api/auth/logout'),
  logoutAll: () => apiClient.post('/api/auth/logout-all'),
  getMe: () => apiClient.get('/api/auth/me'),
};

// Student API
export const studentAPI = {
  getDashboard: () => apiClient.get('/api/student/dashboard'),
  getDepartments: () => apiClient.get('/api/student/departments'),
  aiAssist: (data) => apiClient.post('/api/student/ai/assist', data),
  submitGrievance: (formData) =>
    apiClient.post('/api/student/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyGrievances: (params) => apiClient.get('/api/student/complaints', { params }),
  getGrievanceById: (identifier) => apiClient.get(`/api/student/complaints/${identifier}`),
  getAiInsights: (identifier, refresh = false) =>
    apiClient.get(`/api/student/complaints/${identifier}/ai-insights${refresh ? '?refresh=true' : ''}`),
  withdrawGrievance: (identifier, data) =>
    apiClient.post(`/api/student/complaints/${identifier}/withdraw`, data),
  respondToOfficer: (identifier, data) =>
    apiClient.post(`/api/student/complaints/${identifier}/respond`, data),
  submitFeedback: (identifier, data) =>
    apiClient.post(`/api/student/complaints/${identifier}/feedback`, data),
  getAuditTrail: (identifier) =>
    apiClient.get(`/api/student/complaints/${identifier}/audit-trail`),
};

// Officer API
export const officerAPI = {
  getDashboard: () => apiClient.get('/api/officer/dashboard'),
  getDepartments: () => apiClient.get('/api/officer/departments'),
  getAssignedComplaints: (params) => apiClient.get('/api/officer/assigned-complaints', { params }),
  verifyCaseAccess: (data) => apiClient.post('/api/officer/verify-case-access', data),
  getAiInsights: (identifier, refresh = false) =>
    apiClient.get(`/api/officer/complaints/${identifier}/ai-insights${refresh ? '?refresh=true' : ''}`),
  reviewAiInsights: (identifier, data) =>
    apiClient.patch(`/api/officer/complaints/${identifier}/ai-review`, data),
  updateStatus: (identifier, data) =>
    apiClient.patch(`/api/officer/complaints/${identifier}/status`, data),
  forwardGrievance: (identifier, data) =>
    apiClient.post(`/api/officer/complaints/${identifier}/forward`, data),
  resolveGrievance: (identifier, data) =>
    apiClient.post(`/api/officer/complaints/${identifier}/resolve`, data),
  rejectGrievance: (identifier, data) =>
    apiClient.post(`/api/officer/complaints/${identifier}/reject`, data),
  requestStudentInfo: (identifier, data) =>
    apiClient.post(`/api/officer/complaints/${identifier}/request-info`, data),
  getAuditTrail: (identifier) =>
    apiClient.get(`/api/officer/complaints/${identifier}/audit-trail`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => apiClient.get('/api/admin/dashboard'),
  getComplaints: (params) => apiClient.get('/api/admin/complaints', { params }),
  getAiStatus: () => apiClient.get('/api/admin/ai/status'),
  getAiTrends: (data) => apiClient.post('/api/admin/ai/trends', data || { timeframe: 'Past 30 Days' }),
  getUsers: () => apiClient.get('/api/admin/users'),
  updateUserRole: (id, role) => apiClient.patch(`/api/admin/users/${id}/role`, { role }),
  updateUserStatus: (id, status) => apiClient.patch(`/api/admin/users/${id}/status`, { status }),
  getDepartments: () => apiClient.get('/api/admin/departments'),
  createDepartment: (data) => apiClient.post('/api/admin/departments', data),
  getDepartmentById: (id) => apiClient.get(`/api/admin/departments/${id}`),
  updateDepartment: (id, data) => apiClient.patch(`/api/admin/departments/${id}`, data),
  createAdmin: (data) => apiClient.post('/api/admin/admins', data),
  createOfficer: (data) => apiClient.post('/api/admin/officers', data),
  getPendingOfficers: () => apiClient.get('/api/admin/officers/pending'),
  approveOfficer: (id, data) => apiClient.patch(`/api/admin/officers/${id}/approve`, data),
  assignOfficerDepartment: (id, departmentId) =>
    apiClient.patch(`/api/admin/officers/${id}/department`, { department: departmentId }),
  configureOfficerCaseAccess: (id, config) =>
    apiClient.patch(`/api/admin/officers/${id}/case-access`, config),
  getAuditEvents: (params) => apiClient.get('/api/admin/audit-events', { params }),
};

// Messaging API
export const messageAPI = {
  getMessages: (grievanceId) => apiClient.get(`/api/messages/grievances/${grievanceId}`),
  sendMessage: (grievanceId, data) => apiClient.post(`/api/messages/grievances/${grievanceId}`, data),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => apiClient.get('/api/notifications'),
  getUnreadCount: () => apiClient.get('/api/notifications/unread-count'),
  markAllAsRead: () => apiClient.patch('/api/notifications/read-all'),
  markAsRead: (id) => apiClient.patch(`/api/notifications/${id}/read`),
};

export default apiClient;
