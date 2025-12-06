// controllers/field.controller.js
const Field = require('../models/Field');

// Get all fields
exports.getAllFields = async (req, res) => {
  try {
    const fields = await Field.find();
    
    res.status(200).json({
      success: true,
      count: fields.length,
      data: fields
    });
  } catch (error) {
    console.error('Error in getAllFields:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve fields',
      error: error.message
    });
  }
};

// Search fields with filters
exports.searchFields = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, timeSlot, hasSwimmingPool } = req.query;

    console.log('Search params received:', { location, minPrice, maxPrice, timeSlot, hasSwimmingPool });

    // Build query object
    const query = {};
    
    // Location filter (case-insensitive partial match)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Price range filter
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      query.pricePerHour = { ...query.pricePerHour, $gte: parseFloat(minPrice) };
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      query.pricePerHour = { ...query.pricePerHour, $lte: parseFloat(maxPrice) };
    }

    // Swimming pool filter
    if (hasSwimmingPool === 'true') {
      query.hasSwimmingPool = true;
    }

    // Time slot filter
    if (timeSlot) {
      query.availableTimeSlots = {
        $elemMatch: {
          time: timeSlot,
          isBooked: false
        }
      };
    }

    console.log('MongoDB Query:', JSON.stringify(query));

    const fields = await Field.find(query);

    console.log('Fields found:', fields.length);

    res.status(200).json({
      success: true,
      count: fields.length,
      data: fields,
      message: fields.length > 0 ? 'Fields found successfully' : 'No fields match your criteria'
    });
  } catch (error) {
    console.error('Error in searchFields:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search fields',
      error: error.message
    });
  }
};

// Get field by ID
exports.getFieldById = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }

    res.status(200).json({
      success: true,
      data: field
    });
  } catch (error) {
    console.error('Error in getFieldById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve field',
      error: error.message
    });
  }
};

// Create new field
exports.createField = async (req, res) => {
  try {
    const fieldData = req.body;

    const field = await Field.create(fieldData);

    res.status(201).json({
      success: true,
      data: field,
      message: 'Field created successfully'
    });
  } catch (error) {
    console.error('Error in createField:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create field',
      error: error.message
    });
  }
};

// Update field
exports.updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const field = await Field.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }

    res.status(200).json({
      success: true,
      data: field,
      message: 'Field updated successfully'
    });
  } catch (error) {
    console.error('Error in updateField:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update field',
      error: error.message
    });
  }
};

// Delete field
exports.deleteField = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await Field.findByIdAndDelete(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Field deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteField:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete field',
      error: error.message
    });
  }
};

// Get fields with swimming pool
exports.getFieldsWithSwimmingPool = async (req, res) => {
  try {
    const fields = await Field.find({ hasSwimmingPool: true });

    res.status(200).json({
      success: true,
      count: fields.length,
      data: fields
    });
  } catch (error) {
    console.error('Error in getFieldsWithSwimmingPool:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve fields with swimming pool',
      error: error.message
    });
  }
};