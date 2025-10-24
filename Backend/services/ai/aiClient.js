// services/aiClient.js

const OpenAI = require("openai"); // official OpenAI client
const aiConfig = require("../../configuration/aiConfig.js");

/**
 * OpenAI client instance
 */
const client = new OpenAI({ apiKey: aiConfig.OPENAI_API_KEY });

/**
 * Calls the LLM (Chat Completions API)
 * @param {string} prompt
 * @param {Object} options - { temperature, maxTokens }
 * @returns {Object} { response: string, raw: object, tokens: number }
 */
const callLLM = async (prompt, options = {}) => {
  const model = aiConfig.OPENAI_MODEL || "gpt-4o-mini";
  const temperature = typeof options.temperature !== "undefined" ? options.temperature : aiConfig.TEMPERATURE;
  const maxTokens = options.maxTokens || aiConfig.MAX_TOKENS;

  try {
    const messages = [
      { role: "system", content: "You are an expert academic examiner and exam paper generator. Output valid JSON when requested." },
      { role: "user", content: prompt }
    ];

    const resp = await client.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    });

    const content = resp?.choices?.[0]?.message?.content || "";
    const tokens = resp?.usage ? (resp.usage.total_tokens || 0) : 0;

    return { response: content, raw: resp, tokens };
  } catch (err) {
    console.error("LLM call error:", err);
    throw err;
  }
};

module.exports = { callLLM };
