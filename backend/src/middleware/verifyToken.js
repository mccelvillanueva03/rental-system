import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isTokenBlackListed } from "../utils/blacklistToken.js";

export function verifyToken(secret, tokenKey, payloadKey) {
  return async (req, res, next) => {
    try {
      const token = req.cookies[tokenKey];
      if (!token) {
        return res.status(401).json({ message: "No token provided." });
      }
      //Verify with provided secret
      const payload = jwt.verify(token, secret);
      //Find user by payload id
      const user = await User.findById(payload.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      //check if token is blacklisted
      const isBlacklisted = await isTokenBlackListed(payload.jti);
      if (isBlacklisted) {
        return res.status(403).json({ message: "Token already used." });
      }
      //check if user changed password after token was issued
      if (user.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(
          user.passwordChangedAt.getTime() / 1000,
          10
        );
        if (passwordChangedTimestamp > payload.iat)
          return res.status(401).json({
            message: "Password was changed. Please log in again.",
          });
      }
      // Attach user and payload to request object
      req.user = user;
      req[payloadKey] = payload;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "OTP Token expired." });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid OTP Token." });
      }
      console.log("Error in verifying OTP Token:", error);
      return res.status(500).json({ message: "Server Error." });
    }
  };
}
// Access token verifications
export const verifyAccessToken = verifyToken(
  process.env.JWT_ACCESS_SECRET,
  "accessToken",
  "accessPayload"
);
// OTP related token verifications
export const verifyOtpToken = verifyToken(
  process.env.JWT_OTP_SECRET,
  "otpToken",
  "otpPayload"
);
// Password reset related token verifications
export const verifyResetPasswordToken = verifyToken(
  process.env.JWT_RESET_PASSWORD_SECRET,
  "resetPasswordToken",
  "resetPasswordPayload"
);
// Change password related token verifications
export const verifyChangePasswordToken = verifyToken(
  process.env.JWT_CHANGE_PASSWORD_SECRET,
  "changePasswordToken",
  "changePasswordPayload"
);

// Middleware to authorize based on user roles
export function authorizeRole(...roles) {
  return (req, res, next) => {
    // Ensure req.user is set by verifyToken middleware
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    // Check if the user's role is included in the allowed roles
    const userRoles = Array.isArray(req.user.role)
      ? req.user.role
      : [req.user.role];

    const hasRole = userRoles.some((role) => roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: "Access Denied." });
    }
    // If the role is authorized, proceed to the next middleware
    next();
  };
}
// Middleware to check OTP purpose
export function otpPurpose(purpose) {
  return (req, res, next) => {
    try {
      // Ensure req.user is set by verifyToken middleware
      if (!req.user)
        return res.status(401).json({ message: "User not Authenticated." });
      //get purpose from any of the possible payloads
      const reqPurpose =
        req.otpPayload?.purpose ??
        req.resetPasswordPayload?.purpose ??
        req.changePasswordPayload?.purpose;
      //compare purpose
      if (reqPurpose !== purpose)
        return res.status(403).json({ message: "Access Denied" });
      //If purpose match, proceed to next middleware
      next();
    } catch (error) {
      console.log("Error in purpose checking", error);
      return res.status(500).json({ message: "Server Error." });
    }
  };
}
