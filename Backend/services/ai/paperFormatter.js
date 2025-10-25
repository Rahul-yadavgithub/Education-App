// utils/formatPaper.js
const Paper = require("../../model/Genration/Paper.js");

/**
 * Safely parse LLM JSON output
 * @param {string} text
 * @returns {Object|null} - Parsed object or null if invalid
 */
const safeJsonParse = (text) => {
  if (!text || typeof text !== "string") return null;

  try {
    const start = text.indexOf("{");
    if (start === -1) return null;

    const jsonText = text.slice(start);

    // Try parsing JSON
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("LLM JSON parsing failed:", err.message);
    console.error("Raw LLM output:", text);
    return null;
  }
};

/**
 * Convert LLM output text into normalized Paper object
 * @param {string} llmText - JSON string from LLM
 * @param {Object} meta - optional metadata (subject, totalMarks, etc.)
 * @returns {Object} normalized Paper object
 */
const formatPaperFromLLM = async (llmText, meta = {}) => {
  const obj = safeJsonParse(llmText);

  // Fallback empty paper if parsing fails
  if (!obj) {
    console.warn("Using fallback empty paper due to invalid LLM output.");
    return {
      subject: meta.subject || "Unknown",
      totalMarks: meta.totalMarks || 0,
      difficulty: meta.difficulty || "Mixed",
      duration: meta.duration || "",
      numQuestions: 0,
      standard: meta.standard || "Unknown",
      questions: [],
      answerKey: [],
      metadata: {},
      referenceIds: meta.referenceIds || [],
      createdBy: meta.createdBy || null,
    };
  }

  // Ensure questions array exists
  const questions = Array.isArray(obj.questions) ? obj.questions : [];
  if (!Array.isArray(obj.questions)) {
    console.warn("LLM output missing questions array, using empty array");
  }

  const formattedQuestions = questions.map((q) => ({
    text: q.text || q.question || "",
    marks: q.marks || q.mark || 0,
    difficulty: q.difficulty || "medium",
    type: q.type || "short",
    subparts: Array.isArray(q.subparts) ? q.subparts : [],
  }));

  const formattedAnswerKey = Array.isArray(obj.answerKey)
    ? obj.answerKey.map((a) => ({
        questionIndex:
          a.questionIndex !== undefined ? a.questionIndex : a.qIndex ?? null,
        answer: a.answer || a.text || "",
      }))
    : [];

  return {
    subject: obj.subject || meta.subject || "Unknown",
    totalMarks: obj.totalMarks || meta.totalMarks || 0,
    difficulty: obj.difficulty || meta.difficulty || "Mixed",
    duration: obj.duration || meta.duration || "",
    numQuestions: obj.numQuestions || formattedQuestions.length,
    standard: obj.standard || meta.standard || "Unknown",
    questions: formattedQuestions,
    answerKey: formattedAnswerKey,
    metadata: obj.metadata || {},
    referenceIds: meta.referenceIds || [],
    createdBy: meta.createdBy || null,
  };
};

module.exports = { formatPaperFromLLM };
