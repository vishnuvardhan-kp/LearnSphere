# LearnSphere Authentication System Documentation

## ✅ Authentication System Overview

The LearnSphere platform has **THREE separate authentication systems**:

### 1. Admin Authentication (Separate)
- **Login Endpoint**: `POST /api/admin/auth/login`
- **Access**: Admin users only
- **Signup**: ❌ No signup (admins are created via seed script)
- **Purpose**: Administrative access to manage the entire platform

### 2. Unified Authentication for Instructors & Learners
- **Login Endpoint**: `POST /api/auth/login`
- **Signup Endpoint**: `POST /api/auth/signup` (Learners only)
- **Access**: Instructors and Learners
- **Purpose**: Shared login page for both instructors and learners

## 🔐 Authentication Rules

| User Type | Login Endpoint | Can Signup? | Created By |
|-----------|---------------|-------------|------------|
| **Admin** | `/api/admin/auth/login` | ❌ No | Seed script |
| **Instructor** | `/api/auth/login` | ❌ No | Admin creates |
| **Learner** | `/api/auth/login` | ✅ Yes | Self-signup |

## 📋 API Endpoints

### Admin Login
```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Instructor/Learner Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "instructor1@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "John Instructor",
    "email": "instructor1@example.com",
    "role": "instructor",
    "avatar_url": null
  }
}
```

### Learner Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "New Student",
  "email": "newstudent@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "name": "New Student",
    "email": "newstudent@example.com",
    "role": "learner"
  }
}
```

## 🔒 Security Features

### Role-Based Access Control
1. **Admin users** can ONLY login via `/api/admin/auth/login`
2. **Instructors & Learners** can ONLY login via `/api/auth/login`
3. Cross-authentication is blocked (403 Forbidden)

### Password Requirements
- Minimum 6 characters
- Hashed using bcrypt (10 rounds)
- Stored as `password_hash` in database

### JWT Tokens
- **Admin tokens**: Expire in 1 day
- **User tokens**: Expire in 7 days
- Include: user id, email, and role

## 👥 Test Users

### Admin
- Email: `admin@example.com`
- Password: `password123`
- Role: `admin`

### Instructors
- Email: `instructor1@example.com` / Password: `password123`
- Email: `instructor2@example.com` / Password: `password123`
- Role: `instructor`

### Learners
- Email: `learner1@example.com` / Password: `password123`
- Email: `learner2@example.com` / Password: `password123`
- Email: `learner3@example.com` / Password: `password123`
- Role: `learner`

## 🎯 Frontend Integration Guide

### Admin Frontend
```typescript
// Login at: /api/admin/auth/login
const loginAdmin = async (email: string, password: string) => {
  const response = await axios.post('http://localhost:5001/api/admin/auth/login', {
    email,
    password
  });
  return response.data;
};
```

### Instructor/Learner Frontend
```typescript
// Login at: /api/auth/login
const loginUser = async (email: string, password: string) => {
  const response = await axios.post('http://localhost:5001/api/auth/login', {
    email,
    password
  });
  return response.data;
};

// Signup (Learners only) at: /api/auth/signup
const signupLearner = async (name: string, email: string, password: string) => {
  const response = await axios.post('http://localhost:5001/api/auth/signup', {
    name,
    email,
    password
  });
  return response.data;
};
```

## ✅ Verification

All authentication flows have been tested and verified:
- ✅ Admin can login via admin endpoint
- ✅ Instructor can login via unified endpoint
- ✅ Learner can login via unified endpoint
- ✅ Learner can signup via signup endpoint
- ✅ Admin is blocked from unified endpoint
- ✅ Instructor is blocked from admin endpoint
- ✅ Instructor cannot signup (only admin can create)

## 🚀 Next Steps

1. **Update Instructor Frontend**: Connect to `/api/auth/login`
2. **Update Learner Frontend**: Connect to `/api/auth/login` and `/api/auth/signup`
3. **Implement Protected Routes**: Use JWT tokens for authenticated requests
4. **Add Role-Based UI**: Show different features based on user role
