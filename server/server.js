require("dotenv").config()
const express =require("express");
const cors=require("cors")
const path = require("path");
const connectDB = require("./config/db");
require("./models/Note");
const authRoutes=require("./routes/authRoutes")
// const chatRoutes=require("./routes/chatRoutes")
// const clubRoutes=require("./routes/clubRoutes")
const noteRoutes=require("./routes/noteRoutes")
const userRoutes=require("./routes/userRoutes")

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
connectDB();
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Nexora API is running...");
});


app.use("/api/nex/auth",authRoutes);
// app.use("/api/nex/chat",chatRoutes);
// app.use("/api/nex/club",clubRoutes);
app.use("/api/nex/note",noteRoutes);
app.use("/api/nex/user",userRoutes);



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
