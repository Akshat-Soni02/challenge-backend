import express from "express";
import {
  getAllTasks,
  getTaskById,
  createNewTask,
  updateTaskById,
  deleteTaskById,
} from "../controller/tasksController.js";
import { isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.get("/", isAuthenticated, getAllTasks);
router.get("/:id", getTaskById);
router.post("/",isAuthenticated, createNewTask);
router.put("/:id", updateTaskById);
router.delete("/:id", deleteTaskById);
export default router;
