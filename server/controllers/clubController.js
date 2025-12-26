const Club = require("../models/Club");
const User = require("../models/User");

exports.createClub = async (req, res) => {
  try {
    const { name, description, category, logoUrl, areaId } = req.body;

    // Check if club name already exists in the same area
    const existingClub = await Club.findOne({ name, areaId });
    if (existingClub) return res.status(400).json({ message: "Club name already exists in this area" });

    const club = await Club.create({
      name,
      description,
      category,
      logoUrl,
      areaId,
      admin: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json({ message: "Club created successfully", club });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating club", error: err.message });
  }
};;

exports.getAllClubs = async (req, res) => {
  try {
    const { areaId } = req.query;
    let query = {};

    if (areaId) {
      query.areaId = areaId;
    }

    const clubs = await Club.find(query).populate("admin", "fullName profileImageUrl");
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clubs", error: err.message });
  }
};

exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("admin", "fullName email")
      .populate("members", "fullName email profileImageUrl")
      .populate("posts.author", "fullName");
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

    const newPost = { title, content, author: req.user.id, createdAt: new Date() };
    club.posts.push(newPost);
    await club.save();

    res.status(201).json({ message: "Post added", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Error adding post", error: err.message });
  }
};

exports.deleteClubPost = async (req, res) => {
  try {
    const { id, postId } = req.params;
    const club = await Club.findById(id);

    if (!club) return res.status(404).json({ message: "Club not found" });
    if (!club.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Not a club member" });
    }

    const post = club.posts.id(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only post author or admin can delete
    if (post.author?.toString() !== req.user.id && club.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    club.posts.pull(postId);
    await club.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id: slug } = req.params;
    const club = await Club.findOne({ slug });

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (club.admin.toString() !== req.user.id) {
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
    res.status(201).json({
      message: "Event created",
      event: newEvent,
    });
  } catch (err) {
    console.error("❌ Error creating event:", err);
    res.status(500).json({
      message: "Error creating event",
      error: err.message,
    });
  }
};

exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user is the admin
    if (club.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only club admin can delete the club" });
    }

    await Club.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Club deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting club:", err);
    res.status(500).json({
      message: "Error deleting club",
      error: err.message,
    });
  }
};
