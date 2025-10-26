// Auth logic - implement signup, login, refresh, me
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';
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
      password_hash,
    });

    // Return user info without password
    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      created_at: newUser.created_at,
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
    const accessToken = jwt.sign({ id: user.id, email: user.email }, config.jwt.secret as string, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ id: user.id }, config.jwt.refreshSecret as string, {
      expiresIn: '7d',
    });

    console.log('✅ Login successful for user:', user.email);

    // Return tokens
    return res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900, // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const refresh = (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify the refresh token
    const payload = jwt.verify(refresh_token, config.jwt.refreshSecret as string) as { id: string };

    // Generate new access token using the user ID from the refresh token
    const newAccessToken = jwt.sign({ id: payload.id }, config.jwt.secret as string, {
      expiresIn: '15m',
    });

    console.log('✅ Token refreshed successfully for user ID:', payload.id);

    // Return new access token
    return res.status(200).json({
      access_token: newAccessToken,
      expires_in: 900, // 15 minutes in seconds
    });
  } catch (error) {
    console.error('Refresh token error:', error);

    // Handle JWT errors (expired, invalid, etc.)
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const me = (req: Request, res: Response) => {
  try {
    // Check if req.user exists (from middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Return user info without sensitive data
    return res.status(200).json({
      id: req.user.id,
      email: req.user.email,
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
