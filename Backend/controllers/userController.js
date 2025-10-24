const { getUserModel } = require("../utils/getUserModel.js");

const getCurrentUser = async (req, res) => {
  try {
    // Dynamically get the model based on the user's role/type
    const UserModel = getUserModel(req.userType);
    if (!UserModel) {
      return res.status(400).json({ message: `Invalid user type: ${req.userType}` });
    }

    // Fetch user by ID, exclude password
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user object
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getCurrentUser Error:", error);
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};

module.exports = getCurrentUser;
