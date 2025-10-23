import mongoose from "mongoose";
import { UserModel } from "./User.js";

const StudentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: false },
  grade: { type: String , required: false},
  // Add any other student-specific fields
}, { timestamps: true });

const StudentModel = UserModel.discriminator("Student", StudentSchema);

export default StudentModel;
