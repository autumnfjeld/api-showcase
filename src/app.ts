// Defines Express app, loads routes and middleware
import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import postsRoutes from './routes/postsRoutes.js';

const app = express();

// Middleware
app.use(morgan('dev')); // Log all HTTP requests
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
