// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

// Environment configuration
export const config = {
  port: process.env.PORT || 3003,
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
  }
};

// Validate required environment variables
export const validateEnv = () => {
  const requiredVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
