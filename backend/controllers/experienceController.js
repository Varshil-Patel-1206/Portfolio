const Experience = require("../models/Experience");

// Get all experiences
const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });

    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch experiences",
      error: error.message
    });
  }
};

// Get single experience
const getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found"
      });
    }

    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch experience",
      error: error.message
    });
  }
};

// Create experience
const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create experience",
      error: error.message
    });
  }
};

// Update experience
const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found"
      });
    }

    res.status(200).json(experience);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update experience",
      error: error.message
    });
  }
};

// Delete experience
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found"
      });
    }

    res.status(200).json({
      message: "Experience deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete experience",
      error: error.message
    });
  }
};

module.exports = {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
};