const { body, validationResult } = require("express-validator");
const { Job } = require('../model/Genration/JobModel.js');
const { generatePaperInBackground } = require("../services/ai/aiService.js");

/**
 * POST /api/generate-paper
 * Starts the paper generation job.
 */
const startPaperGeneration = [
  // Your validations are still here
  body("subject").notEmpty().withMessage("Subject required"),
  body("numQuestions").isInt({ min: 1 }).withMessage("numQuestions must be >= 1"),
  body("totalMarks").isInt({ min: 1 }).withMessage("totalMarks must be >= 1"),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = req.user;
      const jobInput = req.body; // { subject, numQuestions, ... }

      // 1. Create the job in the database
      const newJob = await Job.create({
        user: user.userId,
        status: 'PENDING',
        progress: 0,
        promptInput: jobInput
      });

      console.log("Yes we start genrating the paper: ", newJob);

      // 2. Start the work in the background (NO 'await' here)
      // This is the key: we call it but don't wait for it to finish.
      generatePaperInBackground(newJob._id, user, jobInput);

      // 3. Immediately send the new Job ID back to the frontend
      res.status(202).json({
        message: 'Paper generation started.',
        jobId: newJob._id 
      });

    } catch (err) {
      console.error("Failed to start job:", err);
      res.status(500).json({ error: 'Failed to start job.' });
    }
  }
];

/**
 * GET /api/jobs/:jobId/status
 * Checks the status of a running job.
 * (This is the endpoint your 'useJobPolling' hook will call)
 */
const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // If the job is complete, we can also send the final paper
    if (job.status === 'COMPLETE') {
      // .populate() will fetch the actual Paper document
      // using the 'result' ID
      const completedJob = await Job.findById(jobId).populate('result');
      
      return res.status(200).json({
        status: completedJob.status,
        progress: completedJob.progress,
        error: completedJob.error,
        result: completedJob.result // This will be the full Paper object
      });
    }

    // If not complete, just send the status
    res.status(200).json({
      status: job.status,
      progress: job.progress,
      error: job.error,
      result: null // No result yet
    });

  } catch (err) {
    console.error("Get job status error:", err);
    res.status(500).json({ error: 'Server error checking status' });
  }
};

module.exports = {
  startPaperGeneration,
  getJobStatus
};
