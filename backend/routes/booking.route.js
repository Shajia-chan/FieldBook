import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  confirmBooking,
  rejectBooking,
  getBookingStats,
  addReview,
  getFieldReviews,
  requestRefund,
  getRefundRequests,
  processRefundRequest,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Get all bookings (admin) - MUST be before /:id routes
router.get("/all", getAllBookings);
router.get("/stats", getBookingStats);

// Get reviews for a field
router.get("/field/:fieldId/reviews", getFieldReviews);

// Get refund requests (Admin only)
router.get("/refund-requests", getRefundRequests);

// Create a new booking
router.post("/", createBooking);

// Get user's bookings
router.get("/", getUserBookings);

// Confirm a booking (Admin only)
router.patch("/:id/confirm", confirmBooking);

// Reject a booking (Admin only)
router.patch("/:id/reject", rejectBooking);

// Add review to a booking
router.patch("/:id/review", addReview);

// Request refund for a booking
router.post("/:id/refund", requestRefund);

// Process refund request (Admin only)
router.patch("/:id/process-refund", processRefundRequest);

// Cancel a booking
router.patch("/:id/cancel", cancelBooking);

export default router;
