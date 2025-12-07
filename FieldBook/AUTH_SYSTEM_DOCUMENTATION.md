# FieldBook - User Authentication System Documentation

## Overview
This document describes the complete user authentication and registration system for the FieldBook application with three user roles: **Admin**, **Player**, and **Field_Owner**.

---

## Features Implemented

### 1. User Roles
- **Player (Normal User)**: Browse fields, book slots, find players
- **Field Owner**: List fields, manage bookings, earn revenue
- **Admin**: Manage platform, users, and fields

### 2. User Registration
- Multi-step registration process with role selection
- Role-specific fields based on user type
- Password hashing with bcryptjs
- Email validation and uniqueness checks
- Mobile number validation

### 3. User Login
- Email and password-based authentication
- JWT token generation
- Token stored in localStorage
- Automatic redirect based on user role

### 4. User Data Structure

```javascript
User Schema:
- userID (String, unique) - Username
- firstName (String) - First name
- lastName (String) - Last name
- email (String, unique) - Email address
- mobile (String) - Phone number
- password (String, hashed) - Password
- role (String) - 'Admin', 'Player', or 'Field_Owner'
- profilePicture (String) - Profile image URL
- address (String)
- city (String)
- state (String)
- country (String)
- zipCode (String)
- bio (String)

// Field Owner Specific
- fieldName (String)
- fieldLocation (String)
- fieldCapacity (Number)
- fieldType (String) - Football, Cricket, Badminton, Basketball, Volleyball
- pricePerHour (Number)

// Player Specific
- skillLevel (String) - Beginner, Intermediate, Advanced
- preferredSports (Array) - List of sports

// Account Status
- isVerified (Boolean)
- isActive (Boolean)
- timestamps (createdAt, updatedAt)
```

---

## Backend Implementation

### API Endpoints

#### Authentication Endpoints

**1. Register User**
```
POST /users/register
Content-Type: application/json

Request Body:
{
  "userID": "john_doe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "secure_password",
  "confirmPassword": "secure_password",
  "role": "Player|Field_Owner|Admin",
  
  // For Field Owner
  "fieldName": "Premium Football Arena",
  "fieldLocation": "Downtown",
  "fieldCapacity": 20,
  "fieldType": "Football",
  "pricePerHour": 500,
  
  // For Player
  "skillLevel": "Intermediate",
  "preferredSports": ["Football", "Cricket"]
}

Response (Success):
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "userID": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "Player",
    ...
  }
}
```

**2. Login User**
```
POST /users/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "secure_password"
}

Response (Success):
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "userID": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "Player",
    ...
  }
}

Response (Error):
{
  "message": "Invalid email or password"
}
```

#### Profile Endpoints

**3. Get User Profile**
```
GET /users/profile
Headers: Authorization: Bearer {token}
Body: { "userId": "user_id" }

Response:
{
  "message": "User profile retrieved successfully",
  "user": { ... }
}
```

**4. Update User Profile**
```
PUT /users/profile/update
Headers: Authorization: Bearer {token}
Body: { 
  "userId": "user_id",
  "firstName": "Updated Name",
  ... other fields
}

Response:
{
  "message": "User profile updated successfully",
  "user": { ... }
}
```

#### Admin Endpoints

**5. Get All Users**
```
GET /users/all
Headers: Authorization: Bearer {token}

Response:
{
  "message": "Users retrieved successfully",
  "count": 10,
  "users": [ ... ]
}
```

**6. Get Users by Role**
```
GET /users/role/:role
Headers: Authorization: Bearer {token}

Supported roles: Admin, Player, Field_Owner

Response:
{
  "message": "Players retrieved successfully",
  "count": 5,
  "users": [ ... ]
}
```

**7. Delete User**
```
DELETE /users/delete
Headers: Authorization: Bearer {token}
Body: { "userId": "user_id" }

Response:
{
  "message": "User deleted successfully"
}
```

**8. Deactivate User**
```
PUT /users/deactivate
Headers: Authorization: Bearer {token}
Body: { "userId": "user_id" }

Response:
{
  "message": "User account deactivated successfully",
  "user": { ... }
}
```

---

## Frontend Implementation

### 1. Auth Context (`src/context/AuthContext.jsx`)

Provides authentication state management across the application:

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { 
    user,           // Current user object
    token,          // JWT token
    loading,        // Loading state
    login,          // Login function
    logout,         // Logout function
    updateUser,     // Update user data
    isAuthenticated, // Check if user is logged in
    hasRole         // Check if user has specific role
  } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated() && <p>Welcome {user.firstName}</p>}
    </div>
  );
}
```

### 2. Protected Routes (`src/components/ProtectedRoute.jsx`)

Restrict access to components based on authentication and role:

```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Routes>
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
</Routes>
```

### 3. Components

#### Register Component (`src/routes/Register.jsx`)
- Two-step registration process
- Role selection in Step 1
- Dynamic form fields based on selected role
- Password validation
- Error handling

#### Login Component (`src/routes/Login.jsx`)
- Email and password input
- Remember me option
- Error messages
- Automatic redirect based on user role
- Loading state

#### Dashboard Components
- `PlayerDashboard.jsx` - For players
- `FieldOwnerDashboard.jsx` - For field owners
- `AdminDashboard.jsx` - For administrators

### 4. API Service (`src/api/userAPI.js`)

Centralized API calls for user operations:

```javascript
import { userAPI } from './api/userAPI';

// Register
const result = await userAPI.register(userData);

// Login
const result = await userAPI.login(email, password);

// Get all users (Admin)
const users = await userAPI.getAllUsers(token);

// Get users by role (Admin)
const players = await userAPI.getUsersByRole('Player', token);
```

---

## Integration Steps

### 1. Wrap App with AuthProvider

Update `src/main.jsx`:

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

### 2. Update App.jsx with Routes

```javascript
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './routes/Login';
import Register from './routes/Register';
import PlayerDashboard from './routes/PlayerDashboard';
import FieldOwnerDashboard from './routes/FieldOwnerDashboard';
import AdminDashboard from './routes/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
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
        </Routes>
      </Layout>
    </Router>
  );
};
```

---

## Testing the System

### Test Case 1: Register as Player
1. Go to `/register`
2. Select "Player" role
3. Fill in: firstName, lastName, userID, email, mobile, password
4. Select skillLevel and preferredSports
5. Accept terms and submit
6. Should redirect to `/player-dashboard`

### Test Case 2: Register as Field Owner
1. Go to `/register`
2. Select "Field_Owner" role
3. Fill in basic details
4. Fill in: fieldName, fieldLocation, fieldCapacity, fieldType, pricePerHour
5. Submit
6. Should redirect to `/field-owner-dashboard`

### Test Case 3: Login
1. Go to `/login`
2. Enter email and password
3. Click "Sign in"
4. Should redirect to appropriate dashboard based on role

### Test Case 4: Protected Routes
1. Without login, try accessing `/player-dashboard`
2. Should redirect to `/login`
3. After login as Player, try accessing `/admin-dashboard`
4. Should redirect to home page

---

## Environment Variables

Add to `.env`:
```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your-super-secret-jwt-key-fieldbook-2024
```

---

## Security Considerations

1. **Password Hashing**: Passwords are hashed using bcryptjs with salt rounds = 10
2. **JWT Tokens**: Tokens expire in 30 days
3. **Password Not Returned**: Password is excluded from user responses
4. **Email Validation**: Email must match valid format
5. **Mobile Validation**: Mobile must be 10-15 digits
6. **Unique Constraints**: Email, userID, and mobile must be unique

---

## Future Enhancements

1. Email verification
2. Password reset functionality
3. OAuth integration (Google, Facebook)
4. Two-factor authentication
5. Role-based access control (RBAC) middleware
6. User profile pictures
7. Email notifications
8. Audit logs
9. Session management
10. CORS configuration

---

## Troubleshooting

### Issue: "Cannot find module 'bcryptjs'"
**Solution**: Run `npm install bcryptjs jsonwebtoken` in backend

### Issue: "CORS error"
**Solution**: Ensure CORS is enabled in Express (already configured)

### Issue: "JWT token is invalid"
**Solution**: Check JWT_SECRET matches in .env file

### Issue: "User not found after registration"
**Solution**: Check MongoDB connection and ensure data is being saved

---

## Contact & Support

For issues or questions, please refer to the backend and frontend logs for detailed error messages.
