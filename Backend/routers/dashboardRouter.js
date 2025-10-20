import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";

import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get("/", isAuth, getDashboardData);

export default router;
