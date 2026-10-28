import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-nivaran-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-nivaran-primary/30 border-t-nivaran-primary rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-nivaran-textSecondary">
            Verifying security session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If authenticated but unauthorized, redirect to their default dashboard
    if (role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (role === 'officer') return <Navigate to="/officer/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

