// services/paperGenerator.js

const Paper = require("../../model/Genration/Paper.js");
const PromptLog = require("../../model/Genration/PromptLog.js");
const { Job } = require("../../model/Genration/JobModel.js");
const { buildPrompt } = require("../ai/promptBuilder.js");
const { callLLM } = require("../ai/aiClient.js");
const { fetchContextFromRag } = require("../ai/ragService.js");
const { formatPaperFromLLM } = require("../ai/paperFormatter.js");

const dotenv = require("dotenv");
dotenv.config();

/**
 * Retry helper for async functions
 * @param {Function} fn - async function to retry
 * @param {number} retries - number of retries
 * @param {number} delayMs - delay between retries
 */
const retryAsync = async (fn, retries = 3, delayMs = 2000) => {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastError;
};

/**
 * Generates an AI-based paper in the background
 * @param {string} jobId 
 * @param {Object} user 
 * @param {Object} jobInput 
 */
const generatePaperInBackground = async (jobId, user, jobInput) => {
  try {
    const {
      subject,
      numQuestions,
      totalMarks,
      difficulty,
      duration,
      questionTypes,
      language = "English",
      standard,
      referenceIds = [],
      pdfFile = null,
      distribution = null,
    } = jobInput;

    // 1️⃣ Update job status
    await Job.findByIdAndUpdate(jobId, {
      status: "IN_PROGRESS",
      progress: 10,
      statusMessage: "Preparing context and references...",
    });

    // 2️⃣ Fetch RAG context if references exist
    let ragContext = "";
    if (Array.isArray(referenceIds) && referenceIds.length > 0) {
      try {
        const chunks = await fetchContextFromRag(referenceIds, { topK: 5 });
        if (chunks.length > 0) {
          ragContext = chunks.join("\n\n");
          console.log(`✅ RAG context fetched (${chunks.length} chunks)`);
        } else {
          console.log("ℹ️ Reference IDs provided but no chunks found. Proceeding without RAG context.");
        }
      } catch (err) {
        console.warn("⚠️ Failed to fetch RAG context:", err.message);
      }
    } else {
      console.log("ℹ️ No referenceIds provided; generating paper based on prompt only.");
    }

    // 3️⃣ Update job status: building prompt
    await Job.findByIdAndUpdate(jobId, {
      progress: 25,
      statusMessage: "Building structured AI prompt...",
    });

    // 4️⃣ Build prompt
    const promptInput = { subject, numQuestions, totalMarks, difficulty, duration, questionTypes, language, standard, distribution };
    const prompt = buildPrompt(promptInput, ragContext);

    // 5️⃣ Log the prompt
    const log = await PromptLog.create({
      user: user._id,
      promptText: prompt,
      promptInput,
      model: process.env.OPENAI_MODEL || "openai/gpt-oss-20b:free",
      embeddingProvider: "huggingface/sentence-transformers/all-MiniLM-L6-v2",
    });

    // 6️⃣ Update job: calling LLM
    await Job.findByIdAndUpdate(jobId, {
      progress: 50,
      statusMessage: "Generating paper using AI...",
    });

    // 7️⃣ Call LLM with retries
    const llmResult = await retryAsync(() => callLLM(prompt), 3, 3000);

    // 8️⃣ Save raw response to log
    log.responseText = llmResult.response;
    log.tokensUsed = llmResult.tokens || 0;
    await log.save();

    // 9️⃣ Update job: formatting
    await Job.findByIdAndUpdate(jobId, {
      progress: 85,
      statusMessage: "Formatting generated paper...",
    });

    // 🔟 Parse & format final paper
    const paperObj = await formatPaperFromLLM(llmResult.response, {
      subject,
      totalMarks,
      difficulty,
      duration,
      numQuestions,
      standard,
      pdfFile,
      distribution,
      createdBy: user._id,
      referenceIds: referenceIds?.length ? referenceIds : [],
    });

    // 11️⃣ Save final paper
    const savedPaper = await Paper.create(paperObj);

    // 12️⃣ Mark job COMPLETE
    await Job.findByIdAndUpdate(jobId, {
      status: "COMPLETE",
      progress: 100,
      statusMessage: "Paper generation complete!",
      result: savedPaper._id,
    });

    console.log(`✅ Paper generation completed for job ${jobId}`);
  } catch (err) {
    console.error(`[Job ${jobId}] ❌ Paper generation failed:`, err.message || err);

    await Job.findByIdAndUpdate(jobId, {
      status: "FAILED",
      error: err.message || "An unknown error occurred.",
      statusMessage: "Generation failed.",
    });
  }
};

module.exports = { generatePaperInBackground };
