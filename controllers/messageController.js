// const multer = require('multer');
// const path = require('path');
// const { Sequelize } = require('sequelize'); // Import Sequelize
// const Message = require('../models/Message'); // Import the Message model

// // Configure file upload (for media)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage }).single('media');

// // Send a message
// exports.sendMessage = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(500).send('Error uploading file');
//     }

//     const { message, senderId, receiverId, messageType } = req.body;
//     let fileUrl = null;

//     // If a file was uploaded, save its URL
//     if (req.file) {
//       fileUrl = `/uploads/${req.file.filename}`;
//     }

//     try {
//       // Create a new message in the database using Sequelize
//       const newMessage = await Message.create({
//         message,
//         senderId,
//         receiverId,
//         messageType,
//         fileUrl
//       });

//       res.status(200).json({
//         message: 'Message sent successfully',
//         fileUrl,
//         messageId: newMessage.messageId, // Include message ID in response
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Error saving message');
//     }
//   });
// };

// // Get messages for a specific user (by senderId and receiverId)
// exports.getMessages = async (req, res) => {
//     const { senderId, receiverId } = req.query; // Get senderId and receiverId from query params

//     if (!senderId || !receiverId) {
//         return res.status(400).send('Sender ID and Receiver ID are required');
//     }

//     try {
//         // Fetch messages where either senderId or receiverId matches
//         const messages = await Message.findAll({
//             where: {
//                 [Sequelize.Op.or]: [
//                     { senderId: senderId, receiverId: receiverId },  // Sender to Receiver
//                     { senderId: receiverId, receiverId: senderId }   // Receiver to Sender (reverse conversation)
//                 ]
//             },
//             order: [['createdAt', 'ASC']], // Order messages by creation date (ascending)
//         });

//         res.status(200).json(messages); // Send the messages as response
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error retrieving messages');
//     }
// };


const multer = require('multer');
const path = require('path');
const { Sequelize } = require('sequelize'); // Import Sequelize
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

// Get messages for a specific user (by senderId and receiverId)
// In the messageController.js
exports.getMessages = async (req, res) => {
    const { senderId, receiverId } = req.query; // Get senderId and receiverId from query params
  
    if (!senderId || !receiverId) {
      return res.status(400).send('Sender ID and Receiver ID are required');
    }
  
    try {
      console.log('Fetching messages for:', senderId, receiverId); // Debugging line
  
      // Fetch messages where either senderId or receiverId matches
      const messages = await Message.findAll({
        where: {
          [Sequelize.Op.or]: [
            { senderId: senderId, receiverId: receiverId },  // Sender to Receiver
            { senderId: receiverId, receiverId: senderId }   // Receiver to Sender (reverse conversation)
          ]
        },
        order: [['createdAt', 'ASC']], // Order messages by creation date (ascending)
      });
  
      console.log('Messages fetched:', messages.length); // Debugging line
      if (messages.length > 0) {
        return res.status(200).json(messages); // Send the messages as response
      } else {
        console.log('No messages found for the given sender and receiver'); // Debugging line
        return res.status(200).json([]); // Return an empty array if no messages found
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving messages');
    }
  };
  