const express = require("express");

const {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation
} = require("../controllers/educationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getEducation);

// Admin only
router.post("/", protect, createEducation);
router.put("/:id", protect, updateEducation);
router.delete("/:id", protect, deleteEducation);

module.exports = router;