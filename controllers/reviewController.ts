import { Response } from 'express';
import { mockDB } from '../utils/mockDb';
import { AuthenticatedRequest } from '../middlewares/auth';

export const addReview = async (req: AuthenticatedRequest, res: Response) => {
  const { artistId, rating, comment } = req.body;

  if (!artistId || rating === undefined || !comment) {
    res.status(400).json({ message: 'artistId, rating and comment represent mandatory inputs.' });
    return;
  }

  const user = mockDB.users.find(u => u.id === req.user!.id);
  const customerName = user ? user.name : 'GlamBook Customer';

  const reviewId = `rev-${Date.now()}`;
  const newReview = {
    reviewId,
    artistId,
    customerId: req.user!.id,
    customerName,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  };

  mockDB.reviews.push(newReview);
  await mockDB.syncToFirestore('reviews', reviewId, newReview);

  // Recalculate artist standard rating
  const artistReviews = mockDB.reviews.filter(r => r.artistId === artistId);
  const totalRating = artistReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = Number((totalRating / artistReviews.length).toFixed(1));

  const artistIdx = mockDB.artists.findIndex(a => a.artistId === artistId);
  if (artistIdx !== -1) {
    mockDB.artists[artistIdx].rating = averageRating;
    await mockDB.syncToFirestore('artists', artistId, mockDB.artists[artistIdx]);
  }

  // Trigger notification for artist
  const artistNotifId = `notif-${Date.now()}-r`;
  const artistNotif = {
    notificationId: artistNotifId,
    userId: artistId,
    title: 'New Review Received!',
    message: `${customerName} left a ${rating}-star review for your profile.`,
    readStatus: false,
    createdAt: new Date().toISOString()
  };
  mockDB.notifications.push(artistNotif);
  await mockDB.syncToFirestore('notifications', artistNotifId, artistNotif);

  res.status(201).json({
    message: 'Review posted and average artist statistics updated.',
    review: newReview,
    averageRating
  });
};

export const getReviews = (req: AuthenticatedRequest, res: Response) => {
  const { artistId } = req.query;
  if (artistId) {
    const list = mockDB.reviews.filter(r => r.artistId === artistId);
    res.status(200).json(list);
    return;
  }
  res.status(200).json(mockDB.reviews);
};
