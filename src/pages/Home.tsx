import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Sparkles, Star, ChevronRight, CheckCircle2, Sliders, CalendarCheck2, Paintbrush, Scissors, Flower2, Camera } from 'lucide-react';

export const Home: React.FC = () => {
  const { setPage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage('artists-listing', { search: searchQuery, city: selectedCity });
  };

  const handleCategoryClick = (category: string) => {
    setPage('artists-listing', { category });
  };

  const categories = [
    { key: 'makeup', label: 'Makeup Artist', icon: Paintbrush, color: 'bg-violet-50/50 border-violet-100 hover:bg-violet-100/50 text-violet-700 dark:bg-zinc-900/50 dark:border-zinc-800/80 dark:text-violet-400' },
    { key: 'hairsalon', label: 'Hair Stylist', icon: Scissors, color: 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-100/50 text-indigo-750 dark:bg-zinc-900/50 dark:border-zinc-800/80 dark:text-indigo-400' },
    { key: 'mehendi', label: 'Mehendi Henna', icon: Flower2, color: 'bg-pink-50/50 border-pink-100 hover:bg-pink-100/50 text-pink-700 dark:bg-zinc-900/50 dark:border-zinc-800/80 dark:text-pink-400' },
    { key: 'photography', label: 'Shoot Camera', icon: Camera, color: 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/55 text-slate-800 dark:bg-zinc-900/50 dark:border-zinc-800/80 dark:text-slate-300' },
    { key: 'beautician', label: 'Beautician', icon: Sparkles, color: 'bg-cyan-50/50 border-cyan-100 hover:bg-cyan-100/50 text-cyan-750 dark:bg-zinc-900/50 dark:border-zinc-800/80 dark:text-cyan-400' }
  ];

  const benefits = [
    { title: 'Secured Checkout', desc: 'Demo gateway with state-lock bookings' },
    { title: 'Verified Portfolios', desc: 'Every makeup gallery matches verified IDs' },
    { title: 'Direct Dashboards', desc: 'Dedicated client, artist, and admin consoles' }
  ];

  return (
    <div className="w-full bg-slate-50/50 dark:bg-zinc-950 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* Left Column */}
            <div className="space-y-6 text-left animate-in fade-in slide-in-from-left-5 duration-700">
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:border-violet-900/40 dark:text-violet-300">
                <Sparkles className="h-3 w-3 animate-spin" />
                <span>The Bridal & Salon Booking Marketplace</span>
              </span>
              <h1 className="font-serif text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl md:text-6xl">
                Find & Book Handpicked <span className="text-violet-600">Beauty Artists</span>
              </h1>
              <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-lg">
                Instantly connect with high-rated makeup experts, hairstylists, and mehendi professionals. Read real reviews, browse portfolios, and secure appointments in minutes.
              </p>

              {/* Advanced Search Bar Formulation */}
              <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-xl bg-white p-2 rounded-2xl shadow-md border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 transition">
                <div className="flex-1 flex items-center px-2 space-x-2 border-b sm:border-b-0 sm:border-r border-zinc-100 dark:border-zinc-800 pb-2 sm:pb-0">
                  <Search className="h-5 w-5 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search keywords (bridal, natural, curls)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 text-sm focus:outline-none focus:ring-0 text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div className="flex items-center px-2 space-x-2 pb-2 sm:pb-0">
                  <MapPin className="h-4 w-4 text-violet-500 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent border-0 text-xs focus:outline-none focus:ring-0 text-zinc-700 dark:text-zinc-300 min-w-[120px]"
                  >
                    <option value="">All Cities</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Los Angeles">Los Angeles</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-violet-700 shadow-md transition duration-150 active:scale-95"
                >
                  Search
                </button>
              </form>

              {/* Features inline summary */}
              <div className="pt-4 grid grid-cols-3 gap-2 text-zinc-600 dark:text-zinc-450">
                {benefits.map((b, idx) => (
                  <div key={idx} className="border-l border-violet-300 dark:border-zinc-850 pl-3">
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{b.title}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Visual illustration image */}
            <div className="relative flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-5 duration-1000">
              <div className="relative w-full max-w-xl aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-rose-100/60 dark:border-zinc-800">
                <img
                  src="/src/assets/images/glambook_pink_hero_1779387819411.png"
                  alt="Delicate Pastel Pink Bridal Makeup and Mehendi Artistry Collage"
                  className="w-full h-full object-cover rounded-3xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Category Selector Section */}
      <section className="bg-white/60 py-16 dark:bg-zinc-900/60 border-y border-slate-200 dark:border-zinc-900 transition">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-zinc-900 dark:text-zinc-50">
          <h2 className="font-serif text-3xl font-bold tracking-tight mb-2">Explore Specialists</h2>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 mb-10 max-w-lg mx-auto">
            Choose a specialist category to list corresponding pricing sheets, visual galleries, and current booking diaries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  className={`flex flex-col items-center justify-center p-6 border rounded-2xl w-40 h-40 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer ${cat.color}`}
                >
                  <IconComponent className="h-10 w-10 mb-4 stroke-[1.5]" />
                  <span className="text-sm font-bold tracking-tight">{cat.label}</span>
                  <ChevronRight className="h-4 w-4 mt-2 stroke-[2] opacity-70" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Artists Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="text-left">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Featured Specialists</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Stellar certified makeup, hairstyling, and mehendi innovators near you.</p>
            </div>
            <button
              onClick={() => setPage('artists-listing')}
              className="mt-4 md:mt-0 flex items-center space-x-1.5 text-sm font-bold text-violet-600 hover:text-violet-500"
            >
              <span>View All Artists</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Quick manual pre-populated highlights */}
            <div className="group border border-zinc-100 rounded-3xl bg-white shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-lg transition duration-200">
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-200">
                <img 
                  src="/src/assets/images/makeup_palette_1779375794421.png" 
                  alt="Makeup Portfolio" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 rounded-full bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5">Verified</span>
              </div>
              <div className="p-6 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-violet-600 animate-pulse">Makeup Artist</span>
                  <div className="flex items-center space-x-1 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">Samira Khan</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 h-12 line-clamp-3">Professional bridal makeup, glam conversions and custom styling logs. 6+ years experience.</p>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-400">Starting price</p>
                    <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$150/hr</p>
                  </div>
                  <button 
                    onClick={() => setPage('artist-profile', { id: 'artist-1' })}
                    className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition"
                  >
                    View Diary
                  </button>
                </div>
              </div>
            </div>

            <div className="group border border-zinc-100 rounded-3xl bg-white shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-lg transition duration-200">
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-200">
                <img 
                  src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400" 
                  alt="Hair Design Portfolio" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 rounded-full bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5">Verified</span>
              </div>
              <div className="p-6 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600">Hair Salon</span>
                  <div className="flex items-center space-x-1 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">Anika Sharma</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 h-12 line-clamp-3">Master stylist for wedding curlings and blowouts. Red carpet expert in styling curls.</p>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-400">Starting price</p>
                    <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$120/hr</p>
                  </div>
                  <button 
                    onClick={() => setPage('artist-profile', { id: 'artist-2' })}
                    className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition"
                  >
                    View Diary
                  </button>
                </div>
              </div>
            </div>

            <div className="group border border-zinc-100 rounded-3xl bg-white shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-lg transition duration-200">
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-200">
                <img 
                  src="/src/assets/images/mehndi_henna_1779375777116.png" 
                  alt="Mehendi Highlights" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 rounded-full bg-zinc-400 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5">Pending Verify</span>
              </div>
              <div className="p-6 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-600">Mehendi / Henna</span>
                  <div className="flex items-center space-x-1 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>4.7</span>
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">Zoe Sterling</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 h-12 line-clamp-3">Intricate wedding designs incorporating modern geometric patterns and deep rich organic stains.</p>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-400">Starting price</p>
                    <p className="text-sm font-extrabold text-zinc-900 dark:text-white">$95/hr</p>
                  </div>
                  <button 
                    onClick={() => setPage('artist-profile', { id: 'artist-3' })}
                    className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition"
                  >
                    View Diary
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Client Testimonials Section */}
      <section className="bg-slate-50/30 py-20 dark:bg-zinc-900/10 border-t border-slate-200 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-zinc-900 dark:text-zinc-50">
          <h2 className="font-serif text-3xl font-bold tracking-tight mb-2">Loved by Brides & Clients</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-12">See why hundreds of users choose GlamBook for their premium service scheduling.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 text-left">
              <div className="flex items-center space-x-1 text-amber-450 mb-3">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                "The easiest checkout process! The artist was confirmed in seconds and the payment system is fully transparent. No hidden charges!"
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-zinc-100 font-bold flex items-center justify-center text-violet-600 text-xs">M</div>
                <div>
                  <p className="text-xs font-bold">Monica G.</p>
                  <p className="text-[9px] text-zinc-405">Bridal Client</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 text-left">
              <div className="flex items-center space-x-1 text-amber-450 mb-3">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                "As an artist, GlamBook completely changed how I look for clients and manage availability. The earnings dashboard keeps my financial streams clear."
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-zinc-100 font-bold flex items-center justify-center text-violet-600 text-xs">S</div>
                <div>
                  <p className="text-xs font-bold">Samira K.</p>
                  <p className="text-[9px] text-zinc-405">Makeup Specialist</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-zinc-900 dark:border-zinc-800 text-left">
              <div className="flex items-center space-x-1 text-amber-450 mb-3">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                "Finding last-minute hair stylist was a breeze. I could compare availabilities instantly. Highly recommend GlamBook!"
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-zinc-100 font-bold flex items-center justify-center text-violet-600 text-xs">L</div>
                <div>
                  <p className="text-xs font-bold">Laura Croft</p>
                  <p className="text-[9px] text-zinc-405">Event Organizer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
