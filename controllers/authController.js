const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig');
const generateToken = require('../utils/generateToken');  // Correct path to your generateToken file

const register = (req, res) => {
  const { username, email, password } = req.body;

  console.log('Registering user:', { username, email });  // Debugging log

  // Check if email already exists
  User.findOne({ where: { email: email } })
    .then((existingUser) => {
      if (existingUser) {
        console.log('Email already exists:', email);  // Debugging log
        return res.status(400).send('Email already exists');
      }

      // Hash the password before saving
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create new user
      User.create({
        username,
        email,
        password: hashedPassword,
      })
        .then((result) => {
          console.log('User registered successfully:', result);  // Debugging log
          res.status(201).send('User registered successfully');
        })
        .catch((err) => {
          console.error('Error registering user:', err);  // Debugging log
          res.status(500).send('Error registering user');
        });
    })
    .catch((err) => {
      console.error('Database error during email check:', err);  // Debugging log
      res.status(500).send('Database error');
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  console.log('Logging in user:', { email });  // Debugging log

  // Find user by email
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        console.log('User not found:', email);  // Debugging log
        return res.status(400).send('User not found');
      }

      // Check password
      if (!bcrypt.compareSync(password, user.password)) {
        console.log('Incorrect password for user:', email);  // Debugging log
        return res.status(400).send('Incorrect password');
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, jwtConfig.JWT_SECRET, { expiresIn: '1h' });
      console.log('JWT token generated:', generateToken);  // Debugging log
      // Respond with token and userId
      res.status(200).json({ token, userId: user.id });
    })
    .catch((err) => {
      console.error('Database error during login:', err);  // Debugging log
      res.status(500).send('Database error');
    });
};

module.exports = {
  register,
  login,
};
