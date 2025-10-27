// Post type and in-memory data store
export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  engagement_count: number;
}

// In-memory posts store (replace with database in production)
export const posts: Post[] = [];

// Helper functions for post operations
export const findPostById = (id: string): Post | undefined => {
  return posts.find(post => post.id === id);
};

export const findPostsByUserId = (userId: string): Post[] => {
  return posts.filter(post => post.user_id === userId);
};

export const savePost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'engagement_count'>): Promise<Post> => {
  const mockDelay = Math.random() * 10;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const newPost: Post = {
        ...post,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        engagement_count: 0 
      };
      
      posts.push(newPost);
      resolve(newPost);
    }, mockDelay);
  });
};



export interface SearchFilters {
  search?: string;
  tags?: string[];
  user_id?: string;
  date_from?: string;
  date_to?: string;
  sortField?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
