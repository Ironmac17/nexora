const Message = require("../models/Message");
const User = require("../models/User");

exports.getMessagesByRoom = async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await Message.find({ room })
      .populate("sender", "fullName profileImageUrl avatar")
      .sort({ createdAt: 1 }); // oldest → newest

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching room messages", error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { room } = req.params;
    const { text } = req.body;

    if (!text || !room) {
      return res.status(400).json({ message: "Text and room are required" });
    }

    const message = await Message.create({
      sender: req.user.id,
      text,
      room,
      type: "room",
    });

    const populatedMessage = await message.populate("sender", "fullName avatar");

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
};

exports.getPrivateMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    })
      .populate("sender", "fullName avatar")
      .populate("receiver", "fullName avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching private messages", error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting message", error: err.message });
  }
};
