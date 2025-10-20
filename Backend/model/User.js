import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook", "microsoft"],
      default: "local",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // ✅ bcrypt.hash not crypto.hash
    next();
  } catch (error) {
    next(error);
  }
});

// 🔍 Compare entered password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 📨 Generate verification token
UserSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(64).toString("hex");
  this.verificationToken = token;
  return token;
};

// 🔑 Generate reset password token
UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(64).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

// ✅ Correct export for ES modules
export default mongoose.model("User", UserSchema);
