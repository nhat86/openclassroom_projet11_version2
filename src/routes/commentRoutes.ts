import express from "express";
import { authenticateToken } from "../middleware/auth";
import { createComment } from "../controllers/commentController";

const router = express.Router();
router.use(authenticateToken);
router.post("/projects/:projectId/tasks/:taskId/comments", createComment);

export default router;