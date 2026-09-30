const express = require("express");

const {
  getMessages,
  getMessage,
  createMessage,
  markAsRead,
  deleteMessage
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createMessage);

router.get("/", protect, getMessages);
router.get("/:id", protect, getMessage);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteMessage);
module.exports = router;