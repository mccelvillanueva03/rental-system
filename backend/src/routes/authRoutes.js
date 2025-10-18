import express from "express";
import {
  authorizeRole,
  verifyAccessToken,
} from "../middleware/verifyAccessToken.js";
import googleLogin from "../controllers/authentication/googleLogin.js";
import changePassword from "../controllers/authentication/changePassword.js";
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
  verifyChangePasswordToken,
  verifyOtpToken,
  verifyResetPasswordToken,
} from "../middleware/verifyOtpToken.js";
import resetPassword from "../controllers/authentication/resetPassword.js";
import reqChangePassword from "../controllers/authentication/reqChangePassword.js";
import verifyChangePassword from "../controllers/authentication/verifyChangePassword.js";

const router = express.Router();
//protected routes
router.post(
  "/change-password",
  verifyChangePasswordToken,
  otpPurpose("change_password"),
  changePassword
);
router.post(
  "/logout",
  verifyAccessToken,
  authorizeRole("tenant", "host", "admin"),
  logout
);
router.post(
  "/verify-signup-email",
  verifyOtpToken,
  otpPurpose("verify_signup_email"),
  verifyEmail
);
router.post(
  "/verify-forgot-password",
  verifyOtpToken,
  otpPurpose("forgot_password"),
  verifyForgotPassword
);
router.post(
  "/reset-password",
  verifyResetPasswordToken,
  otpPurpose("reset_password"),
  resetPassword
);
router.post(
  "/request-change-password",
  verifyAccessToken,
  authorizeRole("tenant", "host", "admin"),
  reqChangePassword
);
router.post(
  "/verify-change-password",
  verifyOtpToken,
  otpPurpose("request_change_password"),
  verifyChangePassword
);
//public routes
router.post("/refreshToken", refreshToken);
router.post("/login", login);
router.post("/signup", signup);
router.post("/cancel-signup", cancelVerifyEmail);
router.post("/forgot-password", forgotPassword);

//Google OAuth
router.post("/google-login", googleLogin);

export default router;
