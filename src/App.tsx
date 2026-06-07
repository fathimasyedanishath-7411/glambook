import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { ArtistDashboard } from './pages/ArtistDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ArtistsListing } from './pages/ArtistsListing';
import { ArtistProfile } from './pages/ArtistProfile';
import { Booking } from './pages/Booking';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { NotificationsList } from './pages/NotificationsList';
import { Sparkles, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, toasts, removeToast } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'login':
        return <Login />;
      case 'signup':
        return <Signup />;
      case 'forgot-password':
        return <ForgotPassword />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'artist-dashboard':
        return <ArtistDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'artists-listing':
        return <ArtistsListing />;
      case 'artist-profile':
        return <ArtistProfile />;
      case 'booking':
        return <Booking />;
      case 'payment-success':
        return <PaymentSuccess />;
      case 'notifications':
      case 'notifications-list':
        return <NotificationsList />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      
      {/* 1. Header */}
      <Header />

      {/* 2. Page Router Workspace */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Elegant Toast Toast Overlay Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full font-serif pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border animate-slide-in text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-300 dark:border-emerald-900'
                : toast.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/45 dark:text-red-300 dark:border-red-900'
                  : 'bg-zinc-900 border-zinc-800 text-white dark:bg-zinc-900 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-center space-x-2 text-left">
              {toast.type === 'success' && <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />}
              {toast.type === 'info' && <Info className="h-4 w-4 shrink-0 text-amber-400" />}
              <span className="font-sans leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition ml-2 shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
