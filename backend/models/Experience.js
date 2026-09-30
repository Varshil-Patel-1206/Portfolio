const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      default: "Internship"
    },

    description: {
      type: String,
      required: true
    },

    technologies: {
      type: [String],
      default: []
    },

    startDate: {
      type: String,
      required: true
    },

    endDate: {
      type: String,
      default: "Present"
    },

    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Experience", experienceSchema);