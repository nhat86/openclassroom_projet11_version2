import express from "express";
import { authenticateToken } from "../middleware/auth";
import { createTask } from "../controllers/taskController";

const router = express.Router();
router.use(authenticateToken);

router.post("/projects/:projectId/tasks", createTask);

export default router;