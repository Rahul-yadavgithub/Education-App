// services/aiClient.js

const { ChatOpenAI } = require("@langchain/openai");
const aiConfig = require("../../configuration/aiConfig.js");

/**
 * OpenRouter-based LangChain client instance
 */
const client = new ChatOpenAI({
  model: aiConfig.OPENAI_MODEL || "openai/gpt-oss-20b:free",
  apiKey: aiConfig.OPENROUTER_API_KEY, // ✅ must match your OpenRouter key
  temperature: aiConfig.TEMPERATURE || 0.7,
  maxTokens: aiConfig.MAX_TOKENS || 1000,

  // ✅ critical part: force LangChain to use OpenRouter endpoint
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": aiConfig.SITE_URL || "", // optional but recommended for OpenRouter ranking
      "X-Title": aiConfig.SITE_NAME || "",     // optional
    },
  },
});

/**
 * Calls the LLM via LangChain’s ChatOpenAI (OpenRouter backend)
 * @param {string} prompt - The user prompt or question.
 * @param {Object} options - Optional: { temperature, maxTokens }
 * @returns {Promise<{response: string, raw: object}>}
 */
const callLLM = async (prompt, options = {}) => {
  const temperature = options.temperature ?? aiConfig.TEMPERATURE;
  const maxTokens = options.maxTokens || aiConfig.MAX_TOKENS;

  try {
    // Construct messages
    const messages = [
      { role: "system", content: "You are an expert academic examiner and exam paper generator. Output valid JSON when requested." },
      { role: "user", content: prompt },
    ];

    // LangChain’s ChatOpenAI interface requires an array of messages
    const resp = await client.invoke(messages, {
      temperature,
      maxTokens,
    });

    const content = resp?.content || "";
    return { response: content, raw: resp };
  } catch (err) {
    console.error("LLM call error:", err?.response?.data || err.message);
    throw err;
  }
};

module.exports = { callLLM };
