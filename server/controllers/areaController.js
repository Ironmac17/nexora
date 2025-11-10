// controllers/areaController.js

const User = require("../models/User");
const Area = require("../models/Area");
exports.getAreaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await Area.findById(id).populate("events");
    if (!area) return res.status(404).json({ message: "Area not found" });
    res.json({ events: area.events.length, usersOnline: area.usersOnline });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAreaDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await Area.findById(id).populate("events");
    if (!area) return res.status(404).json({ message: "Area not found" });
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinArea = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const area = await Area.findById(id);
    if (!area) return res.status(404).json({ message: "Area not found" });

    const user = await User.findById(userId);
    if (user.position?.areaId !== id) {
      // leave old area if any
      if (user.position?.areaId) {
        await Area.findByIdAndUpdate(user.position.areaId, { $inc: { usersOnline: -1 } });
      }
      user.position = { areaId: id, lastUpdated: new Date() };
      await user.save();
      area.usersOnline += 1;
      await area.save();
    }

    // notify sockets later
    res.json({ success: true, areaId: id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.leaveArea = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const area = await Area.findById(id);
    if (!area) return res.status(404).json({ message: "Area not found" });

    const user = await User.findById(userId);
    if (user.position?.areaId === id) {
      user.position = { areaId: null, lastUpdated: new Date() };
      await user.save();
      area.usersOnline = Math.max(0, area.usersOnline - 1);
      await area.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
