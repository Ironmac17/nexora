const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ["verify", "reset"],
    required: true 
  }
}, { timestamps: true }); // <-- add this

module.exports = mongoose.model("Otp", otpSchema);