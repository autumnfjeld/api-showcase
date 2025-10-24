// Entry point - sets up and runs the server
import app from './app.js';
import dotenv from 'dotenv';
import { config, validateEnv } from './config/env.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
try {
  validateEnv();
  console.log('✅ Environment variables validated');
} catch (error) {
  console.error('❌ Environment validation failed:', error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
}

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📝 Auth endpoints available at http://localhost:${config.port}/auth`);
});
