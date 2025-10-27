import request from 'supertest';
import app from '../../src/app.js';

describe('Signup API', () => {
  it('should return 400 when email or password is missing', async () => {
    // Test missing email
    const response1 = await request(app)
      .post('/auth/signup')
      .send({ password: 'password123' })
      .expect(400);
    expect(response1.body.message).toBe('Email and password are required');

    // Test missing password
    const response2 = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@example.com' })
      .expect(400);
    expect(response2.body.message).toBe('Email and password are required');
  });

  it('should return 409 for duplicate email', async () => {
    const userData = { email: 'duplicate@example.com', password: 'password123' };

    // First signup
    await request(app).post('/auth/signup').send(userData).expect(201);

    // Second signup should fail
    const response = await request(app).post('/auth/signup').send(userData).expect(409);
    expect(response.body.message).toBe('Email already exists');
  });

  it('should create user successfully for valid email and password', async () => {
    const ranNum = Math.floor(Math.random() * 900) + 100;
    const userData = { email: `success${ranNum}@example.com`, password: 'password123' };

    const response = await request(app).post('/auth/signup').send(userData).expect(201);

    expect(response.body.email).toBe(userData.email);
    expect(response.body.id).toBeDefined();
    expect(response.body.created_at).toBeDefined();
  });
});
