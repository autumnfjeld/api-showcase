import { PostService } from '../../../src/services/postService.js';

describe('PostService', () => {
  let postService: PostService;

  beforeEach(() => {
    postService = new PostService();
  });

  describe('createPost', () => {
    it('should create a post with valid data', async () => {
      const postData = {
        user_id: 'user123',
        title: 'Test Post',
        content: 'This is test content',
        tags: ['test', 'example']
      };

      const result = await postService.createPost(postData);

      expect(result).toMatchObject({
        user_id: 'user123',
        title: 'Test Post',
        content: 'This is test content',
        tags: ['test', 'example']
      });
      expect(result.id).toBeDefined();
      expect(result.created_at).toBeDefined();
      expect(result.updated_at).toBeDefined();
      expect(result.engagement_count).toBe(0);
    });

    it('should throw error when title is missing', async () => {
      const postData = {
        user_id: 'user123',
        title: '',
        content: 'This is test content',
        tags: []
      };

      await expect(postService.createPost(postData)).rejects.toThrow('Title is required');
    });
  });
});
