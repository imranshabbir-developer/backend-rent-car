# Category API Documentation

## 🌐 Base URL
```
http://localhost:5000/api/v1/categories
```

---

## 📡 Endpoints Overview

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/categories` | Get all categories | Public |
| GET | `/categories/:id` | Get category by ID | Public |
| POST | `/categories` | Create new category | Admin Required |
| PUT | `/categories/:id` | Update category | Admin Required |
| DELETE | `/categories/:id` | Delete category | Admin Required |
| PATCH | `/categories/:id/status` | Toggle category status | Admin Required |

---

## 📝 Endpoint Details

### 1️⃣ Get All Categories

**GET** `http://localhost:5000/api/v1/categories`

**Query Parameters (Optional):**
- `status`: Filter by status (Active/Inactive)

**Example Request:**
```
GET http://localhost:5000/api/v1/categories
GET http://localhost:5000/api/v1/categories?status=Active
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": {
    "categories": [
      {
        "_id": "64f7a8b9c1d2e3f4a5b6c7d8",
        "name": "Sedans",
        "description": "Comfortable 4-door vehicles perfect for families",
        "photo": "/uploads/categories/sedans-1693506720123-123456789.jpg",
        "status": "Active",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "_id": "64f7a8b9c1d2e3f4a5b6c7d9",
        "name": "SUVs",
        "description": "Larger vehicles for adventure and cargo",
        "photo": "/uploads/categories/suvs-1693506720124-123456790.jpg",
        "status": "Active",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 2️⃣ Get Category by ID

**GET** `http://localhost:5000/api/v1/categories/:id`

**Example Request:**
```
GET http://localhost:5000/api/v1/categories/64f7a8b9c1d2e3f4a5b6c7d8
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "64f7a8b9c1d2e3f4a5b6c7d8",
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

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

### 3️⃣ Create Category

**POST** `http://localhost:5000/api/v1/categories`

**Authentication:** Required (Admin only)

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required): Category name
- `description` (required): Category description
- `status` (optional): Status (Active/Inactive, default: Active)
- `photo` (optional): Image file (jpeg, jpg, png, gif, webp, svg, ico - max 5MB)

**Example Request (with photo):**
```
POST http://localhost:5000/api/v1/categories
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

name: Sedans
description: Comfortable 4-door vehicles perfect for families
status: Active
photo: [binary file data]
```

**Example Request (without photo):**
```
POST http://localhost:5000/api/v1/categories
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/x-www-form-urlencoded

name: Luxury Cars
description: High-end vehicles with premium features
status: Active
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "_id": "64f7a8b9c1d2e3f4a5b6c7d8",
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

**Error Responses:**

**400 Bad Request - Name already exists:**
```json
{
  "success": false,
  "message": "Category already exists"
}
```

**400 Bad Request - Validation error:**
```json
{
  "success": false,
  "message": "Category name is required, Category description is required"
}
```

**400 Bad Request - Invalid file type:**
```json
{
  "success": false,
  "message": "Invalid file type. Allowed types: image/jpeg, image/jpg, image/png, image/gif, image/webp, image/svg+xml, image/x-icon, image/vnd.microsoft.icon"
}
```

**401 Unauthorized - Not admin:**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

### 4️⃣ Update Category

**PUT** `http://localhost:5000/api/v1/categories/:id`

**Authentication:** Required (Admin only)

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (optional): New category name
- `description` (optional): New description
- `status` (optional): New status (Active/Inactive)
- `photo` (optional): New image file

**Example Request:**
```
PUT http://localhost:5000/api/v1/categories/64f7a8b9c1d2e3f4a5b6c7d8
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

name: Premium Sedans
description: Updated description for sedans
photo: [binary file data]
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {
      "_id": "64f7a8b9c1d2e3f4a5b6c7d8",
      "name": "Premium Sedans",
      "description": "Updated description for sedans",
      "photo": "/uploads/categories/premium-sedans-1693506800123-987654321.jpg",
      "status": "Active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

**Error Response (400 Bad Request - Name exists):**
```json
{
  "success": false,
  "message": "Category name already exists"
}
```

---

### 5️⃣ Delete Category

**DELETE** `http://localhost:5000/api/v1/categories/:id`

**Authentication:** Required (Admin only)

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example Request:**
```
DELETE http://localhost:5000/api/v1/categories/64f7a8b9c1d2e3f4a5b6c7d8
Authorization: Bearer YOUR_TOKEN_HERE
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

### 6️⃣ Toggle Category Status

**PATCH** `http://localhost:5000/api/v1/categories/:id/status`

**Authentication:** Required (Admin only)

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example Request:**
```
PATCH http://localhost:5000/api/v1/categories/64f7a8b9c1d2e3f4a5b6c7d8/status
Authorization: Bearer YOUR_TOKEN_HERE
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category status changed to Inactive",
  "data": {
    "category": {
      "_id": "64f7a8b9c1d2e3f4a5b6c7d8",
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

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

## 🎯 Example cURL Commands

### Get All Categories
```bash
curl -X GET http://localhost:5000/api/v1/categories
```

### Get Category by ID
```bash
curl -X GET http://localhost:5000/api/v1/categories/64f7a8b9c1d2e3f4a5b6c7d8
```

### Create Category (with file)
```bash
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Sedans" \
  -F "description=Comfortable 4-door vehicles perfect for families" \
  -F "status=Active" \
  -F "photo=@/path/to/image.jpg"
```

### Update Category
```bash
curl -X PUT http://localhost:5000/api/v1/categories/64f7a8b9c1d2e3f4a5b6c7d8 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "name=Premium Sedans" \
  -F "description=Updated description" \
  -F "photo=@/path/to/new-image.jpg"
```

### Delete Category
```bash
curl -X DELETE http://localhost:5000/api/v1/categories/64f7a8b9c1d2e3f4a5b6c7d8 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Toggle Status
```bash
curl -X PATCH http://localhost:5000/api/v1/categories/64f7a8b9c1d2e3f4a5b6c7d8/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 Sample Data Sets

### Category 1: Sedans
```json
{
  "name": "Sedans",
  "description": "Comfortable 4-door vehicles perfect for families and daily commuting",
  "status": "Active"
}
```

### Category 2: SUVs
```json
{
  "name": "SUVs",
  "description": "Larger vehicles ideal for adventure, cargo, and off-road driving",
  "status": "Active"
}
```

### Category 3: Luxury Cars
```json
{
  "name": "Luxury Cars",
  "description": "High-end vehicles with premium features and exceptional comfort",
  "status": "Active"
}
```

### Category 4: Sports Cars
```json
{
  "name": "Sports Cars",
  "description": "High-performance vehicles designed for speed and exhilaration",
  "status": "Active"
}
```

### Category 5: Electric Vehicles
```json
{
  "name": "Electric Vehicles",
  "description": "Eco-friendly vehicles powered by electricity",
  "status": "Active"
}
```

---

## 📌 Important Notes

### File Upload
- **Allowed formats:** jpeg, jpg, png, gif, webp, svg, ico, favicon
- **Max file size:** 5MB (configurable)
- **Storage location:** `uploads/categories/`
- **File naming:** Auto-generated unique names with timestamps
- **Old files:** Automatically deleted when updating or deleting categories

### Authentication
- All create, update, delete operations require admin authentication
- Public endpoints: GET all categories, GET category by ID
- Use JWT token in Authorization header: `Bearer YOUR_TOKEN_HERE`

### Status Values
- `Active`: Category is visible and can be used
- `Inactive`: Category is hidden but not deleted

### Photo URLs
- Photos are accessible at: `http://localhost:5000/uploads/categories/filename.jpg`
- Automatic folder creation on first upload
- Photos are permanently deleted when category is deleted

### Error Handling
- Validation errors show specific missing fields
- Duplicate name checks prevent conflicts
- File errors include allowed file types
- All errors return consistent JSON format

---

## 🔄 Complete Workflow Example

1. **Register/Login** as admin user
2. **Create Categories** with photos
3. **Get All Categories** to see list
4. **Update Category** to modify details or photo
5. **Toggle Status** to hide/show without deleting
6. **Filter by Status** to get only active categories
7. **Delete Category** to permanently remove

---

## ✅ Testing Checklist

- [ ] Create category with photo
- [ ] Create category without photo
- [ ] Get all categories
- [ ] Get active categories only
- [ ] Get category by ID
- [ ] Update category name
- [ ] Update category description
- [ ] Update category photo
- [ ] Toggle category status
- [ ] Delete category
- [ ] Verify photo deletion on update
- [ ] Verify photo deletion on delete
- [ ] Test with invalid file type
- [ ] Test with file too large
- [ ] Test duplicate name
- [ ] Test without authentication
- [ ] Test with non-admin user

