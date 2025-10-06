import express from "express";
import { authorizeRole, verifyToken } from "../middleware/verifyJwt.js";
import googleLogin from "../controllers/authentication/googleLogin.js";
import changePassword from "../controllers/authentication/changePassword.js";
import forgotPassword from "../controllers/authentication/forgotPassword.js";
import resendOTP from "../controllers/authentication/resendOtp.js";
import verifyEmail from "../controllers/authentication/verifyEmail.js";
import login from "../controllers/authentication/login.js";
import signup from "../controllers/authentication/signup.js";
import verifyForgotPassword from "../controllers/authentication/verifyForgotPassword.js";
import getAllUsers from "../controllers/authentication/getAllUsers.js";
import { refreshToken } from "../controllers/authentication/refreshToken.js";
import logout from "../controllers/authentication/logout.js";
import cancelVerifyEmail from "../controllers/authentication/cancelVerifyEmail.js";

const router = express.Router();
//for checking all users - admin only
router.get("/users", getAllUsers);

//protected routes
router.post(
  "/change-password",
  verifyToken,
  authorizeRole("tenant", "host", "admin"),
  changePassword
);
router.post(
  "/logout",
  verifyToken,
  authorizeRole("tenant", "host", "admin"),
  logout
);
//public routes
router.post("/refreshToken", refreshToken);
router.post("/login", login);
router.post("/signup", signup);
router.post("/verify-signup-email", verifyEmail);
router.post("/cancel-signup", cancelVerifyEmail);
router.post("/resend-signup-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password", verifyForgotPassword);

//Google OAuth
router.post("/google-login", googleLogin);

export default router;
