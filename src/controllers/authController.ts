// Auth logic - implement signup, login, refresh, me
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, User } from '../models/userModel.js';

export const signup = async (req: Request, res: Response) => {
  // TODO: Implement user signup
  // 1. Validate email and password from req.body
  // 2. Check if user already exists
  // 3. Hash password with bcrypt.hash()
  // 4. Create new user in database
  // 5. Return user info (without password)
  
  const { email, password } = req.body ?? {};
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  return res.status(501).json({ message: 'Signup not implemented yet' });
};

export const login = async (req: Request, res: Response) => {
  // TODO: Implement user login
  // 1. Validate email and password from req.body
  // 2. Find user by email
  // 3. Compare password with bcrypt.compare()
  // 4. Generate JWT access token (15min expiry)
  // 5. Generate JWT refresh token (7 days expiry)
  // 6. Return tokens
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  // TODO: Add validation of proper email and

  // TODO: Find user and verify password
  const user = findUserByEmail(email);
  if (!user) return;
  const valid = await bcrypt.compare(password, user.password_hash );
  // TODO: Generate tokens
  // TODO: Return tokens

  return res.status(501).json({ message: 'Login not implemented yet' });
};

export const refresh = (req: Request, res: Response) => {
  // TODO: Implement token refresh
  // 1. Get refresh_token from req.body
  // 2. Verify refresh token with JWT_REFRESH_SECRET
  // 3. Generate new access token
  // 4. Return new access token
  
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  // TODO: Verify refresh token
  // TODO: Generate new access token
  // TODO: Return new access token

  return res.status(501).json({ message: 'Refresh not implemented yet' });
};

export const me = (req: Request, res: Response) => {
  // TODO: Return current user info
  // This should use req.user from authMiddleware
  // Return user info without sensitive data
  
  // TODO: Check if req.user exists (from middleware)
  // TODO: Return user info

  res.status(501).json({ message: 'Me endpoint not implemented yet' });
};
