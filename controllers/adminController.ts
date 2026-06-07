import { Response } from 'express';
import { mockDB } from '../utils/mockDb';
import { AuthenticatedRequest } from '../middlewares/auth';

export const getAdminAnalytics = (req: AuthenticatedRequest, res: Response) => {
  const totalUsersCount = mockDB.users.filter(u => u.role === 'customer').length;
  const totalArtistsCount = mockDB.artists.length;
  const totalBookingsCount = mockDB.bookings.length;

  const totalRevenue = mockDB.payments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  // Revenue by category
  const revenueByCategory: Record<string, number> = {
    makeup: 0,
    mehendi: 0,
    hairsalon: 0,
    photography: 0,
    beautician: 0
  };

  mockDB.bookings.forEach(booking => {
    if (booking.bookingStatus === 'completed') {
      const artist = mockDB.artists.find(a => a.artistId === booking.artistId);
      if (artist && revenueByCategory[artist.category] !== undefined) {
        revenueByCategory[artist.category] += booking.totalAmount;
      }
    }
  });

  // Convert categories to array for charts
  const categoryStats = Object.keys(revenueByCategory).map(cat => ({
    name: cat.toUpperCase(),
    value: revenueByCategory[cat]
  }));

  res.status(200).json({
    analytics: {
      totalUsers: totalUsersCount,
      totalArtists: totalArtistsCount,
      totalBookings: totalBookingsCount,
      revenue: totalRevenue,
      categoryStats
    }
  });
};

export const getManageUsers = (req: AuthenticatedRequest, res: Response) => {
  const usersWithArtistDetails = mockDB.users.map(u => {
    const artistDetails = mockDB.artists.find(a => a.artistId === u.id);
    return {
      ...u,
      artistDetails: artistDetails || null
    };
  });
  res.status(200).json(usersWithArtistDetails);
};

export const toggleBlockUser = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  const userIdx = mockDB.users.findIndex(u => u.id === userId);

  if (userIdx === -1) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  if (mockDB.users[userIdx].role === 'admin') {
    res.status(400).json({ message: 'Administrators cannot be blocked.' });
    return;
  }

  const currentBlocked = !!mockDB.users[userIdx].blocked;
  mockDB.users[userIdx].blocked = !currentBlocked;

  await mockDB.syncToFirestore('users', userId, mockDB.users[userIdx]);

  res.status(200).json({
    message: `User count has been ${!currentBlocked ? 'suspended' : 're-activated'}.`,
    user: mockDB.users[userIdx]
  });
};

export const toggleVerifyArtist = async (req: AuthenticatedRequest, res: Response) => {
  const { artistId } = req.params;
  const artistIdx = mockDB.artists.findIndex(a => a.artistId === artistId);

  if (artistIdx === -1) {
    res.status(404).json({ message: 'Artist profile not found.' });
    return;
  }

  const currentVerifiedState = !!mockDB.artists[artistIdx].verified;
  mockDB.artists[artistIdx].verified = !currentVerifiedState;

  await mockDB.syncToFirestore('artists', artistId, mockDB.artists[artistIdx]);

  res.status(200).json({
    message: `Artist profile verification is set to: ${!currentVerifiedState}.`,
    artist: mockDB.artists[artistIdx]
  });
};
