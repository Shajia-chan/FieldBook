import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Create a new booking
router.post("/", createBooking);

// Get all bookings (admin)
router.get("/all", getAllBookings);

// Get user's bookings
router.get("/", getUserBookings);

// Cancel a booking
router.patch("/:id/cancel", cancelBooking);

export default router;
