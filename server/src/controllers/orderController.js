import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import { charge } from '../services/payment.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SHIPPING_FLAT = 49;
const FREE_SHIPPING_THRESHOLD = 999;

async function resolveCoupon(code, itemsPrice) {
  if (!code) return { discount: 0, coupon: null };
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
  if (!coupon) throw Object.assign(new Error('Invalid coupon code'), { statusCode: 400 });
  if (coupon.expiresAt && coupon.expiresAt < new Date())
    throw Object.assign(new Error('Coupon expired'), { statusCode: 400 });
  if (itemsPrice < coupon.minOrder)
    throw Object.assign(new Error(`Minimum order ₹${coupon.minOrder} for this coupon`), {
      statusCode: 400,
    });
  return { discount: Math.round((itemsPrice * coupon.discountPercent) / 100), coupon };
}

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, couponCode, paymentMethod = 'stub' } = req.body;

  await req.user.populate('cart.product');
  const cartItems = req.user.cart.filter((i) => i.product);
  if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  // Stock check
  for (const item of cartItems) {
    if (item.product.countInStock < item.quantity) {
      return res
        .status(400)
        .json({ message: `Insufficient stock for ${item.product.name}` });
    }
  }

  const items = cartItems.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0],
    size: item.size,
    price: item.product.finalPrice,
    quantity: item.quantity,
  }));

  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const { discount, coupon } = await resolveCoupon(couponCode, itemsPrice);
  const shippingPrice = itemsPrice - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const totalPrice = itemsPrice - discount + shippingPrice;

  // Process payment (stubbed)
  const payment = await charge({ amount: totalPrice, method: paymentMethod });

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    itemsPrice,
    discount,
    shippingPrice,
    totalPrice,
    couponCode: coupon?.code,
    paymentMethod,
    paymentStatus: payment.success ? 'paid' : 'failed',
    isPaid: payment.success,
    paidAt: payment.success ? new Date() : undefined,
    paymentResult: { id: payment.id, status: payment.status, provider: payment.provider },
    orderStatus: 'placed',
    tracking: [{ status: 'placed', note: 'Order placed successfully' }],
  });

  // Decrement stock
  await Promise.all(
    items.map((i) =>
      Product.findByIdAndUpdate(i.product, { $inc: { countInStock: -i.quantity } })
    )
  );

  // Clear cart + notify
  req.user.cart = [];
  await req.user.save();
  await Notification.create({
    user: req.user._id,
    title: 'Order placed',
    message: `Your order #${order._id.toString().slice(-6)} has been placed.`,
    type: 'order',
    link: `/orders/${order._id}`,
  });

  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed' });
  }
  res.json(order);
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed' });
  }
  if (['shipped', 'out_for_delivery', 'delivered'].includes(order.orderStatus)) {
    return res.status(400).json({ message: 'Order can no longer be cancelled' });
  }
  order.orderStatus = 'cancelled';
  order.tracking.push({ status: 'cancelled', note: 'Cancelled by user' });
  await order.save();
  // restock
  await Promise.all(
    order.items.map((i) =>
      Product.findByIdAndUpdate(i.product, { $inc: { countInStock: i.quantity } })
    )
  );
  res.json(order);
});

// Admin
export const listAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.json(orders);
});

const STATUS_FLOW = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!STATUS_FLOW.includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.orderStatus = status;
  order.tracking.push({ status, note });
  if (status === 'delivered') order.deliveredAt = new Date();
  await order.save();

  await Notification.create({
    user: order.user,
    title: 'Order update',
    message: `Your order #${order._id.toString().slice(-6)} is now "${status.replace(/_/g, ' ')}".`,
    type: 'order',
    link: `/orders/${order._id}`,
  });

  res.json(order);
});
