import express from "express";
import { authenticateToken } from "../middleware/auth";
import { createTask, updateTask, deleteTask} from "../controllers/taskController";

const router = express.Router();
router.use(authenticateToken);

router.post("/projects/:projectId/tasks", createTask);
router.put("/projects/:projectId/tasks/:taskId", updateTask);
router.delete("/projects/:projectId/tasks/:taskId", deleteTask);

export default router;