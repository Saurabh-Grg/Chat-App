const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/Message'); 
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
app.use('/api/messages', messageRoutes);

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
  socket.on('send_message', async (data) => {
    const { senderId, receiverId, message } = data;
    console.log('Message received from sender:', senderId, 'to receiver:', receiverId, 'Message:', message);

    // Save the message to the database
    try {
        await Message.create({
          senderId: senderId,
          receiverId: receiverId,
          message: message,
          messageType: 'text',
        });
  
        // Emit the message to the specific receiver only
        socket.to(receiverId).emit('receive_message', { senderId, message });
      } catch (error) {
        console.error('Error saving message:', error);
      }
  });

  // Join room for the user based on their userId
  socket.on('join', (userId) => {
    console.log(`User ${userId} joined`);
    socket.join(userId); // Join a room with userId as the room name
  });

  // Handle media messages (image, audio, video)
  socket.on('send_media', (data) => {
    const { senderId, receiverId, fileUrl } = data;
    console.log('Media received from sender:', senderId, 'to receiver:', receiverId, 'File URL:', fileUrl);

    // Emit the media to the specific receiver only
    socket.to(receiverId).emit('receive_media', { senderId, fileUrl });
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
