import express from "express";
import {
  changePassword,
  forgotPassword,
  getAllUsers,
  login,
  resendOTP,
  signup,
  verifyEmail,
  verifyForgotPassword,
} from "../controllers/authController.js";
import { authorizeRole, verifyToken } from "../middleware/verifyJwt.js";

const router = express.Router();

//protected routes
router.get("/users", getAllUsers);
router.post(
  "/change-password",
  verifyToken,
  authorizeRole("tenant", "host", "admin"),
  changePassword
);
//public routes
router.post("/login", login);
router.post("/signup", signup);
router.post("/verify-email-otp", verifyEmail);
router.post("/resend-email-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password", verifyForgotPassword);

export default router;
