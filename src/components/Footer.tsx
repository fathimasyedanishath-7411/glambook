import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Instagram, Facebook, Twitter, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setPage } = useApp();

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-950/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-violet-600 dark:text-violet-400 group">
              <img 
                src="/src/assets/images/glambook_logo_1779386423887.png" 
                alt="GlamBook Logo" 
                className="h-14 w-14 rounded-full object-cover border border-pink-200 dark:border-zinc-850 shadow-md group-hover:scale-105 transition duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="flex items-center select-none font-script tracking-wide font-extrabold">
                <span className="text-4xl text-pink-600 dark:text-pink-400 select-none font-extrabold drop-shadow-sm">
                  Glam
                </span>
                <span className="text-4xl text-zinc-900 dark:text-zinc-50 select-none ml-1.5 font-extrabold drop-shadow-sm">
                  Book
                </span>
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              Booking beautiful. Connect directly with hand-picked makeup artists, hair designers, and bridal beauticians near you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-violet-600"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-violet-600"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-zinc-400 hover:text-violet-600"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-12 grid grid-cols-2 gap-8 lg:col-span-2 lg:mt-0">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-zinc-405 dark:text-zinc-300 uppercase">Discover</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button onClick={() => setPage('artists-listing')} className="text-sm text-zinc-500 hover:text-violet-600">
                    Find Makeup Artists
                  </button>
                </li>
                <li>
                  <button onClick={() => setPage('artists-listing')} className="text-sm text-zinc-500 hover:text-violet-600">
                    Browse Hair Stylists
                  </button>
                </li>
                <li>
                  <button onClick={() => setPage('artists-listing')} className="text-sm text-zinc-500 hover:text-violet-600">
                    Mehendi Specialists
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider text-zinc-405 dark:text-zinc-300 uppercase">GlamBook Trust</h3>
              <div className="mt-4 flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Verified Artist Profiles & Secured Digital Booking Guarantee.</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-200 dark:border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-zinc-450 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} GlamBook Inc. All rights reserved. Built with Node, Express, React, and Firebase.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="text-xs text-zinc-400 cursor-pointer hover:text-violet-600">Terms of Service</span>
            <span className="text-xs text-zinc-400 cursor-pointer hover:text-violet-600">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
