# 🧪 Complete Postman Testing Guide with Dummy Data

## 🌐 Base URL
```
http://localhost:5000/api/v1
```

---

## 📋 Environment Variables (Postman)

Create these variables in Postman:
- `base_url`: `http://localhost:5000/api/v1`
- `token`: (will be set automatically after login/register)

---

## 👤 USER ENDPOINTS

### 1️⃣ REGISTER USER

**Method:** POST  
**URL:** `{{base_url}}/users/register`  
**Auth:** None

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Alternative Test Data:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah.j@example.com",
  "password": "SarahPass123"
}
```

```json
{
  "name": "Mike Anderson",
  "email": "mike.a@example.com",
  "password": "MikePass123"
}
```

**✅ Success Response (201):**
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ Save the token in Postman variable:** `{{token}}`

---

### 2️⃣ LOGIN USER

**Method:** POST  
**URL:** `{{base_url}}/users/login`  
**Auth:** None

**Body (JSON):**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**✅ Success Response (200):**
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3️⃣ GET USER PROFILE

**Method:** GET  
**URL:** `{{base_url}}/users/profile`  
**Auth:** Bearer Token

**Headers:**
```
Authorization: Bearer {{token}}
```

**✅ Success Response (200):**
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

---

### 4️⃣ UPDATE USER PROFILE

**Method:** PUT  
**URL:** `{{base_url}}/users/profile`  
**Auth:** Bearer Token

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Alternative Test Data:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "64f7a8b9c1d2e3f4a5b6c7d8",
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "role": "user"
    }
  }
}
```

---

## 📦 CATEGORY ENDPOINTS

### ⚠️ IMPORTANT: Create Admin User First

To test category endpoints, you need an admin user. After registering a regular user, manually set the role to "admin" in MongoDB:

```javascript
// In MongoDB
db.users.updateOne(
  { email: "john.doe@example.com" },
  { $set: { role: "admin" } }
)
```

Or create a test admin user via MongoDB:
```javascript
db.users.insertOne({
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2b$10$encrypted_password_hash",
  "role": "admin"
})
```

---

### 5️⃣ GET ALL CATEGORIES

**Method:** GET  
**URL:** `{{base_url}}/categories`  
**Auth:** None

**Query Params (Optional):**
- `status`: `Active` or `Inactive`

**Example URLs:**
```
{{base_url}}/categories
{{base_url}}/categories?status=Active
{{base_url}}/categories?status=Inactive
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": {
    "categories": [
      {
        "_id": "64f7a8b9c1d2e3f4a5b6c7d9",
        "name": "Sedans",
        "description": "Comfortable 4-door vehicles perfect for families",
        "photo": "/uploads/categories/sedans-1693506720123-123456789.jpg",
        "status": "Active",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 6️⃣ GET CATEGORY BY ID

**Method:** GET  
**URL:** `{{base_url}}/categories/:id`  
**Auth:** None

**Example URL:**
```
{{base_url}}/categories/64f7a8b9c1d2e3f4a5b6c7d9
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "64f7a8b9c1d2e3f4a5b6c7d9",
      "name": "Sedans",
      "description": "Comfortable 4-door vehicles perfect for families",
      "photo": "/uploads/categories/sedans-1693506720123-123456789.jpg",
      "status": "Active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 7️⃣ CREATE CATEGORY

**Method:** POST  
**URL:** `{{base_url}}/categories`  
**Auth:** Bearer Token (Admin)  
**Content-Type:** `multipart/form-data`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (form-data):**
| Key | Value | Type |
|-----|-------|------|
| name | `Sedans` | Text |
| description | `Comfortable 4-door vehicles perfect for families and daily commuting` | Text |
| status | `Active` | Text |
| photo | `[Select File]` | File |

**🖼️ Upload a JPG, PNG, or other image file for "photo"**

**Alternative Test Data:**

**Dataset 1:**
| Key | Value |
|-----|-------|
| name | `SUVs` |
| description | `Larger vehicles ideal for adventure, cargo, and off-road driving` |
| status | `Active` |

**Dataset 2:**
| Key | Value |
|-----|-------|
| name | `Luxury Cars` |
| description | `High-end vehicles with premium features and exceptional comfort` |
| status | `Active` |

**Dataset 3:**
| Key | Value |
|-----|-------|
| name | `Sports Cars` |
| description | `High-performance vehicles designed for speed and exhilaration` |
| status | `Active` |

**Dataset 4:**
| Key | Value |
|-----|-------|
| name | `Electric Vehicles` |
| description | `Eco-friendly vehicles powered by electricity` |
| status | `Active` |

**✅ Success Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "_id": "64f7a8b9c1d2e3f4a5b6c7d9",
      "name": "Sedans",
      "description": "Comfortable 4-door vehicles perfect for families",
      "photo": "/uploads/categories/sedans-1693506720123-123456789.jpg",
      "status": "Active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 8️⃣ UPDATE CATEGORY

**Method:** PUT  
**URL:** `{{base_url}}/categories/:id`  
**Auth:** Bearer Token (Admin)  
**Content-Type:** `multipart/form-data`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Example URL:**
```
{{base_url}}/categories/64f7a8b9c1d2e3f4a5b6c7d9
```

**Body (form-data):**
| Key | Value | Type |
|-----|-------|------|
| name | `Premium Sedans` | Text |
| description | `Updated description for premium sedans` | Text |
| status | `Active` | Text |
| photo | `[Select File]` | File (optional) |

**Alternative Test Data:**
| Key | Value |
|-----|-------|
| name | `Sedan Cars` |
| description | `Family-friendly 4-door vehicles` |

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {
      "_id": "64f7a8b9c1d2e3f4a5b6c7d9",
      "name": "Premium Sedans",
      "description": "Updated description for premium sedans",
      "photo": "/uploads/categories/premium-sedans-1693506800123-987654321.jpg",
      "status": "Active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

---

### 9️⃣ DELETE CATEGORY

**Method:** DELETE  
**URL:** `{{base_url}}/categories/:id`  
**Auth:** Bearer Token (Admin)

**Headers:**
```
Authorization: Bearer {{token}}
```

**Example URL:**
```
{{base_url}}/categories/64f7a8b9c1d2e3f4a5b6c7d9
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### 🔟 TOGGLE CATEGORY STATUS

**Method:** PATCH  
**URL:** `{{base_url}}/categories/:id/status`  
**Auth:** Bearer Token (Admin)

**Headers:**
```
Authorization: Bearer {{token}}
```

**Example URL:**
```
{{base_url}}/categories/64f7a8b9c1d2e3f4a5b6c7d9/status
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Category status changed to Inactive",
  "data": {
    "category": {
      "_id": "64f7a8b9c1d2e3f4a5b6c7d9",
      "name": "Sedans",
      "description": "Comfortable 4-door vehicles perfect for families",
      "photo": "/uploads/categories/sedans-1693506720123-123456789.jpg",
      "status": "Inactive",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

---

## 🔄 COMPLETE TESTING WORKFLOW

### Step-by-Step Testing Order:

#### 1. Health Check (Optional)
```
GET {{base_url}}/health
```

#### 2. Register User
```
POST {{base_url}}/users/register
Body: { "name": "Test User", "email": "test@example.com", "password": "Test123!" }
→ Save token to {{token}}
```

#### 3. Login User
```
POST {{base_url}}/users/login
Body: { "email": "test@example.com", "password": "Test123!" }
→ Confirm token matches
```

#### 4. Get Profile
```
GET {{base_url}}/users/profile
Headers: Authorization: Bearer {{token}}
```

#### 5. Update Profile
```
PUT {{base_url}}/users/profile
Headers: Authorization: Bearer {{token}}
Body: { "name": "Updated Name", "email": "updated@example.com" }
```

#### 6. Get All Categories
```
GET {{base_url}}/categories
```

#### 7. Create Category (Need Admin Token)
```
⚠️ First set user role to "admin" in MongoDB!
POST {{base_url}}/categories
Headers: Authorization: Bearer {{token}}
Body (form-data): name, description, status, photo
```

#### 8. Get Category by ID
```
GET {{base_url}}/categories/{{category_id}}
```

#### 9. Update Category
```
PUT {{base_url}}/categories/{{category_id}}
Headers: Authorization: Bearer {{token}}
Body (form-data): name, description, status, photo (optional)
```

#### 10. Toggle Status
```
PATCH {{base_url}}/categories/{{category_id}}/status
Headers: Authorization: Bearer {{token}}
```

#### 11. Delete Category
```
DELETE {{base_url}}/categories/{{category_id}}
Headers: Authorization: Bearer {{token}}
```

---

## 📝 ERRORS TO TEST

### User Endpoints Errors

**Test Registration Errors:**
1. Missing name: `{ "email": "test@example.com", "password": "Test123!" }`
2. Missing email: `{ "name": "Test", "password": "Test123!" }`
3. Missing password: `{ "name": "Test", "email": "test@example.com" }`
4. Duplicate email: `{ "name": "Another User", "email": "test@example.com", "password": "Test123!" }`

**Test Login Errors:**
1. Wrong email: `{ "email": "wrong@example.com", "password": "Test123!" }`
2. Wrong password: `{ "email": "test@example.com", "password": "WrongPass!" }`
3. Missing fields

**Test Auth Errors:**
1. No token: Omit Authorization header
2. Invalid token: `Authorization: Bearer invalid_token_here`
3. Expired token: Use very old token

---

### Category Endpoints Errors

**Test Creation Errors:**
1. Missing name: `{ "description": "Test" }`
2. Missing description: `{ "name": "Test" }`
3. Duplicate name: Use existing category name
4. Invalid file type: Upload PDF or DOC file
5. File too large: Upload >5MB file
6. No auth: Omit Authorization header
7. Non-admin: Use regular user token

**Test Update Errors:**
1. Category not found: Use invalid ID
2. Duplicate name: Use another category's name
3. Invalid file type

**Test Delete Errors:**
1. Category not found: Use invalid ID
2. No auth
3. Non-admin

---

## 🎯 QUICK COPY-PASTE JSON

### User Registration
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "JohnPass123"
}
```

### User Login
```json
{
  "email": "john@example.com",
  "password": "JohnPass123"
}
```

### Update User Profile
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

---

## 📦 MULTIPLE CATEGORIES TO CREATE

### Category 1
```javascript
name: "Sedans"
description: "Comfortable 4-door vehicles perfect for families and daily commuting"
status: "Active"
photo: [Upload sedan image]
```

### Category 2
```javascript
name: "SUVs"
description: "Larger vehicles ideal for adventure, cargo, and off-road driving"
status: "Active"
photo: [Upload SUV image]
```

### Category 3
```javascript
name: "Luxury Cars"
description: "High-end vehicles with premium features and exceptional comfort"
status: "Active"
photo: [Upload luxury car image]
```

### Category 4
```javascript
name: "Sports Cars"
description: "High-performance vehicles designed for speed and exhilaration"
status: "Active"
photo: [Upload sports car image]
```

### Category 5
```javascript
name: "Electric Vehicles"
description: "Eco-friendly vehicles powered by electricity"
status: "Active"
photo: [Upload EV image]
```

### Category 6
```javascript
name: "Compact Cars"
description: "Small, fuel-efficient vehicles for city driving"
status: "Active"
photo: [Upload compact car image]
```

### Category 7
```javascript
name: "Convertibles"
description: "Open-top vehicles for recreational driving"
status: "Active"
photo: [Upload convertible image]
```

### Category 8
```javascript
name: "Vans"
description: "Large passenger vehicles for groups and cargo"
status: "Active"
photo: [Upload van image]
```

---

## 🔐 AUTHENTICATION HEADERS

### For Protected Routes:
```
Authorization: Bearer {{token}}
```

### For JSON Content Type:
```
Content-Type: application/json
```

### For Form Data (Categories):
```
Content-Type: multipart/form-data
```

---

## ⚡ AUTOMATION TIPS

### Postman Pre-request Script (Auto-save token)

**For Login/Register Requests:**
```javascript
// Add to Tests tab
if (pm.response.code === 200 || pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
    console.log("Token saved:", jsonData.data.token);
}
```

### Postman Collection Runner

Create a test collection with:
1. Register → Login → Get Profile → Update Profile
2. Get All Categories → Create Category → Update Category → Delete Category

---

## 🚀 START TESTING NOW!

1. ✅ Import Postman collection or create manually
2. ✅ Set environment variables (base_url, token)
3. ✅ Start server: `npm run dev`
4. ✅ Test user endpoints
5. ✅ Create admin user in MongoDB
6. ✅ Test category endpoints
7. ✅ Upload images for categories
8. ✅ Test all error scenarios

**Happy Testing! 🎉**

