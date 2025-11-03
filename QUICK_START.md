# ⚡ Quick Start Guide for Testing

## 🚀 Start Server

```bash
cd backend-car-service
npm run dev
```

Server will run on: `http://localhost:5000`

---

## 📮 Postman Setup

### 1. Import Collection
- Open Postman
- Click **Import**
- Select `Postman_Collection.json`
- Collection imported! ✅

### 2. Set Environment Variables

**Click "Environment" → Create New Environment:**

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5000/api/v1` | Same |
| `token` | `` (empty) | Auto-set on login |
| `user_id` | `` (empty) | Auto-set |
| `category_id` | `` (empty) | Auto-set |

**Save and select this environment!**

---

## 🧪 Testing Order

### Step 1: Health Check ✅
```
GET /health
→ Should return: { "success": true, "message": "Server is running" }
```

### Step 2: Register User 👤
```
POST /users/register
Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

✅ Success: 201 Created
✅ Token auto-saved to {{token}}
```

### Step 3: Login User 🔐
```
POST /users/login
Body:
{
  "email": "john@example.com",
  "password": "password123"
}

✅ Success: 200 OK
✅ Token auto-saved
```

### Step 4: Get Profile 📋
```
GET /users/profile
Header: Authorization: Bearer {{token}}

✅ Success: 200 OK
✅ Returns your profile
```

### Step 5: Update Profile ✏️
```
PUT /users/profile
Header: Authorization: Bearer {{token}}
Body:
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}

✅ Success: 200 OK
✅ Profile updated
```

### Step 6: Get All Categories 📦
```
GET /categories

✅ Success: 200 OK
✅ Returns list of categories
```

### Step 7: Create Category (Need Admin) 🔒
```
⚠️ IMPORTANT: First create admin user in MongoDB:

// In MongoDB shell or Compass
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { role: "admin" } }
)

Then:
POST /categories
Header: Authorization: Bearer {{token}}
Body (form-data):
- name: "Sedans"
- description: "Comfortable 4-door vehicles"
- status: "Active"
- photo: [Select image file]

✅ Success: 201 Created
✅ Category ID auto-saved
```

### Step 8: Update Category ✏️
```
PUT /categories/{{category_id}}
Header: Authorization: Bearer {{token}}
Body (form-data):
- name: "Premium Sedans"
- description: "Updated description"
- status: "Active"
- photo: [Select new image]

✅ Success: 200 OK
```

### Step 9: Toggle Status 🔄
```
PATCH /categories/{{category_id}}/status
Header: Authorization: Bearer {{token}}

✅ Success: 200 OK
✅ Status toggled
```

### Step 10: Delete Category 🗑️
```
DELETE /categories/{{category_id}}
Header: Authorization: Bearer {{token}}

✅ Success: 200 OK
✅ Category deleted
```

---

## 📦 Create Multiple Categories

### Quick Copy-Paste Data

**Category 1: Sedans**
- name: `Sedans`
- description: `Comfortable 4-door vehicles perfect for families and daily commuting`
- status: `Active`

**Category 2: SUVs**
- name: `SUVs`
- description: `Larger vehicles ideal for adventure, cargo, and off-road driving`
- status: `Active`

**Category 3: Luxury Cars**
- name: `Luxury Cars`
- description: `High-end vehicles with premium features and exceptional comfort`
- status: `Active`

**Category 4: Sports Cars**
- name: `Sports Cars`
- description: `High-performance vehicles designed for speed and exhilaration`
- status: `Active`

**Category 5: Electric Vehicles**
- name: `Electric Vehicles`
- description: `Eco-friendly vehicles powered by electricity`
- status: `Active`

---

## 🎯 Pro Tips

### Auto-Save Token
Collection automatically saves token on:
- User registration
- User login
- Category creation

### Auto-Save IDs
Collection automatically saves:
- `user_id` - After registration/login
- `category_id` - After category creation

### Testing Errors
Try these for error handling:
1. Register with duplicate email
2. Login with wrong password
3. Create category without auth
4. Upload invalid file type
5. Upload file >5MB

### Image Requirements
✅ **Allowed:** jpg, jpeg, png, gif, webp, svg, ico  
❌ **Not allowed:** pdf, doc, txt, zip  
⚠️ **Max size:** 5MB

---

## 🔍 Check Responses

### Success Indicators
- Status code: 200, 201
- Response has `"success": true`
- Data returned in response

### Error Indicators
- Status code: 400, 401, 404, 500
- Response has `"success": false`
- Error message included

---

## 📝 Complete Testing Checklist

### User Endpoints
- [ ] Health check works
- [ ] Register user success
- [ ] Register duplicate email fails
- [ ] Login with correct credentials
- [ ] Login with wrong password fails
- [ ] Get profile with valid token
- [ ] Get profile without token fails
- [ ] Update profile success

### Category Endpoints (Admin)
- [ ] Get all categories
- [ ] Filter by status
- [ ] Create category without auth fails
- [ ] Create category as admin success
- [ ] Upload valid image works
- [ ] Upload invalid file type fails
- [ ] Get category by ID
- [ ] Update category
- [ ] Toggle status
- [ ] Delete category
- [ ] Old photo deleted on update

---

## 🆘 Common Issues

### Issue: "Not authorized, no token provided"
**Solution:** Make sure you've logged in and token is saved

### Issue: "Access denied. Admin privileges required"
**Solution:** Update user role to "admin" in MongoDB

### Issue: "Category already exists"
**Solution:** Use a different category name

### Issue: "Invalid file type"
**Solution:** Upload only image files (jpg, png, etc.)

### Issue: Token not auto-saving
**Solution:** Check Postman environment is selected

---

## 🎉 You're Ready!

Follow the testing order above and you'll successfully test all endpoints!

**Happy Testing! 🚀**

