const User = require("../models/User");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -otp -resetOTP")
      .populate("friends", "fullName profileImageUrl avatar");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("fullName email profileImageUrl avatar friends createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user profile", error: err.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const { outfit, color, accessory, hairstyle } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (outfit) user.avatar.outfit = outfit;
    if (color) user.avatar.color = color;
    if (accessory !== undefined) user.avatar.accessory = accessory;
    if (hairstyle !== undefined) user.avatar.hairstyle = hairstyle;

    await user.save();

    res.status(200).json({ message: "Avatar updated successfully", avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating avatar", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

exports.updatePosition = async (req, res) => {
  try {
    const { x, y, room } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (typeof x === "number") user.avatar.position.x = x;
    if (typeof y === "number") user.avatar.position.y = y;
    if (room) user.avatar.position.room = room;

    await user.save();

    res.status(200).json({ message: "Position updated successfully", position: user.avatar.position });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating position", error: err.message });
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.id;

    if (friendId === req.user.id) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: "User not found" });
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    user.friends.push(friendId);
    friend.friends.push(user._id);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending friend request", error: err.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.id;

    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: "User not found" });

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
    }
    if (!friend.friends.includes(req.user.id)) {
      friend.friends.push(req.user.id);
    }

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error accepting friend request", error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.params;

    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("fullName email profileImageUrl avatar");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error searching users", error: err.message });
  }
};
