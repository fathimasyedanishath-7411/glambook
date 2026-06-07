import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Users, UserCheck, Calendar, DollarSign, ShieldAlert, BarChart3, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface Analytics {
  totalUsers: number;
  totalArtists: number;
  totalBookings: number;
  revenue: number;
  categoryStats: Array<{ name: string; value: number }>;
}

interface ManageUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'artist' | 'admin';
  profileImage: string;
  blocked?: boolean;
  artistDetails?: any;
}

export const AdminDashboard: React.FC = () => {
  const { token, setPage, addToast } = useApp();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<ManageUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'users' | 'verifications'>('analytics');

  useEffect(() => {
    if (!token) {
      setPage('login');
      return;
    }
    fetchAdminMetrics();
  }, [token]);

  const fetchAdminMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics
      const analyticsRes = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.analytics);
      }

      // Fetch users
      const usersRes = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (e) {
      console.error(e);
      addToast('Failed to load admin metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('User access status successfully toggled.', 'info');
        fetchAdminMetrics();
      } else {
        const data = await res.json();
        addToast(data.message, 'error');
      }
    } catch (e) {
      addToast('Block toggle operation failed.', 'error');
    }
  };

  const handleToggleVerify = async (artistId: string) => {
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/verify`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('Artist verification status toggled.', 'success');
        fetchAdminMetrics();
      }
    } catch (e) {
      addToast('Verify toggle failed.', 'error');
    }
  };

  const colors = ['#8b5cf6', '#6366f1', '#10b981', '#f59e0b', '#06b6d4'];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-zinc-900 dark:text-zinc-50 min-h-[85vh]">
      
      {/* 1. Header Admin banner */}
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-850 mb-8 text-left">
        <div className="flex items-center space-x-2">
          <span className="p-1 px-2.5 rounded bg-violet-650 text-white text-[10px] uppercase font-bold tracking-widest">Master Admin Access</span>
        </div>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight mt-1.5">GlamBook Operator Center</h1>
        <p className="text-xs text-zinc-405 mt-0.5">Applet configurations, user control, and total digital booking audits.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-400 font-medium">Crunching administration telemetry...</div>
      ) : (
        <div className="space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            <div className="border border-zinc-100 rounded-2xl bg-white p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-805">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-450 uppercase font-semibold">Total Revenue</span>
                <DollarSign className="h-5 w-5 text-violet-500" />
              </div>
              <p className="text-2xl font-black">${analytics?.revenue}</p>
              <p className="text-[10px] text-zinc-404 mt-1">Settled and locked digital amounts</p>
            </div>

            <div className="border border-zinc-100 rounded-2xl bg-white p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-805">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-445 uppercase font-semibold">Scheduled Bookings</span>
                <Calendar className="h-5 w-5 text-indigo-550" />
              </div>
              <p className="text-2xl font-black">{analytics?.totalBookings}</p>
              <p className="text-[10px] text-zinc-404 mt-1">Direct calendar reservations</p>
            </div>

            <div className="border border-zinc-100 rounded-2xl bg-white p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-805">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-445 uppercase font-semibold">Active Customers</span>
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-black">{analytics?.totalUsers}</p>
              <p className="text-[10px] text-zinc-404 mt-1">Users registered in DB</p>
            </div>

            <div className="border border-zinc-100 rounded-2xl bg-white p-5 shadow-sm dark:bg-zinc-900 dark:border-zinc-850">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-445 uppercase font-semibold text-violet-400">Listed Providers</span>
                <UserCheck className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-black">{analytics?.totalArtists}</p>
              <p className="text-[10px] text-zinc-404 mt-1">Makeup & Hairstylist count</p>
            </div>
          </div>

          {/* Sub Navigation tabs */}
          <div className="flex border-b border-zinc-150 dark:border-zinc-800">
            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`py-3 px-6 border-b-2 font-bold text-xs focus:outline-none uppercase tracking-wider shrink-0 cursor-pointer ${
                activeSubTab === 'analytics' ? 'border-violet-605 text-violet-650' : 'border-transparent text-zinc-500 hover:text-violet-550'
              }`}
            >
              Category Analytics
            </button>
            <button
              onClick={() => setActiveSubTab('users')}
              className={`py-3 px-6 border-b-2 font-bold text-xs focus:outline-none uppercase tracking-wider shrink-0 cursor-pointer ${
                activeSubTab === 'users' ? 'border-violet-605 text-violet-650' : 'border-transparent text-zinc-500 hover:text-violet-550'
              }`}
            >
              Account Control & Blocks
            </button>
            <button
              onClick={() => setActiveSubTab('verifications')}
              className={`py-3 px-6 border-b-2 font-bold text-xs focus:outline-none uppercase tracking-wider shrink-0 cursor-pointer ${
                activeSubTab === 'verifications' ? 'border-violet-605 text-violet-650' : 'border-transparent text-zinc-500 hover:text-violet-550'
              }`}
            >
              Artist Verifications
            </button>
          </div>

          {/* ACTIVE VIEW FOR ANALYTICS CHART */}
          {activeSubTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
              
              {/* Category distribution visual Recharts representation */}
              <div className="lg:col-span-2 border border-zinc-100 rounded-3xl p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800">
                <h3 className="font-bold text-sm mb-6 flex items-center space-x-1.5"><BarChart3 className="h-4 w-4" /> <span>Revenue Contribution by Category</span></h3>
                <div className="w-full h-64">
                  {analytics && analytics.categoryStats && analytics.categoryStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.categoryStats}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {analytics.categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-400">No chart values available yet.</div>
                  )}
                </div>
              </div>

              {/* Data Table review */}
              <div className="border border-zinc-100 rounded-3xl p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800">
                <h3 className="font-bold text-sm mb-4">Financial Contribution Table</h3>
                <div className="space-y-3">
                  {analytics?.categoryStats.map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs pb-2.5 border-b border-zinc-100 dark:border-zinc-805 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{stat.name}</span>
                      </div>
                      <span className="font-extrabold text-zinc-950 dark:text-white">${stat.value}</span>
                    </div>
                  ))}
                  <div className="bg-violet-50/25 p-3 rounded-2xl flex items-center space-x-2 text-violet-750 dark:bg-violet-950/20 dark:text-violet-400 mt-4 text-[11px]">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span>Completed bookings automatically feed into this category-weighted matrix.</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ACTIVE VIEW FOR USER MANAGEMENT */}
          {activeSubTab === 'users' && (
            <div className="border border-zinc-105 rounded-3xl bg-white dark:bg-zinc-905 dark:border-zinc-800 text-left overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-805">
                <h3 className="font-bold text-sm">GlamBook Database Users</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Suspend database login credentials instantly. Administrators are un-blockable.</p>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-805">
                {users.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.profileImage} 
                        alt={item.name} 
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <p className="font-bold text-zinc-900 dark:text-white text-sm">{item.name}</p>
                          <span className={`px-1.5 py-0.2 rounded text-[7px] font-bold ${
                            item.role === 'admin' 
                              ? 'bg-violet-600 text-white' 
                              : item.role === 'artist' 
                                ? 'bg-indigo-50 text-indigo-700' 
                                : 'bg-zinc-100 text-zinc-650'
                          }`}>
                            {item.role.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[10px] mt-0.5">{item.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1 rounded px-2 py-0.5 text-[9px] font-bold ${
                        item.blocked 
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400' 
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20'
                      }`}>
                        {item.blocked ? 'SUSPENDED' : 'ACTIVE IN DB'}
                      </span>
                      {item.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(item.id)}
                          className={`rounded px-3 py-1.5 font-bold ${
                            item.blocked 
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                              : 'bg-red-50 border border-red-200 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20'
                          }`}
                        >
                          {item.blocked ? 'Reactivate' : 'Suspend user'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE VIEW FOR ARTIST VERIFICATION */}
          {activeSubTab === 'verifications' && (
            <div className="border border-zinc-105 rounded-3xl bg-white dark:bg-zinc-905 dark:border-zinc-800 text-left overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-805">
                <h3 className="font-bold text-sm">Artist Portfolio Verification panel</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Assign "Verified" badges to makeup profiles. Verification guarantees upper-tier listings.</p>
              </div>
              <div className="divide-y divide-zinc-150 dark:divide-zinc-800">
                {users.filter(u => u.role === 'artist').map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                        <UserCheck className="h-5 w-5 text-violet-500" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white text-sm">{item.name}</p>
                        <p className="text-zinc-400 text-[10px] uppercase mt-0.5">Type: {item.artistDetails?.category || 'makeup'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1 rounded px-2.5 py-0.5 text-[10px] font-bold ${
                        item.artistDetails?.verified 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                          : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {item.artistDetails?.verified ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-zinc-400" />
                            <span>PENDING VERIFICATION</span>
                          </>
                        )}
                      </span>
                      <button
                        onClick={() => handleToggleVerify(item.id)}
                        className={`rounded px-3 py-1.5 font-bold cursor-pointer transition ${
                          item.artistDetails?.verified 
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-650' 
                            : 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm'
                        }`}
                      >
                        {item.artistDetails?.verified ? 'Revoke Verification' : 'Verify Portfolio'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
