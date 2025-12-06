# FieldBook Architecture - User Authentication System

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FIELDBOOK APPLICATION                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─ AuthContext.jsx ────────────────────────────────────────────┐   │
│  │  • Global Authentication State                              │   │
│  │  • useAuth() hook                                           │   │
│  │  • login(), logout(), updateUser()                         │   │
│  │  • isAuthenticated(), hasRole()                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▲                                        │
│                              │ provides                               │
│                              │                                        │
│  ┌────────────┬──────────────┴──────────────┬───────────┐             │
│  │            │                             │           │             │
│  ▼            ▼                             ▼           ▼             │
│ Login      Register              ProtectedRoute    Dashboards         │
│ ┌─────┐    ┌────────┐           ┌──────────────┐  ┌─────────────┐   │
│ │      │    │ Step 1 │           │              │  │   Player    │   │
│ │Email │    │ Role   │           │ Checks Auth  │  │ Dashboard   │   │
│ │      │    │        │           │              │  │             │   │
│ │Pass  │    │        │           │ Redirects if │  │ - Profile   │   │
│ │      │    ├────────┤           │   not auth   │  │ - Skills    │   │
│ │      │    │ Step 2 │           │              │  │ - Sports    │   │
│ │      │    │ Fields │           │ Role checks  │  └─────────────┘   │
│ │      │    │        │           │              │  ┌──────────────┐   │
│ │      │    │        │           └──────────────┘  │Field Owner   │   │
│ └─────┘    └────────┘                             │ Dashboard    │   │
│    │           │                                   │              │   │
│    └─────┬─────┘                                   │ - Field Info │   │
│          │                                         │ - Bookings   │   │
│          │ Calls API                               │ - Earnings   │   │
│          │                                         └──────────────┘   │
│          └──────────────────────┐                 ┌──────────────┐   │
│                                 │                 │   Admin      │   │
│  ┌─ userAPI.js ─────────────────▼─────────────┐   │ Dashboard    │   │
│  │  • register(userData)                      │   │              │   │
│  │  • login(email, password)                  │   │ - Users      │   │
│  │  • getProfile(userId, token)               │   │ - Fields     │   │
│  │  • updateProfile(userId, data, token)      │   │ - Analytics  │   │
│  │  • getAllUsers(token) [Admin]              │   └──────────────┘   │
│  │  • getUsersByRole(role, token) [Admin]     │                      │
│  └────────────────────┬────────────────────────┘                      │
│                       │ HTTP Requests                                 │
└───────────────────────┼─────────────────────────────────────────────┘
                        │
        ┌───────────────▼───────────────┐
        │      Express Backend (Port 3000)
        │
        ├────────────────────────────────────┐
        │                                    │
        │  ┌──────────────────────────────┐  │
        │  │  Routes                      │  │
        │  │  /users/register       [POST]│  │
        │  │  /users/login          [POST]│  │
        │  │  /users/profile        [GET] │  │
        │  │  /users/profile/update [PUT] │  │
        │  │  /users/all            [GET] │  │  (Admin)
        │  │  /users/role/:role     [GET] │  │  (Admin)
        │  │  /users/delete        [DELETE]  │  (Admin)
        │  │  /users/deactivate     [PUT] │  │  (Admin)
        │  └──────────────────────────────┘  │
        │           ▲                         │
        │           │                         │
        │  ┌────────┴──────────────┐         │
        │  │                       │         │
        │  ▼                       ▼         │
        │ Controllers          Middleware    │
        │ ┌──────────────┐    ┌──────────┐  │
        │ │registerUser()│    │JWT Auth  │  │
        │ │loginUser()   │    │CORS      │  │
        │ │getProfile()  │    └──────────┘  │
        │ │updateProfile()                   │
        │ │getAllUsers() │                   │
        │ │getUsersByRole()                  │
        │ │deleteUser()  │                   │
        │ │deactivateUser()                  │
        │ └──────────────┘                   │
        │        ▲                           │
        │        │ uses                      │
        │        ▼                           │
        │  ┌──────────────────┐             │
        │  │  User Model      │             │
        │  │  ┌────────────┐  │             │
        │  │  │ _id        │  │             │
        │  │  │ userID     │  │             │
        │  │  │ firstName  │  │             │
        │  │  │ lastName   │  │             │
        │  │  │ email      │  │             │
        │  │  │ mobile     │  │             │
        │  │  │ password   │  │             │
        │  │  │ role       │  │             │
        │  │  │ isActive   │  │             │
        │  │  │ timestamps │  │             │
        │  │  │            │  │             │
        │  │  │ Role-Specific Fields:      │  │
        │  │  │ - Player: skillLevel,     │  │
        │  │  │           preferredSports  │  │
        │  │  │ - Field Owner:  fieldName  │  │
        │  │  │                 fieldType  │  │
        │  │  │                 priceHour  │  │
        │  │  └────────────┘  │             │
        │  └──────────────────┘             │
        │           ▲                       │
        │           │                       │
        │           ▼                       │
        │   ┌──────────────┐               │
        │   │   MongoDB    │               │
        │   │   Database   │               │
        │   └──────────────┘               │
        └────────────────────────────────────┘
```

---

## Data Flow Diagram

### Registration Flow
```
User fills Register Form
    │
    ▼
Select Role (Player/Field_Owner/Admin)
    │
    ▼
Fill Role-Specific Fields
    │
    ▼
POST /users/register
    │
    ▼
Backend Validation
    │
    ├─ Check required fields
    ├─ Check unique constraints (email, userID, mobile)
    ├─ Match passwords
    └─ Validate formats
    │
    ▼
Hash Password (bcryptjs)
    │
    ▼
Create User in MongoDB
    │
    ▼
Generate JWT Token
    │
    ▼
Return {token, user}
    │
    ▼
Frontend Stores in localStorage
    │
    ├─ localStorage.setItem('token')
    └─ localStorage.setItem('user')
    │
    ▼
Redirect to Dashboard
    ├─ Player → /player-dashboard
    ├─ Field_Owner → /field-owner-dashboard
    └─ Admin → /admin-dashboard
```

### Login Flow
```
User enters Email & Password
    │
    ▼
POST /users/login
    │
    ▼
Find User by Email
    │
    ├─ User not found → Error
    └─ User found → Continue
    │
    ▼
Compare Password (bcryptjs)
    │
    ├─ Password wrong → Error
    └─ Password correct → Continue
    │
    ▼
Check if Account Active
    │
    ├─ Inactive → Error
    └─ Active → Continue
    │
    ▼
Generate JWT Token
    │
    ▼
Return {token, user}
    │
    ▼
Frontend Stores in localStorage
    │
    ▼
Redirect to Dashboard based on Role
```

### Protected Route Flow
```
User tries to access /player-dashboard
    │
    ▼
ProtectedRoute Component Checks:
    │
    ├─ Is page loading? → Show spinner
    ├─ Is user authenticated? 
    │  ├─ No → Redirect to /login
    │  └─ Yes → Continue
    │
    └─ Does user have required role?
       ├─ No → Redirect to /
       └─ Yes → Render component
```

---

## State Management Flow

```
AuthContext
├── user (state)
│   └── Contains: _id, firstName, lastName, email, role, etc.
│
├── token (state)
│   └── Contains: JWT token string
│
├── loading (state)
│   └── Indicates if auth check is in progress
│
├── login(userData, token) (function)
│   ├── setUser(userData)
│   ├── setToken(token)
│   └── Save to localStorage
│
├── logout() (function)
│   ├── setUser(null)
│   ├── setToken(null)
│   └── Clear localStorage
│
├── updateUser(userData) (function)
│   ├── setUser(userData)
│   └── Update localStorage
│
├── isAuthenticated() (function)
│   └── Returns: token !== null && user !== null
│
└── hasRole(roleString) (function)
    └── Returns: user.role === roleString
```

---

## User Roles & Permissions

```
┌─────────────────────────────────────────────────────┐
│                    ROLE HIERARCHY                     │
└─────────────────────────────────────────────────────┘

ADMIN
├── View All Users
├── Manage Users (Create, Read, Update, Delete)
├── Deactivate User Accounts
├── View All Fields
├── View All Bookings
├── System Analytics & Reports
└── Dashboard: /admin-dashboard

FIELD_OWNER
├── Create Field Profile
├── Edit Field Details
├── View Own Field Bookings
├── Manage Bookings
├── View Earnings
├── Upload Field Photos
├── Set Field Availability
└── Dashboard: /field-owner-dashboard

PLAYER
├── View Own Profile
├── Edit Profile (Bio, Skills, Preferences)
├── Browse Available Fields
├── Make Bookings
├── View Own Bookings
├── Rate & Review Fields
├── Find Playing Partners
└── Dashboard: /player-dashboard
```

---

## Authentication Security

```
┌─ Password Security ──────────────────────────────┐
│                                                   │
│ Registration:                                     │
│ 1. User enters password                          │
│ 2. Validate: min 6 characters                    │
│ 3. Hash with bcryptjs (10 salt rounds)           │
│ 4. Store hashed version in DB                    │
│ 5. Never return password in responses            │
│                                                   │
│ Login:                                            │
│ 1. User enters password                          │
│ 2. Find user by email                            │
│ 3. Compare entered password with hash            │
│ 4. Match → Issue JWT token                       │
│ 5. No match → Return error                       │
│                                                   │
└─────────────────────────────────────────────────┘

┌─ Token Security ──────────────────────────────────┐
│                                                   │
│ Generation:                                       │
│ JWT.sign({ id: user._id }, JWT_SECRET, {        │
│   expiresIn: '30d'                              │
│ })                                               │
│                                                   │
│ Storage:                                          │
│ localStorage.setItem('token', token)            │
│                                                   │
│ Usage:                                            │
│ Authorization: Bearer {token}                   │
│                                                   │
│ Validation:                                       │
│ JWT.verify(token, JWT_SECRET)                   │
│                                                   │
│ Expiry:                                           │
│ 30 days from creation                           │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## File Organization

```
FieldBook/
├── backend/
│   ├── models/
│   │   └── user.model.js           (245 lines)
│   ├── controllers/
│   │   └── user.controller.js      (260 lines)
│   ├── routes/
│   │   └── user.route.js           (25 lines)
│   ├── lib/
│   │   └── connectDB.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── client/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx     (60 lines)
│       ├── components/
│       │   └── ProtectedRoute.jsx  (35 lines)
│       ├── routes/
│       │   ├── Login.jsx           (140 lines)
│       │   ├── Register.jsx        (300 lines)
│       │   ├── PlayerDashboard.jsx      (110 lines)
│       │   ├── FieldOwnerDashboard.jsx  (140 lines)
│       │   └── AdminDashboard.jsx       (130 lines)
│       ├── api/
│       │   └── userAPI.js          (85 lines)
│       └── App.jsx
│
└── Documentation/
    ├── AUTH_SYSTEM_DOCUMENTATION.md
    ├── SETUP_GUIDE.md
    ├── QUICK_REFERENCE.md
    ├── IMPLEMENTATION_SUMMARY.md
    └── ARCHITECTURE.md (this file)
```

---

## Technology Stack

```
Backend:
├── Node.js (Runtime)
├── Express.js (Web Framework)
├── MongoDB (Database)
├── Mongoose (ODM)
├── bcryptjs (Password Hashing)
├── jsonwebtoken (JWT)
└── CORS (Cross-Origin)

Frontend:
├── React (UI Framework)
├── React Router DOM (Routing)
├── Tailwind CSS (Styling)
├── Context API (State Management)
└── Fetch API (HTTP Requests)

Development:
├── Vite (Build Tool)
├── ESLint (Linting)
└── Tailwind CSS PostCSS (Processing)
```

---

## API Response Examples

### Success Response
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "userID": "john_doe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "Player",
    "skillLevel": "Intermediate",
    "preferredSports": ["Football", "Cricket"],
    "isActive": true,
    "isVerified": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Error Response
```json
{
  "message": "Invalid email or password"
}
```

---

## Performance Considerations

```
Frontend:
✓ Token stored in localStorage for persistence
✓ Auth state cached in Context API
✓ Protected routes prevent unauthorized access
✓ Loading states prevent UI jumping
✓ Tailwind CSS (utility-first, minimal CSS)

Backend:
✓ Password hashing with appropriate salt rounds
✓ Database indexes on email, userID, mobile
✓ JWT tokens with expiration
✓ Input validation on all endpoints
✓ CORS configured for security
```

---

## Deployment Checklist

```
Before Production:
☐ Change JWT_SECRET to strong random value
☐ Update API_BASE_URL in frontend
☐ Enable HTTPS only
☐ Set secure cookie flags
☐ Implement rate limiting
☐ Set up email verification
☐ Enable password reset
☐ Configure CORS for production domain
☐ Set up MongoDB backups
☐ Enable request logging
☐ Set up error monitoring
☐ Test all flows
```

---

*This architecture document provides a comprehensive overview of the FieldBook authentication system implementation.*
