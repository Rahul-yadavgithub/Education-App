import React, { useState } from "react";
import StudentForm from "../Forms/StudentForm.jsx";
import TeacherForm from "../Forms/TeacherForm.jsx";
import PrincipalForm from "../Forms/PrincipalForm.jsx";
import HeadOfDistrictForm from "../Forms/HeadOfDistrictForm.jsx";
import { API_PATHS } from "../../Utils/apiPaths";
import { useUser } from "../../Context/UserContext.jsx"; 
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector.jsx";

const SignUpForm = ({ domain, title, redirectTo }) => {
  const { updateUser } = useUser(); 
  const [profilePic, setProfilePic] = useState(null); // ✅ Profile pic state

  // Dynamically generate API path for signup
  const getApiPath = () => {
    switch (domain.toLowerCase()) {
      case "student":
        return API_PATHS.AUTH.REGISTER("student");
      case "teacher":
        return API_PATHS.AUTH.REGISTER("teacher");
      case "principal":
        return API_PATHS.AUTH.REGISTER("principal");
      case "district":
      case "headofdistrict":
        return API_PATHS.AUTH.REGISTER("headofdistrict");
      default:
        return null;
    }
  };

  const renderForm = () => {
    const apiPath = getApiPath();
    if (!apiPath) return <p className="text-red-500">Invalid domain type</p>;

    const props = { apiPath, domain, title, redirectTo, updateUser, profilePic, setProfilePic }; 

    switch (domain.toLowerCase()) {
      case "student":
        return <StudentForm {...props} />;
      case "teacher":
        return <TeacherForm {...props} />;
      case "principal":
        return <PrincipalForm {...props} />;
      case "district":
      case "headofdistrict":
        return <HeadOfDistrictForm {...props} />;
      default:
        return <p className="text-red-500">Invalid domain type</p>;
    }
  };

  return <>{renderForm()}</>;
};

export default SignUpForm;
