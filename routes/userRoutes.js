// routes/userRoutes.js
const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const router = express.Router();

// Get user profile
router.get('/profile/:id', getProfile);

// Update user profile
router.put('/profile', updateProfile);

module.exports = router;
