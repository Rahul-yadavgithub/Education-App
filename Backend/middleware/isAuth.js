import { getUserModel } from "../utils/getUserModel.js";
import { verifyToken } from "../utils/token.js";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token available. Login again." });
    }

    // Verify token
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    const { userId, userType } = decoded;

    if (!userId || !userType) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Get the correct model dynamically
    const UserModel = getUserModel(userType);

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user info to request
    req.userId = userId;
    req.user = user;
    req.userType = userType;

    next();
  } catch (error) {
    return res.status(500).json({ message: `Authentication Error: ${error.message}` });
  }
};

export default isAuth;
