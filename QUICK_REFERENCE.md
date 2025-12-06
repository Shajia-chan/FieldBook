# FieldBook Authentication - Quick Reference

## User Registration Data Structure

```javascript
// Player User Example
{
  userID: "john_player",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  mobile: "9876543210",
  password: "HashedPassword123",
  role: "Player",
  
  // Player Fields
  skillLevel: "Intermediate",
  preferredSports: ["Football", "Cricket"],
  
  // Account Status
  isActive: true,
  isVerified: false
}

// Field Owner User Example
{
  userID: "premier_arena",
  firstName: "Mr.",
  lastName: "Owner",
  email: "owner@example.com",
  mobile: "9876543210",
  password: "HashedPassword123",
  role: "Field_Owner",
  
  // Field Owner Fields
  fieldName: "Premier Football Arena",
  fieldLocation: "Downtown City",
  fieldCapacity: 22,
  fieldType: "Football",
  pricePerHour: 500,
  
  // Account Status
  isActive: true,
  isVerified: false
}

// Admin User Example
{
  userID: "admin_user",
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  mobile: "9876543210",
  password: "HashedPassword123",
  role: "Admin",
  
  // Account Status
  isActive: true,
  isVerified: true
}
```

## API Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register new user |
| POST | `/users/login` | User login |
| GET | `/users/profile` | Get user profile |
| PUT | `/users/profile/update` | Update profile |
| GET | `/users/all` | Get all users (Admin) |
| GET | `/users/role/:role` | Get users by role (Admin) |
| DELETE | `/users/delete` | Delete user (Admin) |
| PUT | `/users/deactivate` | Deactivate account (Admin) |

## React Hooks

```javascript
// Using Auth Context
import { useAuth } from './context/AuthContext';

const { 
  user,              // { _id, firstName, lastName, email, role, ... }
  token,             // JWT token string
  loading,           // Boolean
  login,             // (userData, token) => void
  logout,            // () => void
  updateUser,        // (userData) => void
  isAuthenticated,   // () => boolean
  hasRole            // (roleString) => boolean
} = useAuth();
```

## Response Examples

### Successful Registration
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "userID": "john_player",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "Player",
    "skillLevel": "Intermediate",
    "isActive": true,
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Successful Login
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "userID": "john_player",
    "firstName": "John",
    "email": "john@example.com",
    "role": "Player",
    "isActive": true,
    "isVerified": false
  }
}
```

### Error Response
```json
{
  "message": "Invalid email or password"
}
```

## Role Constants

```javascript
const ROLES = {
  ADMIN: 'Admin',
  PLAYER: 'Player',
  FIELD_OWNER: 'Field_Owner'
};

const SKILL_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};

const FIELD_TYPES = {
  FOOTBALL: 'Football',
  CRICKET: 'Cricket',
  BADMINTON: 'Badminton',
  BASKETBALL: 'Basketball',
  VOLLEYBALL: 'Volleyball'
};
```

## Component Usage Examples

### Login Component
```javascript
import Login from './routes/Login';

// In your router
<Route path="/login" element={<Login />} />
```

### Register Component
```javascript
import Register from './routes/Register';

// In your router
<Route path="/register" element={<Register />} />
```

### Protected Routes
```javascript
import ProtectedRoute from './components/ProtectedRoute';
import PlayerDashboard from './routes/PlayerDashboard';

// In your router
<Route 
  path="/player-dashboard" 
  element={
    <ProtectedRoute requiredRole="Player">
      <PlayerDashboard />
    </ProtectedRoute>
  } 
/>
```

### Using Auth in Components
```javascript
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (hasRole('Admin')) {
    return <div>Admin Panel</div>;
  }
  
  return (
    <div>
      <p>Welcome {user?.firstName}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

## Validation Rules

### Email
- Must be valid email format
- Must be unique
- Case-insensitive

### Mobile
- 10-15 digits
- Must be unique

### Password
- Minimum 6 characters
- Hashed with bcryptjs (salt rounds: 10)
- Never returned in responses

### Username (userID)
- Lowercase
- Trimmed
- Unique
- No spaces

## Storage

### LocalStorage Keys
```javascript
localStorage.getItem('token')      // JWT token
localStorage.getItem('user')       // User object (stringified)
```

### Token Expiry
- 30 days from creation
- Stored in JWT payload

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Cannot POST /users/register | Routes not imported | Import user routes in index.js |
| CORS error | Cross-origin issue | CORS already enabled |
| Invalid token | Expired or malformed | Re-login to get new token |
| User not found | User doesn't exist | Check email, register first |
| Passwords don't match | Confirm password differs | Ensure both fields match |

## Deployment Checklist

- [ ] Set strong JWT_SECRET in .env
- [ ] Update API_BASE_URL for production
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add email verification
- [ ] Set password requirements
- [ ] Enable logging
- [ ] Configure CORS for production domain
- [ ] Set up database backups
