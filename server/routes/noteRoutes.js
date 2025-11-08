const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createNote,
  getNotesByRoom,
  getNotesByUser,
  deleteNote,
} = require("../controllers/noteController");

const router = express.Router();


router.post("/", protect, createNote);


router.get("/room/:room", protect, getNotesByRoom);


router.get("/user/:id", protect, getNotesByUser);


router.delete("/:id", protect, deleteNote);

module.exports = router;
