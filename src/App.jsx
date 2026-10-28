import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public & Marketing Pages
import StitchLandingPage from './pages/StitchLandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PetitionsPage from './pages/PetitionsPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Student / Citizen Pages
import StudentDashboard from './pages/student/StudentDashboard';
import RaiseGrievancePage from './pages/student/RaiseGrievancePage';
import MyGrievancesPage from './pages/student/MyGrievancesPage';
import GrievanceDetailsPage from './pages/student/GrievanceDetailsPage';

// Department Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import AssignedGrievancesPage from './pages/officer/AssignedGrievancesPage';
import OfficerGrievanceReviewPage from './pages/officer/OfficerGrievanceReviewPage';

// Institution Administrator Pages
import InstitutionAdminDashboard from './pages/admin/InstitutionAdminDashboard';
import UserDepartmentManagementPage from './pages/admin/UserDepartmentManagementPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<StitchLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/petitions" element={<PetitionsPage />} />

          {/* Protected Student Redressal Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/raise-grievance"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <RaiseGrievancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/my-grievances"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyGrievancesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/grievance-details/:id"
            element={
              <ProtectedRoute allowedRoles={['student', 'officer', 'admin']}>
                <GrievanceDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />

          {/* Protected Department Officer Routes */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['officer', 'admin']}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/assigned-grievances"
            element={
              <ProtectedRoute allowedRoles={['officer', 'admin']}>
                <AssignedGrievancesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/grievance/:id"
            element={
              <ProtectedRoute allowedRoles={['officer', 'admin']}>
                <OfficerGrievanceReviewPage />
              </ProtectedRoute>
            }
          />
          <Route path="/officer" element={<Navigate to="/officer/dashboard" replace />} />

          {/* Protected Institution Administrator Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <InstitutionAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user-department-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserDepartmentManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Preserved Classic Exploration Portal */}
          <Route
            path="/classic"
            element={
              <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-nivaran-softGreen selection:text-nivaran-forest">
                <Navbar />
                <main className="flex-grow">
                  <LandingPage />
                </main>
                <Footer />
              </div>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<StitchLandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
