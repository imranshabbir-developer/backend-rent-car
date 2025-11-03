# Car API Documentation

Complete API documentation for Car management endpoints.

## Base URL
```
http://localhost:5000/api/v1/cars
```

## Authentication
All create, update, delete operations require:
- **Authorization**: Bearer Token (Admin only)
- Get a token from the login endpoint first

---

## 📋 Endpoints

### 1. Get All Cars
**GET** `/api/v1/cars`

**Access**: Public

**Query Parameters**:
- `status` (optional): Filter by status (`available`, `booked`, `maintenance`, `inactive`)
- `category` (optional): Filter by category ID
- `brand` (optional): Filter by brand
- `city` (optional): Filter by city
- `isAvailable` (optional): Filter by availability (`true`/`false`)

**Response** (200):
```json
{
  "success": true,
  "count": 2,
  "data": {
    "cars": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Honda Civic",
        "brand": "Honda",
        "model": "Civic",
        "year": 2023,
        "carPhoto": "/uploads/cars/civic-1723456789.jpg",
        "category": {
          "_id": "507f191e810c19729de860ea",
          "name": "Sedans",
          "description": "Comfortable 4-door vehicles"
        },
        "rentPerDay": 5000,
        "rentPerHour": 300,
        "currency": "PKR",
        "depositAmount": 10000,
        "isAvailable": true,
        "status": "available",
        "location": {
          "city": "Karachi",
          "address": "Defence Phase 5"
        },
        "transmission": "Automatic",
        "fuelType": "Petrol",
        "seats": 5,
        "mileage": 12.5,
        "color": "Silver",
        "registrationNumber": "KHI-ABC-1234",
        "createdBy": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Admin User",
          "email": "admin@test.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Single Car
**GET** `/api/v1/cars/:id`

**Access**: Public

**Response** (200):
```json
{
  "success": true,
  "data": {
    "car": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Honda Civic",
      "brand": "Honda",
      "model": "Civic",
      "year": 2023,
      "carPhoto": "/uploads/cars/civic-1723456789.jpg",
      "category": {
        "_id": "507f191e810c19729de860ea",
        "name": "Sedans",
        "description": "Comfortable 4-door vehicles"
      },
      "rentPerDay": 5000,
      "rentPerHour": 300,
      "currency": "PKR",
      "depositAmount": 10000,
      "isAvailable": true,
      "status": "available",
      "location": {
        "city": "Karachi",
        "address": "Defence Phase 5"
      },
      "transmission": "Automatic",
      "fuelType": "Petrol",
      "seats": 5,
      "mileage": 12.5,
      "color": "Silver",
      "registrationNumber": "KHI-ABC-1234",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Admin User",
        "email": "admin@test.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error** (404):
```json
{
  "success": false,
  "message": "Car not found"
}
```

---

### 3. Create Car
**POST** `/api/v1/cars`

**Access**: Private/Admin

**Headers**:
```
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Form Data** (required fields marked with *):
- `name`*: Car name (e.g., "Honda Civic")
- `brand`*: Brand name (e.g., "Honda")
- `model`*: Model name (e.g., "Civic")
- `year`*: Manufacturing year (e.g., 2023)
- `category`*: Category ID (ObjectId)
- `rentPerDay`*: Price per day in PKR (e.g., 5000)
- `rentPerHour` (optional): Price per hour in PKR (e.g., 300)
- `currency` (optional): Currency code (default: "PKR")
- `depositAmount` (optional): Security deposit (default: 0)
- `isAvailable` (optional): Availability (default: true)
- `status` (optional): Car status (default: "available")
  - Options: `available`, `booked`, `maintenance`, `inactive`
- `city`*: City name (e.g., "Karachi")
- `address` (optional): Full address
- `transmission`*: Transmission type
  - Options: `Automatic`, `Manual`
- `fuelType`*: Fuel type
  - Options: `Petrol`, `Diesel`, `Hybrid`, `Electric`
- `seats`*: Number of seats (e.g., 5)
- `mileage` (optional): Km per liter (e.g., 12.5)
- `color` (optional): Car color (e.g., "Silver")
- `registrationNumber`*: Unique registration number (will be auto uppercased)
- `carPhoto` (optional): Image file (max 5MB)

**Response** (201):
```json
{
  "success": true,
  "message": "Car created successfully",
  "data": {
    "car": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Honda Civic",
      "brand": "Honda",
      "model": "Civic",
      "year": 2023,
      "carPhoto": "/uploads/cars/civic-1723456789.jpg",
      "category": "507f191e810c19729de860ea",
      "rentPerDay": 5000,
      "rentPerHour": 300,
      "currency": "PKR",
      "depositAmount": 10000,
      "isAvailable": true,
      "status": "available",
      "location": {
        "city": "Karachi",
        "address": "Defence Phase 5"
      },
      "transmission": "Automatic",
      "fuelType": "Petrol",
      "seats": 5,
      "mileage": 12.5,
      "color": "Silver",
      "registrationNumber": "KHI-ABC-1234",
      "createdBy": "507f1f77bcf86cd799439012",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error** (400):
```json
{
  "success": false,
  "message": "Car with this registration number already exists"
}
```

---

### 4. Update Car
**PUT** `/api/v1/cars/:id`

**Access**: Private/Admin

**Headers**:
```
Authorization: Bearer <your_token>
Content-Type: multipart/form-data
```

**Form Data**: Same as Create Car (all fields optional)

**Response** (200):
```json
{
  "success": true,
  "message": "Car updated successfully",
  "data": {
    "car": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Honda Civic 2024",
      "brand": "Honda",
      "model": "Civic",
      "year": 2024,
      "carPhoto": "/uploads/cars/civic-1723456789-new.jpg",
      "category": {
        "_id": "507f191e810c19729de860ea",
        "name": "Sedans"
      },
      "rentPerDay": 5500,
      "createdBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Admin User"
      }
    }
  }
}
```

---

### 5. Delete Car
**DELETE** `/api/v1/cars/:id`

**Access**: Private/Admin

**Headers**:
```
Authorization: Bearer <your_token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Car deleted successfully"
}
```

---

### 6. Toggle Car Availability
**PATCH** `/api/v1/cars/:id/availability`

**Access**: Private/Admin

**Headers**:
```
Authorization: Bearer <your_token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Car marked as unavailable",
  "data": {
    "car": {
      "_id": "507f1f77bcf86cd799439011",
      "isAvailable": false,
      "status": "inactive"
    }
  }
}
```

---

### 7. Update Car Status
**PATCH** `/api/v1/cars/:id/status`

**Access**: Private/Admin

**Headers**:
```
Authorization: Bearer <your_token>
Content-Type: application/json
```

**Body**:
```json
{
  "status": "maintenance"
}
```

**Valid Status Values**: `available`, `booked`, `maintenance`, `inactive`

**Response** (200):
```json
{
  "success": true,
  "message": "Car status changed to maintenance",
  "data": {
    "car": {
      "_id": "507f1f77bcf86cd799439011",
      "status": "maintenance",
      "isAvailable": false
    }
  }
}
```

---

## 🔒 Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Car with this registration number already exists"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Car not found"
}
```

### 400 File Upload Error
```json
{
  "success": false,
  "message": "File size too large"
}
```

---

## 📝 Testing Notes

1. **First**: Create a category or get an existing category ID
2. **Then**: Create cars with valid category references
3. **Registration Numbers**: Must be unique (auto uppercased)
4. **File Uploads**: Supported image formats (JPEG, PNG, GIF, WebP, SVG, ICO)
5. **Status Updates**: Automatically syncs `isAvailable` with `status`
6. **Photos**: Automatically deleted when car is deleted or updated

---

## 🚀 Quick Test Flow

1. **Login as Admin**: `POST /api/v1/users/login`
2. **Get Categories**: `GET /api/v1/categories` (get a category ID)
3. **Create Car**: `POST /api/v1/cars` (use category ID from step 2)
4. **Get All Cars**: `GET /api/v1/cars`
5. **Get Car by ID**: `GET /api/v1/cars/:id`
6. **Update Car**: `PUT /api/v1/cars/:id`
7. **Toggle Availability**: `PATCH /api/v1/cars/:id/availability`
8. **Delete Car**: `DELETE /api/v1/cars/:id`

