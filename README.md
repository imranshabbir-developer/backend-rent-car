# Backend Car Service

A complete Node.js backend server with Express, MongoDB, and JWT authentication following MVC architecture.

## 📁 Project Structure

```
backend-car-service/
├── config/
│   └── dbConfig.js          # MongoDB connection configuration
├── controllers/
│   └── userController.js    # User business logic
├── middleware/
│   ├── authMiddleware.js    # JWT authentication & authorization
│   └── errorMiddleware.js   # Centralized error handling
├── models/
│   └── userModel.js         # User Mongoose schema
├── routes/
│   └── userRoutes.js        # User API routes
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── server.js                # Express server entry point
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd backend-car-service
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
     ```
     MONGODB_URI=mongodb://localhost:27017/rentacar
     JWT_SECRET=your_jwt_secret_key_here
     JWT_EXPIRE=7d
     PORT=5000
     NODE_ENV=development
     ```

3. **Start MongoDB** (if running locally)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- **GET** `/api/v1/health` - Check server status

### User Endpoints
- **POST** `/api/v1/users/register` - Register a new user
- **POST** `/api/v1/users/login` - Login user
- **GET** `/api/v1/users/profile` - Get user profile (Protected)
- **PUT** `/api/v1/users/profile` - Update user profile (Protected)

> 📚 **Complete API Documentation:** See `API_DOCUMENTATION.md` for detailed endpoint documentation with dummy data, request/response examples, and error handling.
> 
> 🚀 **Quick Examples:** Check `API_EXAMPLES.md` for copy-paste ready request bodies and test data.
> 
> 📮 **Postman Collection:** Import `Postman_Collection.json` into Postman for easy testing.

## 📝 API Request Examples

### Register User
```bash
POST /api/v1/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
```bash
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Profile (Protected)
```bash
GET /api/v1/users/profile
Authorization: Bearer <token>
```

## 🔐 Authentication

- JWT-based authentication
- Token expiration: 7 days (configurable)
- Protected routes require `Authorization: Bearer <token>` header
- Password hashing with bcrypt

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer
- **Logging:** Morgan
- **Styling:** Colors
- **Development:** Nodemon

## 📦 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## 🔍 Features

- ✅ ES6 import/export syntax
- ✅ Clean MVC architecture
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Centralized error handling
- ✅ Input validation
- ✅ Role-based access control (user, admin)
- ✅ MongoDB connection with Mongoose
- ✅ Request logging with Morgan
- ✅ Environment variable configuration

## 🏗️ Architecture

- **Models:** Mongoose schemas for database entities
- **Controllers:** Request handling and business logic
- **Routes:** API endpoint definitions
- **Middleware:** Authentication, validation, and error handling
- **Config:** Database and application configuration

## 🔄 Error Handling

The application uses centralized error handling that automatically:
- Catches Mongoose validation errors
- Handles duplicate key errors
- Manages JWT errors (invalid/expired tokens)
- Returns consistent error responses

Common validation messages:
- "Name is required"
- "Email is required"
- "Password is required"

## 📌 Naming Conventions

- File names: camelCase (e.g., `userController.js`, `authMiddleware.js`)
- No dots or full stops in file names
- API routes: `/api/v1/<resource>`

## 🔒 Security

- Passwords are hashed before saving
- JWT tokens for authentication
- Protected routes require valid tokens
- Environment variables for sensitive data
- Password field excluded from queries by default

## 📝 License

ISC

## 👥 Contributing

This is a structured backend setup for the Rent A Car application.

