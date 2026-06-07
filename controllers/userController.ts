import { Response } from 'express';
import { mockDB } from '../utils/mockDb';
import { AuthenticatedRequest } from '../middlewares/auth';

export const getProfile = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const user = mockDB.users.find(u => u.id === req.user!.id);
  if (!user) {
    res.status(404).json({ message: 'User profile not found.' });
    return;
  }

  res.status(200).json(user);
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { name, profileImage } = req.body;
  const userIndex = mockDB.users.findIndex(u => u.id === req.user!.id);

  if (userIndex === -1) {
    res.status(404).json({ message: 'User profile not found.' });
    return;
  }

  if (name) mockDB.users[userIndex].name = name;
  if (profileImage) mockDB.users[userIndex].profileImage = profileImage;

  await mockDB.syncToFirestore('users', req.user.id, mockDB.users[userIndex]);

  res.status(200).json({
    message: 'Profile updated successfully.',
    user: mockDB.users[userIndex]
  });
};
