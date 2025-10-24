// routes/dashboardRoutes.js

const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController.js");
const { isAuth } = require("../middleware/isAuth.js");

const dashRouter = express.Router();

dashRouter.get("/", isAuth, getDashboardData);

module.exports = { dashRouter};
