const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || "openai/gpt-oss-20b:free",
  SITE_URL: process.env.CLIENT_URL || "http://localhost:5173/",
  SITE_NAME: process.env.SITE_NAME || "EduConnect",
  TEMPERATURE: parseFloat(process.env.TEMPERATURE || "0.2"),
  MAX_TOKENS: parseInt(process.env.MAX_TOKEN_LIMIT || "3200", 10)
};
