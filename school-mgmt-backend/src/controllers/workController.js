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
exports.getAllWork = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const offset = (page - 1) * limit;

    // Use findAndCountAll to get both the data and total count for pagination
    const { count, rows } = await Work.findAndCountAll({
      where: { 
        classSection: req.user.classSection,
        type: type 
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']] // Show newest work first
    });

    res.json({
      work: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};