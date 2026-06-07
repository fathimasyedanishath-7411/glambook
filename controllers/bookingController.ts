import { Response } from 'express';
import { mockDB } from '../utils/mockDb';
import { AuthenticatedRequest } from '../middlewares/auth';

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  const { artistId, serviceId, bookingDate, bookingTime, totalAmount, notes } = req.body;

  if (!artistId || !serviceId || !bookingDate || !bookingTime || totalAmount === undefined) {
    res.status(400).json({ message: 'All booking fields are required.' });
    return;
  }

  const bookingId = `book-${Date.now()}`;
  const service = mockDB.services.find(s => s.serviceId === serviceId);
  const serviceName = service ? service.serviceName : 'Custom Service';

  const newBooking = {
    bookingId,
    customerId: req.user!.id,
    artistId,
    serviceId,
    serviceName,
    bookingDate,
    bookingTime,
    bookingStatus: 'pending' as const,
    totalAmount: Number(totalAmount),
    notes: notes || ''
  };

  mockDB.bookings.push(newBooking);
  await mockDB.syncToFirestore('bookings', bookingId, newBooking);

  // Trigger Notifications for both artist and customer
  const artistNotifId = `notif-${Date.now()}-a`;
  const artistNotif = {
    notificationId: artistNotifId,
    userId: artistId,
    title: 'New Booking Request',
    message: `You received a new booking from ${req.user!.email} for ${serviceName} on ${bookingDate} at ${bookingTime}.`,
    readStatus: false,
    createdAt: new Date().toISOString()
  };
  mockDB.notifications.push(artistNotif);
  await mockDB.syncToFirestore('notifications', artistNotifId, artistNotif);

  // Auto-generate Payment entity
  const paymentId = `pay-${Date.now()}`;
  const newPayment = {
    paymentId,
    bookingId,
    customerId: req.user!.id,
    amount: Number(totalAmount),
    paymentMethod: 'Card (Demo)',
    paymentStatus: 'pending' as const
  };
  mockDB.payments.push(newPayment);
  await mockDB.syncToFirestore('payments', paymentId, newPayment);

  res.status(201).json({
    message: 'Booking created successfully.',
    booking: newBooking,
    paymentId
  });
};

export const getBookings = (req: AuthenticatedRequest, res: Response) => {
  const { id, role } = req.user!;
  
  let userBookings = [];
  if (role === 'customer') {
    userBookings = mockDB.bookings.filter(b => b.customerId === id);
  } else if (role === 'artist') {
    userBookings = mockDB.bookings.filter(b => b.artistId === id);
  } else {
    userBookings = mockDB.bookings; // Admin gets everything
  }

  // Populate artist and customer info
  const richBookings = userBookings.map(b => {
    const artistUser = mockDB.users.find(u => u.id === b.artistId);
    const customerUser = mockDB.users.find(u => u.id === b.customerId);
    const artistProfile = mockDB.artists.find(a => a.artistId === b.artistId);

    return {
      ...b,
      artistName: artistUser ? artistUser.name : 'Unknown Artist',
      customerName: customerUser ? customerUser.name : 'Unknown Customer',
      category: artistProfile ? artistProfile.category : 'Service'
    };
  });

  res.status(200).json(richBookings);
};

export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { bookingId } = req.params;
  const { status } = req.body; // 'confirmed', 'completed', 'cancelled'

  if (!status || !['confirmed', 'completed', 'cancelled'].includes(status)) {
    res.status(400).json({ message: 'A valid target status is required.' });
    return;
  }

  const bookingIdx = mockDB.bookings.findIndex(b => b.bookingId === bookingId);
  if (bookingIdx === -1) {
    res.status(404).json({ message: 'Booking appointment not found.' });
    return;
  }

  const booking = mockDB.bookings[bookingIdx];

  // Permissions validation
  const userId = req.user!.id;
  const userRole = req.user!.role;

  if (userRole === 'customer' && status !== 'cancelled') {
    res.status(403).json({ message: 'Customers can only cancel appointments.' });
    return;
  }

  if (userRole === 'artist' && booking.artistId !== userId) {
    res.status(403).json({ message: 'Unauthorized profile operation.' });
    return;
  }

  if (userRole === 'customer' && booking.customerId !== userId) {
    res.status(403).json({ message: 'Unauthorized profile operation.' });
    return;
  }

  // Set new status
  booking.bookingStatus = status;
  await mockDB.syncToFirestore('bookings', bookingId, booking);

  // If completing, mark payment as completed
  if (status === 'completed') {
    const payment = mockDB.payments.find(p => p.bookingId === bookingId);
    if (payment) {
      payment.paymentStatus = 'completed';
      await mockDB.syncToFirestore('payments', payment.paymentId, payment);
    }
  }

  // Trigger Notifications
  const customerNotifId = `notif-${Date.now()}-c`;
  const customerNotif = {
    notificationId: customerNotifId,
    userId: booking.customerId,
    title: `Booking Update: ${status.toUpperCase()}`,
    message: `Your booking appointment with ID ${bookingId} has been ${status}.`,
    readStatus: false,
    createdAt: new Date().toISOString()
  };
  mockDB.notifications.push(customerNotif);
  await mockDB.syncToFirestore('notifications', customerNotifId, customerNotif);

  res.status(200).json({
    message: `Booking status changed to ${status}.`,
    booking
  });
};
