import express from "express";
import { authenticateToken } from "../middleware/auth";
import { createProject, getUsers } from "../controllers/projectController";

const router = express.Router();
router.use(authenticateToken);

router.get("/users", getUsers);
router.post("/", createProject);

export default router;