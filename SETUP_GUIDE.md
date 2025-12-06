# FieldBook Authentication System - Quick Setup Guide

## Backend Setup ✅ (Already Completed)

### Files Created/Modified:
1. **Models**: `backend/models/user.model.js`
2. **Controllers**: `backend/controllers/user.controller.js`
3. **Routes**: `backend/routes/user.route.js`
4. **Environment**: `backend/.env` (JWT_SECRET added)

### Dependencies Installed:
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)

### Starting Backend:
```bash
cd FieldBook/backend
npm start
```
Backend runs on: `http://localhost:3000`

---

## Frontend Setup (To Be Completed)

### 1. Update `main.jsx`

Replace the content of `src/main.jsx`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

### 2. Update `App.jsx`

Import and configure routes:

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./routes/Layout.jsx";
import Homepage from "./routes/Homepage.jsx";
import Booking from "./routes/Booking.jsx";
import Bookings from "./routes/Bookings.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import PlayerDashboard from "./routes/PlayerDashboard.jsx";
import FieldOwnerDashboard from "./routes/FieldOwnerDashboard.jsx";
import AdminDashboard from "./routes/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/player-dashboard" 
            element={
              <ProtectedRoute requiredRole="Player">
                <PlayerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/field-owner-dashboard" 
            element={
              <ProtectedRoute requiredRole="Field_Owner">
                <FieldOwnerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
```

### 3. Frontend Files Structure

All files have been created in the following structure:

```
src/
├── context/
│   └── AuthContext.jsx          ✅ Created
├── components/
│   └── ProtectedRoute.jsx       ✅ Created
├── routes/
│   ├── Login.jsx                ✅ Updated
│   ├── Register.jsx             ✅ Updated
│   ├── PlayerDashboard.jsx      ✅ Created
│   ├── FieldOwnerDashboard.jsx  ✅ Created
│   └── AdminDashboard.jsx       ✅ Created
└── api/
    └── userAPI.js               ✅ Created
```

---

## Testing the System

### Step 1: Start Backend
```bash
cd backend
npm start
```

### Step 2: Start Frontend
```bash
cd client
npm run dev
```

### Step 3: Test Registration

**Test Case 1 - Register as Player:**
1. Navigate to `http://localhost:5173/register`
2. Click "Player" card
3. Fill in:
   - First Name: John
   - Last Name: Doe
   - Username: john_doe
   - Email: john@example.com
   - Mobile: 9876543210
   - Password: TestPass123
   - Confirm Password: TestPass123
   - Skill Level: Intermediate
   - Preferred Sports: Football, Cricket
   - Accept Terms ✓
4. Click "Create account"
5. Should redirect to `/player-dashboard`

**Test Case 2 - Register as Field Owner:**
1. Navigate to `http://localhost:5173/register`
2. Click "Field_Owner" card
3. Fill in all basic details
4. Fill in:
   - Field Name: Premier Football Arena
   - Field Location: Downtown City
   - Field Type: Football
   - Capacity: 22
   - Price Per Hour: 500
5. Click "Create account"
6. Should redirect to `/field-owner-dashboard`

### Step 4: Test Login
1. Navigate to `http://localhost:5173/login`
2. Enter email: john@example.com
3. Enter password: TestPass123
4. Click "Sign in"
5. Should redirect to appropriate dashboard

### Step 5: Test Protected Routes
1. Without login, try accessing `/player-dashboard`
2. Should redirect to `/login`
3. Login as Player
4. Try accessing `/field-owner-dashboard`
5. Should redirect to homepage (not authorized)

---

## API Testing with cURL or Postman

### Register User
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "userID": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "password": "TestPass123",
    "confirmPassword": "TestPass123",
    "role": "Player",
    "skillLevel": "Intermediate",
    "preferredSports": ["Football", "Cricket"]
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "TestPass123"
  }'
```

---

## Features Available

### ✅ Authentication
- User Registration with role selection
- User Login with JWT
- Protected Routes
- Session Management

### ✅ User Types
- Player - Book fields, find players
- Field Owner - Manage fields, earn revenue
- Admin - Manage platform

### ✅ User Data
- Personal Information
- Role-specific fields
- Account status tracking
- Profile pictures support

### ✅ Dashboard
- Player Dashboard
- Field Owner Dashboard
- Admin Dashboard

---

## Troubleshooting

### Error: "Cannot POST /users/register"
- Ensure backend is running on port 3000
- Check if user.route.js is properly imported in index.js

### Error: "CORS error"
- CORS is already enabled in backend
- Ensure frontend is accessing correct backend URL

### Error: "Invalid email or password"
- Double-check entered email and password
- Ensure user was registered first

### Error: "User not found in dashboard"
- Check browser console for errors
- Verify token is stored in localStorage
- Check if user role matches required role

---

## Next Steps

1. Connect Navbar with Auth Context to show user info
2. Add logout button in Navbar
3. Create user profile edit page
4. Implement email verification
5. Add password reset functionality
6. Create admin user management page
7. Create field management for Field Owners
8. Implement booking functionality with user authentication

---

## File Summary

### Backend Files Created:
- ✅ `backend/models/user.model.js` (245 lines)
- ✅ `backend/controllers/user.controller.js` (260 lines)
- ✅ `backend/routes/user.route.js` (25 lines)

### Frontend Files Created:
- ✅ `src/context/AuthContext.jsx` (60 lines)
- ✅ `src/components/ProtectedRoute.jsx` (35 lines)
- ✅ `src/routes/Login.jsx` (140 lines updated)
- ✅ `src/routes/Register.jsx` (300 lines updated)
- ✅ `src/routes/PlayerDashboard.jsx` (110 lines)
- ✅ `src/routes/FieldOwnerDashboard.jsx` (140 lines)
- ✅ `src/routes/AdminDashboard.jsx` (130 lines)
- ✅ `src/api/userAPI.js` (85 lines)

### Documentation:
- ✅ `AUTH_SYSTEM_DOCUMENTATION.md` (Complete reference)
- ✅ `SETUP_GUIDE.md` (This file)

---

## Support

For detailed API documentation, see `AUTH_SYSTEM_DOCUMENTATION.md`
