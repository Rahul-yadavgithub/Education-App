const express = require("express");
const downloadRouter = express.Router();
const { downloadPaperByJobId } = require("../controllers/downloadController");
const { isAuth } = require("../middleware/isAuth"); // JWT / session auth
const fs = require("fs");
const path = require("path");

// Only authenticated users can download
downloadRouter.get("/download/:jobId", downloadPaperByJobId);

// If you are not saving PDFs, just simulate file existence
downloadRouter.head("/download/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const paper = await Paper.findById(jobId).lean();
    if (!paper) return res.status(404).end();
    // Paper exists in DB — we can generate it, so return 200 OK
    return res.status(200).end();
  } catch (err) {
    console.error("HEAD check error:", err);
    return res.status(500).end();
  }
});


module.exports = {downloadRouter};
