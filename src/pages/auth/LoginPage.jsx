import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LotusLogo from '../../components/common/LotusLogo';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/student/dashboard';
  const draft = location.state?.from?.state?.draft || location.state?.draft;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'officer') navigate('/officer/dashboard');
      else navigate(from === '/login' ? '/student/dashboard' : from, { state: draft ? { draft } : undefined });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setError('');
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
    <div className="min-h-screen bg-nivaran-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-nivaran-softGreen selection:text-nivaran-forest">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-3">
          <LotusLogo className="w-10 h-10 group-hover:scale-105 transition-transform" />
          <span className="text-2xl font-bold font-manrope tracking-tight text-nivaran-forest">
            NIVARAN
          </span>
        </Link>
        <h2 className="text-2xl font-bold font-manrope text-nivaran-text tracking-tight">
          Sign in to your portal
        </h2>
        <p className="mt-1 text-sm text-nivaran-textSecondary">
          Institutional Redressal &amp; Governance System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg rounded-2xl border border-nivaran-border">
          {/* Quick Demo Credentials */}
          <div className="mb-6 p-3.5 bg-nivaran-paleGreen rounded-xl border border-nivaran-softGreen">
            <span className="text-[11px] font-semibold text-nivaran-forest uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <ShieldCheck className="w-4 h-4 text-nivaran-primary" />
              Quick Fill Demo Credentials
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="py-1.5 px-2 bg-white rounded-lg border border-nivaran-border hover:border-nivaran-primary text-xs font-semibold text-nivaran-text hover:text-nivaran-primary transition-all shadow-xs"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => fillDemo('officer')}
                className="py-1.5 px-2 bg-white rounded-lg border border-nivaran-border hover:border-nivaran-primary text-xs font-semibold text-nivaran-text hover:text-nivaran-primary transition-all shadow-xs"
              >
                Officer
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="py-1.5 px-2 bg-white rounded-lg border border-nivaran-border hover:border-nivaran-primary text-xs font-semibold text-nivaran-text hover:text-nivaran-primary transition-all shadow-xs"
              >
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-nivaran-errorBg border border-nivaran-error/20 flex items-start gap-2.5 text-xs text-nivaran-error">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-nivaran-text mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-nivaran-textMuted absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 focus:border-nivaran-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-nivaran-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-nivaran-textMuted absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-nivaran-border bg-nivaran-ivory text-nivaran-text focus:outline-none focus:ring-2 focus:ring-nivaran-primary/20 focus:border-nivaran-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-nivaran-primary hover:bg-nivaran-forest text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-nivaran-textSecondary">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-nivaran-primary hover:underline">
              Register as Citizen / Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

