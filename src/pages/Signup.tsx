import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Lock, UserPlus, Sparkles, AlertCircle, ShoppingBag, Eye } from 'lucide-react';

export const Signup: React.FC = () => {
  const { login, setPage, addToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'artist'>('customer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setErrorMsg('All fields are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Signup attempt failed.');
      }

      addToast('Profile registration successful!', 'success');
      login(data.token, data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection to server failed.');
      addToast(err.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-slate-50/50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
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
            Create account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-550 dark:text-zinc-400">
            Or{' '}
            <button
              onClick={() => setPage('login')}
              className="font-semibold text-violet-600 hover:text-violet-700"
            >
              sign in to existing account
            </button>
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-350 uppercase mb-2">I want to register as a:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex flex-col items-center justify-center p-3 border rounded-2xl transition cursor-pointer ${
                  role === 'customer' 
                    ? 'border-violet-550 bg-violet-50/50 text-violet-700' 
                    : 'border-zinc-200 text-zinc-500 dark:border-zinc-850 hover:bg-zinc-50'
                }`}
              >
                <ShoppingBag className="h-5 w-5 mb-1" />
                <span className="text-xs font-bold">Customer</span>
                <span className="text-[9px] text-zinc-400">Looking for services</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`flex flex-col items-center justify-center p-3 border rounded-2xl transition cursor-pointer ${
                  role === 'artist' 
                    ? 'border-violet-550 bg-violet-50/50 text-violet-700' 
                    : 'border-zinc-200 text-zinc-500 dark:border-zinc-850 hover:bg-zinc-50'
                }`}
              >
                <Eye className="h-5 w-5 mb-1" />
                <span className="text-xs font-bold">Beauty Artist</span>
                <span className="text-[9px] text-zinc-400">Providing pricing & work</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 rounded-md">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-350 uppercase mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-200/80 bg-zinc-50/20 py-2.5 pl-10 pr-3 text-sm focus:border-violet-500 focus:outline-none dark:border-zinc-805 dark:bg-zinc-850 dark:text-white"
                  placeholder="Monica Geller"
                />
              </div>
            </div>

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

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700 focus:outline-none shadow-md transition disabled:opacity-50"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <UserPlus className="h-4 w-4 text-violet-300 group-hover:text-violet-100" />
            </span>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

      </div>
    </div>
  );
};
