
const User = require("../models/User");
const Area = require("../models/Area");
require("../models/Event"); 

// GET /api/nex/area/:slug
exports.getAreaDetails = async (req, res) => {
  try {
    const { id: slug } = req.params;
    const area = await Area.findOne({ slug }).populate("events");

    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }
    res.status(200).json(area);
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      stack: err.stack,
    });
  }
};

// GET /api/nex/area/status/:slug
exports.getAreaStatus = async (req, res) => {
  try {
    const { id: slug } = req.params;
    const area = await Area.findOne({ slug }).populate("events"); // ✅ find by slug

    if (!area) return res.status(404).json({ message: "Area not found" });

    res.status(200).json({
      events: area.events.length,
      usersOnline: area.usersOnline,
    });
  } catch (err) {
    console.error("❌ Error in getAreaStatus:", err.message);
    res.status(500).json({ message: "Error fetching area status", error: err.message });
  }
};

// PUT /api/nex/area/:slug/join
exports.joinArea = async (req, res) => {
  try {
    const { id: slug } = req.params;
    const userId = req.user.id;
    const area = await Area.findOne({ slug });

    if (!area) return res.status(404).json({ message: "Area not found" });

    const user = await User.findById(userId);
    if (user.position?.areaSlug !== slug) {
      // Leave old area if user had one
      if (user.position?.areaSlug) {
        await Area.findOneAndUpdate(
          { slug: user.position.areaSlug },
          { $inc: { usersOnline: -1 } }
        );
      }

      user.position = { areaSlug: slug, lastUpdated: new Date() };
      await user.save();

      area.usersOnline += 1;
      await area.save();
    }

    res.status(200).json({ success: true, areaSlug: slug });
  } catch (err) {
    console.error("❌ Error in joinArea:", err.message);
    res.status(500).json({ message: "Error joining area", error: err.message });
  }
};

// PUT /api/nex/area/:slug/leave
exports.leaveArea = async (req, res) => {
  try {
    const { id: slug } = req.params;
    const userId = req.user.id;
    const area = await Area.findOne({ slug });

    if (!area) return res.status(404).json({ message: "Area not found" });

    const user = await User.findById(userId);
    if (user.position?.areaSlug === slug) {
      user.position = { areaSlug: null, lastUpdated: new Date() };
      await user.save();

      area.usersOnline = Math.max(0, area.usersOnline - 1);
      await area.save();
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error in leaveArea:", err.message);
    res.status(500).json({ message: "Error leaving area", error: err.message });
  }
};
