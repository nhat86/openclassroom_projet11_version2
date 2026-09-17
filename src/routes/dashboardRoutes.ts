import express from "express";
import { authenticateToken } from "../middleware/auth";
import { getUserTasks } from "../controllers/dashboardController";

const router = express.Router();
router.use(authenticateToken);

router.get("/tasks", getUserTasks);
export default router;