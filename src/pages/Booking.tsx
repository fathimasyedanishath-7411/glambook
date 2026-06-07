import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Clock, CreditCard, ChevronRight, AlertCircle, ShieldAlert, BadgeInfo } from 'lucide-react';

export const Booking: React.FC = () => {
  const { setPage, pageParams, token, addToast } = useApp();
  const artistId = pageParams?.artistId;
  const serviceId = pageParams?.serviceId;

  const [artist, setArtist] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');

  // Payment mock states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      addToast('Please login to schedule bookings.', 'info');
      setPage('login');
      return;
    }

    if (!artistId || !serviceId) {
      setPage('artists-listing');
      return;
    }

    fetchBookingMetadata();
  }, [artistId, serviceId]);

  const fetchBookingMetadata = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/artists/${artistId}`);
      if (res.ok) {
        const data = await res.json();
        setArtist(data);
        const srv = data.services?.find((s: any) => s.serviceId === serviceId);
        setSelectedService(srv);
      }
    } catch (e) {
      addToast('Error fetching booking metadata.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // format as #### #### #### ####
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // format as MM/YY
    const val = e.target.value.replace(/\D/g, '').substring(0, 4);
    const formatted = val.length >= 2 ? `${val.substring(0, 2)}/${val.substring(2)}` : val;
    setCardExpiry(formatted);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot) {
      addToast('Please choose date & hours.', 'info');
      return;
    }
    if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
      addToast('Please fill mock credit card metrics.', 'info');
      return;
    }

    setCheckoutLoading(true);
    try {
      // 1. Create booking
      const bRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          artistId,
          serviceId,
          bookingDate: date,
          bookingTime: timeSlot,
          notes
        })
      });

      const bData = await bRes.json();
      if (!bRes.ok) {
        throw new Error(bData.message || 'Booking submission failed.');
      }

      // 2. Submit booking payment mock API
      const pRes = await fetch('/api/payments/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: bData.bookingId,
          paymentMethod: 'Card',
          amount: selectedService.price
        })
      });

      const pData = await pRes.json();
      if (!pRes.ok) {
        throw new Error(pData.message || 'Payment simulation failed.');
      }

      // 3. Clear and forward
      addToast('Payment processes verified! Directing...', 'success');
      setPage('payment-success', { bookingId: bData.bookingId, amount: selectedService.price, serviceName: selectedService.serviceName });
    } catch (err: any) {
      addToast(err.message || 'Error executing booking pipelines.', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-zinc-400">Preparing scheduling checkout workspace...</div>;
  }

  if (!artist || !selectedService) {
    return <div className="py-20 text-center text-zinc-400">Failed to load booking models. Please try again.</div>;
  }

  const timeslots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-zinc-900 dark:text-zinc-50 text-left min-h-screen">
      
      <div className="mb-8 border-b border-slate-200 pb-5 dark:border-zinc-805">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight">Confirm Booking</h1>
        <p className="text-xs text-zinc-405 mt-0.5">Secure your appointment immediately via our synchronized demo billing checkout.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Right Panel Card / Summary details */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-zinc-100 rounded-3xl bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-zinc-500 uppercase">GIG SUMMARY</h3>
            <div className="border-b pb-4 border-zinc-100 dark:border-zinc-805">
              <p className="text-[10px] uppercase font-semibold text-violet-600">Specialist Treatment</p>
              <p className="font-bold text-sm mt-0.5">{selectedService.serviceName}</p>
              <p className="text-xs text-zinc-400 mt-1">Provider: <span className="font-semibold text-zinc-805 dark:text-zinc-300">{artist.name}</span></p>
            </div>

            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="font-semibold">Flat treatment fee:</span>
              <span className="font-black text-violet-600">${selectedService.price}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-100 dark:border-zinc-805">
              <span className="font-semibold">Platform Taxes:</span>
              <span className="font-bold text-zinc-400">FREE DEV</span>
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <span className="font-bold text-zinc-800 dark:text-zinc-100">Total charge amount:</span>
              <span className="font-black text-violet-600 text-lg">${selectedService.price}</span>
            </div>
          </div>

          <div className="bg-amber-50/20 border-l-4 border-amber-400 p-4 rounded-r-2xl text-xs space-y-2 dark:bg-zinc-900 dark:border-zinc-800">
            <p className="font-bold text-amber-600 flex items-center space-x-1"><BadgeInfo className="h-4 w-4" /> <span>Sandbox Mode</span></p>
            <p className="text-zinc-500 leading-relaxed">This checkout relies on in-memory state locks. Real money will not be billed, feel free to insert any standard sandbox test values.</p>
          </div>
        </div>

        {/* Left Panel forms */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            
            {/* Step 1: Appointment Details */}
            <div className="border border-zinc-105 rounded-3xl bg-white p-6 shadow-sm dark:bg-zinc-905 dark:border-zinc-805 text-left space-y-5">
              <h3 className="font-bold text-base flex items-center space-x-1">
                <span className="flex h-5 w-5 bg-violet-600 rounded-full text-white text-[10px] font-black items-center justify-center">1</span>
                <span>Select Appointment date & hours</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-50/50 rounded-xl py-2 px-3.5 focus:outline-none border border-zinc-200 focus:border-violet-500 dark:bg-zinc-850 dark:border-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1.5">Available Hour Slots</label>
                  <select
                    required
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-zinc-50/50 rounded-xl py-2 px-3 focus:outline-none border border-zinc-200 focus:border-violet-500 dark:bg-zinc-850 dark:border-zinc-700"
                  >
                    <option value="">Choose hours</option>
                    {timeslots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1.5">Styling Preferences & Comments (Optional)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-50/50 rounded-xl py-2 px-3 text-xs focus:outline-none border border-zinc-200 focus:border-violet-500 dark:bg-zinc-850 dark:border-zinc-700"
                  placeholder="e.g. skin requirements (sensitive dry skin), braids reference, dress theme colors..."
                />
              </div>
            </div>

            {/* Step 2: Sandbox Billing Form */}
            <div className="border border-zinc-105 rounded-3xl bg-white p-6 shadow-sm dark:bg-zinc-905 dark:border-zinc-805 text-left space-y-5">
              <h3 className="font-bold text-base flex items-center space-x-1">
                <span className="flex h-5 w-5 bg-violet-600 rounded-full text-white text-[10px] font-black items-center justify-center">2</span>
                <span>Secure sandbox card billing</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-zinc-50/50 rounded-xl py-2 px-3.5 focus:outline-none border border-zinc-200 focus:border-violet-500 dark:bg-zinc-850 dark:border-zinc-700"
                    placeholder="Name surname"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1.5">Sandbox Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute inset-y-0 left-3 h-4.5 w-4.5 text-zinc-400 my-auto" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full bg-zinc-50/50 rounded-xl py-2.5 pl-10 pr-3.5 focus:outline-none border border-zinc-200 focus:border-violet-500 dark:bg-zinc-850 dark:border-zinc-700"
                      placeholder="4000 1234 5678 9010"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-555 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full bg-zinc-50/50 rounded-xl py-2 px-3.5 focus:outline-none border border-zinc-200 focus:border-violet-500 dark:bg-zinc-850 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-zinc-550 mb-1.5">Security Code (CVV)</label>
                    <input
                      type="password"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.substring(0, 3).replace(/\D/g, ''))}
                      placeholder="•••"
                      className="w-full bg-zinc-50/50 rounded-xl py-2 px-3.5 focus:outline-none border border-zinc-200 focus:border-violet-500 dark:bg-zinc-850 dark:border-zinc-700 animate-pulse"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={checkoutLoading}
              className="w-full rounded-xl bg-violet-605 py-3 text-sm font-bold text-white hover:bg-violet-700 transition disabled:opacity-50 mt-4 shadow-md text-center cursor-pointer"
            >
              {checkoutLoading ? 'Verifying Checkout Sandbox...' : `Authorize Booking & Pay $${selectedService.price}`}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
