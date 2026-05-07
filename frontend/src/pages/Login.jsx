import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Logo from '../components/site/Logo';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await login(email, password);
      const to = location.state?.from?.pathname || '/app';
      navigate(to, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.detail || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#0a0a0a' }}>
      <Link to="/" className="mb-8"><Logo size="lg" /></Link>
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white">Sign in to FleetForge</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back. Run your operation.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-white outline-none focus:border-[#d4a23a]"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-white outline-none focus:border-[#d4a23a]"
              placeholder="••••••••"
            />
          </div>
          {err && <div className="text-sm text-rose-400">{err}</div>}
          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md py-2.5 font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>
        <div className="mt-6 text-sm text-gray-400 text-center">
          New to FleetForge?{' '}
          <Link to="/register" className="font-semibold" style={{ color: '#d4a23a' }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
