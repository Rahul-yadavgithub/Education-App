const Paper = require("../model/Genration/Paper.js");

/**
 * Get all papers for user. If admin requests, can fetch other users' papers.
 */
const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    // allow admins to view any user's history, otherwise only own
    const isAdmin = req.user.role === "Teacher";
    if (!isAdmin && req.user._id.toString() !== userId) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const papers = await Paper.find({ createdBy: userId }).sort({ createdAt: -1 }).lean();
    res.json({ papers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch history" });
  }
};

const getPaperById = async (req, res) => {
  try {
    const { paperId } = req.params;
    const paper = await Paper.findById(paperId).populate("createdBy", "name email").lean();
    if (!paper) return res.status(404).json({ msg: "Paper not found" });

    // allow admin or owner
    if (req.user.role !== "Teacher" && paper.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    res.json({ paper });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch paper" });
  }
};

module.exports = {
 getUserHistory,
  getPaperById
};
