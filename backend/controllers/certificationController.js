const Certification = require("../models/Certification");

// Get all certifications
const getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ order: 1 });

    res.status(200).json(certifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch certifications",
      error: error.message
    });
  }
};

// Get single certification
const getCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        message: "Certification not found"
      });
    }

    res.status(200).json(certification);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch certification",
      error: error.message
    });
  }
};

// Create certification
const createCertification = async (req, res) => {
  try {
    const certification = await Certification.create(req.body);

    res.status(201).json(certification);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create certification",
      error: error.message
    });
  }
};

// Update certification
const updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!certification) {
      return res.status(404).json({
        message: "Certification not found"
      });
    }

    res.status(200).json(certification);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update certification",
      error: error.message
    });
  }
};

// Delete certification
const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(
      req.params.id
    );

    if (!certification) {
      return res.status(404).json({
        message: "Certification not found"
      });
    }

    res.status(200).json({
      message: "Certification deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete certification",
      error: error.message
    });
  }
};

module.exports = {
  getCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification
};