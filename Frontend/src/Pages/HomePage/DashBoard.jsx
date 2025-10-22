import React, { useContext } from "react";
import DashboardLayout from "../../Components/LayOuts/DashboardLayout.jsx";
import { UserDataContext } from "../../Context/UserContext.jsx";

const Dashboard = () => {
  const { user } = useContext(UserDataContext); // get user info if needed

  return (
    <DashboardLayout activeMenu="dashboard">
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome to Dashboard
        </h1>
        <p className="text-gray-600">
          {user ? `Logged in as ${user.email}` : "You have successfully logged in!"}
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
