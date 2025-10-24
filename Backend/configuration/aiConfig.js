const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
  TEMPERATURE: parseFloat(process.env.TEMPERATURE || "0.2"),
  MAX_TOKENS: parseInt(process.env.MAX_TOKEN_LIMIT || "3200", 10)
};
