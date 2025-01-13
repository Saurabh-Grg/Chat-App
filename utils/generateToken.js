const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig'); // Import the JWT secret from the config file

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    jwtConfig.JWT_SECRET, // Use the JWT secret from the config file
    { expiresIn: '1h' }
  );
};

module.exports = generateToken;
