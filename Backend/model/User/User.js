// models/UserModel.js

const mongoose = require("mongoose");
const { UserBaseSchema } = require("./UserBaseSchema.js");

const UserModel = mongoose.model("User", UserBaseSchema);

module.exports = { UserModel };
