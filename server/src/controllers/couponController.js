import Coupon from '../models/Coupon.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listActiveCoupons = asyncHandler(async (_req, res) => {
  const now = new Date();
  const coupons = await Coupon.find({
    active: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  }).select('code description discountPercent minOrder expiresAt');
  res.json(coupons);
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, itemsPrice = 0 } = req.body;
  const coupon = await Coupon.findOne({ code: (code || '').toUpperCase(), active: true });
  if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
  if (coupon.expiresAt && coupon.expiresAt < new Date())
    return res.status(400).json({ message: 'Coupon expired' });
  if (itemsPrice < coupon.minOrder)
    return res.status(400).json({ message: `Minimum order ₹${coupon.minOrder} required` });
  res.json({
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    discount: Math.round((itemsPrice * coupon.discountPercent) / 100),
  });
});

// Admin
export const listCoupons = asyncHandler(async (_req, res) => {
  res.json(await Coupon.find().sort('-createdAt'));
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  res.json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
  res.json({ message: 'Coupon deleted' });
});
