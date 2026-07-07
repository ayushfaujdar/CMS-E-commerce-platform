import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    type: { type: String, enum: ['order', 'promo', 'system'], default: 'system' },
    read: { type: Boolean, default: false },
    link: String,
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
