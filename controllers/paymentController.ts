import { Response } from 'express';
import { mockDB } from '../utils/mockDb';
import { AuthenticatedRequest } from '../middlewares/auth';

export const processDemoPayment = async (req: AuthenticatedRequest, res: Response) => {
  const { bookingId, paymentMethod, amount } = req.body;

  if (!bookingId || !paymentMethod || amount === undefined) {
    res.status(400).json({ message: 'bookingId, paymentMethod, and amount represent required payload parameters.' });
    return;
  }

  const paymentIndex = mockDB.payments.findIndex(p => p.bookingId === bookingId);
  const bookingIndex = mockDB.bookings.findIndex(b => b.bookingId === bookingId);

  if (bookingIndex === -1) {
    res.status(404).json({ message: 'Booking appointment record not found.' });
    return;
  }

  // Update booking status to confirmed if they paid
  mockDB.bookings[bookingIndex].bookingStatus = 'confirmed';
  await mockDB.syncToFirestore('bookings', bookingId, mockDB.bookings[bookingIndex]);

  let activePayment: any;
  if (paymentIndex !== -1) {
    mockDB.payments[paymentIndex].paymentStatus = 'completed';
    mockDB.payments[paymentIndex].paymentMethod = paymentMethod;
    activePayment = mockDB.payments[paymentIndex];
    await mockDB.syncToFirestore('payments', activePayment.paymentId, activePayment);
  } else {
    const paymentId = `pay-${Date.now()}`;
    const newPayment = {
      paymentId,
      bookingId,
      customerId: req.user!.id,
      amount: Number(amount),
      paymentMethod,
      paymentStatus: 'completed' as const
    };
    mockDB.payments.push(newPayment);
    activePayment = newPayment;
    await mockDB.syncToFirestore('payments', paymentId, newPayment);
  }

  // Post booking creation notification
  const customerNotifId = `notif-${Date.now()}-p`;
  const customerNotif = {
    notificationId: customerNotifId,
    userId: mockDB.bookings[bookingIndex].customerId,
    title: 'Payment Successful',
    message: `Payment of $${amount} for Booking ${bookingId} was successfully settled.`,
    readStatus: false,
    createdAt: new Date().toISOString()
  };
  mockDB.notifications.push(customerNotif);
  await mockDB.syncToFirestore('notifications', customerNotifId, customerNotif);

  res.status(200).json({
    message: 'Demo payment processed and booking confirmed.',
    payment: activePayment
  });
};

export const getPayments = (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role === 'admin') {
    res.status(200).json(mockDB.payments);
    return;
  }

  const list = mockDB.payments.filter(p => p.customerId === req.user!.id);
  res.status(200).json(list);
};
