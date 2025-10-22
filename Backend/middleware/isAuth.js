// middleware/isAuth.js
import { getUserModel } from "../utils/getUserModel.js";
import { verifyToken } from "../utils/token.js";

const isAuth = async (req, res, next) => {
  try {
    // 1️⃣ Extract token — support cookies and headers
    const bearerHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      (bearerHeader && bearerHeader.startsWith("Bearer ")
        ? bearerHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 2️⃣ Verify token
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const { id, userType } = decoded;
    if (!id || !userType) {
      return res.status(401).json({
        success: false,
        message: "Token missing required data.",
      });
    }

    // 3️⃣ Get model dynamically
    const UserModel = getUserModel(userType);
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: `Invalid user type: ${userType}`,
      });
    }

    // 4️⃣ Find user
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // 5️⃣ Attach to request
    req.userId = id;
    req.userType = userType;
    req.user = user;

    next();
  } catch (error) {
    console.error("isAuth Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal authentication error.",
    });
  }
};

export default isAuth;
