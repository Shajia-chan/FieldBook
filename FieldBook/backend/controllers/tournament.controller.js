import Tournament from '../models/tournament.model.js';

// Create new tournament (Admin only)
export const createTournament = async (req, res) => {
  try {
    const { name, banner, date } = req.body;

    const tournament = new Tournament({
      name,
      banner,
      date,
      registrationFee: 500
    });

    await tournament.save();

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      tournament
    });
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tournament',
      error: error.message
    });
  }
};

// Get all tournaments
export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({ isActive: true })
      .populate('participants.player', 'firstName lastName email mobile')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      tournaments
    });
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tournaments',
      error: error.message
    });
  }
};

// Get ongoing tournaments
export const getOngoingTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({ 
      status: 'ongoing',
      isActive: true 
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      tournaments
    });
  } catch (error) {
    console.error('Error fetching ongoing tournaments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ongoing tournaments',
      error: error.message
    });
  }
};

// Register for tournament
export const registerTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const userId = req.headers.userid;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Check if already registered
    const alreadyRegistered = tournament.participants.some(
      p => p.player.toString() === userId
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this tournament'
      });
    }

    tournament.participants.push({
      player: userId,
      registeredAt: new Date(),
      paymentStatus: 'paid'
    });

    await tournament.save();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for tournament',
      tournament
    });
  } catch (error) {
    console.error('Error registering for tournament:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for tournament',
      error: error.message
    });
  }
};

// Update tournament status (Admin only)
export const updateTournamentStatus = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { status } = req.body;

    const tournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      { status },
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tournament status updated',
      tournament
    });
  } catch (error) {
    console.error('Error updating tournament status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tournament status',
      error: error.message
    });
  }
};

// Delete tournament (Admin only)
export const deleteTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      { isActive: false },
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete tournament',
      error: error.message
    });
  }
};
