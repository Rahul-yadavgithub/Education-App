// routes/adminRoutes.js

const express = require("express");
const { isAuth, adminOnly } = require("../middleware/isAuth.js");
const { adminOverview, listAllPapers } = require("../controllers/adminController.js");

const adminRoutes = express.Router();

adminRoutes.get("/overview", isAuth, adminOnly, adminOverview);
adminRoutes.get("/papers", isAuth, adminOnly, listAllPapers);

module.exports = { adminRoutes };
