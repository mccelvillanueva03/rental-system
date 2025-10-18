import crypto from "crypto";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

//sign access and refresh token
export const signAccessToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    jti: uuidv4(),
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  // Generate a secure random refresh token
  const refreshToken = crypto.randomBytes(64).toString("hex");
  // Set refresh token expiration time (e.g., 7 days from now)
  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  // Note: Make sure to save the user document after calling signToken to persist the refreshToken and its expiration.

  return { accessToken, refreshToken, refreshTokenExpiresAt };
};

//sign otp token - purpose can be 'verify_signup_email' or 'forgot_password' or others
export const signOtpToken = (user, purpose) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  const payload = {
    id: user._id.toString(),
    email: user.email,
    otp: otp,
    purpose: purpose,
    jti: uuidv4(),
  };
  const otpToken = jwt.sign(payload, process.env.JWT_OTP_SECRET, {
    expiresIn: "10m",
  });

  return { otpToken, otp, expiresIn: "10m" };
};

//sign password token (dynamic)
export const signPasswordToken = (user, purpose, secret) => {
  const payload = {
    id: user._id.toString(),
    purpose: purpose,
    jti: uuidv4(),
  };
  const token = jwt.sign(payload, secret, { expiresIn: "10m" });
  return {
    token,
    expiresIn: "10m",
  };
};
//sign reset password token
export const signResetPasswordToken = (user) =>
  signPasswordToken(
    user,
    "reset_password",
    process.env.JWT_RESET_PASSWORD_SECRET
  );
//sign change password token
export const signChangePasswordToken = (user) =>
  signPasswordToken(
    user,
    "change_password",
    process.env.JWT_CHANGE_PASSWORD_SECRET
  );
