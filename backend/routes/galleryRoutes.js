const express = require("express");

const {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require("../controllers/galleryController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getGallery);
router.get("/:id", getGalleryItem);

// Admin only
router.post(
  "/",
  protect,
  upload.single("image"),
  createGalleryItem
);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateGalleryItem
);

router.delete("/:id", protect, deleteGalleryItem);

module.exports = router;