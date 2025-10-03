import express from "express";
import { authorizeRole, verifyToken } from "../middleware/verifyJwt.js";
import googleLogin from "../controllers/authentication/googleLogin.js";
import changePassword from "../controllers/authentication/changePassword.js";
import forgotPassword from "../controllers/authentication/forgotPassword.js";
import resendOTP from "../controllers/authentication/resendOtp.js";
import verifyEmail from "../controllers/authentication/verifyEmail.js";
import login from "../controllers/authentication/login.js";
import signup from "../controllers/authentication/signup.js";
import verifyForgotPassword from '../controllers/authentication/verifyForgotPassword.js';
import getAllUsers from "../controllers/authentication/getAllUsers.js";

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

//Google OAuth
router.post("/google-login", googleLogin);

export default router;
