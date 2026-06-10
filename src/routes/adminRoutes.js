import express from "express";
import {
  deleteUser,
  getAllUsers,
  getAllUsersWithPaginatin,
  getDashboardStats,
  getSingleUser,
} from "../controllers/adminController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);
router.get("/all-users", protect, adminOnly, getAllUsers);
router.get("/single-user/:id", protect, adminOnly, getSingleUser);
router.get(
  "/all-users/pagination",
  protect,
  adminOnly,
  getAllUsersWithPaginatin,
);
router.delete("/user/:id", protect, adminOnly, deleteUser);
export default router;
