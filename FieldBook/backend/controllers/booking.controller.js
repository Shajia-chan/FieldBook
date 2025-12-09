import Booking from "../models/booking.model.js";
import Field from "../models/field.model.js";
import User from "../models/user.model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { field, bookingDate, timeSlot, numberOfPlayers, totalPrice } = req.body;
    const userId = req.headers.userid || req.body.userId;

    // Validate required fields
    if (!field || !bookingDate || !timeSlot || !numberOfPlayers || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    // Check if field exists
    const fieldData = await Field.findById(field);
    if (!fieldData) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    // Check if the time slot is already booked
    const searchDate = new Date(bookingDate);
    searchDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingBooking = await Booking.findOne({
      field,
      bookingDate: {
        $gte: searchDate,
        $lt: nextDay
      },
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // Create new booking
    const booking = await Booking.create({
      field,
      player: userId,
      bookingDate: searchDate,
      timeSlot,
      numberOfPlayers,
      totalPrice,
      status: "confirmed",
    });

    // Populate field and player information
    await booking.populate('field', 'fieldName fieldLocation fieldType pricePerHour');
    await booking.populate('player', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.headers.userid || req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const bookings = await Booking.find({ player: userId })
      .populate('field', 'fieldName fieldLocation fieldType pricePerHour')
      .populate('player', 'firstName lastName email')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('field', 'fieldName fieldLocation fieldType pricePerHour')
      .populate('player', 'firstName lastName email')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.userid || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns the booking
    if (booking.player.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
