const Work = require('../models/Work');
const { Op } = require('sequelize');

// Teacher uploads work
exports.uploadWork = async (req, res) => {
  try {
    const work = await Work.create({
      ...req.body,
      teacherId: req.user.id
    });
    res.status(201).json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // controllers/workController.js
// const { Op } = require('sequelize'); // Import operators
// const Work = require('../models/Work');

exports.getTodaysWork = async (req, res) => {
  // 1. Safety Check: Ensure middleware passed the student data
  if (!req.user || !req.user.classSection) {
    return res.status(401).json({ error: "Unauthorized: Student class section not found in token." });
  }

  // 2. Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  try {
    // 3. Fetch work matching the student's exact section
    const work = await Work.findAll({
      where: {
        date: today,
        classSection: req.user.classSection.trim().toUpperCase() // Sanitize to match DB
      },
      order: [['created_at', 'DESC']] // Show newest first
    });

    res.json(work);
  } catch (err) {
    console.error("SQL Query Error:", err.message);
    res.status(500).json({ error: "Database query failed. Check if 'works' table exists." });
  }
};