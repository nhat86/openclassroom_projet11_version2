import express from "express";
import { authenticateToken } from "../middleware/auth";
import { createProject, getUsers, getProject, getProjectById, updateProject, deleteProject} from "../controllers/projectController";

const router = express.Router();
router.use(authenticateToken);

router.get("/users", getUsers);
router.get("/", getProject);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
