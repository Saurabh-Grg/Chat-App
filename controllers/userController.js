// controllers/userController.js
const User = require('../models/User');

// Get user profile by userId
const getProfile = (req, res) => {
  const userId = req.params.id;

  User.getProfile(userId, (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).send('Error fetching profile');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).json(results[0]);
  });
};

// Update user profile
const updateProfile = (req, res) => {
  const { userId, statusMessage, profilePicture, onlineStatus } = req.body;

  User.updateProfile(userId, statusMessage, profilePicture, onlineStatus, (err, results) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).send('Error updating profile');
    }

    res.status(200).send('Profile updated successfully');
  });
};

module.exports = {
  getProfile,
  updateProfile
};
