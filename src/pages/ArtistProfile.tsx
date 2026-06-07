import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Calendar, Heart, ArrowLeft, ShieldCheck, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';

export const ArtistProfile: React.FC = () => {
  const { setPage, pageParams, token, savedArtistIds, toggleSaveArtist, addToast } = useApp();
  const artistId = pageParams?.id;

  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistId) {
      setPage('artists-listing');
      return;
    }
    fetchArtistProfile();
  }, [artistId]);

  const fetchArtistProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/artists/${artistId}`);
      if (res.ok) {
        const data = await res.json();
        setArtist(data);
      } else {
        addToast('Artist profile not found.', 'error');
        setPage('artists-listing');
      }
    } catch (e) {
      addToast('Error loading details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-400">Loading profile portfolio specs...</div>;
  }

  if (!artist) {
    return <div className="py-20 text-center text-zinc-400">Artist profile failed to load.</div>;
  }

  const isSaved = savedArtistIds.includes(artist.artistId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-zinc-900 dark:text-zinc-50 min-h-screen text-left">
      
      {/* 1. Back button */}
      <button
        onClick={() => setPage('artists-listing')}
        className="mb-6 flex items-center space-x-1 text-xs font-bold text-zinc-400 hover:text-violet-600 bg-zinc-50 dark:bg-zinc-900 py-1.5 px-3.5 rounded-full border dark:border-zinc-800 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Directory</span>
      </button>

      {/* 2. Top Header profile summary */}
      <div className="border border-zinc-100 rounded-3xl bg-white p-6 md:p-8 shadow-sm dark:bg-zinc-900 dark:border-zinc-805 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        
        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6">
          <img 
            src={artist.profileImage || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'} 
            className="h-24 w-24 rounded-full object-cover border-2 border-violet-300 shadow-sm"
            alt={artist.name}
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="rounded bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-violet-700 dark:bg-zinc-800 dark:text-violet-300 uppercase">{artist.category}</span>
              {artist.verified && (
                <span className="flex items-center space-x-0.5 rounded bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified Creator</span>
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight">{artist.name}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-zinc-450 dark:text-zinc-450">
              <span className="flex items-center space-x-0.5 font-bold text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{artist.rating} rating</span>
              </span>
              <span className="flex items-center space-x-0.5">
                <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                <span>{artist.city}</span>
              </span>
              <span>•</span>
              <span>{artist.experience} Years Experience</span>
            </div>
          </div>
        </div>

        {/* Action Button: Bookmarking */}
        <button
          onClick={() => toggleSaveArtist(artist.artistId)}
          className={`rounded-full px-6 py-2.5 text-sm font-bold flex items-center space-x-2 border cursor-pointer transition ${
            isSaved 
              ? 'border-violet-600 bg-violet-50/50 text-violet-750 dark:text-violet-300' 
              : 'border-zinc-200 text-zinc-500 dark:border-zinc-805 hover:bg-zinc-50'
          }`}
        >
          <Heart className={`h-4.5 w-4.5 ${isSaved ? 'fill-violet-600 text-violet-600 animate-pulse' : ''}`} />
          <span>{isSaved ? 'Saved Creator' : 'Save Creator'}</span>
        </button>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Services Catalogs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Services list with direct Booking page redirects */}
          <div className="border border-zinc-150 p-6 rounded-3xl bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center space-x-1.5"><ShoppingCart className="h-5 w-5 text-violet-600" /> <span>Pricing Catalog & Rates</span></h2>
            <p className="text-xs text-zinc-450 mb-6">Select a specialty treatment below to launch the checkout pipeline diaries.</p>
            
            {(!artist.services || artist.services.length === 0) ? (
              <p className="text-sm text-zinc-500">No custom rate catalog has been defined. Booking base hourly services is still available under the primary calendar.</p>
            ) : (
              <div className="space-y-3.5">
                {artist.services.map((service: any) => (
                  <div 
                    key={service.serviceId} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:bg-slate-50/50 hover:shadow-sm transition bg-white dark:bg-zinc-900 dark:border-zinc-805"
                  >
                    <div className="mb-3 sm:mb-0">
                      <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{service.serviceName}</p>
                      <p className="text-xs text-violet-600 font-bold mt-0.5">${service.price} <span className="text-[10px] text-zinc-400 font-normal">flat fee</span></p>
                    </div>
                    <button
                      onClick={() => setPage('booking', { artistId: artist.artistId, serviceId: service.serviceId })}
                      className="rounded-xl bg-zinc-950 text-white px-5 py-2 text-xs font-bold hover:bg-violet-750 transition tracking-wide dark:bg-zinc-800 dark:hover:bg-zinc-750"
                    >
                      Book treatment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio Images Gallery */}
          <div>
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center space-x-1.5"><Sparkles className="h-5 w-5 text-yellow-500" /> <span>Visual Portfolio Gallery</span></h2>
            {(!artist.portfolio || artist.portfolio.length === 0) ? (
              <p className="text-sm text-zinc-400 py-6">No imagery highlights provided by this specialist.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {artist.portfolio.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <img 
                      src={img} 
                      alt={`Portfolio artwork ${idx}`} 
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Bio & Reviews summary */}
        <div className="space-y-8">
          
          {/* Bio Specifications card */}
          <div className="border border-zinc-100 rounded-3xl p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800 space-y-5">
            <div>
              <h3 className="font-bold text-sm mb-2 text-zinc-500 uppercase">Specialist Biography</h3>
              <p className="text-xs text-zinc-650 leading-relaxed dark:text-zinc-355">
                {artist.bio || 'Highly rated cosmetologist specializing in wedding makeup, skin preparation, eyelashes extensions and intricate hairstyles curlings.'}
              </p>
            </div>

            {/* Availability info board */}
            <div>
              <h3 className="font-bold text-sm mb-2.5 text-zinc-500 uppercase">Operating Diary Days</h3>
              {(!artist.availability || artist.availability.length === 0) ? (
                <p className="text-xs text-zinc-400">Available on custom appointment requests only.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                    const isOpen = artist.availability.includes(day);
                    return (
                      <span 
                        key={day} 
                        className={`rounded px-2.5 py-1 text-[9px] font-bold ${
                          isOpen 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' 
                            : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-805 dark:text-zinc-650'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Previous reviews posted */}
          <div className="border border-zinc-100 rounded-3xl p-6 bg-white dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-zinc-500 uppercase">Customer Reviews ({artist.reviews?.length || 0})</h3>
            
            {(!artist.reviews || artist.reviews.length === 0) ? (
              <p className="text-xs text-zinc-450 italic">No feedback published yet. Be the first to secure a booking!</p>
            ) : (
              <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                {artist.reviews.map((rev: any, idx: number) => (
                  <div key={idx} className="pb-3 border-b last:border-0 border-zinc-100 dark:border-zinc-855">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold">{rev.customerName}</span>
                      <div className="flex items-center text-amber-500 font-bold space-x-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
