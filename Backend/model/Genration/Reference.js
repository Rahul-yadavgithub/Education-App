// models/Genration/Reference.js

const mongoose = require("mongoose");

const referenceSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  size: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chunksCount: { type: Number, default: 0 },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const Reference = mongoose.model("Reference", referenceSchema);

module.exports = Reference;
