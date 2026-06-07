import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, SlidersHorizontal, Star, Sparkles, AlertCircle, Heart } from 'lucide-react';

export const ArtistsListing: React.FC = () => {
  const { setPage, pageParams, toggleSaveArtist, savedArtistIds, addToast } = useApp();
  
  // States corresponding to filters
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(pageParams?.category || '');
  const [city, setCity] = useState(pageParams?.city || '');
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState('');
  const [search, setSearch] = useState(pageParams?.search || '');

  // Reset or sync states whenever navigating or page parameters change
  useEffect(() => {
    setCategory(pageParams?.category || '');
    setCity(pageParams?.city || '');
    setSearch(pageParams?.search || '');
    setMaxPrice(500);
    setMinRating('');
  }, [pageParams]);

  useEffect(() => {
    fetchFilteredArtists();
  }, [category, city, maxPrice, minRating, search]);

  const fetchFilteredArtists = async () => {
    try {
      setLoading(true);
      let queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (city) queryParams.append('city', city);
      if (maxPrice) queryParams.append('maxPrice', String(maxPrice));
      if (minRating) queryParams.append('rating', minRating);
      if (search) queryParams.append('search', search);

      const res = await fetch(`/api/artists?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setArtists(data);
      }
    } catch (e) {
      console.error(e);
      addToast('Failed to retrieve artist directories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setCategory('');
    setCity('');
    setMaxPrice(500);
    setMinRating('');
    setSearch('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-zinc-900 dark:text-zinc-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 dark:border-zinc-850 mb-8 text-left">
        <div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight">Find Professional Artists</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Filter by pricing, localized cities, active star ratings, or service genres.</p>
        </div>
        {artists.length > 0 && (
          <p className="text-xs text-zinc-405 font-bold mt-2 md:mt-0">Displaying {artists.length} hand-picked results</p>
        )}
      </div>

      {/* Real-time Searchable Filter Bar */}
      <div className="mb-8 bg-white dark:bg-zinc-900 rounded-3xl border border-pink-100 dark:border-zinc-805 p-5 shadow-sm text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. Artist Name / Keyword Search */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase mb-1.5 ml-1">Search Artist Name / Bio</label>
            <div className="relative">
              <Search className="absolute inset-y-0 left-3 h-4 w-4 text-zinc-400 my-auto" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, key skill, bio..."
                className="w-full bg-zinc-50 rounded-2xl py-2.5 pl-10 pr-4 text-xs border border-zinc-150 focus:outline-none focus:border-pink-300 dark:bg-zinc-850 dark:border-zinc-700 dark:text-white transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-650 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 2. Service Category Filter */}
          <div className="relative text-left">
            <label className="block text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase mb-1.5 ml-1">Service Category</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400 pointer-events-none text-xs">✨</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-50 rounded-2xl py-2.5 pl-9 pr-4 text-xs border border-zinc-150 focus:outline-none focus:border-pink-300 dark:bg-zinc-850 dark:border-zinc-700 dark:text-white appearance-none cursor-pointer transition"
              >
                <option value="">All Service Categories</option>
                <option value="makeup">💄 Makeup Artist</option>
                <option value="hairsalon">💇‍♀️ Hair Stylist</option>
                <option value="mehendi">🌺 Mehendi Henna</option>
                <option value="photography">📸 Shoot Photography</option>
                <option value="beautician">💅 Salon Beautician</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-1 text-zinc-450 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* 3. Location / Service City Filter */}
          <div className="relative text-left">
            <label className="block text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase mb-1.5 ml-1">Location / City</label>
            <div className="relative">
              <MapPin className="absolute inset-y-0 left-3 h-4 w-4 text-pink-500 my-auto pointer-events-none" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-50 rounded-2xl py-2.5 pl-9 pr-4 text-xs border border-zinc-150 focus:outline-none focus:border-pink-300 dark:bg-zinc-850 dark:border-zinc-700 dark:text-white appearance-none cursor-pointer transition"
              >
                <option value="">All Locations</option>
                <option value="San Francisco">📍 San Francisco</option>
                <option value="Los Angeles">📍 Los Angeles</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center px-1 text-zinc-450 text-[10px]">
                ▼
              </div>
            </div>
          </div>

        </div>

        {/* Filters Active Badge Tags */}
        {(search || category || city) && (
          <div className="mt-4 pt-4 border-t border-dashed border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase mr-1">Active criteria:</span>
            {search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-300 border border-pink-100 dark:border-pink-905">
                Name/Bio: "{search}"
                <button onClick={() => setSearch('')} className="ml-2 text-xs font-bold text-pink-400 hover:text-pink-700">×</button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-300 border border-pink-100 dark:border-pink-905">
                Category: {category.toUpperCase()}
                <button onClick={() => setCategory('')} className="ml-2 text-xs font-bold text-pink-400 hover:text-pink-700">×</button>
              </span>
            )}
            {city && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-300 border border-pink-100 dark:border-pink-905">
                City: {city}
                <button onClick={() => setCity('')} className="ml-2 text-xs font-bold text-pink-400 hover:text-pink-700">×</button>
              </span>
            )}
            <button 
              onClick={handleResetFilters}
              className="text-[10px] font-bold text-pink-600 hover:text-pink-800 hover:underline ml-auto cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filters Rail Box */}
        <div className="col-span-1 border border-zinc-150 rounded-3xl bg-white p-6 shadow-sm h-fit dark:bg-zinc-900 dark:border-zinc-800 text-left">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-850">
            <h3 className="font-bold text-sm flex items-center space-x-1"><SlidersHorizontal className="h-4 w-4" /> <span>Filters</span></h3>
            <button 
              onClick={handleResetFilters}
              className="text-[10px] font-bold text-violet-600 hover:underline"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Search filter input */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Keyword Search</label>
              <div className="relative">
                <Search className="absolute inset-y-0 left-3 h-4 w-4 text-zinc-400 my-auto" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. bridal, braids..."
                  className="w-full bg-zinc-50 rounded-xl py-2 pl-9 pr-3 text-xs border border-zinc-200 focus:outline-none dark:bg-zinc-850 dark:border-zinc-700"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-50 rounded-xl py-2 px-3 text-xs border border-zinc-200 focus:outline-none dark:bg-zinc-850 dark:border-zinc-700"
              >
                <option value="">All Categories</option>
                <option value="makeup">Makeup Artist</option>
                <option value="hairsalon">Hair Stylist</option>
                <option value="mehendi">Mehendi / Henna</option>
                <option value="photography">Shoot Photography</option>
                <option value="beautician">Salon Beautician</option>
              </select>
            </div>

            {/* City selection */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Service City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-50 rounded-xl py-2 px-3 text-xs border border-zinc-200 focus:outline-none dark:bg-zinc-850 dark:border-zinc-700"
              >
                <option value="">All Cities</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Los Angeles">Los Angeles</option>
              </select>
            </div>

            {/* Pricing Slider */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-550 uppercase mb-1 flex justify-between">
                <span>Max Budget</span>
                <span className="font-extrabold text-violet-600">${maxPrice}/hr</span>
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Minimum Rating</label>
              <div className="flex flex-col space-y-2 text-xs">
                {[4.9, 4.8, 4.7].map((num) => (
                  <label key={num} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === String(num)}
                      onChange={() => setMinRating(String(num))}
                      className="text-violet-600 focus:ring-violet-500 focus:outline-none"
                    />
                    <div className="flex items-center space-x-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{num} & up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Listings Display */}
        <div className="lg:col-span-3 text-left">
          {loading ? (
            <div className="py-20 text-center text-zinc-400">Filtering verified registry databases...</div>
          ) : artists.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-16 text-center dark:border-zinc-800">
              <AlertCircle className="h-10 w-10 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm text-zinc-500">No artists match the selected filtering combinations.</p>
              <button onClick={handleResetFilters} className="mt-4 rounded-full bg-violet-600 text-white px-5 py-2 text-xs font-bold hover:bg-violet-700">
                Reset Filter Settings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artists.map((artist) => {
                const isSaved = savedArtistIds.includes(artist.artistId);
                return (
                  <div
                    key={artist.artistId}
                    className="group border border-zinc-100 rounded-3xl bg-white shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-805 hover:shadow-lg transition duration-200"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-200">
                      <img
                        src={artist.portfolio?.[0] || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {artist.verified && (
                        <span className="absolute top-4 left-4 rounded-full bg-emerald-500 text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 shadow-sm">
                          Verified
                        </span>
                      )}
                      
                      {/* Save/Favorite Circle Toggle */}
                      <button
                        onClick={() => toggleSaveArtist(artist.artistId)}
                        className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-zinc-650 hover:text-violet-600 border border-zinc-100 hover:scale-105 transition shadow cursor-pointer"
                      >
                        <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-violet-600 text-violet-600 animate-pulse' : 'text-zinc-500'}`} />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-violet-600 dark:text-violet-400">{artist.category} Specialist</span>
                        <div className="flex items-center space-x-1 text-xs font-bold text-zinc-750 dark:text-zinc-300">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{artist.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <h3 className="font-serif text-lg font-bold text-zinc-905 dark:text-white">{artist.name}</h3>
                      </div>

                      <p className="flex items-center text-zinc-400 space-x-1 mt-0.5 text-xs">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{artist.city}</span>
                        <span className="mx-1">•</span>
                        <span>{artist.experience} yrs exp</span>
                      </p>

                      <p className="text-xs text-zinc-508 dark:text-zinc-400 mt-3 line-clamp-2 h-8">
                        {artist.bio || 'Professional beautician offering bridal packages, curls, and blowout treatments.'}
                      </p>

                      <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-zinc-400 uppercase font-semibold">Base Service</p>
                          <p className="text-base font-extrabold text-zinc-900 dark:text-white">${artist.pricing} <span className="text-[10px] text-zinc-400 font-normal">flat</span></p>
                        </div>
                        <button
                          onClick={() => setPage('artist-profile', { id: artist.artistId })}
                          className="rounded-full bg-zinc-900 text-white px-5 py-2 text-xs font-bold hover:bg-zinc-805 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition"
                        >
                          View Bio & Book
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
