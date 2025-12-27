const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    bio: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },

    avatar: {
      outfit: { type: String, default: "default" },
      color: { type: String, default: "#ffffff" },
      accessory: { type: String, default: null },
      hairstyle: { type: String, default: "none" },
      position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        room: { type: String, default: "campus" },
      },
    },

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],

    otp: { type: String, default: null },
    otpExpire: { type: Date, default: null },
    resetOTP: { type: String, default: null },
    resetOTPExpire: { type: Date, default: null },
    position: {
      areaSlug: { type: String, default: null },
      x: { type: Number, default: 100 },
      y: { type: Number, default: 100 },
      lastUpdated: { type: Date, default: Date.now }
    },
  },

  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
