import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  confirmBooking,
  rejectBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Get all bookings (admin) - MUST be before /:id routes
router.get("/all", getAllBookings);

// Create a new booking
router.post("/", createBooking);

// Get user's bookings
router.get("/", getUserBookings);

// Confirm a booking (Admin only)
router.patch("/:id/confirm", confirmBooking);

// Reject a booking (Admin only)
router.patch("/:id/reject", rejectBooking);

// Cancel a booking
router.patch("/:id/cancel", cancelBooking);

export default router;
