import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    size: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const trackingSchema = new mongoose.Schema(
  {
    status: { type: String },
    note: String,
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    itemsPrice: Number,
    discount: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: Number,
    couponCode: String,
    paymentMethod: { type: String, default: 'stub' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentResult: {
      id: String,
      status: String,
      provider: String,
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    tracking: [trackingSchema],
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
