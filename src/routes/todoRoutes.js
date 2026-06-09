import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addTodo,
  deleteTodo,
  getAllTodos,
  toggleTodo,
  updateTodo,
} from "../controllers/todoController.js";

const router = express.Router();

router.post("/add-todo", protect, addTodo);
router.get("/get-all-todo", protect, getAllTodos);
router.put("/update-todo/:id", protect, updateTodo);
router.patch("/update-todo/:id", protect, updateTodo);
router.delete("/delete-todo/:id", protect, deleteTodo);
router.patch("/toggle-todo/:id", protect, toggleTodo);

export default router;
