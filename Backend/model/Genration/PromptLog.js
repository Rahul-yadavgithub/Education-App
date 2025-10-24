// models/Genration/PromptLog.js

const mongoose = require("mongoose");

const promptLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  promptText: String,
  promptInput: Object,
  responseText: String,
  tokensUsed: Number,
  model: String,
  createdAt: { type: Date, default: Date.now }
});

const PromptLog = mongoose.model("PromptLog", promptLogSchema);

module.exports = PromptLog;
