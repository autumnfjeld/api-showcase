// JWT verification middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../models/userModel.js';

// Extend Request interface to include user
declare global {
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
  // TODO: Implement JWT token verification
  // 1. Extract token from Authorization header (Bearer <token>)
  // 2. Verify token using JWT_SECRET
  // 3. Find user by ID from token payload
  // 4. Attach user info to req.user
  // 5. Call next() or return 401 error
  
  // Get the Authorization header from the request & extract token part after Bearer
  // Example Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  // TODO: Implement JWT verification logic here
  // Hint: Use jwt.verify() with process.env.JWT_SECRET
  // Hint: Use findUserById() to get user data
  // Hint: Set req.user with user info
  
  return next();
};
