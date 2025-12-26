const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createClub,
  getAllClubs,
  getClubById,
  joinClub,
  leaveClub,
  createClubPost,
  deleteClubPost,
  createEvent,
  deleteClub,
} = require("../controllers/clubController");

const router = express.Router();

// Public
router.get("/", getAllClubs);
router.get("/:id", getClubById);

// Private
router.post("/", protect, createClub);
router.post("/join/:id", protect, joinClub);
router.post("/leave/:id", protect, leaveClub);
router.delete("/:id", protect, deleteClub);
router.post("/:id/post", protect, createClubPost);
router.delete("/:id/post/:postId", protect, deleteClubPost);
router.post("/:id/event", protect, createEvent);

module.exports = router;
