const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const work = require('../controllers/workController');
const { verifyToken, isAdmin, authenticate } = require('../middleware/auth');

// Auth Routes
router.post('/login', auth.login);
router.post('/create-user', verifyToken, isAdmin, auth.register); // Only Admin creates users

// Work Routes
router.post('/upload-work', verifyToken, work.uploadWork); // Teachers use this
router.get('/today', authenticate, work.getTodaysWork);     // Students use this

module.exports = router;