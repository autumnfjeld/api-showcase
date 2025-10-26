import request from 'supertest';
import app from '../src/app.js';

describe('Refresh API', () => {
  const signupUser = async (email: string, password: string) => {
    return await request(app).post('/auth/signup').send({ email, password });
  };

  const loginUser = async (email: string, password: string) => {
    return await request(app).post('/auth/login').send({ email, password });
  };

  it('should return 400 when refresh token is missing', async () => {
    const response = await request(app).post('/auth/refresh').send({}).expect(400);
    expect(response.body.message).toBe('Refresh token is required');
  });

  it('should return 400 when refresh token is empty', async () => {
    const response = await request(app)
      .post('/auth/refresh')
      .send({ refresh_token: '' })
      .expect(400);
    expect(response.body.message).toBe('Refresh token is required');
  });

  it('should return 401 for invalid refresh token', async () => {
    const response = await request(app)
      .post('/auth/refresh')
      .send({ refresh_token: 'invalid_token' })
      .expect(401);
    expect(response.body.message).toBe('Invalid refresh token');
  });

  it('should refresh token successfully with valid refresh token', async () => {
    const ranNum = Math.floor(Math.random() * 900) + 100;
    const userData = {
      email: `refreshtest${ranNum}@example.com`,
      password: 'password123',
    };

    // First create a user
    await signupUser(userData.email, userData.password);

    // Then login to get tokens
    const loginResponse = await loginUser(userData.email, userData.password);

    // Use refresh token to get new access token
    const response = await request(app)
      .post('/auth/refresh')
      .send({ refresh_token: loginResponse.body.refresh_token })
      .expect(200);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.expires_in).toBe(900); // 15 minutes
    expect(typeof response.body.access_token).toBe('string');
    expect(response.body.access_token).not.toBe(loginResponse.body.access_token); // Should be different from original
  });
});
