import express from "express";
import viewProfile from "../controllers/users/viewProfile.js";
import uploadProfile from "../controllers/users/uploadProfile.js";
// import {
//   authorizeRole,
//   verifyAccessToken,
// } from "../middleware/verifyAccessToken.js";
import { parser } from "../middleware/multer.js";
import {
  otpPurpose,
  verifyChangePasswordToken,
  verifyOtpToken,
  verifyAccessToken,
  authorizeRole,
} from "../middleware/verifyToken.js";
import changePassword from "../controllers/users/changePassword.js";
import verifyChangePassword from "../controllers/users/verifyChangePassword.js";
import reqChangePassword from "../controllers/users/reqChangePassword.js";

const router = express.Router();

//Public Routes
router.get("/:id", viewProfile);

//Private Routes
//Profile Image Upload Route
router.post(
  "/upload-profile-image",
  verifyAccessToken,
  authorizeRole("tenant", "host", "admin"),
  (req, res, next) => {
    parser.single("profileImage")(req, res, function (err) {
      if (err) {
        // Multer error
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadProfile
);
//Change Password Routes
router.post(
  "/request-change-password",
  verifyAccessToken,
  authorizeRole("tenant", "host", "admin"),
  reqChangePassword
);
// Verify OTP and Change Password Routes
router.post(
  "/verify-change-password",
  verifyOtpToken,
  otpPurpose("request_change_password"),
  verifyChangePassword
);
//
router.post(
  "/change-password",
  verifyChangePasswordToken,
  otpPurpose("change_password"),
  changePassword
);

export default router;
