import StudentModel from "../model/User/StudentModel.js";
import TeacherModel from "../model/User/TeacherModel.js";
import HeadOfCollegeModel from "../model/User/HeadOfCollege.js";
import HeadOfDistrictModel from "../model/User/HeadOfDistrict.js";

export const getUserModel = (userType) => {
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
