const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createClub,
  getAllClubs,
  getClubById,
  joinClub,
  leaveClub,
  createClubPost,
  createEvent,
} = require("../controllers/clubController");

const router = express.Router();

// Public
router.get("/", getAllClubs);
router.get("/:id", getClubById);

// Private
router.post("/", protect, createClub);
router.post("/join/:id", protect, joinClub);
router.post("/leave/:id", protect, leaveClub);
router.post("/:id/post", protect, createClubPost);
router.post("/:id/event", protect, createEvent);

module.exports = router;
