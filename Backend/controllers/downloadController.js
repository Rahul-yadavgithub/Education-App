// /Backend/controllers/downloadController.js
const { Job } = require("../model/Genration/JobModel.js");
const Paper = require("../model/Genration/Paper.js");
const { exportPaperToPdfBuffer } = require("../services/pdf/exportPdf.js");
const stream = require("stream");

/**
 * Controller: Download generated paper as PDF
 * ---------------------------------------------------------
 * Features:
 * - Validates job & paper existence and status
 * - Includes institution name dynamically
 * - Robust error handling and logging
 * - Efficient PDF streaming
 */
const downloadPaperByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(`[📥] PDF Download Requested for Job ID: ${jobId}`);

    // 1️⃣ Validate job existence
    const job = await Job.findById(jobId).lean();
    if (!job) {
      console.warn(`[⚠️] No Job found for ID: ${jobId}`);
      return res.status(404).json({ success: false, msg: "Job not found" });
    }

    // 2️⃣ Check job completion status
    if (job.status !== "COMPLETE") {
      return res.status(400).json({
        success: false,
        msg: `Paper not ready yet. Current status: ${job.status}`,
      });
    }

    // 3️⃣ Validate linked paper
    if (!job.result) {
      console.error(`[❌] Job ${jobId} has no linked paper result`);
      return res.status(404).json({ success: false, msg: "No paper linked with this job" });
    }

    const paper = await Paper.findById(job.result).lean();
    if (!paper) {
      console.error(`[❌] Linked paper (${job.result}) not found in DB`);
      return res.status(404).json({ success: false, msg: "Linked paper not found" });
    }

    // 4️⃣ Construct PDF payload
    const pdfPayload = {
      institution: "Lav Vidyapeeth Public School ", // fallback if missing
      subject: paper.subject || "Question Paper",
      totalMarks: paper.totalMarks || 100,
      duration: paper.duration || "3 Hours",
      questions: paper.questions || [],
      answerKey: paper.answerKey || [],
    };

    // 5️⃣ Generate PDF buffer using pdf-lib
    console.log(`[🧾] Generating PDF for paper: ${pdfPayload.subject}`);
    const buffer = await exportPaperToPdfBuffer(pdfPayload);

    if (!buffer || !Buffer.isBuffer(buffer)) {
      console.error(`[🚨] Invalid PDF buffer generated for job ${jobId}`);
      return res.status(500).json({ success: false, msg: "Failed to generate PDF" });
    }

    // 6️⃣ Stream PDF as download
    const fileName = `${pdfPayload.subject.replace(/\s+/g, "_")}_paper.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(res);

    console.log(`[✅] Paper download started for job: ${jobId}`);

  } catch (err) {
    console.error("[🔥] PDF Download Error:", err);

    // Detect known causes
    const errorResponse = {
      success: false,
      msg: "Failed to generate or download PDF",
      details: err.message || "Unknown error",
    };

    // Return appropriate HTTP status
    if (err.name === "CastError") {
      return res.status(400).json({ ...errorResponse, msg: "Invalid Job ID format" });
    }

    return res.status(500).json(errorResponse);
  }
};

module.exports = { downloadPaperByJobId };
