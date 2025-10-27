// Post service - Business logic layer
import { Post, savePost } from '../models/postModel.js';

export class PostService {
  /**
   * Create a new post
   * @param postData - Post data without auto-generated fields
   * @param postData.user_id - ID of the user creating the post
   * @param postData.title - Title of the post
   * @param postData.content - Content of the post
   * @param postData.tags - Array of tags for the post
   * @returns Promise<Post> - Created post with all fields
   */
  async createPost(postData: {
    user_id: string;
    title: string;
    content: string;
    tags: string[];
  }): Promise<Post> {
    // Validate required fields
    if (!postData.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!postData.content?.trim()) {
      throw new Error('Content is required');
    }
    if (!postData.user_id) {
      throw new Error('User ID is required');
    }

    // Clean and validate data
    const cleanPostData = {
      user_id: postData.user_id,
      title: postData.title.trim(),
      content: postData.content.trim(),
      tags: postData.tags || []
    };

    // TODO: Add production validation
    // - Title length limits (1-200 chars)
    // - Content length limits (1-10000 chars) 
    // - Tag validation (max 10 tags, 50 chars each)
    // - XSS prevention (strip HTML tags)
    // - Profanity filtering
    // - Spam detection patterns
    // - Lib helpers:  Joi, prisma

    // Save post using model
    return await savePost(cleanPostData);
  }
}

// Export service instance
export const postService = new PostService();
