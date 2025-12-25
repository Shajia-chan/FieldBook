import express from 'express';
import upload from '../middleware/upload.js';
import {
  createTournament,
  getAllTournaments,
  getOngoingTournaments,
  registerTournament,
  updateTournamentStatus,
  deleteTournament
} from '../controllers/tournament.controller.js';

const router = express.Router();

// Get all tournaments
router.get('/', getAllTournaments);

// Get ongoing tournaments
router.get('/ongoing', getOngoingTournaments);

// Create tournament (Admin only)
router.post('/create', createTournament);

// Upload tournament banner
router.post('/upload-banner', upload.single('banner'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Return the relative path to be stored in the database
    const bannerPath = `/tournaments/${req.file.filename}`;
    res.status(200).json({ 
      message: 'Banner uploaded successfully',
      banner: bannerPath
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload banner', error: error.message });
  }
});

// Register for tournament
router.post('/:tournamentId/register', registerTournament);

// Update tournament status (Admin only)
router.patch('/:tournamentId/status', updateTournamentStatus);

// Delete tournament (Admin only)
router.delete('/:tournamentId', deleteTournament);

export default router;
