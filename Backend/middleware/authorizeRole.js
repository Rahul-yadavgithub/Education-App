// middleware/authorizeRole.js

/**
 * Middleware to authorize specific roles.
 * Usage: authorizeRole("student", "teacher", "admin")
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // 1️⃣ Ensure user is authenticated
      if (!req.user || !req.userType) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated.",
        });
      }

      // 2️⃣ Normalize for case-insensitive comparison
      const userRole = req.userType.toLowerCase();
      const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

      // 3️⃣ Check if user’s role is allowed
      if (!normalizedAllowed.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: Role '${req.userType}' not permitted.`,
        });
      }

      // 4️⃣ Role is allowed, continue
      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error during role check.",
      });
    }
  };
};

export default authorizeRole;
