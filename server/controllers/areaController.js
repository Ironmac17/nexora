
const User = require("../models/User");
const Area = require("../models/Area");
const Event = require("../models/Event");

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

// POST /api/nex/area/:slug/notice
exports.postNotice = async (req, res) => {
  try {
    const { id: slug } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const area = await Area.findOne({ slug });
    if (!area) return res.status(404).json({ message: "Area not found" });

    area.notices.push({
      title,
      content,
      postedBy: userId,
      createdAt: new Date()
    });

    await area.save();

    res.status(201).json({ message: "Notice posted successfully" });
  } catch (err) {
    console.error("❌ Error posting notice:", err.message);
    res.status(500).json({ message: "Error posting notice", error: err.message });
  }
};

// POST /api/nex/area/:slug/event
exports.postEvent = async (req, res) => {
  try {
    const { id: slug } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const area = await Area.findOne({ slug });
    if (!area) return res.status(404).json({ message: "Area not found" });

    const newEvent = new Event({
      title,
      description: description || "",
      date: new Date(),
      isLive: false,
      chatRoom: null
    });

    await newEvent.save();

    area.events.push(newEvent._id);
    await area.save();

    res.status(201).json({ message: "Event added successfully" });
  } catch (err) {
    console.error("❌ Error adding event:", err.message);
    res.status(500).json({ message: "Error adding event", error: err.message });
  }
};

// DELETE /api/nex/area/:slug/event/:eventId
exports.deleteEvent = async (req, res) => {
  try {
    const { id: slug, eventId } = req.params;

    const area = await Area.findOne({ slug });
    if (!area) return res.status(404).json({ message: "Area not found" });

    // Check if event is in area's events
    if (!area.events.includes(eventId)) {
      return res.status(404).json({ message: "Event not found in this area" });
    }

    // Remove from area's events
    area.events = area.events.filter(id => id.toString() !== eventId);
    await area.save();

    // Delete the event document
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting event:", err.message);
    res.status(500).json({ message: "Error deleting event", error: err.message });
  }
};

// DELETE /api/nex/area/:slug/notice/:noticeIndex
exports.deleteNotice = async (req, res) => {
  try {
    const { id: slug, noticeIndex } = req.params;

    const area = await Area.findOne({ slug });
    if (!area) return res.status(404).json({ message: "Area not found" });

    const index = parseInt(noticeIndex);
    if (isNaN(index) || index < 0 || index >= area.notices.length) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // Remove the notice from the array
    area.notices.splice(index, 1);
    await area.save();

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting notice:", err.message);
    res.status(500).json({ message: "Error deleting notice", error: err.message });
  }
};
