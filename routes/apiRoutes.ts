import { Router } from 'express';
import { authenticateToken, requireRole } from '../middlewares/auth';

// Import All Controllers
import * as authCtrl from '../controllers/authController';
import * as userCtrl from '../controllers/userController';
import * as artistCtrl from '../controllers/artistController';
import * as bookingCtrl from '../controllers/bookingController';
import * as reviewCtrl from '../controllers/reviewController';
import * as paymentCtrl from '../controllers/paymentController';
import * as notificationCtrl from '../controllers/notificationController';
import * as adminCtrl from '../controllers/adminController';

const router = Router();

// ==========================================
// 1. AUTH ROUTES
// ==========================================
router.post('/auth/signup', authCtrl.signup);
router.post('/auth/login', authCtrl.login);
router.post('/auth/logout', authCtrl.logout);
router.post('/auth/forgot-password', authCtrl.forgotPassword);

// ==========================================
// 2. USER ROUTES
// ==========================================
router.get('/user/profile', authenticateToken as any, userCtrl.getProfile as any);
router.put('/user/profile', authenticateToken as any, userCtrl.updateProfile as any);

// ==========================================
// 3. ARTIST ROUTES
// ==========================================
router.get('/artists', artistCtrl.getArtists);
router.get('/artists/:id', artistCtrl.getArtistById);
router.put('/artists/profile', authenticateToken as any, requireRole(['artist']) as any, artistCtrl.updateArtistProfile as any);
router.post('/artists/portfolio', authenticateToken as any, requireRole(['artist']) as any, artistCtrl.uploadPortfolio as any);
router.post('/artists/services', authenticateToken as any, requireRole(['artist']) as any, artistCtrl.addService as any);
router.delete('/artists/services/:serviceId', authenticateToken as any, requireRole(['artist']) as any, artistCtrl.deleteService as any);

// ==========================================
// 4. BOOKING ROUTES
// ==========================================
router.post('/bookings', authenticateToken as any, bookingCtrl.createBooking as any);
router.get('/bookings', authenticateToken as any, bookingCtrl.getBookings as any);
router.patch('/bookings/:bookingId/status', authenticateToken as any, bookingCtrl.updateBookingStatus as any);

// ==========================================
// 5. REVIEW ROUTES
// ==========================================
router.post('/reviews', authenticateToken as any, reviewCtrl.addReview as any);
router.get('/reviews', reviewCtrl.getReviews);

// ==========================================
// 6. PAYMENT ROUTES
// ==========================================
router.post('/payments/demo', authenticateToken as any, paymentCtrl.processDemoPayment as any);
router.get('/payments', authenticateToken as any, paymentCtrl.getPayments as any);

// ==========================================
// 7. NOTIFICATION ROUTES
// ==========================================
router.get('/notifications', authenticateToken as any, notificationCtrl.getNotifications as any);
router.patch('/notifications/read-all', authenticateToken as any, notificationCtrl.markAllAsRead as any);
router.patch('/notifications/:notificationId/read', authenticateToken as any, notificationCtrl.markAsRead as any);

// ==========================================
// 8. ADMIN ROUTES
// ==========================================
router.get('/admin/analytics', authenticateToken as any, requireRole(['admin']) as any, adminCtrl.getAdminAnalytics as any);
router.get('/admin/users', authenticateToken as any, requireRole(['admin']) as any, adminCtrl.getManageUsers as any);
router.patch('/admin/users/:userId/block', authenticateToken as any, requireRole(['admin']) as any, adminCtrl.toggleBlockUser as any);
router.patch('/admin/artists/:artistId/verify', authenticateToken as any, requireRole(['admin']) as any, adminCtrl.toggleVerifyArtist as any);

export default router;
