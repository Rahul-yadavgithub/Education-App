import mongoose from "mongoose";
import { UserModel } from "./User.js";

const HeadOfCollegeSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  otherCollege: { type: String }, // if collegeName === "Other"
  designation: { type: String, default: "Head of College" },
}, { timestamps: true });

const HeadOfCollegeModel = mongoose.model("HeadOfCollege", HeadOfCollegeSchema);

export default HeadOfCollegeModel;  // ✅ default export
