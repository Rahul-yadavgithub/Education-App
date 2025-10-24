// routes/paperRoutes.js

const express = require("express");
const { startPaperGeneration, getJobStatus } = require("../controllers/paperController.js");
const { isAuth } = require("../middleware/isAuth.js");

const paperRoutes = express.Router();

// Start the paper generation job
paperRoutes.post("/generate-paper", isAuth, startPaperGeneration);

// Polling route to get job status
paperRoutes.get("/jobs/:jobId/status", isAuth, getJobStatus);

module.exports = { paperRoutes };
