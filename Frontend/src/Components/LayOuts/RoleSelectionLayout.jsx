import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, User, School, Building2 } from "lucide-react";

const roles = [
  {
    name: "Student",
    icon: <GraduationCap className="w-10 h-10 text-blue-500" />,
    path: "/student/login",   
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Teacher",
    icon: <User className="w-10 h-10 text-green-500" />,
    path: "/teacher/login",   
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Principal",
    icon: <School className="w-10 h-10 text-purple-500" />,
    path: "/principal/login",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Head of District",
    icon: <Building2 className="w-10 h-10 text-orange-500" />,
    path: "/district/login",
    gradient: "from-orange-500 to-yellow-500",
  },
];
const RoleSelectionLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-8 text-gray-800 text-center"
      >
        Welcome to EduConnect Portal
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
      >
        {roles.map((role, index) => (
          <motion.div
            key={role.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => navigate(role.path)}
            className={`cursor-pointer bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center border-t-8 border-transparent hover:border-${role.gradient.split(' ')[1]} transition duration-300`}
          >
            <div
              className={`bg-gradient-to-r ${role.gradient} p-4 rounded-full shadow-md mb-4`}
            >
              {role.icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {role.name}
            </h2>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-gray-600 mt-8 text-center"
      >
        Please select your role to proceed with login.
      </motion.p>
    </div>
  );
};

export default RoleSelectionLayout;
