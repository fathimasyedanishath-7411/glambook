import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, CheckCircle, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { setPage, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Email address is required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Forgot password failed.');
      }

      setSuccess(true);
      addToast('Reset instructions sent to your email!', 'success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Connecting to server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-slate-50/50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
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
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-550 dark:text-zinc-400">
            Provide your email to receive standard resetting instructions.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <p className="text-sm text-zinc-600">
              A temporary password reset link has been dispatched to <span className="font-semibold">{email}</span>. Please verify your inbox/spam folder.
            </p>
            <button
              onClick={() => setPage('login')}
              className="mt-4 flex items-center justify-center mx-auto text-xs font-bold text-violet-600 hover:text-violet-705"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="monica@example.com"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPage('login')}
                className="flex items-center text-xs font-bold text-violet-600 hover:text-violet-705"
              >
                <ArrowLeft className="h-4 w-4 mr-1 animate-pulse" /> Back to Sign In
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700 focus:outline-none transition disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : 'Send Recovery Link'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
