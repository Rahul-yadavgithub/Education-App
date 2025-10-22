import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext.jsx";
import axiosInstance from "../Utils/axiosInstance.js";
import { API_PATHS } from "../Utils/apiPaths.js";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    // ✅ Step 1: If user already exists, don't fetch again
    if (user) return;

    // ✅ Step 2: Check if token exists before making API call
    const hasToken = document.cookie.includes("token=");

    console.log("This is our fronted HasToken:", hasToken);
    if (!hasToken) {
      console.warn("No auth token found — skipping user fetch.");
      return; // No need to call backend if no token yet
    }

    const fetchUserInfo = async () => {
      try {
        // ✅ Step 3: Fetch user info only if token is available
        const response = await axiosInstance.get(API_PATHS.USER.CURRENT_USER, {
          withCredentials: true,
        });

        if (isMounted && response?.data?.user) {
          updateUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);

        if (isMounted) {
          // ✅ Step 4: Handle invalid/expired token
          clearUser();

          // Redirect safely to role-selection instead of /login
          navigate("/role-selection", { replace: true });
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser, navigate]);
};
