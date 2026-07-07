import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// GET /api/products  with search, filter, sort, pagination
export const listProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    gender,
    minPrice,
    maxPrice,
    sort = 'newest',
    featured,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};
  if (q) filter.$text = { $search: q };
  if (gender) filter.gender = gender;
  if (featured === 'true') filter.isFeatured = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (category) {
    // accept slug or id
    const cat = await Category.findOne(
      category.match(/^[0-9a-fA-F]{24}$/) ? { _id: category } : { slug: category }
    );
    if (cat) filter.category = cat._id;
    else return res.json({ products: [], total: 0, page: 1, pages: 0 });
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    popular: { numReviews: -1 },
  };

  const perPage = Math.min(Number(limit), 50);
  const skip = (Number(page) - 1) * perPage;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(perPage),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / perPage),
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };
  const product = await Product.findOne(query).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const reviews = await Review.find({ product: product._id })
    .populate('user', 'name')
    .sort('-createdAt');
  res.json({ product, reviews });
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  data.slug = slugify(`${data.name}-${Date.now().toString(36)}`);
  const product = await Product.create(data);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await Review.deleteMany({ product: product._id });
  res.json({ message: 'Product deleted' });
});
