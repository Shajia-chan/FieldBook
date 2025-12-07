import express from 'express';
import {
  createField,
  getAllFields,
  getFieldById,
  getFieldsByOwner,
  updateField,
  deleteField,
  addAvailableSlots,
  getAvailableSlotsForDate,
  bookSlot,
} from '../controllers/field.controller.js';

const router = express.Router();

// Field management routes
router.post('/create', createField);
router.get('/all', getAllFields);
router.get('/owner', getFieldsByOwner);
router.get('/:id', getFieldById);
router.put('/:id/update', updateField);
router.delete('/:id/delete', deleteField);

// Slot management routes
router.post('/:id/slots/add', addAvailableSlots);
router.get('/:id/slots', getAvailableSlotsForDate);
router.post('/:id/book', bookSlot);

export default router;
