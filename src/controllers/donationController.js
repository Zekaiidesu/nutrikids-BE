const Donation = require('../models/Donation');

// Get all donation programs
exports.getPrograms = async (req, res) => {
  try {
    const programs = await Donation.find({ status: 'active' });
    res.json({ success: true, count: programs.length, programs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single program
exports.getProgram = async (req, res) => {
  try {
    const program = await Donation.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }
    res.json({ success: true, program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create donation program (admin)
exports.createProgram = async (req, res) => {
  try {
    const program = await Donation.create(req.body);
    res.status(201).json({ success: true, program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Donate to program
exports.donate = async (req, res) => {
  try {
    const { amount, message, isAnonymous } = req.body;
    const program = await Donation.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }

    program.donors.push({
      userId: req.user.id,
      amount,
      message,
      isAnonymous: isAnonymous || false,
      date: new Date(),
    });

    program.collectedAmount += amount;

    // Check if target reached
    if (program.collectedAmount >= program.targetAmount) {
      program.status = 'completed';
    }

    await program.save();

    res.json({
      success: true,
      message: 'Donasi berhasil! Terima kasih atas dukungan Anda.',
      program,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user donation history
exports.getMyDonations = async (req, res) => {
  try {
    const programs = await Donation.find({
      'donors.userId': req.user.id,
    });

    const history = [];
    programs.forEach(program => {
      program.donors.forEach(donor => {
        if (donor.userId.toString() === req.user.id) {
          history.push({
            programName: program.programName,
            amount: donor.amount,
            date: donor.date,
            message: donor.message,
            status: program.status,
          });
        }
      });
    });

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
