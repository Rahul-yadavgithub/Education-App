// models/HeadOfCollege.js

const mongoose = require("mongoose");
const { UserModel } = require("./User.js");

const HeadOfCollegeSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    otherCollege: { type: String }, // if collegeName === "Other"
    designation: { type: String, default: "Head of College" },
  },
  { timestamps: true }
);

const HeadOfCollegeModel = UserModel.discriminator("Principle", HeadOfCollegeSchema);

module.exports = HeadOfCollegeModel; // ✅ default export
