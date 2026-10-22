import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StitchLandingPage from './pages/StitchLandingPage';
import StudentDashboard from './pages/student/StudentDashboard';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Primary Route: Exact Google Stitch Brand Experience & Landing Page */}
        <Route path="/" element={<StitchLandingPage />} />

        {/* Student Redressal Dashboard Route */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        
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
