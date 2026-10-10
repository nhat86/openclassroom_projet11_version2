import express from "express";
import { authenticateToken } from "../middleware/auth";
import { createComment, updateComment, deleteComment } from "../controllers/commentController";

const router = express.Router();
router.use(authenticateToken);
router.post("/projects/:project_id/tasks/:task_id/comments", createComment);
router.put("/projects/:project_id/tasks/:task_id/comments/:commentId", updateComment);
router.delete("/projects/:project_id/tasks/:task_id/comments/:commentId", deleteComment);
 
export default router;