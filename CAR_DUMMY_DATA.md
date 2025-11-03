# Car API - Dummy Data for Testing

## 📝 Prerequisites

**IMPORTANT**: You need to get a Category ID first before creating cars!

1. Create categories or get existing ones:
   ```bash
   GET http://localhost:5000/api/v1/categories
   ```

2. Get an admin token:
   ```bash
   POST http://localhost:5000/api/v1/users/login
   {
     "email": "admin@test.com",
     "password": "password123"
   }
   ```

---

## 🎯 Dummy Data Examples

### Example 1: Honda Civic (Sedan)

**POST** `http://localhost:5000/api/v1/cars`

**Headers**:
```
Authorization: Bearer <your_admin_token>
Content-Type: multipart/form-data
```

**Form Data**:
```
name: Honda Civic 2023
brand: Honda
model: Civic
year: 2023
category: <YOUR_CATEGORY_ID>  ← Replace with actual category ID
rentPerDay: 5000
rentPerHour: 300
currency: PKR
depositAmount: 10000
isAvailable: true
status: available
city: Karachi
address: Defence Phase 5, Block XYZ
transmission: Automatic
fuelType: Petrol
seats: 5
mileage: 12.5
color: Silver
registrationNumber: KHI-ABC-1234
carPhoto: [Upload an image file]
```

---

### Example 2: Toyota Corolla (Sedan)

**POST** `http://localhost:5000/api/v1/cars`

**Form Data**:
```
name: Toyota Corolla 2024
brand: Toyota
model: Corolla
year: 2024
category: <YOUR_CATEGORY_ID>
rentPerDay: 5500
rentPerHour: 350
currency: PKR
depositAmount: 12000
isAvailable: true
status: available
city: Lahore
address: Model Town, Main Boulevard
transmission: Automatic
fuelType: Hybrid
seats: 5
mileage: 20.5
color: White Pearl
registrationNumber: LHR-XYZ-5678
carPhoto: [Upload an image file]
```

---

### Example 3: Suzuki Swift (Hatchback)

**POST** `http://localhost:5000/api/v1/cars`

**Form Data**:
```
name: Suzuki Swift 2023
brand: Suzuki
model: Swift
year: 2023
category: <YOUR_CATEGORY_ID>
rentPerDay: 3500
rentPerHour: 200
currency: PKR
depositAmount: 8000
isAvailable: true
status: available
city: Islamabad
address: F-7 Markaz
transmission: Manual
fuelType: Petrol
seats: 5
mileage: 15.0
color: Red
registrationNumber: ISB-MNO-9876
carPhoto: [Upload an image file]
```

---

### Example 4: Honda CR-V (SUV)

**POST** `http://localhost:5000/api/v1/cars`

**Form Data**:
```
name: Honda CR-V 2024
brand: Honda
model: CR-V
year: 2024
category: <YOUR_CATEGORY_ID>
rentPerDay: 8000
rentPerHour: 500
currency: PKR
depositAmount: 20000
isAvailable: true
status: available
city: Karachi
address: Clifton Area, Block 4
transmission: Automatic
fuelType: Hybrid
seats: 7
mileage: 18.0
color: Black
registrationNumber: KHI-SUV-2024
carPhoto: [Upload an image file]
```

---

### Example 5: Mercedes-Benz C-Class (Luxury)

**POST** `http://localhost:5000/api/v1/cars`

**Form Data**:
```
name: Mercedes-Benz C-Class 2024
brand: Mercedes-Benz
model: C-Class
year: 2024
category: <YOUR_CATEGORY_ID>
rentPerDay: 25000
rentPerHour: 1500
currency: PKR
depositAmount: 50000
isAvailable: true
status: available
city: Karachi
address: DHA Phase 6
transmission: Automatic
fuelType: Petrol
seats: 5
mileage: 10.5
color: Metallic Silver
registrationNumber: KHI-LUX-2024
carPhoto: [Upload an image file]
```

---

## 🔄 Update Car Example

**PUT** `http://localhost:5000/api/v1/cars/:id`

**Form Data**:
```
name: Honda Civic 2024
rentPerDay: 5500
status: maintenance
[Other fields optional]
carPhoto: [Upload new image file - optional]
```

---

## 🔄 Status Update Example

**PATCH** `http://localhost:5000/api/v1/cars/:id/status`

**Headers**:
```
Authorization: Bearer <your_admin_token>
Content-Type: application/json
```

**Body** (JSON):
```json
{
  "status": "booked"
}
```

---

## 🔄 Toggle Availability Example

**PATCH** `http://localhost:5000/api/v1/cars/:id/availability`

**Headers**:
```
Authorization: Bearer <your_admin_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Car marked as unavailable",
  "data": {
    "car": {
      "_id": "...",
      "isAvailable": false,
      "status": "inactive"
    }
  }
}
```

---

## 🔍 Query Examples

### Get All Cars
**GET** `http://localhost:5000/api/v1/cars`

### Get Cars by Status
**GET** `http://localhost:5000/api/v1/cars?status=available`

### Get Cars by Category
**GET** `http://localhost:5000/api/v1/cars?category=<CATEGORY_ID>`

### Get Cars by Brand
**GET** `http://localhost:5000/api/v1/cars?brand=Honda`

### Get Cars by City
**GET** `http://localhost:5000/api/v1/cars?city=Karachi`

### Get Available Cars Only
**GET** `http://localhost:5000/api/v1/cars?isAvailable=true`

### Combined Filters
**GET** `http://localhost:5000/api/v1/cars?brand=Toyota&city=Lahore&status=available`

---

## 🗑️ Delete Car Example

**DELETE** `http://localhost:5000/api/v1/cars/:id`

**Headers**:
```
Authorization: Bearer <your_admin_token>
```

---

## 📋 Field Requirements Summary

### Required Fields ✅
- name
- brand
- model
- year
- category (Category ID)
- rentPerDay
- city
- transmission
- fuelType
- seats
- registrationNumber

### Optional Fields ⚪
- carPhoto
- rentPerHour
- currency (default: "PKR")
- depositAmount (default: 0)
- isAvailable (default: true)
- status (default: "available")
- address
- mileage
- color

### Auto-Generated Fields 🔄
- _id (MongoDB)
- createdAt
- updatedAt
- createdBy (from JWT token)

---

## ⚠️ Important Notes

1. **Category ID**: Must be a valid MongoDB ObjectId from your categories collection
2. **Registration Number**: Must be unique, automatically converted to UPPERCASE
3. **Status**: Must be one of: `available`, `booked`, `maintenance`, `inactive`
4. **Transmission**: Must be `Automatic` or `Manual`
5. **Fuel Type**: Must be `Petrol`, `Diesel`, `Hybrid`, or `Electric`
6. **File Upload**: Max 5MB, supported formats: JPEG, PNG, GIF, WebP, SVG, ICO
7. **Authorization**: Admin token required for create/update/delete operations

---

## 🧪 Quick Test Sequence

```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Save the token from response

# 2. Get categories
curl http://localhost:5000/api/v1/categories

# Save a category ID

# 3. Create a car
curl -X POST http://localhost:5000/api/v1/cars \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -F "name=Honda Civic" \
  -F "brand=Honda" \
  -F "model=Civic" \
  -F "year=2023" \
  -F "category=<CATEGORY_ID>" \
  -F "rentPerDay=5000" \
  -F "city=Karachi" \
  -F "transmission=Automatic" \
  -F "fuelType=Petrol" \
  -F "seats=5" \
  -F "registrationNumber=KHI-123" \
  -F "carPhoto=@/path/to/image.jpg"

# 4. Get all cars
curl http://localhost:5000/api/v1/cars

# 5. Get single car
curl http://localhost:5000/api/v1/cars/<CAR_ID>

# 6. Update car
curl -X PUT http://localhost:5000/api/v1/cars/<CAR_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -F "rentPerDay=5500"

# 7. Delete car
curl -X DELETE http://localhost:5000/api/v1/cars/<CAR_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 🎨 Status Flow

```
available → booked → available (after booking ends)
available → maintenance → available (after maintenance)
available → inactive (admin action)
any status → available (admin action)
```

**Auto-sync**: When status changes to "available", `isAvailable` becomes `true`. Otherwise `false`.

