const Message = require("../models/Message");

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message
    });
  }
};

// Get single message
const getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch message",
      error: error.message
    });
  }
};

// Create message
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to send message",
      error: error.message
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update message",
      error: error.message
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    res.status(200).json({
      message: "Message deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete message",
      error: error.message
    });
  }
};

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  markAsRead,
  deleteMessage
};