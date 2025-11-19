import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing auth' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if ((req.user as any).role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};
