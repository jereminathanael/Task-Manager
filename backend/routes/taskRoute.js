import express from "express";
import { getTasks, createTask, updatedStatusTask, deleteTask, getHistoryTask, getDashboard, getMe } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/me", getMe);
router.get("/task/:id/history", getHistoryTask);
router.get("/dashboard", getDashboard);
router.post("/task", createTask);
router.patch("/task/:id", updatedStatusTask);
router.delete("/task/:id", deleteTask);

export default router;
