import { Response } from 'express';
import { mockDB } from '../utils/mockDb';
import { AuthenticatedRequest } from '../middlewares/auth';

export const getNotifications = (req: AuthenticatedRequest, res: Response) => {
  const list = mockDB.notifications
    .filter(n => n.userId === req.user!.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.status(200).json(list);
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const { notificationId } = req.params;
  const index = mockDB.notifications.findIndex(n => n.notificationId === notificationId && n.userId === req.user!.id);

  if (index === -1) {
    res.status(404).json({ message: 'Notification not found.' });
    return;
  }

  mockDB.notifications[index].readStatus = true;
  await mockDB.syncToFirestore('notifications', notificationId, mockDB.notifications[index]);

  res.status(200).json({ message: 'Notification marked as read.' });
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const userNotifs = mockDB.notifications.filter(n => n.userId === req.user!.id);
  
  for (const notif of userNotifs) {
    notif.readStatus = true;
    await mockDB.syncToFirestore('notifications', notif.notificationId, notif);
  }

  res.status(200).json({ message: 'All notifications marked as read.' });
};
