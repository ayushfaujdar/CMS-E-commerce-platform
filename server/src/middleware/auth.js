import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User no longer exists' });

    req.user = user;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
}

export function admin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
}
