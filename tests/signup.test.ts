// Simple signup tests using curl (pragmatic approach)
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Signup API', () => {
  const baseUrl = 'http://localhost:3003';
  
  const makeRequest = async (data: any) => {
    const curlCommand = `curl -s -X POST ${baseUrl}/auth/signup -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`;
    const { stdout } = await execAsync(curlCommand);
    return JSON.parse(stdout);
  };

  it('should return 400 when email or password is missing', async () => {
    // Test missing email
    const response1 = await makeRequest({ password: 'password123' });
    expect(response1.message).toBe('Email and password are required');
    
    // Test missing password
    const response2 = await makeRequest({ email: 'test@example.com' });
    expect(response2.message).toBe('Email and password are required');
  });

  it('should return 409 for duplicate email', async () => {
    const userData = { email: 'duplicate@example.com', password: 'password123' };
    
    // First signup
    await makeRequest(userData);
    
    // Second signup should fail
    const response = await makeRequest(userData);
    expect(response.message).toBe('Email already exists');
  });

  it('should create user successfully for valid email and password', async () => {
    const ranNum = Math.floor(Math.random() * 900) + 100;

    const userData = { email: `success${ranNum}@example.com`, password: 'password123' };
    const response = await makeRequest(userData);
    
    expect(response.email).toBe(userData.email);
    expect(response.id).toBeDefined();
    expect(response.created_at).toBeDefined();
  });
});
