const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Define the User schema (just basic properties for now)
const User = {
  create: (username, email, password, callback) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.query(query, [username, email, hashedPassword], callback);
  },

  findByEmail: (email, callback) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], callback);
  },

  findById: (id, callback) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    db.query(query, [id], callback);
  },
  // New method to update user profile
  updateProfile: (userId, statusMessage, profilePicture, onlineStatus, callback) => {
    const query = `UPDATE users SET status_message = ?, profile_picture = ?, online_status = ? WHERE id = ?`;
    db.query(query, [statusMessage, profilePicture, onlineStatus, userId], callback);
  },

  // New method to get user profile information
  getProfile: (userId, callback) => {
    const query = `SELECT username, email, profile_picture, status_message, online_status FROM users WHERE id = ?`;
    db.query(query, [userId], callback);
  }
};

module.exports = User;
