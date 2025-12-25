const express = require('express');
const Staff = require('../models/staff.model');
const Hire = require('../models/hire.model');

const router = express.Router();

// Get all staff
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hire a staff
router.post('/hire', async (req, res) => {
  const { userId, staffId, date, language } = req.body;
  try {
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ error: "Staff not found" });
    if (!staff.available) return res.status(400).json({ error: "Staff not available" });

    staff.available = false;
    await staff.save();

    const hire = new Hire({ userId, staffId, date, language });
    await hire.save();

    res.json({ message: "Staff hired successfully", staff, hire });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Release a staff (make available again)
router.post('/release/:id', async (req, res) => {
  const staffId = req.params.id;
  try {
    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ error: "Staff not found" });

    // Set availability to true
    staff.available = true;
    await staff.save();

    // Delete the hire record
    await Hire.deleteMany({ staffId: staffId });

    res.json({ message: "Staff released successfully", staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
