import { Router } from 'express';
import { body } from 'express-validator';
import { protect, admin } from '../middleware/auth.js';

import * as auth from '../controllers/authController.js';
import * as products from '../controllers/productController.js';
import * as categories from '../controllers/categoryController.js';
import * as cart from '../controllers/cartController.js';
import * as orders from '../controllers/orderController.js';
import * as reviews from '../controllers/reviewController.js';
import * as coupons from '../controllers/couponController.js';
import * as notifications from '../controllers/notificationController.js';
import * as analytics from '../controllers/analyticsController.js';

const router = Router();

// --- Auth ---
router.post(
  '/auth/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  auth.register
);
router.post('/auth/login', [body('email').isEmail(), body('password').notEmpty()], auth.login);
router.get('/auth/me', protect, auth.me);
router.put('/auth/profile', protect, auth.updateProfile);

// --- Categories ---
router.get('/categories', categories.listCategories);
router.post('/categories', protect, admin, categories.createCategory);
router.put('/categories/:id', protect, admin, categories.updateCategory);
router.delete('/categories/:id', protect, admin, categories.deleteCategory);

// --- Products ---
router.get('/products', products.listProducts);
router.get('/products/:idOrSlug', products.getProduct);
router.post('/products', protect, admin, products.createProduct);
router.put('/products/:id', protect, admin, products.updateProduct);
router.delete('/products/:id', protect, admin, products.deleteProduct);

// --- Reviews ---
router.post('/products/:productId/reviews', protect, reviews.createReview);
router.delete('/reviews/:id', protect, reviews.deleteReview);

// --- Cart ---
router.get('/cart', protect, cart.getCart);
router.post('/cart', protect, cart.addToCart);
router.put('/cart', protect, cart.updateCartItem);
router.delete('/cart/item', protect, cart.removeFromCart);
router.delete('/cart', protect, cart.clearCart);

// --- Orders ---
router.post('/orders', protect, orders.createOrder);
router.get('/orders/mine', protect, orders.getMyOrders);
router.get('/orders/:id', protect, orders.getOrder);
router.post('/orders/:id/cancel', protect, orders.cancelOrder);
router.get('/admin/orders', protect, admin, orders.listAllOrders);
router.put('/admin/orders/:id/status', protect, admin, orders.updateOrderStatus);

// --- Coupons ---
router.get('/coupons', coupons.listActiveCoupons);
router.post('/coupons/validate', coupons.validateCoupon);
router.get('/admin/coupons', protect, admin, coupons.listCoupons);
router.post('/admin/coupons', protect, admin, coupons.createCoupon);
router.put('/admin/coupons/:id', protect, admin, coupons.updateCoupon);
router.delete('/admin/coupons/:id', protect, admin, coupons.deleteCoupon);

// --- Notifications ---
router.get('/notifications', protect, notifications.listNotifications);
router.put('/notifications/:id/read', protect, notifications.markRead);
router.put('/notifications/read-all', protect, notifications.markAllRead);

// --- Admin analytics ---
router.get('/admin/analytics', protect, admin, analytics.getDashboard);

export default router;
