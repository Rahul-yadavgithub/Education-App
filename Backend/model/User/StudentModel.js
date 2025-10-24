// models/Student.js

const mongoose = require("mongoose");
const { UserModel } = require("./User.js");

const StudentSchema = new mongoose.Schema(
  {
    rollNumber: { type: String, required: false },
    grade: { type: String, required: false },
    // Add any other student-specific fields
  },
  { timestamps: true }
);

const StudentModel = UserModel.discriminator("Student", StudentSchema);

module.exports = StudentModel;
