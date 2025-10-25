# Express Auth API Showcase

A comprehensive Node.js/Express API demonstrating modern authentication patterns, search capabilities, and real-time features.

## 🎥 Features

- **JWT Authentication** with access and refresh tokens
- **Advanced search and filtering** with query parameters
- **Real-time data streaming** via Server-Sent Events
- **Batch processing** for bulk operations
- **Request logging** and structured error handling
- **TypeScript** for type safety and better development experience

## 🔧 Tech Stack

- **Node.js** + **Express** + **TypeScript**
- **JWT** for token-based authentication
- **bcrypt** for password hashing
- **Morgan** for HTTP request logging
- **tsx** for development with hot reload

## 📡 API Endpoints

### Authentication
```
POST /auth/signup     - Register a new user
POST /auth/login      - Authenticate and get tokens
POST /auth/refresh    - Get new access token using refresh token
GET  /auth/me         - Get current user info (protected)
```

### Health Check
```
GET  /health          - Server health status
```

## 🧪 Testing

All endpoints can be tested via **Postman** or any HTTP client. The API includes:

- **Request/response logging** - See all HTTP requests in the terminal
- **Structured error responses** - Clear error messages with appropriate status codes
- **Token-based authentication** - Bearer token in Authorization header

### Example Request Flow

1. **Sign up a new user:**
   ```http
   POST /auth/signup
   Content-Type: application/json
   
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Login to get tokens:**
   ```http
   POST /auth/login
   Content-Type: application/json
   
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Use access token for protected routes:**
   ```http
   GET /auth/me
   Authorization: Bearer <access_token>
   ```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd express-auth-api-showcase
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   # Create .env file with:
   PORT=3003
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Test the API:**
   - Server runs on `http://localhost:3003`
   - Health check: `GET http://localhost:3003/health`
   - Auth endpoints: `http://localhost:3003/auth/*`

## 🔐 Security Features

- **Password hashing** with bcrypt (10 salt rounds)
- **JWT tokens** with configurable expiration
- **Separate secrets** for access and refresh tokens
- **Input validation** and sanitization
- **Structured error responses** (no sensitive data leakage)

## 📊 Request Logging

The API includes Morgan middleware for request logging. You'll see output like:
```
POST /auth/login 200 89.123 ms - 245
GET /auth/me 200 3.456 ms - 56
```

## 🏗️ Project Structure

```
src/
├── controllers/     # Route handlers
├── middleware/      # Authentication middleware
├── models/          # Data models and storage
├── routes/          # Route definitions
├── app.ts           # Express app configuration
└── main.ts          # Server entry point
```

## 🎯 Interview Demo

This API demonstrates:

- **RESTful design principles**
- **JWT authentication flow**
- **Error handling patterns**
- **Request/response logging**
- **TypeScript best practices**
- **Security considerations**

For showcasing API design skills and prep for technical interviews.

## 🚀 Planned Features (Learning Roadmap)

This project demonstrates advanced API patterns through a **Social Media Analytics Dashboard**:

### **Phase 1: Posts API** 
- **Advanced search & filtering** with query parameters
- **CRUD operations** for social media posts
- **Pagination, sorting, and field selection**

### **Phase 2: Real-time Analytics**
- **Server-Sent Events (SSE)** for live data streaming
- **Live engagement metrics** (likes, comments, shares)
- **Real-time dashboard updates**

### **Phase 3: Batch Processing**
- **Bulk operations** for engagement data
- **Batch analytics processing**
- **Async job handling**

### **Phase 4: Advanced Search**
- **Full-text search** capabilities
- **Faceted search** with multiple filters
- **Search analytics and insights**

Each phase builds on the previous authentication system, demonstrating modern API design patterns step-by-step for learning and interview preparation.

## 📝 License

MIT License - feel free to use this code for learning and interview preparation.
