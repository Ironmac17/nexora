const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getMessagesByRoom,
  sendMessage,
  getPrivateMessages,
  deleteMessage,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/room/:room", protect, getMessagesByRoom);

router.post("/room/:room", protect, sendMessage);

router.get("/private/:userId", protect, getPrivateMessages);

router.delete("/:messageId", protect, deleteMessage);

module.exports = router;
