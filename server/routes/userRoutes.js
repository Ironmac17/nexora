const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getMe,
  getUserById,
  updateAvatar,
  updatePosition,
  sendFriendRequest,
  acceptFriendRequest,
  searchUsers,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getMe);

router.get("/:id", protect, getUserById);

router.put("/avatar", protect, updateAvatar);

router.put("/position", protect, updatePosition);

router.post("/friend-request/:id", protect, sendFriendRequest);

router.put("/friend-accept/:id", protect, acceptFriendRequest);

router.get("/search/:query", protect, searchUsers);

module.exports = router;
