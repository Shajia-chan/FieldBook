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
    const { field, bookingDate, timeSlot, numberOfPlayers, totalPrice, paymentMethod, transactionId, rentedEquipment, lockerBooked } = req.body;
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

    // Calculate equipment cost
    let equipmentCost = 0;
    if (rentedEquipment && rentedEquipment.length > 0) {
      equipmentCost = rentedEquipment.reduce((sum, item) => sum + (item.pricePerItem * item.quantity), 0);
    }

    // Calculate locker cost
    let lockerCost = 0;
    if (lockerBooked && fieldData.lockerAvailable) {
      lockerCost = fieldData.lockerPrice || 200;
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
      paymentMethod: paymentMethod || "pay_later",
      transactionId: transactionId || null,
      rentedEquipment: rentedEquipment || [],
      equipmentCost: equipmentCost,
      lockerBooked: lockerBooked || false,
      lockerCost: lockerCost,
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

    // Add 10 loyalty points to user
    await User.findByIdAndUpdate(userId, {
      $inc: { loyaltyPoints: 10 }
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

// Get booking stats (Admin dashboard)
export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    
    // Calculate total revenue from confirmed bookings
    const confirmedBookings = await Booking.find({ status: "confirmed" });
    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Get booking stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Add review to a confirmed booking
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.headers.userid || req.body.userId;

    // Validate user ID
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Find the booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the user is the one who made the booking
    if (booking.player.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own bookings",
      });
    }

    // Check if the booking is confirmed
    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "You can only review confirmed bookings",
      });
    }

    // Check if already reviewed
    if (booking.review && booking.review.rating) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking",
      });
    }

    // Add review
    booking.review = {
      rating,
      comment: comment || "",
      reviewedAt: new Date(),
    };

    await booking.save();
    await booking.populate('field', 'fieldName fieldLocation fieldType');
    await booking.populate('player', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      booking,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Get reviews for a specific field
export const getFieldReviews = async (req, res) => {
  try {
    const { fieldId } = req.params;

    // Find all confirmed bookings with reviews for this field
    const bookingsWithReviews = await Booking.find({
      field: fieldId,
      status: "confirmed",
      "review.rating": { $ne: null },
    })
      .populate('player', 'firstName lastName')
      .select('review player bookingDate')
      .sort({ 'review.reviewedAt': -1 });

    // Calculate average rating
    let averageRating = 0;
    if (bookingsWithReviews.length > 0) {
      const totalRating = bookingsWithReviews.reduce(
        (sum, booking) => sum + booking.review.rating,
        0
      );
      averageRating = (totalRating / bookingsWithReviews.length).toFixed(1);
    }

    res.status(200).json({
      success: true,
      count: bookingsWithReviews.length,
      averageRating: parseFloat(averageRating),
      reviews: bookingsWithReviews,
    });
  } catch (error) {
    console.error("Get field reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Request refund for a booking
export const requestRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { bkashNumber } = req.body;
    const userId = req.headers.userid;

    if (!bkashNumber) {
      return res.status(400).json({
        success: false,
        message: "Bkash number is required",
      });
    }

    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns this booking
    if (booking.player.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only request refund for your own bookings",
      });
    }

    // Check if booking is confirmed
    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed bookings can be cancelled for refund",
      });
    }

    // Check if refund already requested
    if (booking.refundRequest.requested) {
      return res.status(400).json({
        success: false,
        message: "Refund already requested for this booking",
      });
    }

    // Check if booking date is at least 2 days away
    const bookingDate = new Date(booking.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);
    
    const daysDifference = Math.floor((bookingDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 2) {
      return res.status(400).json({
        success: false,
        message: "Cancellation must be made at least 2 days before the booking date",
      });
    }

    // Calculate refund amount (80% of total price - 20% cancellation fee)
    const refundAmount = booking.totalPrice * 0.8;

    // Update booking with refund request
    booking.refundRequest = {
      requested: true,
      bkashNumber,
      refundAmount,
      requestedAt: new Date(),
      status: "pending",
    };
    booking.status = "cancelled";
    booking.cancellationReason = "Refund requested by user";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Refund request submitted successfully",
      refundAmount,
      booking,
    });
  } catch (error) {
    console.error("Request refund error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Get all refund requests (Admin only)
export const getRefundRequests = async (req, res) => {
  try {
    const refundRequests = await Booking.find({
      "refundRequest.requested": true,
    })
      .populate('player', 'firstName lastName email mobile')
      .populate('field', 'fieldName fieldLocation')
      .sort({ 'refundRequest.requestedAt': -1 });

    res.status(200).json({
      success: true,
      count: refundRequests.length,
      refundRequests,
    });
  } catch (error) {
    console.error("Get refund requests error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Process refund request (Admin only)
export const processRefundRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" or "rejected"
    const adminId = req.headers.userid;

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status (approved/rejected) is required",
      });
    }

    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if refund was requested
    if (!booking.refundRequest.requested) {
      return res.status(400).json({
        success: false,
        message: "No refund request found for this booking",
      });
    }

    // Check if already processed
    if (booking.refundRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Refund request already processed",
      });
    }

    // Update refund request status
    booking.refundRequest.status = status;
    booking.refundRequest.processedAt = new Date();
    booking.refundRequest.processedBy = adminId;

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Refund request ${status} successfully`,
      booking,
    });
  } catch (error) {
    console.error("Process refund request error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
