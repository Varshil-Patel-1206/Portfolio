const Skill = require("../models/Skill");

// Get all skills
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skills",
      error: error.message
    });
  }
};

// Get single skill
const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found"
      });
    }

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch skill",
      error: error.message
    });
  }
};

// Create skill
const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create skill",
      error: error.message
    });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found"
      });
    }

    res.status(200).json(skill);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update skill",
      error: error.message
    });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found"
      });
    }

    res.status(200).json({
      message: "Skill deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete skill",
      error: error.message
    });
  }
};

module.exports = {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
};