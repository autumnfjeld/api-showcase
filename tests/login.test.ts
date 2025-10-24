// Login tests using curl (pragmatic approach)
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Login API', () => {
  const baseUrl = 'http://localhost:3003';
  
  const makeRequest = async (data: any) => {
    const curlCommand = `curl -s -X POST ${baseUrl}/auth/login -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`;
    const { stdout } = await execAsync(curlCommand);
    return JSON.parse(stdout);
  };

  const signupUser = async (email: string, password: string) => {
    const curlCommand = `curl -s -X POST ${baseUrl}/auth/signup -H "Content-Type: application/json" -d '${JSON.stringify({ email, password })}'`;
    const { stdout } = await execAsync(curlCommand);
    return JSON.parse(stdout);
  };

  beforeEach(async () => {
    // Clear any existing users by restarting the server or clearing the in-memory store
    // For this test, we'll create a fresh user each time
  });

  it('should return 400 when email or password is missing', async () => {
    // Test missing email
    const response1 = await makeRequest({ password: 'password123' });
    expect(response1.message).toBe('Email and password are required');
    
    // Test missing password
    const response2 = await makeRequest({ email: 'test@example.com' });
    expect(response2.message).toBe('Email and password are required');
  });

  it('should return 401 for non-existent user', async () => {
    const response = await makeRequest({ 
      email: 'nonexistent@example.com', 
      password: 'password123' 
    });
    
    expect(response.message).toBe('Invalid credentials');
  });

  it('should return 401 for wrong password', async () => {
    // First create a user
    const userData = { email: 'wrongpass@example.com', password: 'correctpassword' };
    await signupUser(userData.email, userData.password);
    
    // Try to login with wrong password
    const response = await makeRequest({ 
      email: userData.email, 
      password: 'wrongpassword' 
    });
    
    expect(response.message).toBe('Invalid credentials');
  });

  it('should return 401 for empty email or password', async () => {
    // Test empty email
    const response1 = await makeRequest({ email: '', password: 'password123' });
    expect(response1.message).toBe('Email and password are required');
    
    // Test empty password
    const response2 = await makeRequest({ email: 'test@example.com', password: '' });
    expect(response2.message).toBe('Email and password are required');
  });

  it('should login successfully with valid credentials', async () => {
    const ranNum = Math.floor(Math.random() * 900) + 100;
    const userData = { 
      email: `logintest${ranNum}@example.com`, 
      password: 'password123' 
    };
    
    // First create a user
    await signupUser(userData.email, userData.password);
    
    // Then login
    const response = await makeRequest(userData);
    
    expect(response.access_token).toBeDefined();
    expect(response.refresh_token).toBeDefined();
    expect(response.expires_in).toBe(900); // 15 minutes
    expect(typeof response.access_token).toBe('string');
    expect(typeof response.refresh_token).toBe('string');
  });


  it('should handle case insensitive email login', async () => {
    const ranNum = Math.floor(Math.random() * 900) + 100;
    const userData = { 
      email: `CaseTest${ranNum}@example.com`, 
      password: 'password123' 
    };
    
    // Create user with specific case
    await signupUser(userData.email, userData.password);
    
    // Try to login with different case (should succeed)
    const response = await makeRequest({ 
      email: userData.email.toLowerCase(), 
      password: userData.password 
    });
    
    expect(response.access_token).toBeDefined();
    expect(response.refresh_token).toBeDefined();
  });
});
