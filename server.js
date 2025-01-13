const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);  // Create an HTTP server
const io = socketIo(server);           // Initialize Socket.io with the server
const port = process.env.PORT || 8080;

// Setup multer for file uploads
const upload = multer({
  dest: 'uploads/',  // Save files to the 'uploads' folder
  limits: { fileSize: 10 * 1024 * 1024 },  // Max file size: 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp3|mp4|mkv|avi/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('File type is not allowed.'));
    }
  },
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// File upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    return res.json({ message: 'File uploaded successfully', fileUrl });
  } else {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
});

// Socket.io connection event
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Handle incoming text messages
    socket.on('send_message', (data) => {
      console.log('Message received:', data);
      io.emit('receive_message', data);  // Broadcast to all users or specific rooms
    });
  
    // Handle media messages (image, audio, video)
    socket.on('send_media', (data) => {
      console.log('Media received:', data);
      io.emit('receive_media', data);  // Broadcast the media data
    });
  
    // Handle disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
