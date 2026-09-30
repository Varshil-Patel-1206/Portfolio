const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ""
    },

    technologies: {
      type: [String],
      default: []
    },

    githubLink: {
      type: String,
      default: ""
    },

    liveLink: {
      type: String,
      default: ""
    },

    category: {
      type: String,
      default: "Web Development"
    },

    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);