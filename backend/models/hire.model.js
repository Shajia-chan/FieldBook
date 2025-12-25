const mongoose = require('mongoose');

const HireSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  date: { type: String, required: true },
  language: { type: String, default: "en" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Hire", HireSchema);
