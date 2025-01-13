//controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig');

const register = (req, res) => {
  const { username, email, password } = req.body;

  console.log('Registering user:', { username, email });  // Debugging log

  // Check if email already exists
  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error('Database error during email check:', err);  // Debugging log
      return res.status(500).send('Database error');
    }

    if (results.length > 0) {
      console.log('Email already exists:', email);  // Debugging log
      return res.status(400).send('Email already exists');
    }

    // Create new user
    User.create(username, email, password, (err, result) => {
      if (err) {
        console.error('Error registering user:', err);  // Debugging log
        return res.status(500).send('Error registering user');
      }

      console.log('User registered successfully:', result);  // Debugging log
      res.status(201).send('User registered successfully');
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  console.log('Logging in user:', { email });  // Debugging log

  // Find user by email
  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error('Database error during login:', err);  // Debugging log
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      console.log('User not found:', email);  // Debugging log
      return res.status(400).send('User not found');
    }

    const user = results[0];

    // Check password
    if (!bcrypt.compareSync(password, user.password)) {
      console.log('Incorrect password for user:', email);  // Debugging log
      return res.status(400).send('Incorrect password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: '1h' });
    console.log('JWT token generated:', token);  // Debugging log
    res.status(200).json({ token });
  });
};

module.exports = {
  register,
  login
};
