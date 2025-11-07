
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      default: "campus", // optional, ties to Nexora's map/rooms
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
