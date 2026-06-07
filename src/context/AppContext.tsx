import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'artist' | 'admin';
  profileImage: string;
}

export type PageName = 
  | 'home'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'customer-dashboard'
  | 'artist-dashboard'
  | 'admin-dashboard'
  | 'artists-listing'
  | 'artist-profile'
  | 'booking'
  | 'payment-success'
  | 'notifications-list';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: User | null;
  token: string | null;
  theme: 'light' | 'dark';
  currentPage: PageName;
  pageParams: any;
  toasts: Toast[];
  savedArtistIds: string[];
  notificationsCount: number;
  login: (token: string, user: User) => void;
  logout: () => void;
  setPage: (page: PageName, params?: any) => void;
  toggleTheme: () => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  toggleSaveArtist: (artistId: string) => void;
  triggerNotificationReload: () => void;
  notificationVersion: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('glambook_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('glambook_token');
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('glambook_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Client-side state routing that represents the requested 10 pages elegantly without hash-flickering
  const [currentPage, setCurrentPage] = useState<PageName>('home');
  const [pageParams, setPageParams] = useState<any>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [savedArtistIds, setSavedArtistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('glambook_saved_artists');
    return saved ? JSON.parse(saved) : [];
  });
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [notificationVersion, setNotificationVersion] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('glambook_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Periodically fetch notification counts from API
  useEffect(() => {
    if (!token) {
      setNotificationsCount(0);
      return;
    }

    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const unread = data.filter((n: any) => !n.readStatus).length;
          setNotificationsCount(unread);
        }
      } catch (e) {
        console.warn('Failed to load notification counts for badge:', e);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 12000); // refresh every 12 seconds
    return () => clearInterval(interval);
  }, [token, notificationVersion]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('glambook_token', newToken);
    localStorage.setItem('glambook_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    addToast(`Welcome back, ${newUser.name}!`, 'success');

    // Routing based on user roles
    if (newUser.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (newUser.role === 'artist') {
      setCurrentPage('artist-dashboard');
    } else {
      setCurrentPage('customer-dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('glambook_token');
    localStorage.removeItem('glambook_user');
    setToken(null);
    setUser(null);
    setCurrentPage('home');
    addToast('Logged out successfully.', 'info');
  };

  const setPage = (pageName: PageName, params: any = null) => {
    setCurrentPage(pageName);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleSaveArtist = (artistId: string) => {
    if (!user) {
      addToast('Please login to save artists.', 'info');
      setPage('login');
      return;
    }

    setSavedArtistIds(prev => {
      let updated;
      if (prev.includes(artistId)) {
        updated = prev.filter(id => id !== artistId);
        addToast('Artist removed from favorites.', 'info');
      } else {
        updated = [...prev, artistId];
        addToast('Artist saved to favorites!', 'success');
      }
      localStorage.setItem('glambook_saved_artists', JSON.stringify(updated));
      return updated;
    });
  };

  const triggerNotificationReload = () => {
    setNotificationVersion(v => v + 1);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        theme,
        currentPage,
        pageParams,
        toasts,
        savedArtistIds,
        notificationsCount,
        login,
        logout,
        setPage,
        toggleTheme,
        addToast,
        removeToast,
        toggleSaveArtist,
        triggerNotificationReload,
        notificationVersion
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
