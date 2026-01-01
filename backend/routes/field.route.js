const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/field.controller');

// GET /api/fields - Get all fields
router.get('/', fieldController.getAllFields);

// GET /api/fields/search - Search fields with filters
router.get('/search', fieldController.searchFields);

// GET /api/fields/swimming-pool - Get fields with swimming pool
router.get('/swimming-pool', fieldController.getFieldsWithSwimmingPool);

// GET /api/fields/:id - Get field by ID
router.get('/:id', fieldController.getFieldById);

// POST /api/fields - Create new field
router.post('/', fieldController.createField);

// PUT /api/fields/:id - Update field
router.put('/:id', fieldController.updateField);

// DELETE /api/fields/:id - Delete field
router.delete('/:id', fieldController.deleteField);

module.exports = router;


