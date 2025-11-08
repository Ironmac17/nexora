const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, 
    },
    room: {
      type: String,
      default: null, 
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["room", "private"],
      default: "room",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
