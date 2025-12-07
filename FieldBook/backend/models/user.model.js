import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    mobile: {
      type: String,
      required: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid mobile number'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['Admin', 'Player', 'Field_Owner'],
      required: true,
      default: 'Player',
    },
    profilePicture: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    // Field Owner specific fields
    fieldName: {
      type: String,
      default: null,
    },
    fieldLocation: {
      type: String,
      default: null,
    },
    fieldCapacity: {
      type: Number,
      default: null,
    },
    fieldType: {
      type: String,
      default: null, // e.g., "Football", "Cricket", "Badminton"
    },
    pricePerHour: {
      type: Number,
      default: null,
    },
    // Player specific fields
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', null],
      default: null,
    },
    preferredSports: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
