import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Calendar, Heart, MessageSquare, Bell, CreditCard, ChevronRight, CheckCircle, Clock, XCircle, Star, Sparkles } from 'lucide-react';

interface Booking {
  bookingId: string;
  customerId: string;
  artistId: string;
  artistName: string;
  serviceId: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  category: string;
  notes?: string;
}

export const CustomerDashboard: React.FC = () => {
  const { user, token, setPage, savedArtistIds, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved' | 'reviews' | 'profile'>('bookings');
  
  // Bookings list
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewsGiven, setReviewsGiven] = useState<any[]>([]);

  // Profile editing
  const [editName, setEditName] = useState(user?.name || '');
  const [editImage, setEditImage] = useState(user?.profileImage || '');
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      setPage('login');
      return;
    }
    fetchBookings();
    fetchReviews();
  }, [token]);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error('Failed to load bookings:', e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        // filter reviews made by this customer
        const mine = data.filter((r: any) => r.customerId === user?.id);
        setReviewsGiven(mine);
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (res.ok) {
        addToast('Booking cancelled successfully.', 'info');
        fetchBookings();
      } else {
        const data = await res.json();
        addToast(data.message || 'Cancellation failed', 'error');
      }
    } catch (e) {
      addToast('Failed to cancel booking.', 'error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName, profileImage: editImage })
      });

      if (res.ok) {
        const data = await res.json();
        addToast('Profile updated. Live changes will persist.', 'success');
        // reload location storage to apply
        localStorage.setItem('glambook_user', JSON.stringify(data.user));
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const err = await res.json();
        addToast(err.message, 'error');
      }
    } catch (err) {
      addToast('Profile update failed', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleOpenReviewModal = (artistId: string, bookingId: string) => {
    setSelectedArtistId(artistId);
    setSelectedBookingId(bookingId);
    setRating(5);
    setComment('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      addToast('Please enter a review comment.', 'info');
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ artistId: selectedArtistId, rating, comment })
      });

      if (res.ok) {
        addToast('Thank you! Review posted successfully.', 'success');
        setReviewModalOpen(false);
        fetchReviews();
        fetchBookings();
      } else {
        const err = await res.json();
        addToast(err.message || 'Attempt failed', 'error');
      }
    } catch (e) {
      addToast('Review submission failed.', 'error');
    }
  };

  const getStatusStyle = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'confirmed': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400';
      case 'cancelled': return 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400';
      default: return 'bg-amber-50 text-amber-700 dark:bg-amber-951/20 dark:text-amber-400';
    }
  };

  const getStatusIcon = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'confirmed': return <Sparkles className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-zinc-900 dark:text-zinc-50 min-h-[80vh]">
      
      {/* 1. Header user brief */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-200 pb-8 dark:border-zinc-805 mb-8">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <img 
            src={user?.profileImage} 
            alt={user?.name} 
            className="h-20 w-20 rounded-full border-2 border-violet-300 object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="inline-block rounded bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-zinc-805 dark:text-violet-400">
              Customer Portal
            </span>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight mt-1">{user?.name}</h1>
            <p className="text-sm text-zinc-500">{user?.email}</p>
          </div>
        </div>

        {/* Dashboard quick nav buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage('artists-listing')}
            className="rounded-full bg-violet-605 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 shadow transition"
          >
            Find New Artists
          </button>
        </div>
      </div>

      {/* 2. Menu Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm focus:outline-none shrink-0 ${
            activeTab === 'bookings' ? 'border-violet-600 text-violet-650' : 'border-transparent text-zinc-550 hover:text-violet-550'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>My Bookings</span>
          {bookings.length > 0 && (
            <span className="ml-1.5 rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {bookings.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm focus:outline-none shrink-0 ${
            activeTab === 'saved' ? 'border-violet-600 text-violet-650' : 'border-transparent text-zinc-550 hover:text-violet-550'
          }`}
        >
          <Heart className="h-4 w-4" />
          <span>Saved Artists</span>
          {savedArtistIds.length > 0 && (
            <span className="ml-1.5 rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] font-bold text-zinc-700 dark:bg-zinc-805 dark:text-zinc-350">
              {savedArtistIds.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm focus:outline-none shrink-0 ${
            activeTab === 'reviews' ? 'border-violet-600 text-violet-650' : 'border-transparent text-zinc-555 hover:text-violet-550'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>My Reviews</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm focus:outline-none shrink-0 ${
            activeTab === 'profile' ? 'border-violet-600 text-violet-650' : 'border-transparent text-zinc-555 hover:text-violet-550'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 3. Render and process tabs */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center space-x-1.5">
            <span>Booking & Appointment History</span>
          </h2>

          {loadingBookings ? (
            <div className="py-20 text-center text-zinc-400">Loading your diary bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-250 p-12 text-center dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40">
              <Calendar className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">No bookings scheduled yet.</p>
              <button 
                onClick={() => setPage('artists-listing')}
                className="mt-4 rounded-full bg-zinc-900 text-white px-5 py-2 text-xs font-bold hover:bg-zinc-850"
              >
                Browse & Book Artist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((booking) => (
                <div 
                  key={booking.bookingId}
                  className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-805 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition"
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(booking.bookingStatus)}`}>
                        {getStatusIcon(booking.bookingStatus)}
                        <span>{booking.bookingStatus}</span>
                      </span>
                      <span className="text-xs text-zinc-400">ID: {booking.bookingId}</span>
                    </div>
                    <h3 className="font-bold text-lg">{booking.serviceName}</h3>
                    <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                      With: <span className="font-semibold cursor-pointer hover:underline" onClick={() => setPage('artist-profile', { id: booking.artistId })}>{booking.artistName}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-zinc-505 dark:text-zinc-400 pt-1">
                      <p>Date: <span className="font-semibold">{booking.bookingDate}</span></p>
                      <p>Time: <span className="font-semibold">{booking.bookingTime}</span></p>
                      <p>Total amount paid: <span className="font-extrabold text-zinc-900 dark:text-white">${booking.totalAmount}</span></p>
                    </div>
                    {booking.notes && (
                      <p className="text-xs italic bg-slate-50 border-l-2 border-violet-300 p-2 text-zinc-500 rounded mt-2 max-w-xl dark:bg-zinc-850 dark:border-zinc-700">
                        "{booking.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 md:self-center shrink-0">
                    {(booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed') && (
                      <button
                        onClick={() => handleCancelBooking(booking.bookingId)}
                        className="rounded-full border border-slate-200 bg-slate-50/20 text-slate-600 px-4 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {booking.bookingStatus === 'completed' && (
                      <button
                        onClick={() => handleOpenReviewModal(booking.artistId, booking.bookingId)}
                        className="rounded-full bg-zinc-900 text-white px-5 py-2 text-xs font-bold hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition"
                      >
                        Submit Star Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          <h2 className="text-xl font-bold mb-6 text-left">Saved Artists ({savedArtistIds.length})</h2>
          {savedArtistIds.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-250 p-12 text-center dark:border-zinc-800">
              <Heart className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">No starred artists yet.</p>
              <button 
                onClick={() => setPage('artists-listing')}
                className="mt-4 rounded-full bg-violet-600 text-white px-5 py-2 text-xs font-bold hover:bg-violet-700 shadow cursor-pointer text-center"
              >
                Browse verified listings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-serif">
              {savedArtistIds.map(artistId => (
                <div key={artistId} className="border border-zinc-100 rounded-3xl p-5 bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-violet-50 border border-violet-200 overflow-hidden flex items-center justify-center shrink-0">
                      <Sparkles className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-bold font-sans text-sm">Artist Profile #{artistId}</h3>
                      <p className="text-xs text-zinc-400">Click to view portfolio, pricing & diary bookings</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPage('artist-profile', { id: artistId })}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-105 hover:bg-violet-50 text-violet-550 dark:bg-zinc-805"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-left mb-4">Reviews Shared By Me</h2>
          {reviewsGiven.length === 0 ? (
            <p className="text-zinc-450 dark:text-zinc-500 text-sm text-left">You haven't posted any reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 text-left">
              {reviewsGiven.map((review) => (
                <div key={review.reviewId} className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-805">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-zinc-400">ID: {review.artistId}</p>
                    <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">"{review.comment}"</p>
                  <p className="text-[10px] text-zinc-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto bg-white border border-zinc-150 p-8 rounded-3xl dark:bg-zinc-900 dark:border-zinc-800 text-left">
          <h2 className="text-xl font-bold mb-6">Edit Profile Settings</h2>
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-305 uppercase mb-2">Display Name</label>
              <input 
                type="text" 
                value={editName}
                required
                onChange={(e) => setEditName(e.target.value)}
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/20 py-2.5 px-4 text-sm focus:border-violet-500 focus:outline-none dark:border-zinc-805 dark:bg-zinc-850 dark:text-white"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-305 uppercase mb-2">Profile Image URL</label>
              <input 
                type="text" 
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/20 py-2.5 px-4 text-sm focus:border-violet-500 focus:outline-none dark:border-zinc-805 dark:bg-zinc-850 dark:text-white"
                placeholder="https://images.unsplash.com/photo-..."
              />
              <p className="text-[10px] text-zinc-400 mt-1">Provide a standard image URL for your profile avatar.</p>
            </div>
            <button
              type="submit"
              disabled={profileSaving}
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white hover:bg-violet-700 transition disabled:opacity-50 cursor-pointer text-center"
            >
              {profileSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      )}

      {/* 4. Review star submission modal markup */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-left shadow-2xl dark:bg-zinc-900 border dark:border-zinc-800 transform scale-in">
            <h3 className="text-lg font-bold mb-4">Post Artist Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Rating Choice</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className="focus:outline-none"
                    >
                      <Star className={`h-6 w-6 ${num <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1.5">Your Review Comment</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-250 bg-zinc-50/50 p-3 text-xs focus:border-violet-500 focus:outline-none dark:border-zinc-805 dark:bg-zinc-850 dark:text-white"
                  placeholder="Describe your appointment, and provide feedback on hospitality, makeup layers, and styling curls..."
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-650 hover:bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-violet-600 text-white px-5 py-2 text-xs font-bold hover:bg-violet-700 shadow"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
