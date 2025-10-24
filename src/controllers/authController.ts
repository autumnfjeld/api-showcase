// Auth logic - implement signup, login, refresh, me
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, User } from '../models/userModel.js';
import { config } from '../config/env.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize email to lowercase for case-insensitive handling
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password with bcrypt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await createUser({
      email: normalizedEmail,
      password_hash
    });

    // Return user info without password
    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      created_at: newUser.created_at
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    
    // Validate required fields
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Normalize email to lowercase for case-insensitive handling
    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const user = findUserByEmail(normalizedEmail);
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password with stored hash
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      console.log('❌ Invalid password for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      config.jwt.secret as string,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwt.refreshSecret as string,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for user:', user.email);

    // Return tokens
    return res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900 // 15 minutes in seconds
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
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
