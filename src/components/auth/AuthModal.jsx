import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LotusLogo from '../common/LotusLogo';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', defaultRole = 'student' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const authUser = await login(email, password);
        onClose();
        if (authUser.role === 'admin') navigate('/admin/dashboard');
        else if (authUser.role === 'officer') navigate('/officer/dashboard');
        else navigate('/student/dashboard');
      } else {
        const authUser = await register(name, email, password);
        onClose();
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    setError('');
    setMode('login');
    if (role === 'admin') {
      setEmail('admin@nivaran.edu');
      setPassword('Admin@123');
    } else if (role === 'officer') {
      setEmail('officer@nivaran.edu');
      setPassword('Officer@123');
    } else {
      setEmail('test_student@nivaran.edu');
      setPassword('Password@123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nivaran-forest/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-nivaran-border overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-nivaran-forest to-nivaran-primary p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-1.5 backdrop-blur-sm">
              <LotusLogo className="w-full h-full text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-manrope tracking-tight">NIVARAN Portal</h2>
              <p className="text-xs text-white/80">Institutional Grievance Redressal</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-nivaran-forest shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Secure Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-nivaran-forest shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Citizen Registration
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 bg-nivaran-cream/40">
          {/* Quick Demo Credentials Fill Pills */}
          {mode === 'login' && (
            <div className="mb-4 p-3 bg-nivaran-paleGreen rounded-xl border border-nivaran-softGreen">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-nivaran-forest uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-nivaran-primary" />
                  Quick Test Logins:
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('student')}
                  className="py-1 px-2 rounded-lg bg-white border border-nivaran-border hover:border-nivaran-primary hover:text-nivaran-primary font-medium text-[11px] text-center transition-all shadow-xs"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('officer')}
                  className="py-1 px-2 rounded-lg bg-white border border-nivaran-border hover:border-nivaran-primary hover:text-nivaran-primary font-medium text-[11px] text-center transition-all shadow-xs"
                >
                  Officer
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="py-1 px-2 rounded-lg bg-white border border-nivaran-border hover:border-nivaran-primary hover:text-nivaran-primary font-medium text-[11px] text-center transition-all shadow-xs"
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-nivaran-errorBg border border-nivaran-error/30 flex items-start gap-2.5 text-xs text-nivaran-error animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-nivaran-text mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-nivaran-textMuted absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Full Name"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-nivaran-border bg-white text-nivaran-text placeholder-nivaran-textMuted focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 focus:border-nivaran-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-nivaran-text mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-nivaran-textMuted absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-nivaran-border bg-white text-nivaran-text placeholder-nivaran-textMuted focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 focus:border-nivaran-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-nivaran-text mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-nivaran-textMuted absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-nivaran-border bg-white text-nivaran-text placeholder-nivaran-textMuted focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 focus:border-nivaran-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Authenticate & Enter' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'register' && (
            <p className="mt-3 text-[11px] text-center text-nivaran-textSecondary">
              Registration assigns a verified Student citizen account. Administrative roles are provisioned exclusively through internal accreditation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

