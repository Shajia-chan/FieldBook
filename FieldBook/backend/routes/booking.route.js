import express from "express";
import {
  createBooking,
  getAllBookings,
  getAvailableSlots,
  cancelBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Create a new booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getAllBookings);

// Get available time slots for a specific date
router.get("/available-slots", getAvailableSlots);

// Cancel a booking
router.patch("/:id/cancel", cancelBooking);

export default router;
