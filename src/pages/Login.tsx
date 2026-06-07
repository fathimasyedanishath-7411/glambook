import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, setPage, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      console.log('Initiating standard login request for:', cleanEmail);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login attempt failed.');
      }

      console.log('Standard login succeeded, user object retrieved:', data.user);
      login(data.token, data.user);
    } catch (err: any) {
      console.error('Standard login error occurred:', err);
      setErrorMsg(err.message || 'Connecting to server failed.');
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole: 'customer' | 'artist' | 'admin') => {
    let demoEmail = '';
    if (demoRole === 'customer') demoEmail = 'elena@example.com';
    else if (demoRole === 'artist') demoEmail = 'samira@example.com';
    else if (demoRole === 'admin') demoEmail = 'admin@glambook.com';

    setLoading(true);
    setErrorMsg('');
    setEmail(demoEmail);
    setPassword('password');

    try {
      console.log('Initiating demo login for role:', demoRole, 'email:', demoEmail);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'password' })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login attempt failed.');
      }

      console.log('Demo login succeeded, user object retrieved:', data.user);
      login(data.token, data.user);
    } catch (err: any) {
      console.error('Demo login error occurred:', err);
      setErrorMsg(err.message || 'Connecting to server failed.');
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-50/50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-md border border-slate-205 dark:bg-zinc-900 dark:border-zinc-800 transition">
        
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-pink-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-850">
            <img 
              src="/src/assets/images/glambook_logo_1779386423887.png" 
              alt="GlamBook Logo" 
              className="h-14 w-14 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="mt-4 text-center text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-550 dark:text-zinc-400">
            Or{' '}
            <button
              onClick={() => setPage('signup')}
              className="font-semibold text-violet-600 hover:text-violet-750"
            >
              create a new account
            </button>
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 dark:bg-red-950/20 dark:text-red-400 animate-shake">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-350 uppercase mb-1.5">Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-200/80 bg-zinc-50/20 py-2.5 pl-10 pr-3 text-sm focus:border-violet-500 focus:outline-none dark:border-zinc-805 dark:bg-zinc-850 dark:text-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-350 uppercase mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-200/80 bg-zinc-50/20 py-2.5 pl-10 pr-3 text-sm focus:border-violet-500 focus:outline-none dark:border-zinc-805 dark:bg-zinc-850 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-zinc-650 dark:text-zinc-400">
                Remember me
              </label>
            </div>

            <button
              type="button"
              onClick={() => setPage('forgot-password')}
              className="font-semibold text-violet-600 hover:text-violet-750"
            >
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700 focus:outline-none shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LogIn className="h-4 w-4 text-violet-300 group-hover:text-violet-100" />
            </span>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Fast Login Area */}
        <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-6">
          <p className="text-center text-xs font-bold text-zinc-405 dark:text-zinc-500 uppercase mb-3">One-Click Demo Accounts</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('customer')}
              className="rounded-lg bg-zinc-50 border border-zinc-200 py-1.5 text-[10px] font-bold text-zinc-700 hover:bg-violet-50 hover:text-violet-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition cursor-pointer"
            >
              Customer
            </button>
            <button
              onClick={() => handleDemoLogin('artist')}
              className="rounded-lg bg-zinc-50 border border-zinc-200 py-1.5 text-[10px] font-bold text-zinc-700 hover:bg-violet-50 hover:text-violet-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition cursor-pointer"
            >
              Artist
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="rounded-lg bg-zinc-50 border border-zinc-200 py-1.5 text-[10px] font-bold text-zinc-700 hover:bg-violet-50 hover:text-violet-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 transition cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
