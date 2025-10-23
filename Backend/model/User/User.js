import mongoose from "mongoose";
import { UserBaseSchema } from "./UserBaseSchema.js";

export const UserModel = mongoose.model("User", UserBaseSchema);
