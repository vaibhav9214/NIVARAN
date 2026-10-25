import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StitchLandingPage from './pages/StitchLandingPage';
import StudentDashboard from './pages/student/StudentDashboard';
import RaiseGrievancePage from './pages/student/RaiseGrievancePage';
import MyGrievancesPage from './pages/student/MyGrievancesPage';
import GrievanceDetailsPage from './pages/student/GrievanceDetailsPage';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerGrievanceReviewPage from './pages/officer/OfficerGrievanceReviewPage';
import AssignedGrievancesPage from './pages/officer/AssignedGrievancesPage';
import InstitutionAdminDashboard from './pages/admin/InstitutionAdminDashboard';
import UserDepartmentManagementPage from './pages/admin/UserDepartmentManagementPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Primary Route: Exact Google Stitch Brand Experience & Landing Page */}
        <Route path="/" element={<StitchLandingPage />} />

        {/* Student Redressal Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/raise-grievance" element={<RaiseGrievancePage />} />
        <Route path="/student/my-grievances" element={<MyGrievancesPage />} />
        <Route path="/student/grievance-details/:id" element={<GrievanceDetailsPage />} />
        <Route path="/student/grievance-details" element={<GrievanceDetailsPage />} />
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />

        {/* Department Officer Routes */}
        <Route path="/officer/dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/assigned-grievances" element={<AssignedGrievancesPage />} />
        <Route path="/officer/grievance/:id" element={<OfficerGrievanceReviewPage />} />
        <Route path="/officer/grievance" element={<OfficerGrievanceReviewPage />} />
        <Route path="/officer" element={<Navigate to="/officer/dashboard" replace />} />

        {/* Institution Administrator Routes */}
        <Route path="/admin/dashboard" element={<InstitutionAdminDashboard />} />
        <Route path="/admin/user-department-management" element={<UserDepartmentManagementPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Preserved Previous Comprehensive Overview / Portal Exploration */}
        <Route
          path="/classic"
          element={
            <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-blue-600 selection:text-white">
              <Navbar />
              <main className="flex-grow">
                <LandingPage />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Fallback route to Stitch Landing Page */}
        <Route path="*" element={<StitchLandingPage />} />
      </Routes>
    </Router>
  );
}
