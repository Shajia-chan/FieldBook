# Payment Feature - Quick Reference Guide

## 📋 Overview
The payment feature allows players to submit payments for confirmed bookings using mobile payment methods (bKash or Nagad), and allows admin/staff to verify and approve these payments.

## 🎯 Quick Start

### For Players

#### Step 1: Book a Field
- Navigate to "Available Fields"
- Select a field and click "Book Field"
- Submit your booking
- Wait for admin confirmation

#### Step 2: Make Payment (After Booking is Confirmed)
1. Go to "View Bookings" (or navigate from your dashboard)
2. Find your confirmed booking
3. Click the **"💳 Make Payment"** button
4. In the modal that appears:
   - Select payment method: **bKash** or **Nagad**
   - Enter your **Transaction ID** (copy from receipt)
   - Click **"Submit Payment"**

#### Step 3: Wait for Verification
- Payment status will show as "UNPAID"
- Admin will review and verify your transaction
- Status will change to "PAID" or "FAILED"

---

### For Admin/Staff

#### Step 1: Access Payment Verification
1. Go to **Admin Dashboard**
2. Click **"💳 Payment Verification"** button
3. You'll see all pending payments

#### Step 2: Review Payment
- Check the **Transaction ID** against payment provider records
- Review booking and player details
- Confirm the amount matches

#### Step 3: Approve or Reject
- **To Approve**: Click **"✅ Verify & Approve"** button
- **To Reject**: Click **"❌ Reject"** button
- Confirm your action in the modal

#### Step 4: Verification Complete
- Payment status updates to "PAID" or "FAILED"
- Your name and timestamp are recorded
- Player can see verification status in their bookings

---

## 🔄 Payment Status Flow

```
Booking Confirmed
        ↓
    (unpaid)
        ↓
   Player Submits Payment
   with Transaction ID
        ↓
    (unpaid - awaiting verification)
        ↓
    Admin Reviews & Verifies
        ↓
     ✅ PAID  OR  ❌ FAILED
```

---

## 💡 Key Features

### Payment Methods Supported
- **bKash**: Mobile financial service in Bangladesh
- **Nagad**: Mobile payment and financial service

### Payment Status Badges
| Status | Color | Meaning |
|--------|-------|---------|
| UNPAID | 🟠 Orange | Payment submitted, awaiting verification |
| PAID | 🟢 Green | Payment verified and approved |
| FAILED | 🔴 Red | Payment rejected or verification failed |

### Filter Options (Admin Panel)
- **All Pending**: All payments awaiting or processed
- **Unpaid**: Payments awaiting admin verification
- **Verified**: Successfully verified payments
- **Rejected**: Failed or rejected payments

---

## 📊 Payment Information Displayed

### For Players (Bookings Page)
- ✅ Booking status
- 💳 Payment status
- 🕐 Time slot
- 📍 Location
- 💰 Total price
- 🔐 Transaction ID (if submitted)

### For Admin (Payment Verification Panel)
- 📋 Order ID
- 👤 Player name and contact info
- ⚽ Field name and location
- 🕐 Booking date and time
- 💰 Total amount
- 💳 Payment method
- 🔐 Transaction ID (verified format)
- 📅 Submission timestamp
- ✅ Verification status and admin name

---

## ⚠️ Important Notes

1. **Payment can only be submitted for confirmed bookings**
   - Booking status must be "CONFIRMED"
   - Cannot submit payment for pending or cancelled bookings

2. **Transaction ID is required**
   - Copy exactly from your payment receipt
   - Used by admin to verify payment

3. **Admin must verify with payment provider**
   - Admin should check transaction ID with bKash/Nagad
   - Only then approve the payment

4. **Payment status is independent of booking status**
   - Booking can be confirmed but payment unpaid
   - Payment doesn't automatically confirm booking

5. **Once payment is approved, it cannot be changed by player**
   - Only admin can modify payment status
   - Contact admin if there's an issue

---

## 🔗 Navigation

### Player Navigation
- View Bookings → Click "Make Payment" → Select Method → Enter Transaction ID

### Admin Navigation
- Admin Dashboard → Click "💳 Payment Verification" → Review & Verify

---

## 🎨 UI Components

### PaymentModal
- Used by players to submit payment information
- Shows booking details and total amount
- Requires transaction ID entry
- Validates input before submission

### PaymentVerificationPanel
- Full-page admin panel
- Lists all payments awaiting verification
- Includes comprehensive booking and player information
- Provides approve/reject functionality

### Booking Cards (Updated)
- Show both booking status and payment status
- Display payment button for unpaid confirmed bookings
- Show transaction details in expandable card

---

## ❓ Troubleshooting

### Issue: Payment button not appearing
**Solution**: 
- Booking must be in "CONFIRMED" status
- Payment status must be "UNPAID"
- Try refreshing the page

### Issue: Cannot see payment submissions
**Solution**:
- Must be logged in as Admin or Staff
- Navigate to Admin Dashboard → Payment Verification
- Ensure bookings have payment information submitted

### Issue: Transaction ID not accepted
**Solution**:
- Enter transaction ID exactly as shown in receipt
- Ensure no leading/trailing spaces
- Check payment method is correct

---

## 📞 Support Information

For issues with the payment feature:
1. Check the Payment Feature Documentation
2. Contact admin/staff for verification issues
3. Verify transaction ID with payment provider

---

## 🚀 Best Practices

1. **For Players**
   - Keep payment receipt safe
   - Copy transaction ID carefully
   - Wait for admin verification before following up
   - Check payment status regularly

2. **For Admin**
   - Verify transaction ID with payment provider before approving
   - Record any notes about payment verification
   - Process payments in order
   - Notify player if payment is rejected

---

Last Updated: December 18, 2025
Version: 1.0
