// utils/promptBuilder.js

/**
 * buildPrompt: constructs a deterministic prompt that instructs the LLM to return a structured JSON.
 * We embed the provided RAG context (syllabus chunks) - keep context length limited.
 * 
 * @param {Object} params - { subject, numQuestions, totalMarks, difficulty, duration, questionTypes, language }
 * @param {string} context - optional syllabus/reference text
 * @returns {string} prompt for LLM
 */
const buildPrompt = (params = {}, context = "") => {
  const {
    subject,
    numQuestions,
    totalMarks,
    difficulty,
    duration,
    questionTypes = ["short", "long", "mcq"],
    language = "English"
  } = params;

  const types = Array.isArray(questionTypes) ? questionTypes.join(", ") : questionTypes;

  const contextSnippet = context ? `\n---\nSyllabus / References (use only relevant parts):\n${context}\n---\n` : "";

  return `
You are an expert academic examiner who must generate a high-quality, original, syllabus-relevant question paper.

Output only valid JSON (no extra commentary). If you must include explanatory text include it in a "notes" field.

Parameters:
- Subject: ${subject}
- Language: ${language}
- Number of Questions: ${numQuestions}
- Total Marks: ${totalMarks}
- Difficulty: ${difficulty || "Mixed"}
- Duration: ${duration || "As specified"}
- Question Types Available: ${types}

${contextSnippet}

Requirements:
1. Produce exactly ${numQuestions} questions that sum to ${totalMarks} marks.
2. Distribute difficulty (easy/medium/hard) reasonably based on the difficulty parameter.
3. For each question include: "text", "marks", "difficulty", "type", optionally "subparts" (array) if needed.
4. Provide an "answerKey" array giving concise answers for each question (or for subparts).
5. Provide "metadata" containing distribution summary (marks per difficulty).
6. Output must be valid JSON with this top-level structure:

{
  "subject": "${subject}",
  "totalMarks": ${totalMarks},
  "duration": "${duration}",
  "numQuestions": ${numQuestions},
  "questions": [
    { "text": "Question text", "marks": 5, "difficulty": "medium", "type": "short" }
  ],
  "answerKey": [
    { "questionIndex": 0, "answer": "Concise answer text" }
  ],
  "metadata": { "distribution": { "easy": 0, "medium": 0, "hard": 0 } },
  "notes": ""
}

Return only JSON. If you cannot obey, return an error object in JSON.

End of prompt.
`;
};

module.exports = { buildPrompt };
