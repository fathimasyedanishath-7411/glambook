import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, DollarSign, List, Calendar, Image, Star, Plus, Trash2, CheckCircle, Clock, XSquare, Settings, Check, User } from 'lucide-react';

interface Service {
  serviceId: string;
  artistId: string;
  serviceName: string;
  price: number;
}

interface Booking {
  bookingId: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
}

interface Review {
  reviewId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const ArtistDashboard: React.FC = () => {
  const { user, token, setPage, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'requests' | 'services' | 'portfolio' | 'profile' | 'reviews'>('requests');
  
  // Dashboard states
  const [artistData, setArtistData] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // New Service Form state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  // New Portfolio URL
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');

  // Edit Profile Form state
  const [category, setCategory] = useState('makeup');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');
  const [pricing, setPricing] = useState('');
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      setPage('login');
      return;
    }
    fetchDashboardDetails();
  }, [token]);

  const fetchDashboardDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/artists/${user?.id}`);
      if (!res.ok) {
        throw new Error('Artist profile data load failed.');
      }
      const data = await res.json();
      setArtistData(data);
      setServices(data.services || []);
      setReviews(data.reviews || []);
      
      // Load inputs matching fetched profile
      setCategory(data.category);
      setCity(data.city);
      setExperience(String(data.experience));
      setPricing(String(data.pricing));
      setBio(data.bio || '');
      setAvailability(data.availability || []);

      // Now fetch artist bookings
      const bookingsRes = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }
    } catch (e) {
      console.error(e);
      addToast('Error loading artist specifications.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/artists/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          city,
          experience: Number(experience),
          pricing: Number(pricing),
          bio,
          availability
        })
      });

      if (res.ok) {
        addToast('Artist profile parameters saved successfully!', 'success');
        fetchDashboardDetails();
      } else {
        const data = await res.json();
        addToast(data.message, 'error');
      }
    } catch (e) {
      addToast('Operation failed', 'error');
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) {
      addToast('Name and price are required.', 'info');
      return;
    }

    try {
      const res = await fetch('/api/artists/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ serviceName: newServiceName, price: Number(newServicePrice) })
      });

      if (res.ok) {
        addToast('Service listing successfully added.', 'success');
        setNewServiceName('');
        setNewServicePrice('');
        fetchDashboardDetails();
      } else {
        const data = await res.json();
        addToast(data.message, 'error');
      }
    } catch (e) {
      addToast('Failed to add service.', 'error');
    }
  };

  const handleDeleteService = async (srvId: string) => {
    if (!window.confirm('Delete this service rate?')) return;
    try {
      const res = await fetch(`/api/artists/services/${srvId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addToast('Service deleted.', 'info');
        fetchDashboardDetails();
      }
    } catch (e) {
      addToast('Could not delete service.', 'error');
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioUrl) return;

    try {
      const res = await fetch('/api/artists/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: newPortfolioUrl })
      });

      if (res.ok) {
        addToast('Portfolio link uploaded.', 'success');
        setNewPortfolioUrl('');
        fetchDashboardDetails();
      }
    } catch (e) {
      addToast('Image upload failed.', 'error');
    }
  };

  const handleBookingStatus = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        addToast(`Booking status changed to ${status.toUpperCase()}!`, 'success');
        fetchDashboardDetails();
      } else {
        const data = await res.json();
        addToast(data.message, 'error');
      }
    } catch (e) {
      addToast('Status change failed', 'error');
    }
  };

  const toggleDay = (day: string) => {
    if (availability.includes(day)) {
      setAvailability(prev => prev.filter(d => d !== day));
    } else {
      setAvailability(prev => [...prev, day]);
    }
  };

  // Earnings tally variables
  const completedBookings = bookings.filter(b => b.bookingStatus === 'completed');
  const activeBookings = bookings.filter(b => b.bookingStatus === 'confirmed');
  const totalEarned = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const activePendingPayments = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'confirmed': return 'bg-indigo-50 text-indigo-750 dark:bg-indigo-950/20 dark:text-indigo-400';
      case 'cancelled': return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400';
      default: return 'bg-amber-50 text-amber-500 dark:bg-amber-951/20 dark:text-amber-400';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-zinc-900 dark:text-zinc-50 min-h-[85vh]">
      
      {/* 1. Profile Status Overview Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-200 pb-8 dark:border-zinc-850 mb-8">
        <div className="flex items-center space-x-4 text-left">
          <img 
            src={user?.profileImage} 
            alt={user?.name} 
            className="h-20 w-20 rounded-full border-2 border-violet-300 object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-block rounded bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-zinc-800 dark:text-violet-400">
                PRO ARTIST KEY
              </span>
              {artistData?.verified ? (
                <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
                  ✓ Verified by Admin
                </span>
              ) : (
                <span className="inline-block rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 uppercase">
                  Pending Verify
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight mt-1">{user?.name}</h1>
            <div className="flex items-center space-x-4 text-xs text-zinc-500 mt-0.5">
              <p>Type: <span className="font-semibold text-violet-600 uppercase">{artistData?.category}</span></p>
              <p>Rating: <span className="font-semibold text-amber-500 flex items-center inline-flex gap-0.5"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {artistData?.rating || '5.0'}</span></p>
            </div>
          </div>
        </div>

        {/* 2. Earnings Dashboard values */}
        <div className="mt-6 md:mt-0 grid grid-cols-3 gap-6 text-left border border-zinc-200 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-805">
          <div>
            <p className="text-[10px] uppercase font-semibold text-zinc-400">Total Earned</p>
            <p className="text-xl font-black text-violet-600 dark:text-violet-400">${totalEarned}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-zinc-400">Locked Pending</p>
            <p className="text-xl font-black text-zinc-750 dark:text-zinc-100">${activePendingPayments}</p>
          </div>
          <div className="border-l border-zinc-105 pl-4 dark:border-zinc-805">
            <p className="text-[10px] uppercase font-semibold text-zinc-400">Completed bookings</p>
            <p className="text-xl font-black text-zinc-900 dark:text-white">{completedBookings.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-404">Loading your dashboard diaries...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Navigation Rails Sidebar */}
          <div className="col-span-1 space-y-2 text-left">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex w-full items-center space-x-3 py-3 px-4 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'requests' 
                  ? 'bg-violet-600 text-white shadow' 
                  : 'text-zinc-700 hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Booking Requests</span>
              {bookings.filter(b => b.bookingStatus === 'pending').length > 0 && (
                <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-600">
                  {bookings.filter(b => b.bookingStatus === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex w-full items-center space-x-3 py-3 px-4 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'services' 
                  ? 'bg-violet-600 text-white shadow' 
                  : 'text-zinc-700 hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <List className="h-4 w-4" />
              <span>Catalog & Services</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex w-full items-center space-x-3 py-3 px-4 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'portfolio' 
                  ? 'bg-violet-600 text-white shadow' 
                  : 'text-zinc-700 hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <Image className="h-4 w-4" />
              <span>Portfolio Gallery</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex w-full items-center space-x-3 py-3 px-4 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-violet-600 text-white shadow' 
                  : 'text-zinc-700 hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Availability & Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex w-full items-center space-x-3 py-3 px-4 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'reviews' 
                  ? 'bg-violet-600 text-white shadow' 
                  : 'text-zinc-700 hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <Star className="h-4 w-4" />
              <span>Reviews Received</span>
              {reviews.length > 0 && (
                <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-650 dark:bg-zinc-800">{reviews.length}</span>
              )}
            </button>
          </div>

          {/* Right Main Panel Workspace */}
          <div className="lg:col-span-3 text-left">
            
            {/* BOOKINGS VIEW */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold tracking-tight mb-4">My Client Appointments</h2>
                {bookings.length === 0 ? (
                  <p className="text-zinc-500 py-10">No appointment history found.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.bookingId}
                        className="rounded-2xl border border-zinc-105 bg-white p-6 shadow-sm dark:bg-zinc-905 dark:border-zinc-800 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-zinc-400">ID: {booking.bookingId}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[9px] uppercase font-bold ${getStatusBadge(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </div>
                          <h3 className="font-bold text-base">{booking.serviceName}</h3>
                          <p className="text-sm text-violet-600 font-medium font-sans">Customer: {booking.customerName}</p>
                          <div className="flex items-center space-x-6 text-xs text-zinc-500 pt-1">
                            <p>Date: <span className="font-semibold text-zinc-800 dark:text-zinc-300">{booking.bookingDate}</span></p>
                            <p>Time: <span className="font-semibold text-zinc-800 dark:text-zinc-300">{booking.bookingTime}</span></p>
                            <p>Earned Price: <span className="font-extrabold text-zinc-900 dark:text-white">${booking.totalAmount}</span></p>
                          </div>
                          {booking.notes && (
                            <p className="text-xs italic bg-slate-50 border-l-2 border-violet-300 p-2 text-zinc-500 rounded mt-2 dark:bg-zinc-850 dark:border-zinc-700">
                              "{booking.notes}"
                            </p>
                          )}
                        </div>

                        {/* Status Check actions */}
                        <div className="flex items-center gap-2 md:self-center">
                          {booking.bookingStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleBookingStatus(booking.bookingId, 'confirmed')}
                                className="rounded-full bg-violet-600 text-white px-4 py-2 text-xs font-bold hover:bg-violet-700 cursor-pointer"
                              >
                                Accept & Confirm
                              </button>
                              <button
                                onClick={() => handleBookingStatus(booking.bookingId, 'cancelled')}
                                className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-650 hover:bg-slate-50 cursor-pointer"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {booking.bookingStatus === 'confirmed' && (
                            <button
                              onClick={() => handleBookingStatus(booking.bookingId, 'completed')}
                              className="rounded-full bg-emerald-600 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-500 cursor-pointer"
                            >
                              Complete Appointment
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SERVICES VIEW */}
            {activeTab === 'services' && (
              <div className="space-y-8">
                
                {/* Form to Add New Service Rate */}
                <div className="bg-slate-50 p-6 rounded-3xl dark:bg-zinc-900 border dark:border-zinc-805">
                  <h3 className="font-bold text-base mb-4 flex items-center space-x-1.5 text-violet-750 dark:text-violet-400">
                    <Plus className="h-4 w-4" /> <span>Add New Service Rate</span>
                  </h3>
                  <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Service Name</label>
                      <input 
                        type="text"
                        required
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="w-full bg-white border border-zinc-200 py-2 px-3 text-xs rounded-xl focus:outline-none dark:bg-zinc-850 dark:border-zinc-700 dark:text-white"
                        placeholder="e.g., Party Blow Dry & Curls, Bridal HD Look"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Flat Price ($)</label>
                      <input 
                        type="number"
                        required
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="w-full bg-white border border-zinc-200 py-2 px-3 text-xs rounded-xl focus:outline-none dark:bg-zinc-850 dark:border-zinc-700 dark:text-white"
                        placeholder="e.g., 120"
                      />
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="rounded-full bg-violet-600 px-5 py-2 text-xs font-bold text-white hover:bg-violet-700 shadow cursor-pointer text-center"
                      >
                        Push Service to Catalog
                      </button>
                    </div>
                  </form>
                </div>

                {/* Catalog Listing */}
                <div>
                  <h3 className="font-bold text-base mb-4">Active Pricing catalog ({services.length})</h3>
                  {services.length === 0 ? (
                    <p className="text-sm text-zinc-500">Your price catalog is empty. Please add services above.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 border border-zinc-150 rounded-2xl bg-white dark:bg-zinc-905 dark:border-zinc-805">
                      {services.map((service) => (
                        <div key={service.serviceId} className="flex items-center justify-between p-4 border-b last:border-b-0 border-zinc-100 dark:border-zinc-805">
                          <div className="text-left">
                            <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50">{service.serviceName}</p>
                            <p className="text-xs text-violet-605 font-bold">${service.price}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteService(service.serviceId)}
                            className="p-2 text-zinc-400 hover:text-red-500 rounded cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* PORTFOLIO VIEW */}
            {activeTab === 'portfolio' && (
              <div className="space-y-8">
                
                {/* Image upload simulator */}
                <div className="bg-slate-50 p-6 rounded-3xl dark:bg-zinc-900 border dark:border-zinc-800">
                  <h3 className="font-bold text-base mb-4">Upload Portfolio Images</h3>
                  <form onSubmit={handleAddPortfolio} className="flex flex-col md:flex-row gap-2">
                    <input 
                      type="url"
                      required
                      value={newPortfolioUrl}
                      onChange={(e) => setNewPortfolioUrl(e.target.value)}
                      className="flex-1 bg-white border border-zinc-200 py-2.5 px-4 text-xs rounded-xl focus:outline-none dark:bg-zinc-850 dark:border-zinc-700 text-white"
                      placeholder="Paste Unsplash or external Image URL link..."
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2 text-xs font-bold dark:bg-zinc-800 dark:hover:bg-zinc-750"
                    >
                      Add Image
                    </button>
                  </form>
                  <p className="text-[10px] text-zinc-400 mt-2">GlamBook utilizes external image hosting. Simulating upload by appending valid web URLs directly.</p>
                </div>

                {/* Portfolio Visual Showcase */}
                <div>
                  <h3 className="font-bold text-base mb-4">My visual gallery ({artistData?.portfolio?.length || 0})</h3>
                  {(!artistData?.portfolio || artistData.portfolio.length === 0) ? (
                    <p className="text-sm text-zinc-400">No images posted yet in your portfolio.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {artistData.portfolio.map((imgUrl: string, idx: number) => (
                        <div key={idx} className="relative aspect-square bg-zinc-150 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800">
                          <img 
                            src={imgUrl} 
                            alt={`Portfolio Highlight ${idx}`} 
                            className="w-full h-full object-cover rounded-2xl hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* PROFILE VIEW */}
            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-3xl border border-zinc-150 dark:bg-zinc-900 border dark:border-zinc-800">
                <h3 className="font-bold text-lg mb-6">Profile & Availability Variables</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-550 uppercase mb-2">Service Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-zinc-50/50 border border-zinc-200 py-2.5 px-4 text-xs rounded-xl focus:outline-none dark:bg-zinc-850 dark:border-zinc-700 text-white"
                      >
                        <option value="makeup">Makeup Artist</option>
                        <option value="hairsalon">Hair Stylist</option>
                        <option value="mehendi">Mehendi / Henna</option>
                        <option value="photography">Camera / Photography</option>
                        <option value="beautician">Salon Beautician</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-550 uppercase mb-2">Service Base City</label>
                      <input 
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-zinc-50/50 border border-zinc-200 py-2.5 px-4 text-xs rounded-xl focus:outline-none dark:bg-zinc-850 dark:border-zinc-700 text-white"
                        placeholder="e.g., San Francisco"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-550 uppercase mb-2">Years of Experience</label>
                      <input 
                        type="number"
                        required
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-zinc-50/50 border border-zinc-200 py-2.5 px-4 text-xs rounded-xl focus:outline-none dark:bg-zinc-850 dark:border-zinc-700 text-white"
                        placeholder="e.g., 6"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-550 uppercase mb-2">Standard pricing rate ($/hr)</label>
                      <input 
                        type="number"
                        required
                        value={pricing}
                        onChange={(e) => setPricing(e.target.value)}
                        className="w-full bg-zinc-50/50 border border-zinc-200 py-2.5 px-4 text-xs rounded-xl focus:outline-none dark:bg-zinc-850 dark:border-zinc-700 text-white"
                        placeholder="e.g., 100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-550 uppercase mb-2">Professional Bio</label>
                    <textarea 
                      rows={5}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-zinc-50/50 border border-zinc-200 py-2.5 px-4 text-xs rounded-xl focus:outline-none dark:bg-zinc-850 dark:border-zinc-700 text-white"
                      placeholder="Describe your stylistic journey, techniques used, and experience layers..."
                    />
                  </div>

                  {/* Availability Checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-555 uppercase mb-2">Operating Availability</label>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                        const active = availability.includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`flex items-center space-x-1.5 py-2 px-4 rounded-full border text-xs font-semibold cursor-pointer transition ${
                              active 
                                ? 'bg-violet-50 border-violet-400 text-violet-700 dark:bg-violet-950/20' 
                                : 'border-zinc-200 text-zinc-500'
                            }`}
                          >
                            {active && <Check className="h-3.5 w-3.5" />}
                            <span>{day}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white hover:bg-violet-700 shadow cursor-pointer text-center"
                  >
                    Save Professional Profile
                  </button>
                </form>
              </div>
            )}

            {/* REVIEWS VIEW */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold tracking-tight mb-4">Reviews from clients</h2>
                {reviews.length === 0 ? (
                  <p className="text-zinc-500 py-10">No reviews received yet. Completed bookings let clients post star reviews.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {reviews.map((rev) => (
                      <div key={rev.reviewId} className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="p-1.5 bg-violet-50 rounded-full dark:bg-zinc-800 text-violet-500"><User className="h-4 w-4" /></span>
                            <span className="font-bold text-sm">{rev.customerName}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span>{rev.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">"{rev.comment}"</p>
                        <p className="text-[9px] text-zinc-400 mt-2">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
