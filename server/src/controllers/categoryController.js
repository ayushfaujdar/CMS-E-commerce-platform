import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort('name');
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const category = await Category.create({ name, slug: slugify(name), description, image });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const update = { description, image };
  if (name) {
    update.name = name;
    update.slug = slugify(name);
  }
  const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ category: req.params.id });
  if (inUse > 0) return res.status(400).json({ message: 'Category has products; reassign first' });
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
});
