const mysql = require('mysql2');
// console.log('Using database:', process.env.DB_NAME);  // Debugging log

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Leave empty if there's no password
    database: 'chatapp',
  });
  
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);  // Debugging log
    return;
  }
  console.log('Connected to the MySQL database');
});

module.exports = connection;
