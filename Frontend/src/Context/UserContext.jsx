import React, { createContext, useContext, useState, useMemo } from "react";

// Create Context
export const UserDataContext = createContext(null);

// Custom hook for easier usage
export const useUser = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider Component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (userData) => setUser(userData);
  const clearUser = () => setUser(null);

  // Memoize to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      updateUser,
      clearUser,
    }),
    [user]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserProvider;
