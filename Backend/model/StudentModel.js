import mongoose from "mongoose";
import { UserModel } from "./User.js";

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  grade: { type: String },
  // Add any other student-specific fields
}, { timestamps: true });

const StudentModel = UserModel.discriminator("Student", StudentSchema);

export default StudentModel;
