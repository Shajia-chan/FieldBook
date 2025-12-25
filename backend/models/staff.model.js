const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, required: true },
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Staff', StaffSchema);



