const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const projectRoutes = require("./routes/projectRoutes");

const skillRoutes = require("./routes/skillRoutes");

const serviceRoutes = require("./routes/serviceRoutes");

const experienceRoutes = require("./routes/experienceRoutes");

const educationRoutes = require("./routes/educationRoutes");

const certificationRoutes = require("./routes/certificationRoutes");

const galleryRoutes = require("./routes/galleryRoutes");

const messageRoutes = require("./routes/messageRoutes");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "Portfolio API is running"
  });
});

// Project routes
app.use("/api/projects", projectRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/experience", experienceRoutes);

app.use("/api/education", educationRoutes);

app.use("/api/certifications", certificationRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "MulterError" || error instanceof SyntaxError) {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  const PORT = process.env.PORT || 5000;

  await connectDB();

  return app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
