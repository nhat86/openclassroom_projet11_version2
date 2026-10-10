import express from "express";
import { authenticateToken } from "../middleware/auth";
import { generateTasks, createTasksBatch } from "../controllers/AITaskController";

const router = express.Router();
router.use(authenticateToken);

router.post("/projects/:project_id/tasks/generate", generateTasks);
router.post("/projects/:project_id/tasks/batch", createTasksBatch);

export default router;