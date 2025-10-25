const { Job } = require("../model/Genration/JobModel.js");
const Paper = require("../model/Genration/Paper.js");
const { exportPaperToPdfBuffer } = require("../services/pdf/exportPdf.js");
const stream = require("stream");

const downloadPaperByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log("Backend received Job ID:", jobId);

    // 1️⃣ Find the job first
    const job = await Job.findById(jobId).lean();
    if (!job) return res.status(404).json({ msg: "Job not found" });

    if (job.status !== "COMPLETE") {
      return res.status(400).json({ msg: "Paper not ready yet" });
    }

    // 2️⃣ Use job.result to find the paper
    if (!job.result) {
      return res.status(404).json({ msg: "No paper linked with this job" });
    }

    const paper = await Paper.findById(job.result).lean();
    if (!paper) {
      return res.status(404).json({ msg: "Linked paper not found" });
    }

    // 3️⃣ Generate PDF buffer
    const buffer = await exportPaperToPdfBuffer(paper);
    if (!buffer || !Buffer.isBuffer(buffer)) {
      console.error("Invalid PDF buffer");
      return res.status(500).json({ msg: "Failed to generate PDF" });
    }

    // 4️⃣ Send PDF as a downloadable stream
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${paper.subject.replace(/\s+/g, "_")}_paper.pdf`
    );
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const bufferStream = new stream.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(res);

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ msg: "Failed to generate PDF" });
  }
};

module.exports = { downloadPaperByJobId };
