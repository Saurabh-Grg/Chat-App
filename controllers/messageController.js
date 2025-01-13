const multer = require('multer');
const path = require('path');
const Message = require('../models/Message'); // Import the Message model

// Configure file upload (for media)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('media');

// Send a message
exports.sendMessage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error uploading file');
    }

    const { message, senderId, receiverId, messageType } = req.body;
    let fileUrl = null;

    // If a file was uploaded, save its URL
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    try {
      // Create a new message in the database using Sequelize
      const newMessage = await Message.create({
        message,
        senderId,
        receiverId,
        messageType,
        fileUrl
      });

      res.status(200).json({
        message: 'Message sent successfully',
        fileUrl,
        messageId: newMessage.messageId, // Include message ID in response
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error saving message');
    }
  });
};

// Get messages for a specific user (by receiverId)
exports.getMessages = async (req, res) => {
    const { receiverId } = req.query; // Get receiverId from query params
  
    if (!receiverId) {
      return res.status(400).send('Receiver ID is required');
    }
  
    try {
      const messages = await Message.findAll({
        where: {
          receiverId: receiverId, // Fetch messages where receiverId matches
        },
        order: [['createdAt', 'DESC']], // Order messages by creation date (latest first)
      });
  
      res.status(200).json(messages); // Send the messages as response
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving messages');
    }
  };