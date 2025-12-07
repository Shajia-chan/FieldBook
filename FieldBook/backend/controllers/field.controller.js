import Field from '../models/field.model.js';
import User from '../models/user.model.js';

// Helper function to generate 1.5-hour slots from 8 AM to 10 PM
const generateDailySlots = () => {
  const slots = [];
  const startHour = 8; // 8 AM
  const endHour = 22; // 10 PM
  const slotDuration = 1.5; // 1.5 hours

  let currentHour = startHour;
  let currentMinute = 0;

  while (currentHour < endHour) {
    const startTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    
    // Calculate end time (add 1.5 hours)
    let endTimeHour = currentHour;
    let endTimeMinute = currentMinute + 90; // 90 minutes

    if (endTimeMinute >= 60) {
      endTimeHour += Math.floor(endTimeMinute / 60);
      endTimeMinute = endTimeMinute % 60;
    }

    // Don't add slot if it would go past 10 PM
    if (endTimeHour > endHour) {
      break;
    }

    const endTime = `${String(endTimeHour).padStart(2, '0')}:${String(endTimeMinute).padStart(2, '0')}`;
    slots.push({
      time: `${startTime}-${endTime}`,
      isBooked: false,
    });

    // Move to next slot
    currentHour = endTimeHour;
    currentMinute = endTimeMinute;
  }

  return slots;
};

// Helper function to generate slots for next 30 days
const generateAvailableSlots = () => {
  const slots = [];
  const dailySlots = generateDailySlots();

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);

    slots.push({
      date: date,
      slots: JSON.parse(JSON.stringify(dailySlots)), // Deep copy of daily slots
    });
  }

  return slots;
};

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

    // Generate available slots for next 30 days
    const availableSlots = generateAvailableSlots();

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
      availableSlots,
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

    let fields = await Field.find(filter)
      .populate('fieldOwner', 'firstName lastName email mobile')
      .sort({ createdAt: -1 });

    // Ensure all fields have slots generated
    for (let field of fields) {
      if (!field.availableSlots || field.availableSlots.length === 0) {
        const availableSlots = generateAvailableSlots();
        field.availableSlots = availableSlots;
        await field.save();
      }
    }

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

    // If field has no availableSlots, generate them
    if (!field.availableSlots || field.availableSlots.length === 0) {
      const availableSlots = generateAvailableSlots();
      field.availableSlots = availableSlots;
      await field.save();
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
    // This endpoint is no longer needed as slots are auto-generated
    // Keeping it for backward compatibility but it just returns a message
    return res.status(200).json({
      message: 'Time slots are automatically generated for all fields (8 AM - 10 PM, 1.5-hour slots)',
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

    // If field has no availableSlots, generate them
    if (!field.availableSlots || field.availableSlots.length === 0) {
      const availableSlots = generateAvailableSlots();
      field.availableSlots = availableSlots;
      await field.save();
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
