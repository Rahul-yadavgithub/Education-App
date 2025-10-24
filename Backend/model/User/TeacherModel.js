// models/Teacher.js

const mongoose = require("mongoose");
const { UserModel } = require("./User.js");

const TeacherSchema = new mongoose.Schema(
  {
    domain: { 
      type: String, 
      enum: ["Math", "Science", "Computer", "History", "Hindi", "English", "Art", "Other"], 
      required: true 
    },
    otherDomain: { type: String }, // used if domain === "Other"
    dateOfJoining: { type: Date, required: true },
    employeeId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const TeacherModel = UserModel.discriminator("Teacher", TeacherSchema);

module.exports = TeacherModel;
