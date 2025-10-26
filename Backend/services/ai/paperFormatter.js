// utils/formatPaper.js

// Ensure this path is correct for your project structure
// const Paper = require("../../model/Genration/Paper.js");

/**
 * Safely parse LLM JSON output, cleaning up common LLM preambles.
 * @param {string} text
 * @returns {Object|null} - Parsed object or null if invalid
 */
const safeJsonParse = (text) => {
  if (!text || typeof text !== "string") return null;

  try {
    // Attempt to find the first curly brace to cut off preamble text
    const start = text.indexOf("{");
    if (start === -1) return null;

    const jsonText = text.slice(start);

    // Try parsing JSON
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("LLM JSON parsing failed:", err.message);
    // console.error("Raw LLM output (for debug):", text);
    return null;
  }
};

/**
 * Normalizes a single question object, including options and subparts.
 * @param {Object} q - Raw question object from LLM
 * @returns {Object} Normalized question object
 */
const normalizeQuestion = (q) => {
  const normalized = {
    text: q.text || q.question || "",
    marks: q.marks || q.mark || 0,
    difficulty: q.difficulty || "medium",
    type: q.type || "short", // e.g., 'short', 'long', 'mcq'
    
    // NEW: Safely normalize multiple-choice options
    options: Array.isArray(q.options) 
        ? q.options.filter(o => typeof o === 'string' && o.trim() !== '') 
        : [],
    
    // Recursively normalize subparts
    subparts: Array.isArray(q.subparts) 
        ? q.subparts.map(sp => normalizeQuestion(sp)) 
        : [],
  };
  return normalized;
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

  // Normalize all questions
  const questions = Array.isArray(obj.questions) ? obj.questions : [];
  const formattedQuestions = questions.map(q => normalizeQuestion(q));

  // Normalize Answer Key
  const formattedAnswerKey = Array.isArray(obj.answerKey)
    ? obj.answerKey.map((a) => ({
        // Use a consistent index field
        questionIndex: a.questionIndex !== undefined ? a.questionIndex : a.qIndex ?? null,
        answer: a.answer || a.text || "",
        // NEW: Capture the index for subparts if needed (e.g., '1a', '2b')
        subpartIndex: a.subpartIndex || null
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
