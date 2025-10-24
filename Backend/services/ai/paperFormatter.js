// utils/formatPaper.js

const Paper = require("../../model/Genration/Paper.js");

/**
 * Safely parse LLM JSON output
 * @param {string} text
 * @returns {Object}
 */
const safeJsonParse = (text) => {
  try {
    const start = text.indexOf("{");
    const jsonText = text.slice(start);
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error("Failed to parse LLM JSON output: " + err.message);
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

  if (!obj.questions || !Array.isArray(obj.questions)) {
    throw new Error("LLM output missing questions array");
  }

  const questions = obj.questions.map((q) => ({
    text: q.text || q.question || "",
    marks: q.marks || q.mark || 0,
    difficulty: q.difficulty || "medium",
    type: q.type || "short",
    subparts: q.subparts || []
  }));

  const answerKey = (obj.answerKey || []).map((a) => ({
    questionIndex: a.questionIndex !== undefined ? a.questionIndex : a.qIndex ?? null,
    answer: a.answer || a.text || ""
  }));

  const paper = {
    subject: obj.subject || meta.subject || "Unknown",
    totalMarks: obj.totalMarks || meta.totalMarks || 0,
    difficulty: obj.difficulty || meta.difficulty || "Mixed",
    duration: obj.duration || meta.duration || "",
    numQuestions: obj.numQuestions || questions.length,
    questions,
    answerKey,
    metadata: obj.metadata || {},
    referenceIds: meta.referenceIds || [],
    createdBy: meta.createdBy
  };

  return paper;
};

module.exports = { formatPaperFromLLM };
