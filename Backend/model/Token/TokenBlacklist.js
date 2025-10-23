// models/TokenBlacklist.js
import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

// Automatically remove expired blacklisted tokens
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
