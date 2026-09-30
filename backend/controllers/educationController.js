const Education = require("../models/Education");

// Get all education
const getEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1 });

    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch education",
      error: error.message
    });
  }
};

// Create education
const createEducation = async (req, res) => {
  try {
    const education = await Education.create(req.body);

    res.status(201).json(education);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create education",
      error: error.message
    });
  }
};

// Update education
const updateEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!education) {
      return res.status(404).json({
        message: "Education not found"
      });
    }

    res.status(200).json(education);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update education",
      error: error.message
    });
  }
};

// Delete education
const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);

    if (!education) {
      return res.status(404).json({
        message: "Education not found"
      });
    }

    res.status(200).json({
      message: "Education deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete education",
      error: error.message
    });
  }
};

module.exports = {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation
};