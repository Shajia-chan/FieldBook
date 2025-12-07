import Field from '../models/field.model.js';
import User from '../models/user.model.js';

// Create a new field
export const createField = async (req, res) => {
  try {
    const {
      fieldName,
      fieldLocation,
      fieldType,
      fieldCapacity,
      pricePerHour,
      description,
      amenities,
    } = req.body;

    // Validate required fields
    if (!fieldName || !fieldLocation || !fieldType || !fieldCapacity || !pricePerHour) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get field owner from token (user ID)
    const userId = req.headers.userid || req.body.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    // Check if user exists and is a Field Owner
    const user = await User.findById(userId);
    if (!user || user.role !== 'Field_Owner') {
      return res.status(403).json({ message: 'Only Field Owners can create fields' });
    }

    // Create field
    const field = new Field({
      fieldName,
      fieldLocation,
      fieldType,
      fieldCapacity,
      pricePerHour,
      description: description || null,
      amenities: amenities || [],
      fieldOwner: userId,
    });

    await field.save();
    await field.populate('fieldOwner', 'firstName lastName email');

    return res.status(201).json({
      message: 'Field created successfully',
      field,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get all available fields (for players to browse)
export const getAllFields = async (req, res) => {
  try {
    const { fieldType, location, maxPrice, minCapacity } = req.query;

    // Build filter
    const filter = { isActive: true };

    if (fieldType) {
      filter.fieldType = fieldType;
    }

    if (location) {
      filter.fieldLocation = new RegExp(location, 'i');
    }

    if (maxPrice) {
      filter.pricePerHour = { $lte: parseInt(maxPrice) };
    }

    if (minCapacity) {
      filter.fieldCapacity = { $gte: parseInt(minCapacity) };
    }

    const fields = await Field.find(filter)
      .populate('fieldOwner', 'firstName lastName email mobile')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Fields retrieved successfully',
      count: fields.length,
      fields,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get field by ID
export const getFieldById = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await Field.findById(id).populate('fieldOwner', 'firstName lastName email mobile');

    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    return res.status(200).json({
      message: 'Field retrieved successfully',
      field,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get fields by owner
export const getFieldsByOwner = async (req, res) => {
  try {
    const userId = req.headers.userid || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    const fields = await Field.find({ fieldOwner: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Fields retrieved successfully',
      count: fields.length,
      fields,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Update field
export const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.userid || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    // Check if user is the field owner
    if (field.fieldOwner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only update your own fields' });
    }

    // Update allowed fields
    const allowedUpdates = ['fieldName', 'fieldLocation', 'fieldType', 'fieldCapacity', 'pricePerHour', 'description', 'amenities', 'isActive'];
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        field[update] = req.body[update];
      }
    });

    await field.save();
    await field.populate('fieldOwner', 'firstName lastName email');

    return res.status(200).json({
      message: 'Field updated successfully',
      field,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete field
export const deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.userid || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    // Check if user is the field owner
    if (field.fieldOwner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only delete your own fields' });
    }

    await Field.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Field deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Add available slots
export const addAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, slots } = req.body;
    const userId = req.headers.userid || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    if (!date || !slots || slots.length === 0) {
      return res.status(400).json({ message: 'Date and slots are required' });
    }

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    // Check if user is the field owner
    if (field.fieldOwner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only add slots to your own fields' });
    }

    // Check if date already exists
    const existingSlot = field.availableSlots.find(
      slot => new Date(slot.date).toDateString() === new Date(date).toDateString()
    );

    if (existingSlot) {
      // Merge slots
      existingSlot.slots = [
        ...existingSlot.slots,
        ...slots.map(time => ({ time, isBooked: false })),
      ];
    } else {
      // Add new date with slots
      field.availableSlots.push({
        date: new Date(date),
        slots: slots.map(time => ({ time, isBooked: false })),
      });
    }

    await field.save();

    return res.status(200).json({
      message: 'Slots added successfully',
      field,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get available slots for a specific date
export const getAvailableSlotsForDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    const slotDate = field.availableSlots.find(
      slot => new Date(slot.date).toDateString() === new Date(date).toDateString()
    );

    if (!slotDate) {
      return res.status(200).json({
        message: 'No slots available for this date',
        slots: [],
      });
    }

    return res.status(200).json({
      message: 'Available slots retrieved successfully',
      slots: slotDate.slots,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Book a slot
export const bookSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, timeSlot } = req.body;
    const userId = req.headers.userid || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'Date and timeSlot are required' });
    }

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    const slotDate = field.availableSlots.find(
      slot => new Date(slot.date).toDateString() === new Date(date).toDateString()
    );

    if (!slotDate) {
      return res.status(400).json({ message: 'No slots available for this date' });
    }

    const slot = slotDate.slots.find(s => s.time === timeSlot);

    if (!slot) {
      return res.status(400).json({ message: 'Slot not found' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'Slot is already booked' });
    }

    slot.isBooked = true;

    await field.save();

    return res.status(200).json({
      message: 'Slot booked successfully',
      field,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
