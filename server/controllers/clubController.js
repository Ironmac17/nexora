const Club = require("../models/Club");
const User = require("../models/User");

exports.createClub = async (req, res) => {
  try {
    const { name, description, category, logoUrl } = req.body;

    const existingClub = await Club.findOne({ name });
    if (existingClub) return res.status(400).json({ message: "Club name already exists" });

    const club = await Club.create({
      name,
      description,
      category,
      logoUrl,
      admin: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json({ message: "Club created successfully", club });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating club", error: err.message });
  }
};

exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate("admin", "fullName profileImageUrl");
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clubs", error: err.message });
  }
};

exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("admin", "fullName email")
      .populate("members", "fullName email profileImageUrl");
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.status(200).json(club);
  } catch (err) {
    res.status(500).json({ message: "Error fetching club details", error: err.message });
  }
};

exports.joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    if (club.members.includes(req.user.id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    club.members.push(req.user.id);
    await club.save();

    res.status(200).json({ message: "Joined club successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error joining club", error: err.message });
  }
};

exports.leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    club.members = club.members.filter((id) => id.toString() !== req.user.id);
    await club.save();

    res.status(200).json({ message: "Left club successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error leaving club", error: err.message });
  }
};

exports.createClubPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const club = await Club.findById(req.params.id);

    if (!club) return res.status(404).json({ message: "Club not found" });
    if (!club.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Not a club member" });
    }

    const newPost = { title, content, createdAt: new Date() };
    club.posts.push(newPost);
    await club.save();

    res.status(201).json({ message: "Post added", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Error adding post", error: err.message });
  }
};

// controllers/clubController.js
exports.createEvent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const club = await Club.findOne({ slug: req.params.id });

    if (!club)
      return res.status(404).json({ message: "Club not found" });
    if (club.admin?.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only club admin can create events" });
    }

    const newEvent = {
      title,
      description,
      date: new Date(),
      isLive: true,
      chatRoom: `${club.slug}-event-${Date.now()}`,
    };

    club.events.push(newEvent);
    await club.save();

    res.status(201).json({ message: "Event created", event: newEvent });
  } catch (err) {
    res.status(500).json({
      message: "Error creating event",
      error: err.message,
    });
  }
};
