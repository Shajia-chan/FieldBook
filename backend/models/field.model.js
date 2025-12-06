import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  availableSlots: [
    {
      date: String,
      time: String,
      isBooked: { type: Boolean, default: false },
    },
  ],
  hasLocker: { type: Boolean, default: false },
  hasSwimmingPool: { type: Boolean, default: false },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ["available", "unavailable"], default: "available" },
});

export default mongoose.model("Field", fieldSchema);
