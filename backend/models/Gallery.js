const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    tools: {
      type: [String],
      default: []
    },

    featured: {
      type: Boolean,
      default: false
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

module.exports = mongoose.model("Gallery", gallerySchema);