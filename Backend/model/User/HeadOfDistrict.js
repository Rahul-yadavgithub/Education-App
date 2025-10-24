// models/HeadOfDistrict.js

const mongoose = require("mongoose");
const { UserModel } = require("./User.js");

const HeadOfDistrictSchema = new mongoose.Schema(
  {
    districtName: { 
      type: String, 
      required: true 
    },
    officeId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    designation: { 
      type: String, 
      default: "Head of District" 
    },
  },
  { timestamps: true }
);

const HeadOfDistrictModel = UserModel.discriminator("District", HeadOfDistrictSchema);

module.exports = HeadOfDistrictModel;
