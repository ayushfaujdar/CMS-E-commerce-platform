import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: String,
    discountPercent: { type: Number, required: true, min: 1, max: 90 },
    minOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);
