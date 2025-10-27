// Posts controller - CRUD operations and search functionality
import { Request, Response } from 'express';
import { postService } from '../services/postService.js';

// Extend Request type to include user from auth middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// GET /api/posts - List posts with search and filtering
export const getPosts = (req: Request, res: Response) => {
  try {
    // TODO: Extract query parameters
    // TODO: Apply filters
    // TODO: Return posts list

    res.status(501).json({ message: 'Get posts not implemented yet' });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/posts/:id - Get specific post
export const getPost = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Find post by ID
    // TODO: Return 404 if not found
    // TODO: Return post data

    res.status(501).json({ message: 'Get post not implemented yet' });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/posts - Create new post
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user?.id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    // Validate required fields
    if (!title?.trim()) {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    if (!content?.trim()) {
      return res.status(400).json({ 
        message: 'Content is required' 
      });
    }

    // Create post using service
    const newPost = await postService.createPost({
      user_id: userId,
      title: title,
      content: content,
      tags: tags || []
    });

    // Return created post
    return res.status(201).json(newPost);

  } catch (error) {
    console.error('Create post error:', error);
    
    // Handle validation errors from service
    if (error instanceof Error && error.message.includes('required')) {
      return res.status(400).json({ 
        message: error.message 
      });
    }

    // Handle other errors
    return res.status(500).json({ 
      message: 'Failed to create post' 
    });
  }
};

// PUT /api/posts/:id - Update post
export const updatePost = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.user?.id; // From auth middleware

    // TODO: Find post by ID
    // TODO: Check if user owns the post
    // TODO: Update post fields
    // TODO: Return updated post

    res.status(501).json({ message: 'Update post not implemented yet' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/posts/:id - Delete post
export const deletePost = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // From auth middleware

    // TODO: Find post by ID
    // TODO: Check if user owns the post
    // TODO: Delete post
    // TODO: Return success message

    res.status(501).json({ message: 'Delete post not implemented yet' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
