const Note = require("../models/Note");
const User = require("../models/User");

exports.createNote = async (req, res) => {
  try {
    const { title, content, room } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.create({
      user: req.user.id,
      title,
      content,
      room: room || "campus",
    });
    await User.findByIdAndUpdate(req.user.id, { $push: { notes: note._id } });

    res.status(201).json({ message: "Note created successfully", note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating note", error: err.message });
  }
};


exports.getNotesByRoom = async (req, res) => {
  try {
    const { room } = req.params;
    const notes = await Note.find({ room }).populate("user", "fullName profileImageUrl");
    res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notes", error: err.message });
  }
};


exports.getNotesByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await Note.find({ user: id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user's notes", error: err.message });
  }
};


exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this note" });
    }

    await note.deleteOne();
    await User.findByIdAndUpdate(req.user.id, { $pull: { notes: note._id } });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting note", error: err.message });
  }
};
