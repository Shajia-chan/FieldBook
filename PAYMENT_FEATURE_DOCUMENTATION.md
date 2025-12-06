# Payment Status Feature Documentation

## Overview
This document outlines the new payment status feature added to the FieldBook application. The feature allows users to submit payments for confirmed bookings using mobile payment methods (bKash or Nagad), and admin/staff users to verify and approve these payments.

## Features Implemented

### 1. **Payment Status States**
- **UNPAID**: Initial state when a booking is confirmed
- **PAID**: Status after admin verifies the transaction
- **FAILED**: Status when payment verification is rejected

### 2. **User-Side Features**

#### Payment Modal Component (`PaymentModal.jsx`)
- Displays booking details and total amount
- Allows users to select payment method (bKash or Nagad)
- Requires transaction ID input
- Shows clear validation messages
- Displays transaction ID before submission

#### Bookings Component Updates (`Bookings.jsx`)
- Shows payment status badge for each booking
- Displays transaction ID and payment method (if submitted)
- Shows payment button only for confirmed bookings with unpaid status
- Color-coded payment status badges:
  - Orange: Unpaid
  - Green: Paid
  - Red: Failed

#### Payment Submission Flow
1. User clicks "Make Payment" button on a confirmed booking
2. Payment Modal opens showing booking details
3. User selects payment method (bKash/Nagad)
4. User enters transaction ID from payment receipt
5. System submits payment information to backend
6. Payment is stored with "unpaid" status (awaiting admin verification)
7. User receives confirmation message

### 3. **Admin-Side Features**

#### Payment Verification Panel (`PaymentVerificationPanel.jsx`)
- View all pending payments awaiting verification
- Filter by payment status: All Pending, Unpaid, Verified, Rejected
- Display comprehensive payment information:
  - Order ID
  - Booking details (date, time, field, location)
  - Player information
  - Payment method and transaction ID
  - Amount
  - Player contact information

#### Payment Verification Process
1. Admin navigates to Payment Verification panel from Admin Dashboard
2. System displays all bookings with submitted payment information
3. Admin reviews transaction ID and verifies with payment provider
4. Admin can:
   - **Approve Payment**: Marks booking as "PAID" and records verification
   - **Reject Payment**: Marks booking as "FAILED" and clears transaction details
5. Verification is recorded with timestamp and verifying admin's name

### 4. **Database Schema Updates**

#### Booking Model Updates
```javascript
paymentStatus: {
  type: String,
  enum: ["unpaid", "paid", "failed"],
  default: "unpaid",
}
paymentMethod: {
  type: String,
  enum: ["bkash", "nagad", null],
  default: null,
}
transactionId: {
  type: String,
  default: null,
}
paymentVerifiedAt: {
  type: Date,
  default: null,
}
verifiedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
}
```

## API Endpoints

### Submit Payment
**Endpoint**: `POST /bookings/submit-payment`

**Request Body**:
```json
{
  "bookingId": "booking_object_id",
  "orderId": "ORD-XXXXX",
  "paymentMethod": "bkash" | "nagad",
  "transactionId": "TXN1234567890"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment submitted successfully. Waiting for admin verification.",
  "booking": { ...booking object }
}
```

**Validation**:
- All fields required
- User must own the booking
- Booking status must be "confirmed"
- Payment method must be bkash or nagad

### Verify Payment (Admin/Staff Only)
**Endpoint**: `POST /bookings/verify-payment`

**Request Body**:
```json
{
  "bookingId": "booking_object_id",
  "verified": true | false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "booking": { ...booking object with updated payment status }
}
```

**Validation**:
- User must have admin or staff role
- Booking must exist
- All required fields present

## User Workflows

### For Players
1. **Make Booking** → Booking is confirmed by admin
2. **Navigate to Bookings Page** → View confirmed booking
3. **Click "Make Payment" Button** → Payment Modal opens
4. **Select Payment Method** → Choose bKash or Nagad
5. **Enter Transaction ID** → Copy from payment receipt
6. **Submit** → System sends to admin for verification
7. **Wait for Verification** → Admin approves/rejects payment
8. **Payment Status Updates** → Status changes to PAID or FAILED

### For Admin/Staff
1. **Navigate to Admin Dashboard** → Click "Payment Verification" button
2. **Filter Payments** → View unpaid, paid, or failed payments
3. **Review Payment Details** → Check transaction ID and booking info
4. **Verify with Payment Provider** → Confirm transaction exists
5. **Approve or Reject** → Update payment status
6. **Record Verification** → System records timestamp and admin name

## Route Configuration

### New Routes Added to App.jsx
- `/admin-payments` - Payment verification panel (Admin/Staff only)

### Updated Routes
- `/bookings` - Shows payment status and payment button

## Security Considerations

1. **User Authorization**
   - Users can only submit payment for their own bookings
   - Only admin/staff can verify payments

2. **Payment Method Validation**
   - Only bKash and Nagad payment methods allowed
   - Transaction ID is required and stored

3. **Booking Status Validation**
   - Payment can only be submitted for confirmed bookings
   - Payment confirmation doesn't change booking status

4. **Admin Verification**
   - Payment approval is recorded with admin details
   - Failed payments clear transaction information for re-submission

## Frontend Components

### PaymentModal.jsx
- Reusable modal component
- Handles payment method selection
- Validates transaction ID
- Shows booking details
- Displays amount in Taka (৳)

### PaymentVerificationPanel.jsx
- Full-page admin panel
- Displays pending payments
- Filter functionality
- Verification confirmation modal
- Shows payment history

### Bookings.jsx (Updated)
- Displays payment status badges
- Shows payment button for unpaid confirmed bookings
- Displays transaction details
- Integrates PaymentModal component

## Testing Checklist

- [ ] User can submit payment for confirmed booking
- [ ] Payment Modal opens with correct booking details
- [ ] Transaction ID is required and validated
- [ ] Payment status updates to "unpaid" after submission
- [ ] Admin can see pending payments in Payment Verification panel
- [ ] Admin can approve payment and status changes to "paid"
- [ ] Admin can reject payment and clear transaction details
- [ ] Payment approval is recorded with admin details
- [ ] Filters work correctly in Payment Verification panel
- [ ] User cannot submit payment for non-confirmed bookings
- [ ] User cannot submit payment for cancelled bookings
- [ ] Admin cannot verify payment if not admin/staff role
- [ ] Transaction ID is displayed correctly in payment card
- [ ] Payment method is displayed in booking details
- [ ] Verification timestamp is displayed correctly

## Future Enhancements

1. **Automated Payment Verification**
   - Integration with actual payment provider APIs
   - Real-time transaction verification

2. **Email Notifications**
   - Notify users when payment is verified
   - Notify admin when payment is submitted

3. **Payment History Report**
   - Generate payment reports
   - Track payment verification timeline

4. **Multiple Payment Methods**
   - Add credit card support
   - Add PayPal integration
   - Add bank transfer option

5. **Refund Processing**
   - Handle refunds for cancelled bookings
   - Track refund status

6. **Payment Analytics**
   - Payment success rate dashboard
   - Revenue tracking by payment method
   - Payment verification time analysis
