// Posts API tests using supertest
import request from 'supertest';
import app from '../src/app.js';

describe('Posts API', () => {
  const signupUser = async (email: string, password: string) => {
    return await request(app).post('/auth/signup').send({ email, password });
  };

  const loginUser = async (email: string, password: string) => {
    return await request(app).post('/auth/login').send({ email, password });
  };

  const getAuthToken = async (email: string, password: string) => {
    await signupUser(email, password);
    const loginResponse = await loginUser(email, password);
    return loginResponse.body.access_token;
  };

  describe('POST /api/posts - Create Post', () => {
    // Contract Tests
    describe('Contract Tests', () => {
      it('should fulfill the expected response contract', async () => {
        const token = await getAuthToken('contract@example.com', 'password123');

        const response = await request(app)
          .post('/api/posts')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Contract Test',
            content: 'Test content',
            tags: ['test'],
          });

        expect(response.status).toBe(201);

        // Just verify it has the shape of a Post object
        expect(response.body).toMatchObject({
          id: expect.any(String),
          user_id: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          tags: expect.any(Array),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          engagement_count: expect.any(Number),
        });
      });
    });
    // Behavioral Tests

    describe('Create Post Behavioral Test', () => {
      it('should allow authenticated user to create post', async () => {
        // Given: I am an authenticated user
        const token = await getAuthToken('behavior@example.com', 'password123');

        // When: I create a post
        const response = await request(app)
          .post('/api/posts')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'My Post',
            content: 'This is my content',
            tags: ['testy'],
          });

        // Then: The post should be created successfully
        expect(response.status).toBe(201);
        expect(response.body.title).toBe('My Post');
        expect(response.body.content).toBe('This is my content');
        expect(response.body.tags).toEqual(['testy']);
        expect(response.body.id).toBeDefined();
        expect(response.body.user_id).toBeDefined();
      });
    });
  });
});
