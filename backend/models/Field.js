// models/Field.js
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const fieldSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: [true, 'Field name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    index: true // Add index for faster searching
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: [0, 'Price cannot be negative']
  },
  availableTimeSlots: {
    type: [timeSlotSchema],
    default: []
  },
  hasLocker: {
    type: Boolean,
    default: false
  },
  hasSwimmingPool: {
    type: Boolean,
    default: false,
    index: true // Add index for filtering
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  capacity: {
    type: Number,
    default: 22
  },
  facilities: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x300'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for text search on fieldName and location
fieldSchema.index({ fieldName: 'text', location: 'text' });

// Instance method to check if field is available at specific time
fieldSchema.methods.isAvailableAt = function(timeSlot) {
  return this.availableTimeSlots.some(slot => 
    slot.time === timeSlot && !slot.isBooked
  );
};

// Instance method to get free time slots
fieldSchema.methods.getFreeTimeSlots = function() {
  return this.availableTimeSlots.filter(slot => !slot.isBooked);
};

// Static method for search with filters
fieldSchema.statics.searchFields = async function(filters) {
  const query = {};

  // Location filter (case-insensitive partial match)
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }

  // Price range filter
  if (filters.minPrice !== undefined && filters.minPrice !== null) {
    query.pricePerHour = { ...query.pricePerHour, $gte: parseFloat(filters.minPrice) };
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
    query.pricePerHour = { ...query.pricePerHour, $lte: parseFloat(filters.maxPrice) };
  }

  // Swimming pool filter
  if (filters.hasSwimmingPool === true || filters.hasSwimmingPool === 'true') {
    query.hasSwimmingPool = true;
  }

  // Time slot filter
  if (filters.timeSlot) {
    query.availableTimeSlots = {
      $elemMatch: {
        time: filters.timeSlot,
        isBooked: false
      }
    };
  }

  try {
    const fields = await this.find(query).sort({ createdAt: -1 });
    return fields;
  } catch (error) {
    throw new Error('Error searching fields: ' + error.message);
  }
};

const Field = mongoose.model('Field', fieldSchema);

module.exports = Field;