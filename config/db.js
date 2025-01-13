const { Sequelize } = require('sequelize');

// Database connection setup
const sequelize = new Sequelize('chatapp', 'root', '', {
  host: 'localhost',  // Change 'root' to 'localhost' as the host
  dialect: 'mysql',
  logging: false,  // Set to true if you want to see SQL queries
});

// Authenticate the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the MySQL database');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.stack);  // Debugging log
  });

module.exports = sequelize;
