import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPaths";

// ✅ Create Context
export const UserDataContext = createContext(null); // <-- named export

// ✅ Custom Hook for easy usage
export const useUser = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// ✅ Provider Component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const res = await axiosInstance.get(API_PATHS.USER.CURRENT_USER, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem("accessToken");
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        localStorage.removeItem("accessToken");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
  };

  const clearUser = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  const value = useMemo(
    () => ({
      user,
      loadingUser,
      loginUser,
      updateUser,
      clearUser,
    }),
    [user, loadingUser]
  );

  return (
    <UserDataContext.Provider value={value}>
      {!loadingUser && children}
    </UserDataContext.Provider>
  );
};

export default UserProvider;
