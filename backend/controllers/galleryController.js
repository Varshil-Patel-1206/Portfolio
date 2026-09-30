const fs = require("fs");
const path = require("path");
const Gallery = require("../models/Gallery");

const removeUploadedFile = (file) => {
  if (file?.path && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
};

const parseTools = (tools) => {
  if (!tools) {
    return [];
  }

  const parsedTools = JSON.parse(tools);

  if (!Array.isArray(parsedTools)) {
    throw new Error("Tools must be a JSON array");
  }

  return parsedTools;
};

// Get all gallery items
const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ order: 1 });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gallery",
      error: error.message
    });
  }
};


// Get single gallery item
const getGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found"
      });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gallery item",
      error: error.message
    });
  }
};


// Create gallery item
const createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tools,
      featured,
      order
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        message: "Title and category are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required"
      });
    }

    const image = `/uploads/gallery/${req.file.filename}`;

    const galleryItem = await Gallery.create({
      title,
      description,
      image,
      category,
      tools: parseTools(tools),
      featured: featured === "true",
      order: order || 0
    });

    res.status(201).json(galleryItem);
  } catch (error) {
    removeUploadedFile(req.file);

    res.status(400).json({
      message: "Failed to create gallery item",
      error: error.message
    });
  }
};


// Update gallery item
const updateGalleryItem = async (req, res) => {
  let previousImagePath;

  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found"
      });
    }

    const {
      title,
      description,
      category,
      tools,
      featured,
      order
    } = req.body;

    item.title = title || item.title;
    item.description = description ?? item.description;
    item.category = category || item.category;

    if (tools) {
      item.tools = parseTools(tools);
    }

    if (featured !== undefined) {
      item.featured = featured === "true";
    }

    if (order !== undefined) {
      item.order = order;
    }

    // Replace old image if a new one is uploaded
    if (req.file) {
      if (item.image) {
        previousImagePath = path.join(
          __dirname,
          "..",
          item.image.replace("/uploads/", "uploads/")
        );
      }

      item.image = `/uploads/gallery/${req.file.filename}`;
    }

    await item.save();

    if (previousImagePath && fs.existsSync(previousImagePath)) {
      try {
        fs.unlinkSync(previousImagePath);
      } catch (cleanupError) {
        console.error("Failed to remove replaced gallery image:", cleanupError.message);
      }
    }

    res.status(200).json(item);
  } catch (error) {
    removeUploadedFile(req.file);

    res.status(400).json({
      message: "Failed to update gallery item",
      error: error.message
    });
  }
};


// Delete gallery item
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found"
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    if (item.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        item.image.replace("/uploads/", "uploads/")
      );

      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (cleanupError) {
        console.error("Failed to remove deleted gallery image:", cleanupError.message);
      }
    }

    res.status(200).json({
      message: "Gallery item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete gallery item",
      error: error.message
    });
  }
};


module.exports = {
  getGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
