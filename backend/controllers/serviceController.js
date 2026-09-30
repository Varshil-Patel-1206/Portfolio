const Service = require("../models/Service");

// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message
    });
  }
};

// Get single service
const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch service",
      error: error.message
    });
  }
};

// Create service
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create service",
      error: error.message
    });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update service",
      error: error.message
    });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.status(200).json({
      message: "Service deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete service",
      error: error.message
    });
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
};