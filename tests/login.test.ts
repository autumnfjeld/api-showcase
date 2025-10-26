import request from 'supertest';
import app from '../src/app.js';

describe('Login API', () => {
  const signupUser = async (email: string, password: string) => {
    return await request(app).post('/auth/signup').send({ email, password });
  };

  it('should return 400 when email or password is missing', async () => {
    // Test missing email
    const response1 = await request(app)
      .post('/auth/login')
      .send({ password: 'password123' })
      .expect(400);
    expect(response1.body.message).toBe('Email and password are required');

    // Test missing password
    const response2 = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com' })
      .expect(400);
    expect(response2.body.message).toBe('Email and password are required');
  });

  it('should return 401 for non-existent user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 401 for wrong password', async () => {
    // First create a user
    const userData = { email: 'wrongpass@example.com', password: 'correctpassword' };
    await signupUser(userData.email, userData.password);

    // Try to login with wrong password
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: userData.email,
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 401 for empty email or password', async () => {
    // Test empty email
    const response1 = await request(app)
      .post('/auth/login')
      .send({ email: '', password: 'password123' })
      .expect(400);
    expect(response1.body.message).toBe('Email and password are required');

    // Test empty password
    const response2 = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: '' })
      .expect(400);
    expect(response2.body.message).toBe('Email and password are required');
  });

  it('should login successfully with valid credentials', async () => {
    const ranNum = Math.floor(Math.random() * 900) + 100;
    const userData = {
      email: `logintest${ranNum}@example.com`,
      password: 'password123',
    };

    // First create a user
    await signupUser(userData.email, userData.password);

    // Then login
    const response = await request(app).post('/auth/login').send(userData).expect(200);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
    expect(response.body.expires_in).toBe(900); // 15 minutes
    expect(typeof response.body.access_token).toBe('string');
    expect(typeof response.body.refresh_token).toBe('string');
  });

  it('should handle case insensitive email login', async () => {
    const ranNum = Math.floor(Math.random() * 900) + 100;
    const userData = {
      email: `CaseTest${ranNum}@example.com`,
      password: 'password123',
    };

    // Create user with specific case
    await signupUser(userData.email, userData.password);

    // Try to login with different case (should succeed)
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: userData.email.toLowerCase(),
        password: userData.password,
      })
      .expect(200);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
  });
});
