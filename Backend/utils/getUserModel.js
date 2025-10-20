import StudentModel from "../model/StudentModel.js";
import TeacherModel from "../model/TeacherModel.js";
import HeadOfCollegeModel from "../model/HeadOfCollege.js";
import HeadOfDistrictModel from "../model/HeadOfDistrict.js";

export const getUserModel = (userType) => {
  switch (userType) {
    case "Student":
      return StudentModel;
    case "Teacher":
      return TeacherModel;
    case "HeadOfCollege":
      return HeadOfCollegeModel;
    case "HeadOfDistrict":
      return HeadOfDistrictModel;
    default:
      throw new Error("Invalid userType");
  }
};
