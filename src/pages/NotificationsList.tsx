import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle, Trash2, ArrowLeft, Clock, Sparkles } from 'lucide-react';

interface Notification {
  notificationId: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const NotificationsList: React.FC = () => {
  const { token, setPage, addToast } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setPage('login');
      return;
    }
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
      addToast('Error loading notification feeds.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/notifications/read', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        addToast('All notifications marked as read.', 'success');
        fetchNotifications();
      }
    } catch (e) {
      addToast('Update failed.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-zinc-900 dark:text-zinc-50 min-h-[80vh] text-left">
      
      {/* Back button */}
      <button
        onClick={() => setPage('home')}
        className="mb-6 flex items-center space-x-1 text-xs font-bold text-zinc-405 bg-zinc-50 dark:bg-zinc-900 py-1.5 px-3.5 rounded-full border dark:border-zinc-800 cursor-pointer hover:text-violet-600"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 dark:border-zinc-850 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight">System Message Center</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Booking shifts, verified badges, and transaction status receipts.</p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="mt-4 sm:mt-0 flex items-center space-x-1 hover:text-violet-700 font-bold text-xs bg-violet-50 border border-violet-100 rounded-xl py-2 px-4 shadow-sm text-violet-750 dark:bg-zinc-900 dark:border-zinc-800 cursor-pointer transition active:scale-95"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-400">Toll filtering live signal streams...</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-200 p-16 text-center dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40">
          <Bell className="h-12 w-12 text-zinc-300 mx-auto mb-3 animate-bounce" />
          <p className="text-sm text-zinc-500">Your notifications feed is empty. Complete a booking or register accounts to trigger feeds.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {notifications.map((notif) => (
            <div 
              key={notif.notificationId} 
              className={`rounded-2xl border p-4 shadow-xs transition flex items-start gap-3.5 ${
                !notif.read 
                  ? 'bg-violet-50/10 border-violet-200/60 dark:bg-violet-950/5' 
                  : 'bg-white border-zinc-100 dark:bg-zinc-900 dark:border-zinc-805'
              }`}
            >
              <div className={`p-2.5 rounded-full shrink-0 ${
                !notif.read ? 'bg-violet-50 text-violet-600 dark:bg-zinc-800' : 'bg-slate-50 text-zinc-400 dark:bg-zinc-850'
              }`}>
                <Bell className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1">
                <p className={`text-xs leading-relaxed ${!notif.read ? 'font-semibold text-zinc-900 dark:text-zinc-105' : 'text-zinc-650'}`}>
                  {notif.message}
                </p>
                <div className="flex items-center space-x-1.5 text-[9px] text-zinc-400 font-medium">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}</span>
                  {!notif.read && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-violet-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
