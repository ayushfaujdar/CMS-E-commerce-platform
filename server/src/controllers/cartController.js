import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function populatedCart(user) {
  await user.populate('cart.product');
  return user.cart
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product,
      size: item.size,
      quantity: item.quantity,
    }));
}

export const getCart = asyncHandler(async (req, res) => {
  res.json({ cart: await populatedCart(req.user) });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const existing = req.user.cart.find(
    (item) => item.product.toString() === productId && item.size === size
  );
  if (existing) existing.quantity += Number(quantity);
  else req.user.cart.push({ product: productId, size, quantity: Number(quantity) });

  await req.user.save();
  res.status(201).json({ cart: await populatedCart(req.user) });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, size, quantity } = req.body;
  const item = req.user.cart.find(
    (i) => i.product.toString() === productId && i.size === size
  );
  if (!item) return res.status(404).json({ message: 'Item not in cart' });
  if (Number(quantity) <= 0) {
    req.user.cart = req.user.cart.filter(
      (i) => !(i.product.toString() === productId && i.size === size)
    );
  } else {
    item.quantity = Number(quantity);
  }
  await req.user.save();
  res.json({ cart: await populatedCart(req.user) });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId, size } = req.body;
  req.user.cart = req.user.cart.filter(
    (i) => !(i.product.toString() === productId && i.size === size)
  );
  await req.user.save();
  res.json({ cart: await populatedCart(req.user) });
});

export const clearCart = asyncHandler(async (req, res) => {
  req.user.cart = [];
  await req.user.save();
  res.json({ cart: [] });
});
