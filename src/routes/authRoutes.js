import express from "express";
import {
  forgotPassword,
  forgotVerifyOtp,
  loginUser,
  registerUser,
  resetPassword,
  verifyRegisterOtp,
} from "../controllers/authController.js";

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Verify OTP
router.post("/verify-otp", verifyRegisterOtp);

// Login user
router.post("/login", loginUser);
//forgot password
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password-otp", forgotVerifyOtp);
router.post("/reset-password", resetPassword);

export default router;
