//server.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
// Use user profile routes
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
