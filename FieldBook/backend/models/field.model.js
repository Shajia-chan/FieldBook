import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema(
  {
    fieldName: {
      type: String,
      required: true,
      trim: true,
    },
    fieldLocation: {
      type: String,
      required: true,
      trim: true,
    },
    fieldType: {
      type: String,
      required: true,
      enum: ['Football', 'Cricket', 'Badminton', 'Basketball', 'Volleyball', 'Tennis', 'Other'],
      trim: true,
    },
    fieldCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    amenities: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    fieldOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    availableSlots: [
      {
        date: Date,
        slots: [
          {
            time: String, // Format: "09:00-10:00"
            isBooked: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    equipment: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        pricePerItem: {
          type: Number,
          default: 100,
        },
        available: {
          type: Boolean,
          default: true,
        },
      },
    ],
    lockerAvailable: {
      type: Boolean,
      default: false,
    },
    lockerPrice: {
      type: Number,
      default: 200,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Field = mongoose.model('Field', fieldSchema);

export default Field;
