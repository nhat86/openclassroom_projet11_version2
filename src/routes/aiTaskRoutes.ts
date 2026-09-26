import express from "express";
import { authenticateToken } from "../middleware/auth";
import { generateTasks, createTasksBatch } from "../controllers/aiTaskController";

const router = express.Router();
router.use(authenticateToken);

router.post("/projects/:projectId/tasks/generate", generateTasks);
router.post("/projects/:projectId/tasks/batch", createTasksBatch);

export default router;