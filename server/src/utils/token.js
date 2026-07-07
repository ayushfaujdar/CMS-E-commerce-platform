import jwt from 'jsonwebtoken';

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretkey123', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
