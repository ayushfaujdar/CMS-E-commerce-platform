import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  const [revenueAgg, orderCount, userCount, productCount, lowStock] = await Promise.all([
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments(),
    Product.find({ countInStock: { $lte: 5 } })
      .select('name countInStock')
      .sort('countInStock')
      .limit(10),
  ]);

  const statusBreakdown = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);

  // Sales over the last 14 days
  const since = new Date();
  since.setDate(since.getDate() - 14);
  const salesByDay = await Order.aggregate([
    { $match: { createdAt: { $gte: since }, isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        sold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    totalRevenue: revenueAgg[0]?.total || 0,
    orderCount,
    userCount,
    productCount,
    lowStock,
    statusBreakdown,
    salesByDay,
    topProducts,
  });
});
