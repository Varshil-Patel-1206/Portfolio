const express = require("express");

const {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification
} = require("../controllers/certificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getCertifications);
router.get("/:id", getCertification);

// Admin only
router.post("/", protect, createCertification);
router.put("/:id", protect, updateCertification);
router.delete("/:id", protect, deleteCertification);

module.exports = router;