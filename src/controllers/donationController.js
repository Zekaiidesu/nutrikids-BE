const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const User = require('../models/User');

// ==================== GET ALL PROGRAMS ====================
exports.getPrograms = async (req, res) => {
  try {
    const programs = await Donation.findAll({
      where: { status: 'active' },
      include: [
        {
          model: Donor,
          as: 'donors',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, count: programs.length, programs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET SINGLE PROGRAM ====================
exports.getProgram = async (req, res) => {
  try {
    const program = await Donation.findByPk(req.params.id, {
      include: [
        {
          model: Donor,
          as: 'donors',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
      ],
    });

    if (!program) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }

    res.json({ success: true, program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== CREATE PROGRAM ====================
exports.createProgram = async (req, res) => {
  try {
    const program = await Donation.create(req.body);
    res.status(201).json({ success: true, program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== DONATE ====================
exports.donate = async (req, res) => {
  try {
    const { amount, message, isAnonymous } = req.body;

    const program = await Donation.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }

    await Donor.create({
      donationId: program.id,
      userId: req.user.id,
      amount,
      message,
      isAnonymous: isAnonymous || false,
      date: new Date(),
    });

    // Update collected amount
    program.collectedAmount = parseFloat(program.collectedAmount) + parseFloat(amount);
    
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

// ==================== MY DONATIONS ====================
exports.getMyDonations = async (req, res) => {
  try {
    const donors = await Donor.findAll({
      where: { userId: req.user.id },
      include: [{ model: Donation, as: 'donation' }],
      order: [['date', 'DESC']],
    });

    const history = donors.map((d) => ({
      programName: d.donation.programName,
      amount: d.amount,
      date: d.date,
      message: d.message,
      status: d.donation.status,
    }));

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
