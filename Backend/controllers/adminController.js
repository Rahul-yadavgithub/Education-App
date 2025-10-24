const Paper = require("../model/Genration/Paper.js");
const PromptLog = require("../model/Genration/PromptLog.js");
const { getUserModel } = require("../utils/getUserModel.js");

const adminOverview = async (req, res) => {
  try {
    const UserModel = getUserModel(req.userType);
    const totalUsers = await UserModel.countDocuments();
    const totalPapers = await Paper.countDocuments();
    const recentLogs = await PromptLog.find().sort({ createdAt: -1 }).limit(20).lean();

    res.json({ totalUsers, totalPapers, recentLogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Admin overview fetch failed" });
  }
};

const listAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ papers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to list papers" });
  }
};

module.exports = {
  adminOverview,
  listAllPapers
};
