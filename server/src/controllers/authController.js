import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = new User({ name, email });
  await user.setPassword(password);
  await user.save();

  const token = signToken(user._id);
  return res.status(201).json({ token, user: user.toSafeJSON() });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.validatePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user._id);
  return res.json({ token, user: user.toSafeJSON() });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, addresses } = req.body;
  if (name) req.user.name = name;
  if (Array.isArray(addresses)) req.user.addresses = addresses;
  await req.user.save();
  res.json({ user: req.user.toSafeJSON ? req.user.toSafeJSON() : req.user });
});
