// utils/promptBuilder.js

/**
 * buildPrompt: constructs a deterministic prompt for syllabus-aware, standard-aware, and distribution-aware question generation.
 * Integrates RAG context (syllabus / reference PDFs) and ensures class/standard-sensitive difficulty mapping.
 * 
 * @param {Object} params - { subject, numQuestions, totalMarks, difficulty, duration, questionTypes, language, standard, distribution }
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
    language = "English",
    standard = "6",
    distribution = null // e.g., { easy: 5, medium: 6, hard: 2 }
  } = params;

  const types = Array.isArray(questionTypes) ? questionTypes.join(", ") : questionTypes;

  const contextSnippet = context
    ? `\n---\nSyllabus / References (use only relevant parts from the reference books):\n${context}\n---\n`
    : "";

  const distributionSnippet = distribution
    ? `\nUse this question difficulty distribution:\nEasy: ${distribution.easy || 0}, Medium: ${distribution.medium || 0}, Hard: ${distribution.hard || 0}\n`
    : "";

  return `
You are an expert academic examiner and curriculum-aligned question paper generator. 

Instructions:
1. Consider the class/standard: ${standard}. Adjust question difficulty according to the grade level.
   - For example, "Class 6" questions should be age-appropriate and conceptually simpler than "Class 12".
   - Ensure higher classes can have more conceptual and challenging questions.

2. Use the following syllabus and reference material for generating questions:
${contextSnippet}

3. Follow these user-specified parameters:
- Subject: ${subject}
- Language: ${language}
- Number of Questions: ${numQuestions}
- Total Marks: ${totalMarks}
- Duration: ${duration || "As specified"}
- Question Types Available: ${types}
${distributionSnippet}

4. Requirements:
- Produce exactly ${numQuestions} questions that sum to ${totalMarks} marks.
- Respect the requested difficulty distribution (Easy/Medium/Hard).
- For each question include: 
  {
    "text": "Question text",
    "marks": number,
    "difficulty": "easy" | "medium" | "hard",
    "type": "short" | "long" | "mcq",
    "subparts": [] // if applicable
  }
- Provide an "answerKey" array giving concise answers for each question (or subparts).
- Include "metadata" containing distribution summary (marks per difficulty, total marks per type).
- Output only valid JSON. If anything cannot be satisfied, include a JSON "error" field.

Top-level JSON structure:
{
  "subject": "${subject}",
  "standard": "${standard}",
  "totalMarks": ${totalMarks},
  "duration": "${duration}",
  "numQuestions": ${numQuestions},
  "questions": [],
  "answerKey": [],
  "metadata": { "distribution": { "easy": 0, "medium": 0, "hard": 0 } },
  "notes": ""
}

End of prompt.
`;
};

module.exports = { buildPrompt };
