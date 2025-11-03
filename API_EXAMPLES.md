# Quick API Examples - Copy & Paste Ready

## 🌐 Base URL
```
http://localhost:5000/api/v1
```

---

## ✅ Health Check

**GET** `http://localhost:5000/api/v1/health`

```
✅ Expected: { "success": true, "message": "Server is running" }
```

---

## 👤 User Endpoints

### 1️⃣ Register User

**POST** `http://localhost:5000/api/v1/users/register`

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**✅ Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**❌ Error - Duplicate:**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2️⃣ Login User

**POST** `http://localhost:5000/api/v1/users/login`

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**✅ Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**❌ Error - Wrong Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3️⃣ Get Profile

**GET** `http://localhost:5000/api/v1/users/profile`

**Header:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**✅ Success Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**❌ Error - No Token:**
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

---

### 4️⃣ Update Profile

**PUT** `http://localhost:5000/api/v1/users/profile`

**Header:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**✅ Success Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "role": "user"
    }
  }
}
```

**❌ Error - Email Taken:**
```json
{
  "success": false,
  "message": "Email already in use"
}
```

---

## 🎯 Quick Test Data Sets

### Dataset 1: Regular User
```json
{
  "name": "Sarah Johnson",
  "email": "sarah.j@test.com",
  "password": "sarah123456"
}
```

### Dataset 2: Another User
```json
{
  "name": "Mike Anderson",
  "email": "mike.a@test.com",
  "password": "mike123456"
}
```

### Dataset 3: Admin User (set role manually in DB)
```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123456"
}
```

---

## 🔑 Testing Workflow

1. **Start Server**
   - Run `npm run dev` in backend-car-service folder

2. **Register a User**
   - POST to `/users/register` with name, email, password
   - Copy the token from response

3. **Login**
   - POST to `/users/login` with email, password
   - Verify you get the same token

4. **Get Profile**
   - GET `/users/profile` with Authorization header
   - Should return your user data

5. **Update Profile**
   - PUT `/users/profile` with Authorization header + new data
   - Verify changes reflected in response

---

## ⚠️ Common Errors

| Error | HTTP Code | Meaning |
|-------|-----------|---------|
| "Name is required" | 400 | Missing name field |
| "Email is required" | 400 | Missing email field |
| "Password is required" | 400 | Missing password field |
| "User already exists" | 400 | Email already registered |
| "Invalid email or password" | 401 | Wrong credentials |
| "Not authorized, no token" | 401 | Missing auth header |
| "Not authorized, token failed" | 401 | Invalid/expired token |
| "Email already in use" | 400 | Duplicate email on update |

---

## 📝 Postman Collection Setup

### Environment Variables
- `base_url`: `http://localhost:5000/api/v1`
- `token`: (set after login/register)

### Headers for Protected Routes
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

---

## 🚀 Quick Test Script

```javascript
// Test all endpoints in sequence
1. Health Check → Should return success
2. Register → Get token
3. Login → Get token (verify it matches)
4. Get Profile → Verify user data
5. Update Profile → Verify changes
6. Get Profile Again → Confirm updates
```

---

## 💡 Pro Tips

- Store the token after register/login for protected routes
- Token expires in 7 days (set in .env JWT_EXPIRE)
- Passwords must be at least 6 characters
- Email must be unique
- All timestamps are added automatically
- Password is never returned in API responses

