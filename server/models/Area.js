// models/Area.js
const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  usersOnline: { type: Number, default: 0 },
});

module.exports=mongoose.model("Area", areaSchema);
