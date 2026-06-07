import { Request, Response } from 'express';
import { mockDB } from '../utils/mockDb';
import { AuthenticatedRequest } from '../middlewares/auth';

export const getArtists = (req: Request, res: Response) => {
  const { category, city, minPrice, maxPrice, rating, search } = req.query;
  let filtered = mockDB.artists.map(artist => {
    const user = mockDB.users.find(u => u.id === artist.artistId);
    return {
      ...artist,
      name: user ? user.name : 'Unknown Artist',
      profileImage: user ? user.profileImage : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      email: user ? user.email : ''
    };
  });

  // Filter blocked artists out
  filtered = filtered.filter(artist => {
    const userObj = mockDB.users.find(u => u.id === artist.artistId);
    return userObj && !userObj.blocked;
  });

  if (category) {
    filtered = filtered.filter(a => a.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (city) {
    filtered = filtered.filter(a => a.city.toLowerCase() === (city as string).toLowerCase());
  }

  if (minPrice) {
    filtered = filtered.filter(a => a.pricing >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(a => a.pricing <= Number(maxPrice));
  }

  if (rating) {
    filtered = filtered.filter(a => a.rating >= Number(rating));
  }

  if (search) {
    const s = (search as string).toLowerCase();
    filtered = filtered.filter(a => 
      a.name.toLowerCase().includes(s) || 
      (a.bio && a.bio.toLowerCase().includes(s)) ||
      a.city.toLowerCase().includes(s) ||
      (a.category && a.category.toLowerCase().includes(s))
    );
  }

  res.status(200).json(filtered);
};

export const getArtistById = (req: Request, res: Response) => {
  const { id } = req.params;
  const artist = mockDB.artists.find(a => a.artistId === id);

  if (!artist) {
    res.status(404).json({ message: 'Artist profile not found.' });
    return;
  }

  const user = mockDB.users.find(u => u.id === id);
  const artistServices = mockDB.services.filter(s => s.artistId === id);
  const artistReviews = mockDB.reviews.filter(r => r.artistId === id);

  res.status(200).json({
    ...artist,
    name: user ? user.name : 'Unknown Artist',
    profileImage: user ? user.profileImage : '',
    email: user ? user.email : '',
    services: artistServices,
    reviews: artistReviews
  });
};

export const updateArtistProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'artist') {
    res.status(403).json({ message: 'Only registered artists can update their artist profile.' });
    return;
  }

  const { category, city, experience, pricing, bio, availability } = req.body;
  const artistIndex = mockDB.artists.findIndex(a => a.artistId === req.user!.id);

  if (artistIndex === -1) {
    res.status(404).json({ message: 'Artist record not found' });
    return;
  }

  if (category) mockDB.artists[artistIndex].category = category;
  if (city) mockDB.artists[artistIndex].city = city;
  if (experience !== undefined) mockDB.artists[artistIndex].experience = Number(experience);
  if (pricing !== undefined) mockDB.artists[artistIndex].pricing = Number(pricing);
  if (bio !== undefined) mockDB.artists[artistIndex].bio = bio;
  if (availability) mockDB.artists[artistIndex].availability = availability;

  await mockDB.syncToFirestore('artists', req.user.id, mockDB.artists[artistIndex]);

  res.status(200).json({
    message: 'Artist profile updated successfully.',
    artist: mockDB.artists[artistIndex]
  });
};

export const uploadPortfolio = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'artist') {
    res.status(403).json({ message: 'Only registered artists can upload portfolio images.' });
    return;
  }

  const { imageUrl } = req.body;
  if (!imageUrl) {
    res.status(400).json({ message: 'imageUrl represents a required parameter.' });
    return;
  }

  const artistIndex = mockDB.artists.findIndex(a => a.artistId === req.user!.id);
  if (artistIndex === -1) {
    res.status(404).json({ message: 'Artist profile not found.' });
    return;
  }

  mockDB.artists[artistIndex].portfolio.push(imageUrl);
  await mockDB.syncToFirestore('artists', req.user.id, mockDB.artists[artistIndex]);

  res.status(201).json({
    message: 'Portfolio image added successfully.',
    portfolio: mockDB.artists[artistIndex].portfolio
  });
};

export const addService = async (req: AuthenticatedRequest, res: Response) => {
  const { serviceName, price } = req.body;
  if (!serviceName || price === undefined) {
    res.status(400).json({ message: 'serviceName and price are required.' });
    return;
  }

  const serviceId = `srv-${Date.now()}`;
  const newService = {
    serviceId,
    artistId: req.user!.id,
    serviceName,
    price: Number(price)
  };

  mockDB.services.push(newService);
  await mockDB.syncToFirestore('services', serviceId, newService);

  res.status(201).json({
    message: 'Service listing added.',
    service: newService
  });
};

export const deleteService = async (req: AuthenticatedRequest, res: Response) => {
  const { serviceId } = req.params;
  const index = mockDB.services.findIndex(s => s.serviceId === serviceId && s.artistId === req.user!.id);

  if (index === -1) {
    res.status(404).json({ message: 'Service not found or unauthorized.' });
    return;
  }

  mockDB.services.splice(index, 1);
  await mockDB.deleteFromFirestore('services', serviceId);

  res.status(200).json({ message: 'Service listing deleted successfully.' });
};
