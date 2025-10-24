// services/paperGenerator.js

const Paper = require("../../model/Genration/Paper.js");
const PromptLog = require("../../model/Genration/PromptLog.js");
const { Job } = require('../../model/Genration/JobModel.js');
const { buildPrompt } = require("../ai/promptBuilder.js");
const { callLLM } = require("../ai/aiClient.js");
const { fetchContextFromRag } = require("../ai/ragService.js");
const { formatPaperFromLLM } = require("../ai/paperFormatter.js");

/**
 * Generates an AI-based paper in the background, optionally using RAG and PDF references.
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
      referenceIds = [],
      language = "English",
      standard,
      pdfFile = null
    } = jobInput;

    // 1) Update job status: Starting RAG
    await Job.findByIdAndUpdate(jobId, { 
      status: 'IN_PROGRESS', 
      progress: 10,
      statusMessage: 'Fetching context...'
    });
    
    // 2) Fetch context via RAG
    let ragContext = "";
    if (Array.isArray(referenceIds) && referenceIds.length > 0) {
      const chunks = await fetchContextFromRag(referenceIds, { topK: 5 });
      ragContext = chunks.join("\n\n");
    }

    console.log("You are in the AI service:", ragContext);

    // 3) Update job status: Building prompt
    await Job.findByIdAndUpdate(jobId, { 
      progress: 25, 
      statusMessage: 'Building prompt...' 
    });

    // 4) Build prompt
    const promptInput = { subject, numQuestions, totalMarks, difficulty, duration, questionTypes, language, standard };
    const prompt = buildPrompt(promptInput, ragContext);

    // 5) Log the prompt
    const log = await PromptLog.create({
      user: user._id,
      promptText: prompt,
      promptInput: promptInput,
      model: process.env.OPENAI_MODEL
    });

    // 6) Update job status: Calling AI
    await Job.findByIdAndUpdate(jobId, { 
      progress: 50, 
      statusMessage: 'Generating paper with AI... (this may take a moment)' 
    });
    
    // 7) Call LLM
    const llmResult = await callLLM(prompt);

    // 8) Save raw response to logs
    log.responseText = llmResult.response;
    log.tokensUsed = llmResult.tokens || 0;
    await log.save();

    // 9) Update job status: Formatting
    await Job.findByIdAndUpdate(jobId, { 
      progress: 85, 
      statusMessage: 'Formatting paper...' 
    });

    // 10) Parse & format
    const paperObj = await formatPaperFromLLM(llmResult.response, {
      subject,
      totalMarks,
      difficulty,
      duration,
      numQuestions,
      standard,
      pdfFile,
      createdBy: user._id,
      referenceIds
    });

    // 11) Save the final paper
    const savedPaper = await Paper.create(paperObj);

    // 12) FINAL STEP: Mark job as COMPLETE
    await Job.findByIdAndUpdate(jobId, {
      status: 'COMPLETE',
      progress: 100,
      statusMessage: 'Paper generation complete!',
      result: savedPaper._id
    });

  } catch (err) {
    console.error(`[Job ${jobId}] Paper generation failed:`, err);

    await Job.findByIdAndUpdate(jobId, {
      status: 'FAILED',
      error: err.message || "An unknown error occurred.",
      statusMessage: 'Generation failed.'
    });
  }
};

module.exports = { generatePaperInBackground };
