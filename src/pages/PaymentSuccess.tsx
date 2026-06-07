import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Calendar, Sparkles, ChevronRight, Share2, Printer } from 'lucide-react';

export const PaymentSuccess: React.FC = () => {
  const { setPage, pageParams, addToast } = useApp();

  const bookingId = pageParams?.bookingId;
  const amount = pageParams?.amount;
  const serviceName = pageParams?.serviceName;

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8 text-center text-zinc-900 dark:text-zinc-50 min-h-[75vh] flex items-center justify-center">
      <div className="border border-zinc-100 rounded-3xl bg-white p-8 md:p-12 shadow-md dark:bg-zinc-900 dark:border-zinc-800 space-y-8 animate-in fade-in duration-550">
        
        {/* Animated Check icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">
          <CheckCircle2 className="h-12 w-12 animate-pulse" />
        </div>

        <div className="space-y-3">
          <span className="inline-block rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-610 dark:text-emerald-400">
            Booking & Rent Authorized
          </span>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight">Payment Completed!</h1>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Your sandbox booking request was processed securely. A notification message has been dispatched to the artist's calendar dashboard.
          </p>
        </div>

        {/* Booking details table summary */}
        <div className="border border-zinc-100 rounded-2xl bg-slate-50/50 p-6 space-y-4 text-left text-xs dark:bg-zinc-850 dark:border-zinc-805">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Booking Reference ID</span>
            <span className="font-mono font-extrabold text-zinc-800 dark:text-white">{bookingId || 'GB-1029-A'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Service Requested</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-100">{serviceName || 'Bridal Makeover & Hair Prep'}</span>
          </div>

          <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-3 text-sm">
            <span className="font-bold text-zinc-800 dark:text-zinc-300">Total charge authorized</span>
            <span className="font-black text-violet-600">${amount || 150}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setPage('customer-dashboard')}
            className="flex w-full justify-center rounded-xl bg-zinc-950 text-white py-3.5 text-xs font-bold hover:bg-zinc-850 dark:bg-zinc-850 dark:hover:bg-zinc-750 transition shadow"
          >
            Review my bookings dashboard
          </button>
          
          <button
            onClick={() => setPage('artists-listing')}
            className="flex w-full justify-center rounded-xl border border-zinc-200 py-3.5 text-xs font-bold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-550 dark:text-zinc-300 transition"
          >
            Browse other beauty artists
          </button>
        </div>

        {/* Document Action utilities */}
        <div className="flex items-center justify-center space-x-6 text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-850">
          <button onClick={() => window.print()} className="flex items-center space-x-1 hover:text-violet-600">
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </button>
          <button onClick={() => addToast('Receipt share link copied to clipboard.', 'success')} className="flex items-center space-x-1 hover:text-violet-600">
            <Share2 className="h-4 w-4" />
            <span>Share Ticket</span>
          </button>
        </div>

      </div>
    </div>
  );
};
