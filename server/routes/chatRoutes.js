const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getMessagesByRoom,
  sendMessage,
  getPrivateMessages,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/room/:room", protect, getMessagesByRoom);

router.post("/room/:room", protect, sendMessage);

router.get("/private/:userId", protect, getPrivateMessages);

module.exports = router;
