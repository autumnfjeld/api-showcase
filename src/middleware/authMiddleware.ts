// JWT verification middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../models/userModel.js';
import { config } from '../config/env.js';

// Extend Request interface to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token using JWT_SECRET
    const payload = jwt.verify(token, config.jwt.secret as string) as { id: string };

    // Find user by ID from token payload
    const user = findUserById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    // Attach user info to req.user
    req.user = {
      id: user.id,
      email: user.email,
    };

    // Call next() to continue to the route handler
    return next();
  } catch (error) {
    console.error('Token verification error:', error);

    // Handle JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};
