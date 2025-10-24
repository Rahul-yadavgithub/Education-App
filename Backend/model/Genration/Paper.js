// models/Genration/Paper.js

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  marks: { type: Number, required: true },
  difficulty: { type: String },
  type: { type: String }
});

const paperSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  difficulty: { type: String },
  duration: { type: String },
  numQuestions: { type: Number },
  questions: [questionSchema],
  standard: { type: Number, required: true },
  answerKey: [{ questionIndex: Number, answer: String }],
  metadata: { type: Object, default: {} },
  referenceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reference" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const Paper = mongoose.model("Paper", paperSchema);

module.exports = Paper;
