# API Documentation with Dummy Data

Base URL: `http://localhost:5000/api/v1`

---

## Health Check

### GET /health

**Description:** Check if server is running

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## User Endpoints

### 1. Register User

**POST** `/users/register`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f7a8b9c1d2e3f4a5b6c7d8",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGY3YThiOWMxZDJlM2Y0YTViNmM3ZDgiLCJpYXQiOjE2OTM1MDY3MjAsImV4cCI6MTY5NDExMTUyMH0.abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx"
  }
}
```

**Error Response (400 Bad Request) - User exists:**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

**Error Response (400 Bad Request) - Validation error:**
```json
{
  "success": false,
  "message": "Name is required, Email is required, Password is required"
}
```

---

### 2. Login User

**POST** `/users/login`

**Description:** Login with email and password

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f7a8b9c1d2e3f4a5b6c7d8",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGY3YThiOWMxZDJlM2Y0YTViNmM3ZDgiLCJpYXQiOjE2OTM1MDY3MjAsImV4cCI6MTY5NDExMTUyMH0.abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get User Profile

**GET** `/users/profile`

**Description:** Get current user's profile

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGY3YThiOWMxZDJlM2Y0YTViNmM3ZDgiLCJpYXQiOjE2OTM1MDY3MjAsImV4cCI6MTY5NDExMTUyMH0.abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f7a8b9c1d2e3f4a5b6c7d8",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    }
  }
}
```

**Error Response (401 Unauthorized) - No token:**
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

**Error Response (401 Unauthorized) - Invalid token:**
```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

---

### 4. Update User Profile

**PUT** `/users/profile`

**Description:** Update user's name or email

**Authentication:** Required (Bearer Token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGY3YThiOWMxZDJlM2Y0YTViNmM3ZDgiLCJpYXQiOjE2OTM1MDY3MjAsImV4cCI6MTY5NDExMTUyMH0.abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "64f7a8b9c1d2e3f4a5b6c7d8",
      "name": "John Smith",
      "email": "john.smith@example.com",
      "role": "user"
    }
  }
}
```

**Error Response (400 Bad Request) - Email already in use:**
```json
{
  "success": false,
  "message": "Email already in use"
}
```

---

## Example cURL Commands

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "password": "MySecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "MySecurePass123!"
  }'
```

### Get Profile (Replace TOKEN with actual token)
```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer TOKEN"
```

### Update Profile (Replace TOKEN with actual token)
```bash
curl -X PUT http://localhost:5000/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com"
  }'
```

### Health Check
```bash
curl -X GET http://localhost:5000/api/v1/health
```

---

## Example User Data Sets

### Regular User
```json
{
  "name": "Alice Johnson",
  "email": "alice.j@example.com",
  "password": "Alice123456"
}
```

### Admin User
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPass123"
}
```

### Another Regular User
```json
{
  "name": "Bob Williams",
  "email": "bob.w@example.com",
  "password": "BobSecure789"
}
```

---

## Testing with Different Scenarios

### 1. Success Flow
- Register → Get token → Use token for profile access → Update profile

### 2. Validation Errors
- Empty fields, invalid email format, password too short (< 6 characters)

### 3. Authentication Errors
- Missing token, invalid token, expired token

### 4. Duplicate Data
- Register with existing email

---

## Notes

- All timestamps are automatically added by Mongoose (createdAt, updatedAt)
- Password minimum length: 6 characters
- Passwords are hashed using bcrypt before saving
- JWT tokens expire in 7 days (configurable via .env)
- All passwords in examples are for testing only
- Tokens shown are examples and won't work in actual API calls

