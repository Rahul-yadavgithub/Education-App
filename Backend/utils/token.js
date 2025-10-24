// utils/token.js
const jwt = require("jsonwebtoken");

/**
 * Generates access and refresh tokens.
 * @param {Object} payload - should contain { id, userType }
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokens = (payload) => {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined in environment variables.");
  }

  try {
    // Access Token — short-lived
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
      algorithm: "HS512",
    });

    // Refresh Token — long-lived
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
      algorithm: "HS512",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error.message);
    throw new Error("Token generation failed.");
  }
};

/**
 * Verifies a JWT token using a secret.
 * @returns {Object|null} decoded payload or null if invalid
 */
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Invalid Token:", error.message);
    return null;
  }
};

/**
 * Refreshes access token using refresh token
 */
const refreshAccessToken = (refreshToken) => {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets missing in environment variables.");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Recreate short-lived access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, userType: decoded.userType },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
        algorithm: "HS512",
      }
    );

    return newAccessToken;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("Refresh token expired");
    } else {
      console.error("Invalid refresh token:", error.message);
    }
    return null;
  }
};

module.exports = { generateTokens, verifyToken, refreshAccessToken };
