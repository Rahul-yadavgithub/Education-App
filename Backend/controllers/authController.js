import crypto from "crypto";
import { getUserModel } from "../utils/getUserModel.js";
import { generateTokens } from '../utils/token.js';
import sendEmail from '../utils/sendEmail.js';
import { verifyEmailTemplate } from '../utils/EmailTemplate/verifyEmailTemplate.js';
import { resetPasswordTemplate } from '../utils/EmailTemplate/resetPasswordTemplate.js';
import dotenv from 'dotenv';
dotenv.config();

// ------------------ SIGNUP ------------------
export const signUp = async (req, res) => {
  const { name, email, password, profileImageUrl, userType, ...rest } = req.body;

  if (!name || !email || !password || !userType) {
    return res.status(400).json({ message: "All fields including userType are required" });
  }

  try {
    const Model = getUserModel(userType);

    const userExists = await Model.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new Model({ name, email, password, profileImageUrl, ...rest });

    const verificationToken = user.generateVerificationToken();
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/${userType.toLowerCase()}/verify/${verificationToken}`;
    const message = verifyEmailTemplate(verifyUrl, name);
    await sendEmail(email, "Email Verification", message);

    return res.json({ message: "Verification Email sent. Please check your inbox." });
  } catch (error) {
    console.error("SignUp Error", error.message);
    return res.status(500).json({ message: "Server Error Occurred" });
  }
};

// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ message: "Email, password, and userType are required" });
  }

  try {
    const Model = getUserModel(userType);
    const user = await Model.findOne({ email }).select("+password");

    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    if (!user.isVerified) return res.status(400).json({ message: "Please verify your email first" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const { accessToken, refreshToken } = generateTokens({ id: user._id , userType});

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          role: userType,
          name: user.name,
          profileImageUrl : user.profileImageUrl,
        },
      });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------ FORGOT PASSWORD ------------------
export const forgotPassword = async (req, res) => {
  const { email, userType } = req.body;

  if (!email || !userType) return res.status(400).json({ message: "Email and userType required" });

  try {
    const Model = getUserModel(userType);
    const user = await Model.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/${userType.toLowerCase()}/reset-password/${resetToken}`;
    const message = resetPasswordTemplate(resetUrl, user.name);
    await sendEmail(email, "Reset Password", message);

    return res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(500).json({ message: "Server Error Occurred" });
  }
};

// ------------------ RESET PASSWORD ------------------
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log("Fronted Send Token: ", token);

  if (!password) return res.status(400).json({ message: "Please enter a valid password" });

  try {
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log("Reset Hashtoken:", hashToken);

    // Find user dynamically across all models
    const models = [getUserModel("Student"), getUserModel("Teacher"), getUserModel("Principle"), getUserModel("District")];
    let user = null;

    for (const Model of models) {
      user = await Model.findOne({ resetPasswordToken: hashToken, resetPasswordExpire: { $gt: Date.now() } });
      if (user) break;
    }

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password Reset Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// ------------------ LOGOUT ------------------
export const logout = (req, res) => {
  res.status(200).json({ message: "User logged out!" });
};

// ------------------ EMAIL VERIFICATION ------------------
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Check across all user models
    const models = [getUserModel("Student"), getUserModel("Teacher"), getUserModel("Principle"), getUserModel("District")];
    let user = null;

    for (const Model of models) {
      user = await Model.findOne({ verificationToken: token });
      if (user) break;
    }

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
