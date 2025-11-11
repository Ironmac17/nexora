// seedAreas.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Area = require("./models/Area");

// Load env variables
dotenv.config({ path: "./.env" });

const areas = [
  { name: "CS Block", slug: "cs-block" },
  { name: "Mechanical Workshop", slug: "mechanical-workshop" },
  { name: "Library", slug: "library" },
  { name: "Food Court", slug: "food-court" },
  { name: "Hostels Zone", slug: "hostels-zone" },
  { name: "Sports Complex", slug: "sports-complex" },
  { name: "Cricket Field", slug: "cricket-field" },
  { name: "Main Entrance", slug: "main-entrance" },
  { name: "Polytechnic Gate", slug: "polytechnic-gate" },
  { name: "TSLS Gate", slug: "tsls-gate" },
];

async function seedAreas() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Optional: clear existing areas to avoid duplicates
    await Area.deleteMany({});
    console.log("🧹 Cleared old areas");

    await Area.insertMany(areas);
    console.log("🌱 Inserted campus areas successfully!");

    mongoose.connection.close();
    console.log("🚪 MongoDB connection closed.");
  } catch (err) {
    console.error("❌ Error seeding areas:", err.message);
    process.exit(1);
  }
}

seedAreas();
