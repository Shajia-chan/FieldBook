# Pending Booking Status & Admin Confirmation Feature

## Overview
The field booking system has been enhanced with a pending booking status workflow and a comprehensive admin panel for confirming or rejecting bookings.

## How It Works

### 1. User Booking Flow
When a player books a field:
- **Status**: Set to "pending" (not "confirmed" immediately)
- **Order ID**: A unique order ID (e.g., `ORD-ABC123-XYZ789`) is automatically generated
- **Message**: User receives a message "Booking created successfully. Awaiting admin confirmation."

### 2. Admin Panel
Admins can access the booking management panel at `/admin-bookings` from the Admin Dashboard.

#### Features:
- **View All Bookings**: Display all bookings in a table format
- **Filter by Status**: 
  - Pending (orders waiting for approval)
  - Confirmed (approved orders)
  - Cancelled (rejected orders)
  - All (shows all bookings)
- **Confirm Booking**: Click "Confirm" to approve a pending booking
- **Reject Booking**: Click "Reject" to decline a booking with an optional reason
- **Booking Details**: See order ID, player info, field info, date, time, number of players, price

#### Admin Panel Table Columns:
1. **Order ID** - Unique identifier (e.g., ORD-ABC-XYZ)
2. **Player** - Name and email of the player
3. **Field** - Field name and location
4. **Date** - Booking date
5. **Time** - Time slot (e.g., 08:00-09:30)
6. **Players** - Number of players
7. **Price** - Total booking price
8. **Status** - Color-coded badge (yellow=pending, green=confirmed, red=cancelled)
9. **Actions** - Confirm/Reject buttons (visible only for pending bookings)

### 3. Player View
Players can see their bookings with:
- Order ID displayed prominently
- Status badge showing current status (pending, confirmed, or cancelled)
- All booking details

## Backend Changes

### Booking Model (`booking.model.js`)
```javascript
orderId: {
  type: String,
  unique: true,
  required: true,
  index: true,
}
```

### Booking Controller (`booking.controller.js`)
**New Functions:**
- `generateOrderId()` - Creates unique order IDs
- `confirmBooking(id)` - Admin endpoint to confirm pending bookings
- `rejectBooking(id)` - Admin endpoint to reject bookings with reason

**Updated Functions:**
- `createBooking()` - Now generates orderId and sets status to "pending"

### Booking Routes (`booking.route.js`)
**New Endpoints:**
- `PATCH /bookings/:id/confirm` - Confirm a booking (admin)
- `PATCH /bookings/:id/reject` - Reject a booking (admin)

## Frontend Changes

### New Component: AdminBookingPanel
- **Path**: `/client/src/routes/AdminBookingPanel.jsx`
- **Route**: `/admin-bookings`
- **Access**: Admin role only
- **Features**:
  - Table view of all bookings
  - Filter by status (pending, confirmed, cancelled, all)
  - Confirm/Reject actions with modal
  - Success/error notifications
  - Real-time status updates

### Updated Components:
- **App.jsx** - Added route for AdminBookingPanel
- **AdminDashboard.jsx** - Added "Manage Bookings" button linking to `/admin-bookings`
- **Bookings.jsx** - Updated to display order ID for players

## Order ID Format
Order IDs are generated with the following format:
```
ORD-{timestamp}-{randomString}
```
Example: `ORD-ABC123-XYZ789`

**Characteristics:**
- Unique for every booking
- Indexed in database for fast lookup
- Human-readable format
- Includes timestamp component for sequencing

## Status Flow

```
Player Books → Status: PENDING (awaiting admin review)
                    ↓
            Admin Reviews
                    ↓
              Confirm → Status: CONFIRMED
              OR Reject → Status: CANCELLED (with reason)
```

## Database Changes
- All new bookings will have an `orderId` field
- Existing bookings without orderId should be handled gracefully (they're in confirmed state already)
- All bookings now have a status field (pending, confirmed, or cancelled)

## How to Use

### For Players:
1. Click "Book Field" on available field
2. Select date and time slot
3. Confirm booking
4. Status will show "Pending" until admin approves
5. Go to "My Bookings" or "View Bookings" to see order ID and status

### For Admin:
1. Go to Admin Dashboard
2. Click "Manage Bookings" button
3. View all pending bookings
4. Click "Confirm" to approve or "Reject" to decline
5. Use filter buttons to view specific status bookings

## API Endpoints Summary

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /bookings | Create booking | Player |
| GET | /bookings | Get user's bookings | Player |
| GET | /bookings/all | Get all bookings | Admin |
| PATCH | /bookings/:id/confirm | Confirm booking | Admin |
| PATCH | /bookings/:id/reject | Reject booking | Admin |
| PATCH | /bookings/:id/cancel | Cancel booking | Player |

## Next Steps (Optional)
- Add email notifications when booking status changes
- Add payment integration before confirmation
- Add booking cancellation reasons from players
- Add revenue reports in admin panel
