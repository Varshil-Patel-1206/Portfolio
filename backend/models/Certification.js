const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    organization: {
      type: String,
      required: true,
      trim: true
    },

    issueDate: {
      type: String,
      required: true
    },

    credentialId: {
      type: String,
      default: ""
    },

    credentialUrl: {
      type: String,
      default: ""
    },

    certificateImage: {
      type: String,
      default: ""
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

module.exports = mongoose.model("Certification", certificationSchema);