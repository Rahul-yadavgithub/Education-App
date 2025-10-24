// routes/historyRoutes.js

const express = require("express");
const { isAuth } = require("../middleware/isAuth.js");
const { getUserHistory, getPaperById } = require("../controllers/historyController.js");

const historyRoutes = express.Router();

// Get history for a specific user
historyRoutes.get("/:userId", isAuth, getUserHistory);

// Get a paper by ID
historyRoutes.get("/paper/:paperId", isAuth, getPaperById);

module.exports = { historyRoutes };
