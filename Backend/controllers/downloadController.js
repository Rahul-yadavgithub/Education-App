const Paper = require("../model/Genration/Paper.js");
const { exportPaperToPdfBuffer } = require("../services/pdf/exportPdf.js");

/**
 * GET /api/papers/:paperId/download
 */
const downloadPaperPdf = async (req, res) => {
  try {
    const { paperId } = req.params;
    const paper = await Paper.findById(paperId).lean();
    if (!paper) return res.status(404).json({ msg: "Paper not found" });

    // Authorization: only owner or admin
    if (req.user.role !== "Teacher" && paper.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const buffer = await exportPaperToPdfBuffer(paper);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${paper.subject.replace(/\s+/g, "_")}_paper.pdf`
    );
    res.send(buffer);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ msg: "Failed to generate PDF" });
  }
};

module.exports = {
  downloadPaperPdf
};
