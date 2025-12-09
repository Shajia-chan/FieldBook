import Booking from "../models/booking.model.js";
import Field from "../models/field.model.js";
import User from "../models/user.model.js";

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  const extra = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${randomStr}-${extra}`.toUpperCase();
};

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

    // Generate unique order ID
    const orderId = generateOrderId();

    console.log('Creating booking with status: pending');

    // Create new booking with pending status
    const bookingData = {
      orderId,
      field,
      player: userId,
      bookingDate: searchDate,
      timeSlot,
      numberOfPlayers,
      totalPrice,
      status: "pending",
    };
    
    console.log('=== BOOKING CREATION ===');
    console.log('Booking data BEFORE save:', bookingData);

    const booking = await Booking.create(bookingData);

    console.log('Booking data AFTER create (in memory):', {
      _id: booking._id,
      status: booking.status,
      statusType: typeof booking.status,
    });

    // Refetch from database to verify
    const verifyBooking = await Booking.findById(booking._id);
    console.log('Booking data AFTER findById (from DB):', {
      _id: verifyBooking._id,
      status: verifyBooking.status,
      statusType: typeof verifyBooking.status,
    });

    // Check raw MongoDB document
    const rawDoc = await Booking.collection.findOne({ _id: booking._id });
    console.log('Raw MongoDB document status field:', rawDoc?.status);
    console.log('=== END BOOKING CREATION ===');

    console.log('New booking created:', {
      orderId: booking.orderId,
      status: booking.status,
      field: booking.field,
      player: booking.player,
    });

    // Populate field and player information
    await booking.populate('field', 'fieldName fieldLocation fieldType pricePerHour');
    await booking.populate('player', 'firstName lastName email');

    console.log('Before sending response - booking status:', booking.status);
    console.log('Booking object to send:', {
      _id: booking._id,
      orderId: booking.orderId,
      status: booking.status,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
    });

    // Convert to plain object to ensure no Mongoose getters/setters interfere
    const bookingPlain = booking.toObject();
    console.log('Booking as plain object:', {
      _id: bookingPlain._id,
      orderId: bookingPlain.orderId,
      status: bookingPlain.status,
      statusType: typeof bookingPlain.status,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully. Awaiting admin confirmation.",
      booking: bookingPlain,
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
      .sort({ createdAt: -1 });

    // Debug each booking
    bookings.forEach((b, index) => {
      console.log(`Booking ${index}:`, {
        orderId: b.orderId,
        status: b.status,
        statusType: typeof b.status,
        timeSlot: b.timeSlot,
        createdAt: b.createdAt,
      });
    });

    console.log(`Fetched ${bookings.length} bookings for user ${userId}:`, 
      bookings.map(b => ({ orderId: b.orderId, status: b.status }))
    );

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
      .sort({ createdAt: -1 });

    console.log('Total bookings fetched:', bookings.length); // Debug log
    console.log('Sample booking:', bookings[0]); // Debug log

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

// Confirm a booking (Admin only)
export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be confirmed",
      });
    }

    booking.status = "confirmed";
    await booking.save();

    // Populate before sending response
    await booking.populate('field', 'fieldName fieldLocation fieldType pricePerHour');
    await booking.populate('player', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (error) {
    console.error("Confirm booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Reject a booking (Admin only)
export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be rejected",
      });
    }

    booking.status = "cancelled";
    booking.cancellationReason = reason || "Rejected by admin";
    await booking.save();

    // Populate before sending response
    await booking.populate('field', 'fieldName fieldLocation fieldType pricePerHour');
    await booking.populate('player', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    console.error("Reject booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
