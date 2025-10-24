// User type and in-memory data store
export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// In-memory user store (replace with database in production)
export const users: User[] = [];

// Helper functions for user operations
export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const createUser = async (user: Omit<User, 'id' | 'created_at'>): Promise<User> => {
  const mockDelay = Math.random() * 10;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      resolve(newUser);
    }, mockDelay);
  });
};
