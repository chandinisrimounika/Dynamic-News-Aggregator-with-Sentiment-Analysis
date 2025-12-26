require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const newsRoutes = require("./routes/newsRoutes");

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());              // ✅ allow frontend (localhost:3000)
app.use(express.json());

// base route
app.get("/", (req, res) => {
  res.send("API is running");
});

// news routes
app.use("/api/news", newsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
