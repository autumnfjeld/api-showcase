// Posts route definitions - connects routes to controller
import express from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/postsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All posts routes require authentication
router.use(authenticateToken);

// Posts routes
router.get('/', getPosts);                    // GET /api/posts - List posts with search/filtering
router.get('/:id', getPost);                 // GET /api/posts/:id - Get specific post
router.post('/', createPost);               // POST /api/posts - Create new post
router.put('/:id', updatePost);              // PUT /api/posts/:id - Update post
router.delete('/:id', deletePost);            // DELETE /api/posts/:id - Delete post

export default router;

