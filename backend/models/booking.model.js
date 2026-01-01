import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field',
      required: true,
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true, // Format: "09:00-10:00"
    },
    numberOfPlayers: {
      type: Number,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["pay_later", "bkash", "nagad"],
      default: "pay_later",
    },
    transactionId: {
      type: String,
      default: null,
    },
    rentedEquipment: [
      {
        name: String,
        quantity: Number,
        pricePerItem: Number,
      }
    ],
    equipmentCost: {
      type: Number,
      default: 0,
    },
    lockerBooked: {
      type: Boolean,
      default: false,
    },
    lockerCost: {
      type: Number,
      default: 0,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      comment: {
        type: String,
        default: null,
      },
      reviewedAt: {
        type: Date,
        default: null,
      },
    },
    refundRequest: {
      requested: {
        type: Boolean,
        default: false,
      },
      bkashNumber: {
        type: String,
        default: null,
      },
      refundAmount: {
        type: Number,
        default: null,
      },
      requestedAt: {
        type: Date,
        default: null,
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      processedAt: {
        type: Date,
        default: null,
      },
      processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
