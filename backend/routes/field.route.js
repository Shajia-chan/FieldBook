import express from 'express';
import upload from '../middleware/upload.js';
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
  getFieldCount,
} from '../controllers/field.controller.js';

const router = express.Router();

// Field management routes
router.post('/create', createField);
router.get('/all', getAllFields);
router.get('/count', getFieldCount);
router.get('/owner', getFieldsByOwner);
router.get('/:id', getFieldById);
router.put('/:id/update', updateField);
router.post('/:id/upload-cover', upload.single('coverImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the relative path to be stored in the database
    const coverImagePath = `/fields/${req.file.filename}`;
    res.status(200).json({ 
      message: 'File uploaded successfully',
      coverImage: coverImagePath
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload file', error: error.message });
  }
});
router.delete('/:id/delete', deleteField);

// Slot management routes
router.post('/:id/slots/add', addAvailableSlots);
router.get('/:id/slots', getAvailableSlotsForDate);
router.post('/:id/book', bookSlot);

export default router;
