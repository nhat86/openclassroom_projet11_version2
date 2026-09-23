import express from "express";
import { authenticateToken } from "../middleware/auth";
import { createComment, updateComment, deleteComment } from "../controllers/commentController";

const router = express.Router();
router.use(authenticateToken);
router.post("/projects/:projectId/tasks/:taskId/comments", createComment);
router.put("/projects/:projectId/tasks/:taskId/comments/:commentId", updateComment);
router.delete("/projects/:projectId/tasks/:taskId/comments/:commentId", deleteComment);
 
export default router;