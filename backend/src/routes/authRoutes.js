import express from "express";
// import {
//   authorizeRole,
//   verifyAccessToken,
// } from "../middleware/verifyAccessToken.js";
import googleLogin from "../controllers/authentication/googleLogin.js";
import forgotPassword from "../controllers/authentication/forgotPassword.js";
import verifyEmail from "../controllers/authentication/verifySignupEmail.js";
import login from "../controllers/authentication/login.js";
import signup from "../controllers/authentication/signup.js";
import verifyForgotPassword from "../controllers/authentication/verifyForgotPassword.js";
import { refreshToken } from "../controllers/authentication/refreshToken.js";
import logout from "../controllers/authentication/logout.js";
import cancelVerifyEmail from "../controllers/authentication/cancelVerifyEmail.js";
import {
  otpPurpose,
  verifyOtpToken,
  verifyResetPasswordToken,
  verifyAccessToken,
  authorizeRole,
} from "../middleware/verifyToken.js";
import resetPassword from "../controllers/authentication/resetPassword.js";

const router = express.Router();
//protected routes
//logout route
router.post(
  "/logout",
  verifyAccessToken,
  authorizeRole("tenant", "host", "admin"),
  logout
);
//verify email route
router.post(
  "/verify-signup-email",
  verifyOtpToken,
  otpPurpose("verify_signup_email"),
  verifyEmail
);
//verify forgot password route
router.post(
  "/verify-forgot-password",
  verifyOtpToken,
  otpPurpose("forgot_password"),
  verifyForgotPassword
);
//reset password route
router.post(
  "/reset-password",
  verifyResetPasswordToken,
  otpPurpose("reset_password"),
  resetPassword
);
//public routes
router.post("/refreshToken", refreshToken);//token refresh route
router.post("/login", login);
router.post("/signup", signup);
router.post("/cancel-signup", cancelVerifyEmail);
router.post("/forgot-password", forgotPassword);

//Google OAuth
router.post("/google-login", googleLogin);

export default router;
