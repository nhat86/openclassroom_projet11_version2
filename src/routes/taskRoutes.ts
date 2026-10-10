import express from "express";
import { authenticateToken } from "../middleware/auth";
import { createTask, updateTask, deleteTask} from "../controllers/taskController";

const router = express.Router();
router.use(authenticateToken);

router.post("/projects/:project_id/tasks", createTask);
router.put("/projects/:project_id/tasks/:task_id", updateTask);
router.delete("/projects/:project_id/tasks/:task_id", deleteTask);

export default router;