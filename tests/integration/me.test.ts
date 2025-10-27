// Me endpoint tests using supertest
import request from 'supertest';
import app from '../../src/app.js';

describe('Me API', () => {
  const signupUser = async (email: string, password: string) => {
    return await request(app).post('/auth/signup').send({ email, password });
  };

  const loginUser = async (email: string, password: string) => {
    return await request(app).post('/auth/login').send({ email, password });
  };

  it('should return 401 when no authorization header is provided', async () => {
    const response = await request(app).get('/auth/me').expect(401);

    expect(response.body.message).toBe('Access token required');
  });

  it('should return 401 when authorization header is malformed or token is invalid', async () => {
    // Test malformed header
    const response1 = await request(app)
      .get('/auth/me')
      .set('Authorization', 'InvalidFormat')
      .expect(401);
    expect(response1.body.message).toBe('Access token required');

    // Test invalid token
    const response2 = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401);
    expect(response2.body.message).toBe('Invalid token');
  });

  it('should work with valid access token and refreshed access token', async () => {
    const ranNum = Math.floor(Math.random() * 900) + 100;
    const userData = {
      email: `refreshtest${ranNum}@example.com`,
      password: 'password123',
    };

    // Create user and login
    await signupUser(userData.email, userData.password);
    const loginResponse = await loginUser(userData.email, userData.password);

    // Use refresh token to get new access token
    const refreshResponse = await request(app)
      .post('/auth/refresh')
      .send({ refresh_token: loginResponse.body.refresh_token })
      .expect(200);

    // Use the new access token to get user info
    const response = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${refreshResponse.body.access_token}`)
      .expect(200);

    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe(userData.email);
    expect(response.body.password_hash).toBeUndefined(); // Should not return sensitive data
  });
});
