const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getAreaStatus,
  getAreaDetails,
  joinArea,
  leaveArea,
  postNotice,
  postEvent,
  deleteEvent,
  deleteNotice,
} = require("../controllers/areaController.js");

const router = express.Router();

// Public read routes
router.get("/status/:id", getAreaStatus);
router.get("/:id", getAreaDetails);

// Protected user movement routes
router.put("/:id/join", protect, joinArea);
router.put("/:id/leave", protect, leaveArea);
router.post("/:id/notice", protect, postNotice);
router.post("/:id/event", protect, postEvent);
router.delete("/:id/event/:eventId", protect, deleteEvent);
router.delete("/:id/notice/:noticeIndex", protect, deleteNotice);

module.exports = router;