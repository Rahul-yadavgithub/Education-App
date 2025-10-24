// models/Genration/JobModel.js

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETE", "FAILED"],
      default: "PENDING",
    },
    progress: {
      type: Number,
      default: 0,
    },
    // This will store the final generated Paper ID
    result: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper", // Links to your existing Paper model
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    // Field to show a message to the user
    statusMessage: {
      type: String,
      default: "Job queued...",
    },
    // Store the original input for reference
    promptInput: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = { Job };
