import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Bell, Menu, X, User, LogOut, Moon, Sun, ShieldAlert, Heart } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, currentPage, setPage, theme, toggleTheme, notificationsCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const handleNav = (page: any) => {
    setPage(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const getDashboardPage = () => {
    if (!user) return 'login';
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'artist') return 'artist-dashboard';
    return 'customer-dashboard';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-100/60 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 transition-colors duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex cursor-pointer items-center space-x-3 group"
        >
          <img 
            src="/src/assets/images/glambook_logo_1779386423887.png" 
            alt="GlamBook Logo" 
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-pink-200/80 dark:border-zinc-750 shadow-md group-hover:scale-105 group-hover:rotate-2 transition duration-300"
            referrerPolicy="no-referrer"
          />
          <span className="flex items-center select-none font-script tracking-wide font-extrabold">
            <span className="text-4xl sm:text-5xl text-pink-600 dark:text-pink-400 select-none font-extrabold drop-shadow-sm">
              Glam
            </span>
            <span className="text-4xl sm:text-5xl text-zinc-900 dark:text-zinc-50 select-none ml-1.5 font-extrabold drop-shadow-sm">
              Book
            </span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => handleNav('artists-listing')}
            className={`text-sm font-medium transition-colors hover:text-violet-600 ${
              currentPage === 'artists-listing' 
                ? 'text-violet-600 font-semibold' 
                : 'text-zinc-600 dark:text-zinc-300'
            }`}
          >
            Find Artists
          </button>
          
          {user && (
            <button 
              onClick={() => handleNav(getDashboardPage())}
              className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                currentPage.includes('dashboard') 
                  ? 'text-violet-600 font-semibold' 
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              Dashboard
            </button>
          )}

          {user && user.role === 'customer' && (
            <button 
              onClick={() => handleNav('customer-dashboard')}
              className="flex items-center space-x-1 text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-300"
            >
              <Heart className="h-4 w-4 text-violet-500" />
              <span>Saved</span>
            </button>
          )}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Light/Dark Toggle */}
          <button 
            onClick={toggleTheme}
            className="rounded-full p-2 text-zinc-600 hover:bg-slate-100 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          {user && (
            <button 
              onClick={() => handleNav('notifications-list')}
              className="relative rounded-full p-2 text-zinc-600 hover:bg-slate-100 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                  {notificationsCount}
                </span>
              )}
            </button>
          )}

          {/* Profile Menu */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-50/50 p-1 pr-3 dark:border-zinc-800 dark:bg-zinc-800/50 hover:border-violet-300 dark:hover:border-zinc-700 transition"
              >
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="h-8 w-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 max-w-[100px] truncate">{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 dark:bg-zinc-800 dark:ring-zinc-700">
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-700">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 rounded bg-violet-50 px-1.5 py-0.5 text-[8px] font-medium text-violet-600 dark:bg-zinc-700 dark:text-violet-400">
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleNav(getDashboardPage())}
                    className="flex w-full items-center px-4 py-2 text-left text-sm text-zinc-700 hover:bg-slate-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    <User className="mr-2 h-4 w-4" /> My Dashboard
                  </button>
                  <button 
                    onClick={logout}
                    className="flex w-full items-center px-4 py-2 text-left text-sm text-red-650 hover:bg-slate-50 dark:hover:bg-zinc-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleNav('login')}
                className="text-sm font-medium text-zinc-700 hover:text-violet-600 dark:text-zinc-300"
              >
                Sign In
              </button>
              <button 
                onClick={() => handleNav('signup')}
                className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-violet-700 shadow-sm transition"
              >
                Join Free
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center space-x-2">
          {user && (
            <button 
              onClick={() => handleNav('notifications-list')}
              className="relative p-2 text-zinc-650 hover:text-violet-600"
            >
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-violet-600 text-[8px] font-bold text-white">
                  {notificationsCount}
                </span>
              )}
            </button>
          )}

          <button 
            onClick={toggleTheme}
            className="p-2 text-zinc-650"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-zinc-600 hover:bg-slate-100 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-850"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="space-y-3">
            <button 
              onClick={() => handleNav('artists-listing')}
              className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-zinc-700 hover:bg-slate-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Find Artists
            </button>

            {user ? (
              <>
                <button 
                  onClick={() => handleNav(getDashboardPage())}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-zinc-700 hover:bg-slate-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Dashboard
                </button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2"></div>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <img 
                    src={user.profileImage} 
                    alt={user.name} 
                    className="h-10 w-10 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-950 dark:text-white">{user.name}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50/55 dark:hover:bg-zinc-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => handleNav('login')}
                  className="rounded-full border border-slate-350 py-2 text-center text-sm font-medium text-zinc-700 dark:text-zinc-350"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleNav('signup')}
                  className="rounded-full bg-violet-600 py-2 text-center text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Join Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
