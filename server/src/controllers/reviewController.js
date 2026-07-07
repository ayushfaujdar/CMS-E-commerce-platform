import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function recalcRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avg * 10) / 10,
    numReviews: count,
  });
}

export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  try {
    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
    await recalcRating(product._id);
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: 'You already reviewed this product' });
    throw err;
  }
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed' });
  }
  await review.deleteOne();
  await recalcRating(review.product);
  res.json({ message: 'Review deleted' });
});
