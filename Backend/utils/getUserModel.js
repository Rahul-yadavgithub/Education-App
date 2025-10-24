// getUserModel.js
const StudentModel = require("../model/User/StudentModel.js");
const TeacherModel = require("../model/User/TeacherModel.js");
const HeadOfCollegeModel = require("../model/User/HeadOfCollege.js");
const HeadOfDistrictModel = require("../model/User/HeadOfDistrict.js");

const getUserModel = (userType) => {
  switch (userType) {
    case "Student":
      return StudentModel;
    case "Teacher":
      return TeacherModel;
    case "Principle":
      return HeadOfCollegeModel;
    case "District":
      return HeadOfDistrictModel;
    default:
      throw new Error("Invalid userType");
  }
};

module.exports = { getUserModel } ;
