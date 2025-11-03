# Car API - Quick Start Guide

## 🚀 Quick Setup

### Step 1: Start Your Server
```bash
cd backend-car-service
npm run dev
```

### Step 2: Get Admin Token
```bash
POST http://localhost:5000/api/v1/users/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "password123"
}
```
**Save the `token` from response**

---

## 🎯 Quick Car Creation

### Step 3: Get Category ID
```bash
GET http://localhost:5000/api/v1/categories
```
**Save a `category._id` from response**

---

### Step 4: Create Your First Car

**Using Postman/Thunder Client**:

**Method**: POST  
**URL**: `http://localhost:5000/api/v1/cars`  
**Headers**:
```
Authorization: Bearer <YOUR_ADMIN_TOKEN>
```

**Body** (form-data):
```
name: Honda Civic 2023
brand: Honda
model: Civic
year: 2023
category: <PASTE_CATEGORY_ID_HERE>
rentPerDay: 5000
city: Karachi
transmission: Automatic
fuelType: Petrol
seats: 5
registrationNumber: KHI-TEST-001
carPhoto: [Select a car image]
```

**Response**:
```json
{
  "success": true,
  "message": "Car created successfully",
  "data": {
    "car": {
      "_id": "...",
      "name": "Honda Civic 2023",
      ...
    }
  }
}
```

---

## 📋 Complete Endpoints

### Public Endpoints (No Auth Required)
```
GET  /api/v1/cars           - Get all cars
GET  /api/v1/cars/:id       - Get single car
GET  /api/v1/cars?status=available&city=Karachi  - Filter cars
```

### Admin Endpoints (Auth Required)
```
POST   /api/v1/cars                 - Create car
PUT    /api/v1/cars/:id             - Update car
DELETE /api/v1/cars/:id             - Delete car
PATCH  /api/v1/cars/:id/availability - Toggle availability
PATCH  /api/v1/cars/:id/status      - Update status
```

---

## 🔍 Common Queries

### Get Available Cars in Karachi
```
GET http://localhost:5000/api/v1/cars?status=available&city=Karachi
```

### Get All Toyota Cars
```
GET http://localhost:5000/api/v1/cars?brand=Toyota
```

### Get Cars by Category
```
GET http://localhost:5000/api/v1/cars?category=<CATEGORY_ID>
```

### Get Only Available Cars
```
GET http://localhost:5000/api/v1/cars?isAvailable=true
```

---

## 🎨 All Car Status Types

- **available** - Car is ready for rental
- **booked** - Car is currently rented
- **maintenance** - Car is under maintenance
- **inactive** - Car is temporarily unavailable

---

## 📸 Photo Requirements

- **Max Size**: 5MB
- **Allowed Types**: JPEG, JPG, PNG, GIF, WebP, SVG, ICO
- **Auto-naming**: Timestamp + random number
- **Auto-cleanup**: Deleted when car is updated/deleted

---

## ⚠️ Important Notes

1. **Category Required**: Every car must belong to a category
2. **Unique Registration**: Registration numbers must be unique
3. **Auto Uppercase**: Registration numbers automatically converted to UPPERCASE
4. **Admin Only**: Only admins can create/update/delete cars
5. **Auto Sync**: Status and availability sync automatically

---

## 🧪 Test Car Examples

### Example 1: Basic Car
```
name: Suzuki Swift
brand: Suzuki
model: Swift
year: 2023
category: <ID>
rentPerDay: 3500
city: Islamabad
transmission: Manual
fuelType: Petrol
seats: 5
registrationNumber: ISB-SWIFT-001
```

### Example 2: Luxury Car
```
name: Mercedes-Benz C-Class
brand: Mercedes-Benz
model: C-Class
year: 2024
category: <ID>
rentPerDay: 25000
rentPerHour: 1500
depositAmount: 50000
city: Karachi
transmission: Automatic
fuelType: Petrol
seats: 5
color: Metallic Silver
registrationNumber: KHI-MERC-001
```

### Example 3: Electric Car
```
name: Tesla Model 3
brand: Tesla
model: Model 3
year: 2024
category: <ID>
rentPerDay: 30000
city: Lahore
transmission: Automatic
fuelType: Electric
seats: 5
mileage: 15.0
registrationNumber: LHR-TESLA-001
```

---

## 📚 Full Documentation

For complete API documentation, see:
- `CAR_API.md` - Complete endpoint documentation
- `CAR_DUMMY_DATA.md` - Detailed examples and test data

---

## 🐛 Troubleshooting

### "Category is required"
→ Make sure you passed a valid Category ID

### "Registration number already exists"
→ Use a different registration number (must be unique)

### "Not authorized"
→ Make sure you're logged in as admin and passed the token

### "File size too large"
→ Reduce image file size (max 5MB)

### "Invalid file type"
→ Use JPEG, PNG, GIF, WebP, SVG, or ICO

---

## ✅ Success Checklist

- [ ] Server running on port 5000
- [ ] Admin logged in and token saved
- [ ] Category created and ID saved
- [ ] Car created successfully
- [ ] Photo uploaded and displaying
- [ ] Can query cars with filters
- [ ] Can update/delete cars
- [ ] Status changes working

---

## 🎉 You're Ready!

Your Car API is now fully functional. Start creating cars and building your rental platform!

**Next Steps**:
1. Create frontend UI for car management
2. Add car search and filters
3. Integrate with booking system
4. Add image galleries
5. Implement car availability calendar

