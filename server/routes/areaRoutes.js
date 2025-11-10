const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    getAreaStatus,
  getAreaDetails,
  joinArea,
  leaveArea,
} = require("../controllers/areaController.js");

const router = express.Router();

// Public read routes
router.get("/status/:id", getAreaStatus);
router.get("/:id", getAreaDetails);

// Protected user movement routes
router.put("/:id/join", protect, joinArea);
router.put("/:id/leave", protect, leaveArea);

module.exports = router;

